import React, { useEffect, useRef, useCallback } from 'react';
import {
  Canvas as FabricCanvas,
  PencilBrush,
  Rect,
  Circle as FabricCircle,
  Ellipse,
  Triangle as FabricTriangle,
  Polygon,
  Path,
  Line as FabricLine,
  IText,
  Textbox,
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
  LayerItem,
  ShapeType,
  GridType
} from '../../types/canvas';
import {
  createFabricShape,
  resizeShapeObject,
  applyDefaultShapeDimensions
} from '../../constants/shapes';
import { EmptyCanvasState } from './EmptyCanvasState';
import { BotanicalBackground } from './BotanicalBackground';

export function colorToRgba(color: string, alpha: number): string {
  if (!color) return `rgba(74, 75, 70, ${alpha})`;
  const trimmed = color.trim();
  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (match) {
      const [, r, g, b] = match;
      return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
    }
  }
  let c = trimmed.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const r = parseInt(c.slice(0, 2), 16) || 74;
  const g = parseInt(c.slice(2, 4), 16) || 75;
  const b = parseInt(c.slice(4, 6), 16) || 70;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

const hexToRgba = colorToRgba;

interface CanvasWorkspaceProps {
  activeTool: ToolType;
  settings: ToolSettings;
  backgroundColor: string;
  showGrid: boolean;
  gridType?: GridType;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSelectionChange: (props: SelectedObjectProperties | null) => void;
  onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
  onSaveTrigger: (canvasJson: string) => void;
  onLayersUpdate?: (layers: LayerItem[]) => void;
  canvasRefCallback?: (canvas: FabricCanvas | null) => void;
  onToolUsed?: () => void;
  onToolChange?: (tool: ToolType) => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  activeTool,
  settings,
  backgroundColor,
  showGrid,
  gridType = 'grid',
  zoom,
  onZoomChange,
  onSelectionChange,
  onHistoryChange,
  onSaveTrigger,
  onLayersUpdate,
  canvasRefCallback,
  onToolChange
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
      else if (type === 'i-text' || type === 'text' || type === 'textbox') name = `Text: "${(obj as IText).text?.slice(0, 12)}..."`;
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

    if (onLayersUpdate) {
      onLayersUpdate(layerItems);
    }
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
      const isSticky = !!(activeObj as any).isStickyNote;
      let fillVal = typeof activeObj.fill === 'string' ? activeObj.fill : undefined;
      let strokeVal = typeof activeObj.stroke === 'string' ? activeObj.stroke : undefined;
      const bgVal = typeof activeObj.backgroundColor === 'string' ? activeObj.backgroundColor : undefined;

      let textObj: IText | null = null;
      if (activeObj.type === 'i-text' || activeObj.type === 'text' || activeObj.type === 'textbox') {
        textObj = activeObj as IText;
      } else if (activeObj.type === 'group') {
        const found = (activeObj as Group).getObjects().find((o) => o.type === 'i-text' || o.type === 'text' || o.type === 'textbox');
        if (found) textObj = found as IText;
      }

      let textColorVal: string | undefined = undefined;
      if (textObj && typeof textObj.fill === 'string') {
        textColorVal = textObj.fill;
      }

      if (isSticky) {
        fillVal = bgVal || '#FAF0D7';
        strokeVal = (activeObj as any).cardStroke || '#E2D4B6';
      } else if (activeObj.type === 'group') {
        const groupObjects = (activeObj as Group).getObjects();
        if (groupObjects[0]) {
          if (typeof groupObjects[0].fill === 'string') fillVal = groupObjects[0].fill;
          if (typeof groupObjects[0].stroke === 'string') strokeVal = groupObjects[0].stroke;
        }
      }

      let detectedShapeType: ShapeType | undefined = (activeObj as any).shapeType;
      if (!detectedShapeType) {
        if (activeObj instanceof FabricCircle || activeObj.type === 'circle') {
          detectedShapeType = 'circle';
        } else if (activeObj instanceof Ellipse || activeObj.type === 'ellipse') {
          detectedShapeType = 'ellipse';
        } else if (activeObj instanceof FabricTriangle || activeObj.type === 'triangle') {
          detectedShapeType = 'triangle';
        } else if (activeObj instanceof Rect || activeObj.type === 'rect') {
          const r = activeObj as Rect;
          detectedShapeType = r.rx && r.rx > 0 ? 'rounded-rect' : 'rectangle';
        } else if (activeObj instanceof Polygon || activeObj.type === 'polygon') {
          detectedShapeType = 'polygon';
        }
      }

