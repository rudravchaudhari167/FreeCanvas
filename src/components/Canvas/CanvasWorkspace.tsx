import React, { useEffect, useRef, useCallback } from 'react';
import {
  Canvas as FabricCanvas,
  PencilBrush,
  Rect,
  Circle as FabricCircle,
  Triangle as FabricTriangle,
  Polygon,
  Line as FabricLine,
  IText,
  Group,
  Point,
  FabricObject,
  Shadow,
  util
} from 'fabric';
import type {
  ToolType,
  ToolSettings,
  SelectedObjectProperties,
  LayerItem
} from '../../types/canvas';
import { EmptyCanvasState } from './EmptyCanvasState';
import { BotanicalBackground } from './BotanicalBackground';

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const r = parseInt(c.slice(0, 2), 16) || 48;
  const g = parseInt(c.slice(2, 4), 16) || 49;
  const b = parseInt(c.slice(4, 6), 16) || 45;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

interface CanvasWorkspaceProps {
  activeTool: ToolType;
  settings: ToolSettings;
  backgroundColor: string;
  showGrid: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSelectionChange: (props: SelectedObjectProperties | null) => void;
  onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
  onSaveTrigger: (canvasJson: string) => void;
  onLayersUpdate: (layers: LayerItem[]) => void;
  canvasRefCallback?: (canvas: FabricCanvas | null) => void;
  onToolUsed?: () => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  activeTool,
  settings,
  backgroundColor,
  showGrid,
  zoom,
  onZoomChange,
  onSelectionChange,
  onHistoryChange,
  onSaveTrigger,
  onLayersUpdate,
  canvasRefCallback
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  // History state
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const isHistoryActionRef = useRef<boolean>(false);
  const [hasObjects, setHasObjects] = React.useState<boolean>(false);

  // Shape drawing state
  const isDrawingShapeRef = useRef<boolean>(false);
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const activeShapeObjectRef = useRef<FabricObject | null>(null);

  // Spacebar pan state
  const isPanningRef = useRef<boolean>(false);
  const lastPanPosRef = useRef<{ x: number; y: number } | null>(null);
  const isSpacePressedRef = useRef<boolean>(false);

  // Eraser state
  const isErasingRef = useRef<boolean>(false);
  const hasErasedRef = useRef<boolean>(false);

  // Active tool and settings live references for canvas events
  const activeToolRef = useRef<ToolType>(activeTool);
  activeToolRef.current = activeTool;
  const settingsRef = useRef<ToolSettings>(settings);
  settingsRef.current = settings;

  // Update layer list for Layers panel
  const updateLayers = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const layerItems: LayerItem[] = objects.map((obj, index) => {
      let name = 'Object ' + (index + 1);
      const type = obj.type || 'unknown';
      if (type === 'path') name = `Drawing ${index + 1}`;
      else if (type === 'i-text' || type === 'text') name = `Text: "${(obj as IText).text?.slice(0, 12)}..."`;
      else if (type === 'rect') name = `Rectangle ${index + 1}`;
      else if (type === 'circle') name = `Circle ${index + 1}`;
      else if (type === 'triangle') name = `Triangle ${index + 1}`;
      else if (type === 'line') name = `Line ${index + 1}`;
      else if (type === 'image') name = `Image ${index + 1}`;
      else if (type === 'group') name = `Group / Note ${index + 1}`;

      return {
        id: (obj as any).id || `obj_${index}`,
        name,
        type,
        visible: obj.visible !== false,
        locked: !!obj.lockMovementX,
        zIndex: index
      };
    }).reverse();

