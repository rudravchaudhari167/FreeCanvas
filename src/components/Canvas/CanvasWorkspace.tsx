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
import { configureStickyNoteObject } from '../../services/stickyNoteService';
import { EmptyCanvasState } from './EmptyCanvasState';
import { BotanicalBackground } from './BotanicalBackground';
import { Edit3 } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

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
  selectedObject?: SelectedObjectProperties | null;
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
  selectedObject,
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

  const isMobile = useIsMobile(768);
  const lastTapRef = useRef<{ time: number; target: any } | null>(null);
  const pendingDoubleTapTextRef = useRef<Textbox | IText | null>(null);

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

  // Text drag tracking state (guarantees dragging across mobile touch, templates, and standalone text)
  const isDraggingTextRef = useRef<boolean>(false);
  const textDragStartPointerRef = useRef<{ x: number; y: number } | null>(null);
  const textDragStartObjectPosRef = useRef<{ left: number; top: number } | null>(null);
  const textDragTargetRef = useRef<FabricObject | null>(null);
  const textDragMovedRef = useRef<boolean>(false);

  // Active tool and settings live references for canvas events
  const activeToolRef = useRef<ToolType>(activeTool);
  activeToolRef.current = activeTool;
  const settingsRef = useRef<ToolSettings>(settings);
  settingsRef.current = settings;
  const onZoomChangeRef = useRef(onZoomChange);
  onZoomChangeRef.current = onZoomChange;
  const updateSelectionPropsRef = useRef<() => void>(() => {});
  const handleMouseUpRef = useRef<(opt?: any) => void>(() => {});

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

  // Helper to reliably trigger text editing across touch/mobile and desktop devices
  const triggerTextEditing = useCallback((target: Textbox | IText, event?: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !target || typeof target.enterEditing !== 'function') return;

    if (activeToolRef.current !== 'select' && onToolChange) {
      onToolChange('select');
    }

    // Exit editing on any other text object
    canvas.getObjects().forEach((o: any) => {
      if (o !== target && o.isEditing && typeof o.exitEditing === 'function') {
        o.exitEditing();
      }
    });

    try {
      canvas.setActiveObject(target);
      if (!target.isEditing) {
        target.enterEditing(event);
      }
    } catch (err) {
      console.warn('Error on enterEditing:', err);
    }

    // Mobile Virtual Keyboard optimization:
    // Fabric 6's hiddenTextarea has font-size: 1px and z-index: -999, which breaks mobile keyboards.
    // Setting font-size: 18px and positioning it in viewport ensures mobile Safari / Chrome show keyboard without jumping.
    const textarea = (target as any).hiddenTextarea as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.style.fontSize = '18px';
      textarea.style.position = 'fixed';
      textarea.style.top = '50%';
      textarea.style.left = '50%';
      textarea.style.transform = 'translate(-50%, -50%)';
      textarea.style.width = '30px';
      textarea.style.height = '30px';
      textarea.style.opacity = '0.01';
      textarea.style.zIndex = '99999';
      textarea.style.pointerEvents = 'auto';
      textarea.focus();
    }

    canvas.requestRenderAll();
  }, [onToolChange]);

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

    // Configure touch handling and control handles
    FabricObject.prototype.cornerSize = 14;
    FabricObject.prototype.touchCornerSize = 48; // Generous 48px touch target for mobile fingertips
    FabricObject.prototype.cornerStyle = 'circle';
    FabricObject.prototype.cornerColor = '#FFFFFF';
    FabricObject.prototype.cornerStrokeColor = '#5E6547';
    FabricObject.prototype.borderColor = '#777D5E';
    FabricObject.prototype.borderScaleFactor = 2;
    FabricObject.prototype.transparentCorners = false;
    FabricObject.prototype.padding = 6;
    Group.prototype.subTargetCheck = false;
    Group.prototype.interactive = false;

    const lockGroupDescendants = (group: Group) => {
      group.set({ subTargetCheck: false, interactive: false });
      (group as any).subTargetCheck = false;
      (group as any).interactive = false;
      const lock = (child: any) => {
        child.set({ selectable: false, evented: false, lockMovementX: true, lockMovementY: true });
        child.selectable = false;
        child.evented = false;
        if (typeof child.getObjects === 'function') {
          child.set({ subTargetCheck: false, interactive: false });
          child.subTargetCheck = false;
          child.interactive = false;
          child.getObjects().forEach(lock);
        }
      };
      if (typeof group.getObjects === 'function') {
        group.getObjects().forEach(lock);
      }
    };

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
        canvas.getObjects().forEach((o: any) => {
          if (o.type === 'group' && !o.isStickyNote) {
            lockGroupDescendants(o as Group);
          }
        });
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
        canvas.getObjects().forEach((o: any) => {
          if (o.type === 'group' && !o.isStickyNote) {
            lockGroupDescendants(o as Group);
          }
        });
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

    (canvas as any).triggerTextEditing = (target?: Textbox | IText) => {
      const active = target || (canvas.getActiveObject() as any);
      if (active && (active instanceof Textbox || active instanceof IText || active.type === 'textbox' || active.type === 'i-text')) {
        triggerTextEditing(active);
      }
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
      activeObj.setCoords?.();
      const isSticky = !!(activeObj as any).isStickyNote;
      let fillVal = typeof activeObj.fill === 'string' ? activeObj.fill : undefined;
      let strokeVal = typeof activeObj.stroke === 'string' ? activeObj.stroke : undefined;
      const bgVal = typeof activeObj.backgroundColor === 'string' ? activeObj.backgroundColor : undefined;

      let textObj: IText | null = null;
      if (activeObj.type === 'i-text' || activeObj.type === 'text' || activeObj.type === 'textbox') {
        textObj = activeObj as IText;
      } else if (activeObj.type === 'group' && (activeObj as any).isStickyNote) {
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

      const stickyH = (activeObj as any).cardHeight || activeObj.height || 160;
      const actualHeight = Math.round(isSticky ? stickyH * (activeObj.scaleY || 1) : (activeObj.height || 0) * (activeObj.scaleY || 1));

      onSelectionChange({
        id: (activeObj as any).id,
        type: activeObj.type,
        left: Math.round(activeObj.left || 0),
        top: Math.round(activeObj.top || 0),
        width: Math.round((activeObj.width || 0) * (activeObj.scaleX || 1)),
        height: actualHeight,
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
    updateSelectionPropsRef.current = updateSelectionProps;

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
        if (!target.group || (target.group as any).isStickyNote) {
          textObj = target as Textbox | IText;
        }
      } else if ((target as any).isStickyNote) {
        const group = target as Group;
        const subTargets = opt.subTargets || [];
        const subText = subTargets.find((o: any) => o.type === 'textbox' || o.type === 'i-text');
        if (subText) {
          textObj = subText as Textbox | IText;
        } else if (typeof group.getObjects === 'function') {
          textObj = (group.getObjects().find((o) => o.type === 'textbox' || o.type === 'i-text') as Textbox | IText) || null;
        }
      }

      if (!textObj) {
        const pointer = canvas.getScenePoint(opt.e);
        const allObjects = canvas.getObjects();
        for (let i = allObjects.length - 1; i >= 0; i--) {
          const obj = allObjects[i];
          if (
            (obj instanceof Textbox || obj.type === 'textbox' || obj instanceof IText || obj.type === 'i-text') &&
            (!obj.group || (obj.group as any).isStickyNote) &&
            typeof obj.containsPoint === 'function' &&
            obj.containsPoint(pointer)
          ) {
            textObj = obj as Textbox | IText;
            break;
          }
        }
      }

      if (textObj) {
        triggerTextEditing(textObj, opt.e);
      }
    });

    // History trigger events, sticky note configuration & sticker/illustration group locking
    canvas.on('object:added', (opt: any) => {
      const target = opt?.target;
      if (target) {
        if ((target as any).isStickyNote && !(target as any)._configuredSticky) {
          configureStickyNoteObject(target as Textbox, (target as any).cardHeight || 170);
          (target as any)._configuredSticky = true;
        } else if (target.type === 'group' && !(target as any).isStickyNote) {
          target.set({
            subTargetCheck: false,
            interactive: false
          });
          (target as any).subTargetCheck = false;
          (target as any).interactive = false;
          const lock = (child: any) => {
            child.set({ selectable: false, evented: false, lockMovementX: true, lockMovementY: true });
            child.selectable = false;
            child.evented = false;
            if (typeof child.getObjects === 'function') {
              child.set({ subTargetCheck: false, interactive: false });
              child.subTargetCheck = false;
              child.interactive = false;
              child.getObjects().forEach(lock);
            }
          };
          if (typeof target.getObjects === 'function') {
            target.getObjects().forEach(lock);
          }
        }
      }
      if (!isHistoryActionRef.current) saveStateToHistory();
    });

    canvas.on('object:modified', (opt: any) => {
      const target = opt?.target || canvas.getActiveObject();
      if (target && (target as any).isStickyNote) {
        const s = target.scaleX || 1;
        if (Math.abs(s - 1) > 0.01) {
          const newWidth = Math.max(80, Math.round((target.width || 200) * s));
          const curH = (target as any).cardHeight || 160;
          const newH = Math.max(50, Math.round(curH * s));
          const curFont = (target as any).fontSize || 22;
          const newFont = Math.max(12, Math.min(64, Math.round(curFont * s)));

          target.set({
            width: newWidth,
            fontSize: newFont,
            scaleX: 1,
            scaleY: 1
          });
          (target as any).cardHeight = newH;
          target.initDimensions();
          target.setCoords();
          canvas.requestRenderAll();
        }
      }
      updateSelectionProps();
      if (!isHistoryActionRef.current) saveStateToHistory();
    });

    canvas.on('object:scaling', (opt: any) => {
      const target = opt?.target;
      if (target && (target as any).isStickyNote) {
        updateSelectionProps();
      }
    });

    canvas.on('object:resizing', (opt: any) => {
      const target = opt?.target;
      if (target && (target as any).isStickyNote) {
        target.initDimensions();
        target.setCoords();
        updateSelectionProps();
      }
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
      onZoomChangeRef.current(currentZoom);
    });

    // Touch gesture handling: two-finger pinch-to-zoom and two-finger pan
    const upperCanvas = canvas.upperCanvasEl;
    let initialTouchDist = 0;
    let initialZoom = 1;
    let initialMidpoint: { x: number; y: number } | null = null;
    let lastMidpoint: { x: number; y: number } | null = null;
    let wasDrawingBeforeTouch = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isDraggingTextRef.current = false;
        textDragTargetRef.current = null;
        textDragStartPointerRef.current = null;
        textDragStartObjectPosRef.current = null;

        e.preventDefault();
        e.stopPropagation();

        if (canvas.isDrawingMode) {
          wasDrawingBeforeTouch = true;
          canvas.isDrawingMode = false;
        }

        const t0 = e.touches[0];
        const t1 = e.touches[1];
        initialTouchDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        initialZoom = canvas.getZoom();
        initialMidpoint = {
          x: (t0.clientX + t1.clientX) / 2,
          y: (t0.clientY + t1.clientY) / 2
        };
        lastMidpoint = { ...initialMidpoint };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      // Direct 1-finger mobile text dragging
      if (
        e.touches.length === 1 &&
        isDraggingTextRef.current &&
        textDragTargetRef.current &&
        textDragStartPointerRef.current &&
        textDragStartObjectPosRef.current
      ) {
        e.preventDefault();
        const pointer = canvas.getScenePoint(e as any);
        const dx = pointer.x - textDragStartPointerRef.current.x;
        const dy = pointer.y - textDragStartPointerRef.current.y;

        if (Math.hypot(dx, dy) > 2) {
          textDragMovedRef.current = true;
          pendingDoubleTapTextRef.current = null; // Finger moved, cancel double-tap edit candidate
          const target = textDragTargetRef.current;

          // Ensure virtual keypad is closed while dragging
          if ((target as any).isEditing && typeof (target as any).exitEditing === 'function') {
            (target as any).exitEditing();
          }
          const hiddenTa = (target as any).hiddenTextarea as HTMLTextAreaElement | null;
          if (hiddenTa) hiddenTa.blur();
          if (document.activeElement && typeof (document.activeElement as HTMLElement).blur === 'function') {
            (document.activeElement as HTMLElement).blur();
          }

          target.set({
            left: textDragStartObjectPosRef.current.left + dx,
            top: textDragStartObjectPosRef.current.top + dy
          });
          target.setCoords();
          canvas.requestRenderAll();
        }
        return;
      }

      if (e.touches.length === 2 && initialMidpoint && lastMidpoint && upperCanvas) {
        e.preventDefault();
        e.stopPropagation();

        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const currentDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        const currentMidpoint = {
          x: (t0.clientX + t1.clientX) / 2,
          y: (t0.clientY + t1.clientY) / 2
        };

        // Relative Pan
        const deltaX = currentMidpoint.x - lastMidpoint.x;
        const deltaY = currentMidpoint.y - lastMidpoint.y;
        lastMidpoint = currentMidpoint;
        canvas.relativePan(new Point(deltaX, deltaY));

        // Pinch Zoom
        if (initialTouchDist > 0) {
          const scale = currentDist / initialTouchDist;
          let targetZoom = initialZoom * scale;
          targetZoom = Math.max(0.2, Math.min(5, targetZoom));

          const rect = upperCanvas.getBoundingClientRect();
          const zoomPoint = new Point(currentMidpoint.x - rect.left, currentMidpoint.y - rect.top);
          canvas.zoomToPoint(zoomPoint, targetZoom);
          onZoomChangeRef.current(targetZoom);
        }

        canvas.requestRenderAll();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const pendingDoubleTap = pendingDoubleTapTextRef.current;
      pendingDoubleTapTextRef.current = null;

      if (isDraggingTextRef.current) {
        isDraggingTextRef.current = false;
        const wasMoved = textDragMovedRef.current;
        const target = textDragTargetRef.current;
        textDragStartPointerRef.current = null;
        textDragStartObjectPosRef.current = null;
        textDragTargetRef.current = null;
        textDragMovedRef.current = false;

        if (target && wasMoved) {
          target.setCoords();
          canvas.requestRenderAll();
          saveStateToHistory();
          updateLayers();
          updateSelectionProps();
          canvas.fire('object:modified', { target });
        } else if (pendingDoubleTap && !wasMoved) {
          // Stationary double-tap: user tapped twice in place without dragging -> enter editing
          triggerTextEditing(pendingDoubleTap, e);
        }
      } else if (pendingDoubleTap) {
        triggerTextEditing(pendingDoubleTap, e);
      }

      if (isDrawingShapeRef.current) {
        handleMouseUpRef.current({ e });
      }

      if (e.touches.length < 2) {
        initialMidpoint = null;
        lastMidpoint = null;
        initialTouchDist = 0;

        if (wasDrawingBeforeTouch) {
          setTimeout(() => {
            const curTool = activeToolRef.current;
            if (curTool === 'pen' || curTool === 'pencil' || curTool === 'marker') {
              canvas.isDrawingMode = true;
            }
            wasDrawingBeforeTouch = false;
          }, 60);
        }
      }
    };

    if (upperCanvas) {
      upperCanvas.style.touchAction = 'none';
      upperCanvas.addEventListener('touchstart', onTouchStart, { passive: false });
      upperCanvas.addEventListener('touchmove', onTouchMove, { passive: false });
      upperCanvas.addEventListener('touchend', onTouchEnd, { passive: false });
      upperCanvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    }

    return () => {
      if (upperCanvas) {
        upperCanvas.removeEventListener('touchstart', onTouchStart);
        upperCanvas.removeEventListener('touchmove', onTouchMove);
        upperCanvas.removeEventListener('touchend', onTouchEnd);
        upperCanvas.removeEventListener('touchcancel', onTouchEnd);
      }
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
  const prevToolRef = useRef<ToolType>(activeTool);
  useEffect(() => {
    const prevTool = prevToolRef.current;
    prevToolRef.current = activeTool;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Reset interaction states
    canvas.isDrawingMode = false;
    canvas.selection = activeTool === 'select';
    canvas.defaultCursor = 'default';

    // Only discard active object when user explicitly switches to eraser or drawing tools, NEVER on settings updates!
    if (prevTool !== activeTool && !['select', 'text'].includes(activeTool)) {
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

      // Reset pending double-tap candidate
      pendingDoubleTapTextRef.current = null;

      // When not using the text tool, dismiss any previous text editing and close the mobile keyboard
      if (activeToolRef.current !== 'text') {
        canvas.getObjects().forEach((o: any) => {
          if (o.isEditing && typeof o.exitEditing === 'function') {
            o.exitEditing();
          }
        });
        if (document.activeElement && (document.activeElement as HTMLElement).tagName === 'TEXTAREA') {
          (document.activeElement as HTMLElement).blur();
        }
      }

      const pointer = canvas.getScenePoint(opt.e);

      // 1. Group / Sticker / Illustration Unified Targeting:
      // If the clicked target is a component inside a group, or is a sticker/illustration group,
      // unify targeting to the root group so the entire sticker/illustration is dragged as a single whole object.
      let rootGroup: Group | null = null;
      if (opt.target) {
        if (opt.target.group && !(opt.target.group as any).isStickyNote) {
          let curr = opt.target.group;
          while (curr && curr.group && !(curr.group as any).isStickyNote) {
            curr = curr.group;
          }
          rootGroup = curr as Group;
        } else if (opt.target.type === 'group' && !(opt.target as any).isStickyNote) {
          rootGroup = opt.target as Group;
        }
      }

      // If activeTool is eraser, erase the whole sticker / illustration group
      if (activeTool === 'eraser' && rootGroup) {
        isErasingRef.current = true;
        hasErasedRef.current = false;
        canvas.remove(rootGroup);
        canvas.discardActiveObject();
        canvas.renderAll();
        hasErasedRef.current = true;
        return;
      }

      if (rootGroup && activeTool !== 'eraser') {
        // Enforce that this group and all its nested children are completely atomic
        rootGroup.set({
          subTargetCheck: false,
          interactive: false,
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          lockRotation: false
        });
        (rootGroup as any).subTargetCheck = false;
        (rootGroup as any).interactive = false;

        const lockDescendants = (obj: any) => {
          obj.set({
            selectable: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true
          });
          obj.selectable = false;
          obj.evented = false;
          if (typeof obj.getObjects === 'function') {
            obj.set({ subTargetCheck: false, interactive: false });
            (obj as any).subTargetCheck = false;
            (obj as any).interactive = false;
            obj.getObjects().forEach(lockDescendants);
          }
        };
        if (typeof rootGroup.getObjects === 'function') {
          rootGroup.getObjects().forEach(lockDescendants);
        }

        opt.target = rootGroup;
        opt.subTargets = [];

        // Check if user clicked/touched a resize / rotate control handle on the sticker group
        const curTransform = (canvas as any)._currentTransform;
        const isTransformingControl = !!(curTransform && curTransform.corner);
        const controlHit =
          typeof rootGroup.findControl === 'function' &&
          rootGroup.findControl(canvas.getViewportPoint(opt.e), true);

        if (isTransformingControl || controlHit) {
          // USER TOUCHED A STICKER / ILLUSTRATION POINT (ROTATE OR ADJUST SIZE)!
          // Preserve Fabric's native scale/rotate transformation and DO NOT hijack with drag!
          isDraggingTextRef.current = false;
          textDragTargetRef.current = null;
          textDragStartPointerRef.current = null;
          textDragStartObjectPosRef.current = null;
          textDragMovedRef.current = false;

          if (activeToolRef.current !== 'select' && onToolChange) {
            onToolChange('select');
          }
          return;
        }

        // Otherwise, user touched the body of the sticker / illustration:
        if (canvas.getActiveObject() !== rootGroup) {
          canvas.setActiveObject(rootGroup);
          canvas.requestRenderAll();
        }

        // For stickers and illustrations, we DO NOT hijack with custom isDraggingTextRef.
        // Fabric natively handles 1-finger group dragging via its built-in dragHandler,
        // and leaving isDraggingTextRef false allows touchmove events to reach Fabric
        // so corner point scaling (adjust size) and top point rotating execute smoothly!
        isDraggingTextRef.current = false;
        textDragTargetRef.current = null;
        textDragStartPointerRef.current = null;
        textDragStartObjectPosRef.current = null;
        textDragMovedRef.current = false;

        if (activeToolRef.current !== 'select' && onToolChange) {
          onToolChange('select');
        }
        return;
      }

      // Prioritize text selection: if the user clicked on or inside any text object,
      // select/edit the text and do not let the underlying or surrounding shape hijack the selection.
      if (activeTool !== 'eraser') {
        let textTarget: Textbox | IText | null = null;
        if (
          opt.target &&
          (opt.target instanceof Textbox ||
            opt.target.type === 'textbox' ||
            opt.target instanceof IText ||
            opt.target.type === 'i-text')
        ) {
          if (!opt.target.group || (opt.target.group as any).isStickyNote) {
            textTarget = opt.target as Textbox | IText;
          }
        } else if (opt.target && (opt.target as any).isStickyNote) {
          if (typeof (opt.target as Group).getObjects === 'function') {
            textTarget = ((opt.target as Group).getObjects().find((o) => o.type === 'textbox' || o.type === 'i-text') as Textbox | IText) || null;
          }
        }

        // Even if opt.target was an underlying card or shape, check if the touch point hits a text object
        if (!textTarget) {
          const allObjects = canvas.getObjects();
          for (let i = allObjects.length - 1; i >= 0; i--) {
            const obj = allObjects[i];
            if (
              (obj instanceof Textbox || obj.type === 'textbox' || obj instanceof IText || obj.type === 'i-text') &&
              (!obj.group || (obj.group as any).isStickyNote) &&
              typeof obj.containsPoint === 'function' &&
              obj.containsPoint(pointer)
            ) {
              textTarget = obj as Textbox | IText;
              break;
            }
          }
        }

        if (textTarget) {
          const now = Date.now();
          const lastTap = lastTapRef.current;
          const isDoubleTap = !!(lastTap && lastTap.target === textTarget && now - lastTap.time < 450);

          lastTapRef.current = { time: now, target: textTarget };

          // Exit editing on any text object so cursor never leaks or ghost-edits, and keyboard closes
          canvas.getObjects().forEach((o: any) => {
            if (o.isEditing && typeof o.exitEditing === 'function') {
              o.exitEditing();
            }
          });

          // Always ensure the clicked text is set as active
          canvas.setActiveObject(textTarget);

          // If the text tool is specifically active in the toolbar -> enter editing!
          if (activeToolRef.current === 'text') {
            triggerTextEditing(textTarget, opt.e);
          } else {
            // Select mode or mobile drag:
            // Ensure editing is exited and virtual keyboard is completely dismissed
            if (textTarget.isEditing && typeof textTarget.exitEditing === 'function') {
              textTarget.exitEditing();
            }
            const hiddenTa = (textTarget as any).hiddenTextarea as HTMLTextAreaElement | null;
            if (hiddenTa) hiddenTa.blur();
            if (document.activeElement && typeof (document.activeElement as HTMLElement).blur === 'function') {
              (document.activeElement as HTMLElement).blur();
            }

            // If it's a double-tap, remember as candidate for in-place edit on release (touchend/mouseup)
            // ONLY if the user does NOT drag!
            if (isDoubleTap) {
              pendingDoubleTapTextRef.current = textTarget;
            } else {
              pendingDoubleTapTextRef.current = null;
            }

            const curTransform = (canvas as any)._currentTransform;
            const isTransformingControl = !!(curTransform && curTransform.corner);
            const isControlClicked =
              typeof (textTarget as any).findControl === 'function' &&
              (textTarget as any).findControl(canvas.getViewportPoint(opt.e), true);

            if (!isControlClicked && !isTransformingControl) {
              const dragItem =
                textTarget.group && !(textTarget.group as any).interactive
                  ? (textTarget.group as any)
                  : textTarget;

              isDraggingTextRef.current = true;
              textDragStartPointerRef.current = { x: pointer.x, y: pointer.y };
              textDragStartObjectPosRef.current = { left: dragItem.left || 0, top: dragItem.top || 0 };
              textDragTargetRef.current = dragItem;
              textDragMovedRef.current = false;

              if (typeof (canvas as any)._setupCurrentTransform === 'function') {
                (canvas as any)._setupCurrentTransform(opt.e, textTarget, false);
              }
            } else {
              isDraggingTextRef.current = false;
              textDragTargetRef.current = null;
            }
          }

          if (activeToolRef.current !== 'select' && onToolChange) {
            onToolChange('select');
          }
          canvas.requestRenderAll();
          return;
        }
      }

      // If user clicked on an existing object (shape, card, etc.) outside of text:
      if (opt.target && activeTool !== 'eraser') {
        const shapeTarget = (opt.target.group && !(opt.target.group as any).isStickyNote)
          ? opt.target.group
          : opt.target;

        // Check if the click/touch landed on any control handle (corner scale handles or top rotation handle)
        const curTransform = (canvas as any)._currentTransform;
        const isTransformingControl = !!(curTransform && curTransform.corner);
        const controlHit =
          typeof (shapeTarget as any).findControl === 'function' &&
          (shapeTarget as any).findControl(canvas.getViewportPoint(opt.e), true);

        if (isTransformingControl || controlHit) {
          // USER TOUCHED A CONTROL POINT (ROTATE, MINIMISE/MAXIMISE)!
          // Preserve Fabric's native scale/rotate transformation and DO NOT hijack with drag!
          isDraggingTextRef.current = false;
          textDragTargetRef.current = null;
          textDragStartPointerRef.current = null;
          textDragStartObjectPosRef.current = null;
          textDragMovedRef.current = false;

          if (activeToolRef.current !== 'select' && onToolChange) {
            onToolChange('select');
          }
          return;
        }

        // Otherwise, user touched the body of the shape:
        if (canvas.getActiveObject() !== shapeTarget) {
          canvas.setActiveObject(shapeTarget);
          updateSelectionPropsRef.current();
          canvas.requestRenderAll();
        }

        // For shapes, do NOT hijack with custom text dragging.
        // Fabric natively handles 1-finger shape dragging, and leaving isDraggingTextRef false
        // allows touchmove events to reach Fabric so corner points (minimise/maximise)
        // and rotation point (rotate) execute smoothly via Fabric!
        isDraggingTextRef.current = false;
        textDragTargetRef.current = null;
        textDragStartPointerRef.current = null;
        textDragStartObjectPosRef.current = null;
        textDragMovedRef.current = false;

        if (activeToolRef.current !== 'select' && onToolChange) {
          onToolChange('select');
        }
        return;
      }

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
            let toRemove = target;
            if (target.group && !(target.group as any).isStickyNote) {
              toRemove = target.group;
            }
            canvas.remove(toRemove);
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

        const curSettings = settingsRef.current;
        const fillColor = curSettings.fillColor || curSettings.color || '#E8EBD9';
        const strokeColor = curSettings.strokeColor || '#5E6547';
        const commonProps = {
          left: pointer.x,
          top: pointer.y,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: curSettings.strokeWidth || 2,
          opacity: curSettings.opacity,
          selectable: true
        };

        const shapeObj = createFabricShape(curSettings.shapeType, commonProps, 2, 2);
        (shapeObj as any).shapeType = curSettings.shapeType;
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
      // Direct Text Drag tracking (guarantees seamless drag across mobile touch, templates, sticky notes)
      if (
        isDraggingTextRef.current &&
        textDragTargetRef.current &&
        textDragStartPointerRef.current &&
        textDragStartObjectPosRef.current
      ) {
        const pointer = canvas.getScenePoint(opt.e);
        const dx = pointer.x - textDragStartPointerRef.current.x;
        const dy = pointer.y - textDragStartPointerRef.current.y;

        if (Math.hypot(dx, dy) > 2) {
          textDragMovedRef.current = true;
          pendingDoubleTapTextRef.current = null; // User moved their cursor/finger, cancel double-tap edit
          const target = textDragTargetRef.current;

          // Ensure virtual keypad is never open during dragging
          if ((target as any).isEditing && typeof (target as any).exitEditing === 'function') {
            (target as any).exitEditing();
          }
          const hiddenTa = (target as any).hiddenTextarea as HTMLTextAreaElement | null;
          if (hiddenTa) hiddenTa.blur();
          if (document.activeElement && typeof (document.activeElement as HTMLElement).blur === 'function') {
            (document.activeElement as HTMLElement).blur();
          }

          target.set({
            left: textDragStartObjectPosRef.current.left + dx,
            top: textDragStartObjectPosRef.current.top + dy
          });
          target.setCoords();
          canvas.requestRenderAll();
        }
        return;
      }

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

    const handleMouseUp = (opt?: any) => {
      const pendingDoubleTap = pendingDoubleTapTextRef.current;
      pendingDoubleTapTextRef.current = null;

      if (isDraggingTextRef.current) {
        isDraggingTextRef.current = false;
        const wasMoved = textDragMovedRef.current;
        const target = textDragTargetRef.current;
        textDragStartPointerRef.current = null;
        textDragStartObjectPosRef.current = null;
        textDragTargetRef.current = null;
        textDragMovedRef.current = false;

        if (target && wasMoved) {
          target.setCoords();
          canvas.requestRenderAll();
          saveStateToHistory();
          updateLayers();
          canvas.fire('object:modified', { target });
          return;
        } else if (pendingDoubleTap && !wasMoved) {
          triggerTextEditing(pendingDoubleTap, opt?.e);
          return;
        }
      } else if (pendingDoubleTap) {
        triggerTextEditing(pendingDoubleTap, opt?.e);
        return;
      }

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

          let finalCreatedObject: FabricObject = obj;

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
            finalCreatedObject = arrowGroup;
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
            finalCreatedObject = line;
          } else if (activeTool === 'shape') {
            // ONLY if the user single-clicked without dragging (< 10px), provide a standard default size
            if (actualW < 10 && actualH < 10) {
              applyDefaultShapeDimensions(obj, start.x, start.y);
            }
            obj.setCoords();
            finalCreatedObject = obj;
          } else {
            obj.setCoords();
            finalCreatedObject = obj;
          }

          finalCreatedObject.setCoords();
          canvas.setActiveObject(finalCreatedObject);
          updateSelectionPropsRef.current();
          if (onToolChange) {
            onToolChange('select');
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
    handleMouseUpRef.current = handleMouseUp;

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    // Keyboard space bar listener for panning
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !isSpacePressedRef.current &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
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
  }, [activeTool, settings, saveStateToHistory, eraseAtPoint, updateLayers, onToolChange, triggerTextEditing]);

  return (
    <main
      ref={containerRef}
      className="canvas-touch-surface"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#F8F3EC',
        touchAction: 'none'
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

      {/* Mobile Floating Text Edit Trigger Button */}
      {isMobile && selectedObject && (selectedObject.text !== undefined || selectedObject.isStickyNote || selectedObject.type === 'textbox' || selectedObject.type === 'i-text') && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const canvas = fabricCanvasRef.current;
            if (!canvas) return;
            const activeObj = canvas.getActiveObject();
            if (!activeObj) return;
            let textObj: Textbox | IText | null = null;
            if (activeObj instanceof Textbox || activeObj.type === 'textbox' || activeObj instanceof IText || activeObj.type === 'i-text') {
              textObj = activeObj as Textbox | IText;
            } else if (activeObj.type === 'group') {
              textObj = ((activeObj as Group).getObjects().find((o) => o.type === 'textbox' || o.type === 'i-text') as Textbox | IText) || null;
            }
            if (textObj) {
              triggerTextEditing(textObj);
            }
          }}
          className="mobile-edit-text-pill"
          style={{
            position: 'absolute',
            bottom: '76px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#4A503D',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 600,
            borderRadius: '9999px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            cursor: 'pointer',
            touchAction: 'manipulation'
          }}
        >
          <Edit3 size={16} />
          <span>Tap to Edit Text</span>
        </button>
      )}

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