      onSelectionChange({
        id: (activeObj as any).id,
        type: activeObj.type,
        left: Math.round(activeObj.left || 0),
        top: Math.round(activeObj.top || 0),
        width: Math.round((activeObj.width || 0) * (activeObj.scaleX || 1)),
        height: Math.round((activeObj.height || 0) * (activeObj.scaleY || 1)),
        angle: Math.round(activeObj.angle || 0),
        fill: fillVal,
        stroke: strokeVal,
        strokeWidth: isSticky ? ((activeObj as any).cardStrokeWidth || 1.5) : activeObj.strokeWidth,
        opacity: activeObj.opacity,
        isLocked: !!activeObj.lockMovementX,
        text: textObj ? textObj.text : undefined,
        fontFamily: textObj ? textObj.fontFamily : undefined,
        fontSize: textObj ? textObj.fontSize : undefined,
        fontWeight: textObj ? textObj.fontWeight : undefined,
        fontStyle: textObj ? textObj.fontStyle : undefined,
        underline: textObj ? !!textObj.underline : undefined,
        textAlign: textObj ? textObj.textAlign : undefined,
        shapeType: detectedShapeType,
        isStickyNote: isSticky,
        backgroundColor: isSticky ? (bgVal || fillVal) : bgVal,
        textColor: textColorVal
      });
    };

    canvas.on('selection:created', updateSelectionProps);
    canvas.on('selection:updated', updateSelectionProps);
    canvas.on('selection:cleared', () => onSelectionChange(null));
    canvas.on('text:changed', (opt: any) => {
      const target = opt.target;
      if (target && target.isStickyNote) {
        target.set('stroke', null);
        target.set('strokeWidth', 0);
      }
      updateSelectionProps();
    });
    canvas.on('text:selection:changed', updateSelectionProps);

    // Double-click to enter editing on text or sticky notes
    canvas.on('mouse:dblclick', (opt: any) => {
      const target = opt.target;
      if (!target) return;

      // Auto-switch to select tool so pencil/brush/shape doesn't interrupt text editing
      if (activeToolRef.current !== 'select' && onToolChange) {
        onToolChange('select');
      }

      let textObj: Textbox | IText | null = null;
      if (target instanceof Textbox || target.type === 'textbox' || target instanceof IText || target.type === 'i-text') {
        textObj = target as Textbox | IText;
      } else if (target.type === 'group' || (target as any).isStickyNote) {
        const group = target as Group;
        const subTargets = opt.subTargets || [];
        const subText = subTargets.find((o: any) => o.type === 'textbox' || o.type === 'i-text');
        if (subText) {
          textObj = subText as Textbox | IText;
        } else {
          textObj = (group.getObjects().find((o) => o.type === 'textbox' || o.type === 'i-text') as Textbox | IText) || null;
        }
      }

      if (textObj && typeof textObj.enterEditing === 'function') {
        if (!textObj.isEditing) {
          try {
            canvas.setActiveObject(textObj);
            textObj.enterEditing(opt.e);
            canvas.requestRenderAll();
          } catch (err) {
            console.warn('Error on dblclick enterEditing:', err);
          }
        }
      }
    });

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
          // Authentic Sketch Pencil: fine graphite lead with soft graphite halo texture
          const pencilAlpha = Math.min(1, 0.82 * currentSettings.opacity);
          pathObj.set({
            stroke: hexToRgba(currentSettings.color, pencilAlpha),
            opacity: 1,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
            shadow: new Shadow({
              color: hexToRgba(currentSettings.color, 0.35),
              blur: 1.2,
              offsetX: 0,
              offsetY: 0
            })
          });
        } else if (tool === 'pen') {
          // Smooth Ink Pen: rich, fluid, bold solid ink line with no shadow
          pathObj.set({
            stroke: hexToRgba(currentSettings.color, currentSettings.opacity),
            opacity: 1,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
            shadow: null
          });
        } else if (tool === 'marker') {
          // Broad Chisel Highlighter: wide, flat-edge translucent fluorescent wash that multiplies over drawings
          const highlighterAlpha = Math.min(1, 0.45 * currentSettings.opacity);
          pathObj.set({
            stroke: hexToRgba(currentSettings.color, highlighterAlpha),
            opacity: 1,
            strokeLineCap: 'square',
            strokeLineJoin: 'miter',
            globalCompositeOperation: 'multiply',
            shadow: null
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
        // Smooth Fountain / Gel Pen: bold, fluid, glossy rich ink line with bezier curve decimation
        const penSize = Math.max(3.5, Math.round(settings.size * 1.35 * 10) / 10);
        brush.color = hexToRgba(settings.color, settings.opacity);
        brush.width = penSize;
        brush.strokeLineCap = 'round';
        brush.strokeLineJoin = 'round';
        brush.decimate = 2.8; // High decimation turns raw points into elegant, fluid ink curves
        brush.shadow = null;
      } else if (activeTool === 'pencil') {
        // Natural Graphite Sketch Pencil: ultra-fine lead, crisp sketch responsiveness, soft graphite texture
        const pencilSize = Math.max(1.2, Math.round(settings.size * 0.42 * 10) / 10);
        const pencilAlpha = Math.min(1, 0.82 * settings.opacity);
        brush.color = hexToRgba(settings.color, pencilAlpha);
        brush.width = pencilSize;
        brush.strokeLineCap = 'round';
        brush.strokeLineJoin = 'round';
        brush.decimate = 0.2; // Low decimation preserves sharp sketch angles, hatching, and hand flicks
        brush.shadow = new Shadow({
          color: hexToRgba(settings.color, 0.35),
          blur: 1.2,
          offsetX: 0,
          offsetY: 0
        });
      } else if (activeTool === 'marker') {
        // Broad Chisel Highlighter: wide flat chisel edge, vibrant see-through wash
        const highlighterSize = Math.max(24, Math.round(settings.size * 4.5));
        const highlighterAlpha = Math.min(1, 0.45 * settings.opacity);
        brush.color = hexToRgba(settings.color, highlighterAlpha);
        brush.width = highlighterSize;
        brush.strokeLineCap = 'square';
        brush.strokeLineJoin = 'miter';
        brush.decimate = 2.0;
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

      // If already drawing a shape/line/arrow, do not create another shape
      if (isDrawingShapeRef.current) {
        return;
      }

      // If user clicked on an existing object or control handle, and not erasing, let Fabric handle selection/transformation
      if (opt.target && activeTool !== 'eraser') {
        if (
          opt.target instanceof Textbox ||
          opt.target.type === 'textbox' ||
          opt.target instanceof IText ||
          opt.target.type === 'i-text'
        ) {
          if (activeToolRef.current !== 'select' && onToolChange) {
            onToolChange('select');
          }
        }
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
        const textbox = new Textbox('Type your thoughts...', {
          left: pointer.x,
          top: pointer.y,
          width: 260,
          fontFamily: settings.fontFamily,
          fontSize: settings.fontSize || 22,
          fill: settings.color,
          fontWeight: settings.isBold ? 'bold' : 'normal',
          fontStyle: settings.isItalic ? 'italic' : 'normal',
          underline: settings.isUnderline,
          textAlign: settings.textAlign || 'left',
          opacity: settings.opacity,
          padding: 6
        });
        canvas.add(textbox);
        canvas.setActiveObject(textbox);
        textbox.enterEditing();
        textbox.selectAll();
        canvas.renderAll();
        saveStateToHistory();
        return;
      }

      // Shape Creation Mode
      if (activeTool === 'shape') {
        isDrawingShapeRef.current = true;
        shapeStartRef.current = { x: pointer.x, y: pointer.y };

        const fillColor = settings.fillColor || settings.color || '#E8EBD9';
        const strokeColor = settings.strokeColor || '#5E6547';
        const commonProps = {
          left: pointer.x,
          top: pointer.y,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: settings.strokeWidth || 2,
          opacity: settings.opacity,
          selectable: true
        };

        const shapeObj = createFabricShape(settings.shapeType, commonProps, 2, 2);
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
        const width = Math.max(2, Math.abs(pointer.x - start.x));
        const height = Math.max(2, Math.abs(pointer.y - start.y));
        const left = Math.min(pointer.x, start.x);
        const top = Math.min(pointer.y, start.y);

        resizeShapeObject(obj, width, height, left, top);
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
        const start = shapeStartRef.current;
        shapeStartRef.current = null;
        const obj = activeShapeObjectRef.current;
        activeShapeObjectRef.current = null;

        if (obj && start) {
          // Measure actual size drawn on canvas
          let actualW = 0;
          let actualH = 0;
          if (obj instanceof FabricCircle) {
            actualW = (obj.radius || 0) * 2;
            actualH = actualW;
          } else if (obj instanceof Ellipse) {
            actualW = (obj.rx || 0) * 2;
            actualH = (obj.ry || 0) * 2;
          } else if (obj instanceof Polygon || obj instanceof Path) {
            actualW = (obj.width || 100) * (obj.scaleX || 1);
            actualH = (obj.height || 100) * (obj.scaleY || 1);
          } else {
            actualW = (obj.width || 0) * (obj.scaleX || 1);
            actualH = (obj.height || 0) * (obj.scaleY || 1);
          }

          // If shape is arrow, add arrowhead
          if (activeTool === 'arrow') {
            const line = obj as FabricLine;
            let x1 = line.x1 || start.x;
            let y1 = line.y1 || start.y;
            let x2 = line.x2 || start.x;
            let y2 = line.y2 || start.y;

            if (Math.hypot(x2 - x1, y2 - y1) < 10) {
              x2 = x1 + 120;
              y2 = y1;
              line.set({ x1, y1, x2, y2 });
            }

            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLength = 16;

            const arrowHead = new FabricTriangle({
              left: x2,
              top: y2,
              originX: 'center',
              originY: 'center',
              angle: (angle * 180) / Math.PI + 90,
              width: headLength,
              height: headLength,
              fill: settings.color
            });

            canvas.remove(line);
            const arrowGroup = new Group([line, arrowHead], { selectable: true });
            canvas.add(arrowGroup);
            arrowGroup.setCoords();
          } else if (activeTool === 'line') {
            const line = obj as FabricLine;
            let x1 = line.x1 || start.x;
            let y1 = line.y1 || start.y;
            let x2 = line.x2 || start.x;
            let y2 = line.y2 || start.y;
            if (Math.hypot(x2 - x1, y2 - y1) < 10) {
              line.set({ x1, y1, x2: x1 + 120, y2: y1 });
            }
            line.setCoords();
          } else if (activeTool === 'shape') {
            // ONLY if the user single-clicked without dragging (< 10px), provide a standard default size
            if (actualW < 10 && actualH < 10) {
              applyDefaultShapeDimensions(obj, start.x, start.y);
            }
            obj.setCoords();
          } else {
            obj.setCoords();
          }

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
  }, [activeTool, settings, saveStateToHistory, eraseAtPoint, updateLayers, onToolChange]);

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
            ...getGridStyle(gridType)
          }}
          aria-hidden="true"
        />
      )}
    </main>
  );
};

function getGridStyle(gridType: GridType): React.CSSProperties {
  if (gridType === 'dots') {
    return {
      backgroundImage: 'radial-gradient(circle, rgba(119, 125, 94, 0.35) 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px'
    };
  }
  if (gridType === 'lined') {
    return {
      backgroundImage: 'linear-gradient(to bottom, transparent 27px, rgba(119, 125, 94, 0.24) 28px)',
      backgroundSize: '100% 28px'
    };
  }
  if (gridType === 'dark-grid') {
    return {
      backgroundImage: 'radial-gradient(circle, rgba(240, 245, 230, 0.32) 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px'
    };
  }
  // Standard coordinate graph paper
  return {
    backgroundImage: `
      linear-gradient(to right, rgba(119, 125, 94, 0.16) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(119, 125, 94, 0.16) 1px, transparent 1px)
    `,
    backgroundSize: '24px 24px'
  };
}