    onLayersUpdate(layerItems);
  }, [onLayersUpdate]);

  // Push state to undo stack
  const saveStateToHistory = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isHistoryActionRef.current) return;

    const json = JSON.stringify(canvas.toJSON());
    const stack = undoStackRef.current;

    // Avoid recording duplicate state
    if (stack.length === 0 || stack[stack.length - 1] !== json) {
      stack.push(json);
      if (stack.length > 50) stack.shift(); // Limit history to 50
      redoStackRef.current = []; // Clear redo
      onHistoryChange(stack.length > 1, false);
      onSaveTrigger(json);
    }

    setHasObjects(canvas.getObjects().length > 0);
    updateLayers();
  }, [onHistoryChange, onSaveTrigger, updateLayers]);

  // Helper: erase strokes or objects intersecting the eraser circle
  const eraseAtPoint = useCallback((pointer: { x: number; y: number }) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;

    const currentSettings = settingsRef.current;
    const radius = Math.max(10, (currentSettings.size || 20) / 2);
    const objects = canvas.getObjects();
    let erasedCount = 0;

    // Distance from point (px, py) to line segment (x1, y1)-(x2, y2)
    const distToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
      const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      if (l2 === 0) return Math.hypot(px - x1, py - y1);
      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
    };

    // Iterate backwards from top-most to bottom-most
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (!obj || obj === (canvas as any).backgroundImage) continue;
      if (obj.type === 'activeSelection') continue;

      const bbox = obj.getBoundingRect();
      const strokePad = (obj.strokeWidth || 2) / 2;
      const effectiveRadius = radius + strokePad;

      const expandedBbox = {
        left: bbox.left - effectiveRadius,
        top: bbox.top - effectiveRadius,
        right: bbox.left + bbox.width + effectiveRadius,
        bottom: bbox.top + bbox.height + effectiveRadius
      };

      if (
        pointer.x < expandedBbox.left ||
        pointer.x > expandedBbox.right ||
        pointer.y < expandedBbox.top ||
        pointer.y > expandedBbox.bottom
      ) {
        continue;
      }

      let isHit = false;

      if (typeof obj.containsPoint === 'function' && obj.containsPoint(new Point(pointer.x, pointer.y))) {
        isHit = true;
      } else if (obj instanceof FabricLine || obj.type === 'line') {
        const line = obj as FabricLine;
        const x1 = line.x1 || 0;
        const y1 = line.y1 || 0;
        const x2 = line.x2 || 0;
        const y2 = line.y2 || 0;
        if (distToSegment(pointer.x, pointer.y, x1, y1, x2, y2) <= effectiveRadius) {
          isHit = true;
        }
      } else if (obj.type === 'path') {
        const pathData = (obj as any).path;
        if (Array.isArray(pathData) && pathData.length > 0) {
          const matrix = obj.calcTransformMatrix ? obj.calcTransformMatrix() : null;
          const offset = (obj as any).pathOffset || { x: 0, y: 0 };

          let prevPt: { x: number; y: number } | null = null;
          for (let pIdx = 0; pIdx < pathData.length; pIdx++) {
            const cmd = pathData[pIdx];
            if (!cmd || cmd.length < 3) continue;

            const rawX = cmd[cmd.length - 2];
            const rawY = cmd[cmd.length - 1];

            let pt = { x: rawX, y: rawY };
            if (matrix) {
              const localPt = new Point(rawX - offset.x, rawY - offset.y);
              pt = util.transformPoint(localPt, matrix);
            }

            if (Math.hypot(pointer.x - pt.x, pointer.y - pt.y) <= effectiveRadius) {
              isHit = true;
              break;
            }

            if (prevPt) {
              if (distToSegment(pointer.x, pointer.y, prevPt.x, prevPt.y, pt.x, pt.y) <= effectiveRadius) {
                isHit = true;
                break;
              }
            }

            prevPt = pt;
          }
        } else {
          isHit = true;
        }
      } else {
        isHit = true;
      }

      if (isHit) {
        canvas.remove(obj);
        erasedCount++;
        if (currentSettings.eraserMode === 'object') {
          break;
        }
      }
    }

    if (erasedCount > 0) {
      canvas.discardActiveObject();
      canvas.renderAll();
      return true;
    }

    return false;
  }, []);

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const canvas = new FabricCanvas(canvasElRef.current, {
      width,
      height,
      backgroundColor,
      selection: true,
      preserveObjectStacking: true,
      stopContextMenu: true
    });

    fabricCanvasRef.current = canvas;
    if (canvasRefCallback) canvasRefCallback(canvas);

    // Initial empty state in history
    const initialJson = JSON.stringify(canvas.toJSON());
    undoStackRef.current = [initialJson];
    redoStackRef.current = [];
    onHistoryChange(false, false);

    // Expose undo, redo, and resetCanvas on canvas instance
    (canvas as any).undo = () => {
      const uStack = undoStackRef.current;
      const rStack = redoStackRef.current;
      if (uStack.length <= 1) return;

      const currentState = uStack.pop()!;
      rStack.push(currentState);
      const prevState = uStack[uStack.length - 1];

      isHistoryActionRef.current = true;
      canvas.loadFromJSON(JSON.parse(prevState)).then(() => {
        canvas.renderAll();
        isHistoryActionRef.current = false;
        setHasObjects(canvas.getObjects().length > 0);
        updateLayers();
        onHistoryChange(uStack.length > 1, rStack.length > 0);
        onSaveTrigger(prevState);
      });
    };

    (canvas as any).redo = () => {
      const uStack = undoStackRef.current;
      const rStack = redoStackRef.current;
      if (rStack.length === 0) return;

      const nextState = rStack.pop()!;
      uStack.push(nextState);

      isHistoryActionRef.current = true;
      canvas.loadFromJSON(JSON.parse(nextState)).then(() => {
        canvas.renderAll();
        isHistoryActionRef.current = false;
        setHasObjects(canvas.getObjects().length > 0);
        updateLayers();
        onHistoryChange(uStack.length > 1, rStack.length > 0);
        onSaveTrigger(nextState);
      });
    };

    (canvas as any).resetCanvas = () => {
      canvas.clear();
      canvas.backgroundColor = '#FFFEFA';
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.renderAll();
      const emptyJson = JSON.stringify(canvas.toJSON());
      undoStackRef.current = [emptyJson];
      redoStackRef.current = [];
      setHasObjects(false);
      updateLayers();
      onHistoryChange(false, false);
      onSelectionChange(null);
    };

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !fabricCanvasRef.current) return;
      fabricCanvasRef.current.setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
      fabricCanvasRef.current.renderAll();
    };
    window.addEventListener('resize', handleResize);

    // Selection events
    const updateSelectionProps = () => {
      const activeObj = canvas.getActiveObject();
      if (!activeObj) {
        onSelectionChange(null);
        return;
      }
      onSelectionChange({
        id: (activeObj as any).id,
        type: activeObj.type,
        left: Math.round(activeObj.left || 0),
        top: Math.round(activeObj.top || 0),
        width: Math.round((activeObj.width || 0) * (activeObj.scaleX || 1)),
        height: Math.round((activeObj.height || 0) * (activeObj.scaleY || 1)),
        angle: Math.round(activeObj.angle || 0),
        fill: typeof activeObj.fill === 'string' ? activeObj.fill : undefined,
        stroke: typeof activeObj.stroke === 'string' ? activeObj.stroke : undefined,
        strokeWidth: activeObj.strokeWidth,
        opacity: activeObj.opacity,
        isLocked: !!activeObj.lockMovementX,
        text: (activeObj as IText).text,
        fontFamily: (activeObj as IText).fontFamily,
        fontSize: (activeObj as IText).fontSize,
        fontWeight: (activeObj as IText).fontWeight,
        fontStyle: (activeObj as IText).fontStyle,
        underline: (activeObj as IText).underline,
        textAlign: (activeObj as IText).textAlign
      });
    };

    canvas.on('selection:created', updateSelectionProps);
    canvas.on('selection:updated', updateSelectionProps);
    canvas.on('selection:cleared', () => onSelectionChange(null));

    // History trigger events
    canvas.on('object:added', () => {
      if (!isHistoryActionRef.current) saveStateToHistory();
    });
    canvas.on('object:modified', () => {
      if (!isHistoryActionRef.current) saveStateToHistory();
    });
    canvas.on('object:removed', () => {
      if (!isHistoryActionRef.current) saveStateToHistory();
    });
    canvas.on('path:created', (opt: any) => {
      const tool = activeToolRef.current;
      const currentSettings = settingsRef.current;
      const pathObj = opt.path;

      if (pathObj) {
        if (tool === 'pencil') {
          // Delicate graphite sketch style with semi-translucent layering & fine grain
          pathObj.set({
            opacity: 0.65 * currentSettings.opacity,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
            strokeDashArray: [1.2, 0.6] // subtle paper grain texture
          });
        } else if (tool === 'pen') {
          // Rich, smooth solid ink line
          pathObj.set({
            opacity: currentSettings.opacity,
            strokeLineCap: 'round',
            strokeLineJoin: 'round'
          });
        } else if (tool === 'marker') {
          // Translucent chisel highlighter
          pathObj.set({
            opacity: 0.35 * currentSettings.opacity,
            strokeLineCap: 'square',
            strokeLineJoin: 'miter'
          });
        }
        canvas.renderAll();
      }

      if (!isHistoryActionRef.current) saveStateToHistory();
    });

    // Mouse wheel zoom
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let currentZoom = canvas.getZoom();
      currentZoom *= 0.999 ** delta;
      if (currentZoom > 5) currentZoom = 5;
      if (currentZoom < 0.2) currentZoom = 0.2;
      canvas.zoomToPoint(new Point(opt.e.offsetX, opt.e.offsetY), currentZoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      onZoomChange(currentZoom);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
      fabricCanvasRef.current = null;
      if (canvasRefCallback) canvasRefCallback(null);
    };
  }, []);

  // Update background color when prop changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.backgroundColor = backgroundColor;
      canvas.renderAll();
    }
  }, [backgroundColor]);

  // Sync zoom prop with fabric canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && Math.abs(canvas.getZoom() - zoom) > 0.001) {
      const center = canvas.getCenterPoint();
      canvas.zoomToPoint(center, zoom);
      canvas.renderAll();
    }
  }, [zoom]);

  // Configure tool mode on the canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Reset interaction states
    canvas.isDrawingMode = false;
    canvas.selection = activeTool === 'select';
    canvas.defaultCursor = 'default';

    if (activeTool !== 'select') {
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    if (activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker') {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);

      if (activeTool === 'pen') {
        // Smooth Fountain / Ink Pen: solid saturated color, thick smooth flow, tremor decimation
        brush.color = hexToRgba(settings.color, settings.opacity);
        brush.width = Math.max(2, settings.size);
        brush.strokeLineCap = 'round';
        brush.strokeLineJoin = 'round';
        brush.decimate = 2.5; // Smooths hand jitter into clean fluid ink curves
        brush.shadow = null;
      } else if (activeTool === 'pencil') {
        // Natural Graphite Pencil: much finer sketch stroke, graphite transparency & soft graphite grain
        const pencilSize = Math.max(1, Math.round(settings.size * 0.45));
        brush.color = hexToRgba(settings.color, 0.65 * settings.opacity);
        brush.width = pencilSize;
        brush.strokeLineCap = 'round';
        brush.strokeLineJoin = 'round';
        brush.decimate = 0.4; // Preserves natural sketch nuances & textures
        brush.shadow = new Shadow({
          color: hexToRgba(settings.color, 0.2),
          blur: 0.8,
          offsetX: 0.3,
          offsetY: 0.3
        });
      } else if (activeTool === 'marker') {
        // Broad Chisel Marker / Highlighter
        brush.color = hexToRgba(settings.color, 0.35 * settings.opacity);
        brush.width = Math.max(16, settings.size * 3);
        brush.strokeLineCap = 'square';
        brush.strokeLineJoin = 'miter';
        brush.decimate = 2;
        brush.shadow = null;
      }

      canvas.freeDrawingBrush = brush;
    } else if (activeTool === 'eraser') {
      canvas.discardActiveObject();
      canvas.renderAll();
      const cursorRadius = Math.max(6, Math.min(48, Math.round((settings.size || 20) / 2)));
      const cursorSize = (cursorRadius + 4) * 2;
      const center = cursorRadius + 4;
      const cursorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" viewBox="0 0 ${cursorSize} ${cursorSize}"><circle cx="${center}" cy="${center}" r="${cursorRadius}" fill="rgba(217, 147, 121, 0.2)" stroke="#D99379" stroke-width="2"/><circle cx="${center}" cy="${center}" r="1.5" fill="#B35D43"/></svg>`;
      const cursorUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(cursorSvg)}") ${center} ${center}, crosshair`;
      canvas.defaultCursor = cursorUrl;
    } else if (activeTool === 'text') {
      canvas.defaultCursor = 'text';
    } else if (['shape', 'line', 'arrow'].includes(activeTool)) {
      canvas.defaultCursor = 'crosshair';
    }
  }, [activeTool, settings]);

  // Mouse / Pointer handlers for Shape, Line, Arrow, Text, Eraser, and Pan
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (opt: any) => {
      const evt = opt.e as MouseEvent;

      // Spacebar Pan
      if (isSpacePressedRef.current || evt.button === 1) {
        isPanningRef.current = true;
        lastPanPosRef.current = { x: evt.clientX, y: evt.clientY };
        canvas.defaultCursor = 'grabbing';
        return;
      }

      const pointer = canvas.getScenePoint(opt.e);

      // Eraser Mode
      if (activeTool === 'eraser') {
        isErasingRef.current = true;
        hasErasedRef.current = false;

        const target = opt.target;
        if (target && target !== (canvas as any).backgroundImage) {
          if (target.type === 'activeSelection') {
            const subObjects = (target as any).getObjects ? (target as any).getObjects() : [];
            const hitSub = subObjects.find((sub: any) => typeof sub.containsPoint === 'function' && sub.containsPoint(pointer));
            if (hitSub) {
              canvas.remove(hitSub);
              hasErasedRef.current = true;
            }
            canvas.discardActiveObject();
            canvas.renderAll();
          } else {
            canvas.remove(target);
            canvas.discardActiveObject();
            canvas.renderAll();
            hasErasedRef.current = true;
          }
        } else {
          const erased = eraseAtPoint(pointer);
          if (erased) {
            hasErasedRef.current = true;
          }
        }
        return;
      }

      // Text Creation Mode
      if (activeTool === 'text' && !opt.target) {
        const iText = new IText('Type your thoughts...', {
          left: pointer.x,
          top: pointer.y,
          fontFamily: settings.fontFamily,
          fontSize: settings.fontSize || 22,
          fill: settings.color,
          fontWeight: settings.isBold ? 'bold' : 'normal',
          fontStyle: settings.isItalic ? 'italic' : 'normal',
          underline: settings.isUnderline,
          textAlign: settings.textAlign,
          opacity: settings.opacity
        });
        canvas.add(iText);
        canvas.setActiveObject(iText);
        iText.enterEditing();
        iText.selectAll();
        canvas.renderAll();
        saveStateToHistory();
        return;
      }

      // Shape Creation Mode
      if (activeTool === 'shape') {
        isDrawingShapeRef.current = true;
        shapeStartRef.current = { x: pointer.x, y: pointer.y };

        let shapeObj: FabricObject;
        const commonProps = {
          left: pointer.x,
          top: pointer.y,
          fill: settings.color,
          stroke: settings.strokeColor || '#5E6547',
          strokeWidth: settings.strokeWidth || 2,
          opacity: settings.opacity,
          selectable: true
        };

        if (settings.shapeType === 'circle') {
          shapeObj = new FabricCircle({ ...commonProps, radius: 1 });
        } else if (settings.shapeType === 'triangle') {
          shapeObj = new FabricTriangle({ ...commonProps, width: 2, height: 2 });
        } else if (settings.shapeType === 'star') {
          // 5-point star
          const starPoints = [
            { x: 0, y: -25 },
            { x: 7, y: -10 },
            { x: 24, y: -8 },
            { x: 12, y: 5 },
            { x: 15, y: 22 },
            { x: 0, y: 13 },
            { x: -15, y: 22 },
            { x: -12, y: 5 },
            { x: -24, y: -8 },
            { x: -7, y: -10 }
          ];
          shapeObj = new Polygon(starPoints, { ...commonProps });
        } else {
          // Rectangle or Rounded Rectangle
          shapeObj = new Rect({
            ...commonProps,
            width: 2,
            height: 2,
            rx: settings.shapeType === 'rounded-rect' ? 12 : 0,
            ry: settings.shapeType === 'rounded-rect' ? 12 : 0
          });
        }

        activeShapeObjectRef.current = shapeObj;
        canvas.add(shapeObj);
        return;
      }

      // Straight Line or Arrow Creation Mode
      if (activeTool === 'line' || activeTool === 'arrow') {
        isDrawingShapeRef.current = true;
        shapeStartRef.current = { x: pointer.x, y: pointer.y };

        const line = new FabricLine([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: settings.color,
          strokeWidth: settings.strokeWidth || 3,
          strokeDashArray:
            settings.lineStyle === 'dashed'
              ? [8, 6]
              : settings.lineStyle === 'dotted'
              ? [3, 4]
              : undefined,
          opacity: settings.opacity,
          selectable: true
        });

        activeShapeObjectRef.current = line;
        canvas.add(line);
      }
    };

    const handleMouseMove = (opt: any) => {
      // Pan movement
      if (isPanningRef.current && lastPanPosRef.current) {
        const evt = opt.e as MouseEvent;
        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] += evt.clientX - lastPanPosRef.current.x;
          vpt[5] += evt.clientY - lastPanPosRef.current.y;
          canvas.setViewportTransform(vpt);
          lastPanPosRef.current = { x: evt.clientX, y: evt.clientY };
          canvas.renderAll();
        }
        return;
      }

      // Eraser drag movement
      if (isErasingRef.current && activeTool === 'eraser') {
        const pointer = canvas.getScenePoint(opt.e);
        const erased = eraseAtPoint(pointer);
        if (erased) {
          hasErasedRef.current = true;
        }
        return;
      }

      if (!isDrawingShapeRef.current || !shapeStartRef.current || !activeShapeObjectRef.current) return;

      const pointer = canvas.getScenePoint(opt.e);
      const start = shapeStartRef.current;
      const obj = activeShapeObjectRef.current;

      if (activeTool === 'shape') {
        const width = Math.abs(pointer.x - start.x);
        const height = Math.abs(pointer.y - start.y);
        const left = Math.min(pointer.x, start.x);
        const top = Math.min(pointer.y, start.y);

        if (obj instanceof FabricCircle) {
          const radius = Math.max(width, height) / 2;
          obj.set({ radius, left, top });
        } else if (obj instanceof Rect || obj instanceof FabricTriangle) {
          obj.set({ width, height, left, top });
        }
        canvas.renderAll();
      } else if (activeTool === 'line' || activeTool === 'arrow') {
        const line = obj as FabricLine;
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        lastPanPosRef.current = null;
        canvas.defaultCursor = isSpacePressedRef.current ? 'grab' : 'default';
      }

      if (isDrawingShapeRef.current) {
        isDrawingShapeRef.current = false;
        shapeStartRef.current = null;

        if (activeShapeObjectRef.current) {
          // If shape is arrow, add arrowhead
          if (activeTool === 'arrow') {
            const line = activeShapeObjectRef.current as FabricLine;
            const x1 = line.x1 || 0;
            const y1 = line.y1 || 0;
            const x2 = line.x2 || 0;
            const y2 = line.y2 || 0;
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLength = 16;

            const arrowHead = new FabricTriangle({
              left: x2,
              top: y2,
              originX: 'center',
              originY: 'center',
              pointType: 'arrow_start',
              angle: (angle * 180) / Math.PI + 90,
              width: headLength,
              height: headLength,
              fill: settings.color
            });

            canvas.remove(line);
            const arrowGroup = new Group([line, arrowHead], { selectable: true });
            canvas.add(arrowGroup);
            canvas.setActiveObject(arrowGroup);
          } else {
            canvas.setActiveObject(activeShapeObjectRef.current);
          }

          activeShapeObjectRef.current = null;
          canvas.renderAll();
          saveStateToHistory();
        }
      }

      if (isErasingRef.current) {
        isErasingRef.current = false;
        if (hasErasedRef.current) {
          hasErasedRef.current = false;
          saveStateToHistory();
          setHasObjects(canvas.getObjects().length > 0);
          updateLayers();
        }
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    // Keyboard space bar listener for panning
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressedRef.current && (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        isSpacePressedRef.current = true;
        canvas.defaultCursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressedRef.current = false;
        canvas.defaultCursor = activeTool === 'select' ? 'default' : 'crosshair';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTool, settings, saveStateToHistory, eraseAtPoint, updateLayers]);

  return (
    <main
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 72px)',
        overflow: 'hidden',
        backgroundColor: '#F8F3EC'
      }}
      aria-label="Canvas Workspace"
    >
      {/* Decorative Botanical Leaf branch & Warm Organic Shape matching Reference Image 1 */}
      <BotanicalBackground />

      {/* Empty State message & illustration matching Reference Image 1 */}
      <EmptyCanvasState visible={!hasObjects} />

      {/* Interactive Fabric Canvas Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2
        }}
      >
        <canvas ref={canvasElRef} />
      </div>

      {/* Grid Guide Overlay - placed directly above canvas with pointer-events: none */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 5,
            backgroundImage: `
              linear-gradient(to right, rgba(119, 125, 94, 0.14) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(119, 125, 94, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />
      )}
    </main>
  );
};
