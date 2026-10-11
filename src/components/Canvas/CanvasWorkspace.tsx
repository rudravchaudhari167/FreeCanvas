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
  FabricObject
} from 'fabric';
import type {
  ToolType,
  ToolSettings,
  SelectedObjectProperties,
  LayerItem
} from '../../types/canvas';
import { EmptyCanvasState } from './EmptyCanvasState';
import { BotanicalBackground } from './BotanicalBackground';

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
    canvas.on('path:created', () => {
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

    if (activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker') {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);

      if (activeTool === 'pen') {
        brush.color = settings.color;
        brush.width = settings.size;
        brush.strokeLineCap = 'round';
        brush.strokeLineJoin = 'round';
      } else if (activeTool === 'pencil') {
        // Natural sketch stroke: thinner line with slight texture
        brush.color = settings.color;
        brush.width = Math.max(1, Math.round(settings.size * 0.7));
        brush.strokeLineCap = 'round';
        brush.strokeLineJoin = 'round';
      } else if (activeTool === 'marker') {
        // Marker/highlighter: wider with transparency
        const hex = settings.color;
        brush.color = hex;
        brush.width = Math.max(14, settings.size * 2.5);
        brush.strokeLineCap = 'square';
      }

      canvas.freeDrawingBrush = brush;
    } else if (activeTool === 'eraser') {
      canvas.defaultCursor = 'crosshair';
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
        const target = opt.target;
        if (target) {
          canvas.remove(target);
          canvas.discardActiveObject();
          canvas.renderAll();
          saveStateToHistory();
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
  }, [activeTool, settings, saveStateToHistory]);

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

      {/* Grid Guide Overlay */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            backgroundImage: `radial-gradient(#D5C9B8 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px',
            opacity: 0.65
          }}
          aria-hidden="true"
        />
      )}

      {/* Empty State message & illustration matching Reference Image 1 */}
      <EmptyCanvasState visible={!hasObjects} />

      {/* Interactive Fabric Canvas */}
      <canvas
        ref={canvasElRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2
        }}
      />
    </main>
  );
};
