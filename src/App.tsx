import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Canvas as FabricCanvas,
  FabricImage,
  IText,
  Textbox,
  Group,
  FabricObject,
  Shadow,
  Control,
  loadSVGFromString,
  util
} from 'fabric';
import type {
  ToolType,
  ToolSettings,
  SelectedObjectProperties,
  GridType,
  TemplateType
} from './types/canvas';
import type { CanvasProject } from './types/project';
import { saveProject } from './services/db';
import { createFabricShape } from './constants/shapes';
import {
  createWeeklyPlanner,
  createCornellNotes,
  createMindMap,
  createStoryboard,
  createKanbanBoard
} from './services/templateGenerator';

import { EditorHeader } from './components/Header/EditorHeader';
import { LeftToolbar } from './components/Toolbar/LeftToolbar';
import { MoreToolsMenu } from './components/Toolbar/MoreToolsMenu';
import { PropertiesPanel } from './components/Properties/PropertiesPanel';
import { BottomFloatingBar } from './components/BottomBar/BottomFloatingBar';
import { CanvasWorkspace } from './components/Canvas/CanvasWorkspace';

import { GalleryModal } from './components/Modals/GalleryModal';
import { ExportModal } from './components/Modals/ExportModal';
import { ProjectsModal } from './components/Modals/ProjectsModal';
import { TemplatesModal } from './components/Modals/TemplatesModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { Toast } from './components/Modals/Toast';

export function App() {
  // Current Project State
  const [projectId, setProjectId] = useState<string>(() => 'proj_' + Date.now());
  const [projectName, setProjectName] = useState<string>('Ideas Into Beauty');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');

  // Tool & Settings State
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [settings, setSettings] = useState<ToolSettings>({
    color: '#777D5E', // Default Sage Green
    size: 4,
    opacity: 1,
    strokeWidth: 4,
    fillColor: '#777D5E',
    strokeColor: '#5E6547',
    shapeType: 'rectangle',
    eraserMode: 'stroke',
    lineStyle: 'solid',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 22,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textAlign: 'left',
    stickyColor: '#FAF0D7'
  });

  // Selected Object Properties
  const [selectedObject, setSelectedObject] = useState<SelectedObjectProperties | null>(null);

  // View Settings
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFEFA');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [gridType, setGridType] = useState<GridType>('none');
  const [currentTemplate, setCurrentTemplate] = useState<TemplateType>('warm');
  const [showProperties, setShowProperties] = useState<boolean>(true);
  const [showToolbar, setShowToolbar] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);

  // Undo / Redo
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Modals state
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clipboard for copy/paste
  const clipboardRef = useRef<any>(null);

  // Canvas Instance reference
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  }, []);

  // Update tool settings
  const handleUpdateSettings = (newSettings: Partial<ToolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Update selected object properties on canvas
  const handleUpdateSelectedObject = (props: Partial<SelectedObjectProperties>) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    if (props.backgroundColor !== undefined) {
      if ((activeObj as any).isStickyNote) {
        activeObj.set('backgroundColor', props.backgroundColor);
        activeObj.set('dirty', true);
      }
    }

    if (props.textColor !== undefined) {
      const colorVal = props.textColor;
      if ((activeObj as any).isStickyNote) {
        activeObj.set('fill', colorVal);
        activeObj.set('stroke', null);
        activeObj.set('strokeWidth', 0);
        if ((activeObj as any).isEditing) {
          (activeObj as any).setSelectionStyles?.({ fill: colorVal, stroke: null, strokeWidth: 0 });
          (activeObj as any).hiddenTextarea?.focus();
        }
        if ((activeObj as any).styles) {
          const styles = (activeObj as any).styles;
          Object.keys(styles).forEach((lineKey) => {
            if (styles[lineKey]) {
              Object.keys(styles[lineKey]).forEach((charKey) => {
                if (styles[lineKey][charKey]) {
                  styles[lineKey][charKey].fill = colorVal;
                  delete styles[lineKey][charKey].stroke;
                  delete styles[lineKey][charKey].strokeWidth;
                }
              });
            }
          });
        }
        activeObj.set('dirty', true);
      } else if (activeObj.type === 'i-text' || activeObj.type === 'text' || activeObj.type === 'textbox') {
        activeObj.set('fill', colorVal);
        if ((activeObj as any).isEditing) {
          if ((activeObj as any).selectionStart !== (activeObj as any).selectionEnd) {
            (activeObj as any).setSelectionStyles?.({ fill: colorVal });
          } else {
            (activeObj as any).set('fill', colorVal);
          }
        }
        if ((activeObj as any).styles) {
          const styles = (activeObj as any).styles;
          Object.keys(styles).forEach((lineKey) => {
            if (styles[lineKey]) {
              Object.keys(styles[lineKey]).forEach((charKey) => {
                if (styles[lineKey][charKey]) styles[lineKey][charKey].fill = colorVal;
              });
            }
          });
        }
        activeObj.set('dirty', true);
      } else if (activeObj.type === 'group') {
        const textObjects = (activeObj as Group).getObjects().filter((o) => o.type === 'i-text' || o.type === 'text' || o.type === 'textbox');
        textObjects.forEach((t) => {
          t.set('fill', colorVal);
          if ((t as any).isEditing) {
            (t as any).setSelectionStyles?.({ fill: colorVal });
          }
          if ((t as any).styles) {
            const styles = (t as any).styles;
            Object.keys(styles).forEach((lineKey) => {
              if (styles[lineKey]) {
                Object.keys(styles[lineKey]).forEach((charKey) => {
                  if (styles[lineKey][charKey]) styles[lineKey][charKey].fill = colorVal;
                });
              }
            });
          }
          t.set('dirty', true);
        });
        activeObj.set('dirty', true);
      }
    }

    if (props.fill !== undefined) {
      if ((activeObj as any).isStickyNote) {
        if (props.backgroundColor !== undefined) {
          activeObj.set('backgroundColor', props.backgroundColor);
          activeObj.set('dirty', true);
        } else if (props.textColor === undefined) {
          activeObj.set('backgroundColor', props.fill);
          activeObj.set('dirty', true);
        }
      } else if (activeObj.type === 'group') {
        const groupObjects = (activeObj as Group).getObjects();
        const baseShape = groupObjects.find((o) => o.type !== 'i-text' && o.type !== 'text' && o.type !== 'textbox') || groupObjects[0];
        if (baseShape) {
          baseShape.set('fill', props.fill);
        }
        activeObj.set('dirty', true);
      } else {
        activeObj.set('fill', props.fill);
      }
    }
    if (props.stroke !== undefined) {
      if ((activeObj as any).isStickyNote) {
        (activeObj as any).cardStroke = props.stroke;
        activeObj.set('stroke', null);
        activeObj.set('strokeWidth', 0);
        activeObj.set('dirty', true);
      } else {
        activeObj.set('stroke', props.stroke);
        if (activeObj.type === 'group') {
          const groupObjects = (activeObj as Group).getObjects();
          if (groupObjects[0]) {
            groupObjects[0].set('stroke', props.stroke);
          }
        }
      }
    }
    if (props.strokeWidth !== undefined) {
      if ((activeObj as any).isStickyNote) {
        (activeObj as any).cardStrokeWidth = props.strokeWidth;
        activeObj.set('stroke', null);
        activeObj.set('strokeWidth', 0);
        activeObj.set('dirty', true);
      } else {
        activeObj.set('strokeWidth', props.strokeWidth);
        if (activeObj.type === 'group') {
          const groupObjects = (activeObj as Group).getObjects();
          if (groupObjects[0]) {
            groupObjects[0].set('strokeWidth', props.strokeWidth);
          }
        }
      }
    }
    if (props.opacity !== undefined) activeObj.set('opacity', props.opacity);

    // Shape Morphing / Changing
    if (props.shapeType !== undefined) {
      const isCurrentShape = ['rect', 'circle', 'ellipse', 'triangle', 'polygon', 'path'].includes(activeObj.type || '');
      if (isCurrentShape) {
        const curLeft = activeObj.left || 100;
        const curTop = activeObj.top || 100;
        const curWidth = Math.max(20, (activeObj.width || 100) * (activeObj.scaleX || 1));
        const curHeight = Math.max(20, (activeObj.height || 100) * (activeObj.scaleY || 1));
        const curFill = typeof activeObj.fill === 'string' ? activeObj.fill : (settings.fillColor || settings.color || '#E8EBD9');
        const curStroke = typeof activeObj.stroke === 'string' ? activeObj.stroke : (settings.strokeColor || '#5E6547');
        const curStrokeWidth = activeObj.strokeWidth !== undefined ? activeObj.strokeWidth : 2;
        const curOpacity = activeObj.opacity !== undefined ? activeObj.opacity : 1;
        const curAngle = activeObj.angle || 0;

        const commonProps = {
          left: curLeft,
          top: curTop,
          fill: curFill,
          stroke: curStroke,
          strokeWidth: curStrokeWidth,
          opacity: curOpacity,
          angle: curAngle,
          selectable: true
        };

        const newObj = createFabricShape(props.shapeType, commonProps, curWidth, curHeight);

        (newObj as any).shapeType = props.shapeType;
        canvas.remove(activeObj);
        canvas.add(newObj);
        canvas.setActiveObject(newObj);
        newObj.setCoords();
        canvas.requestRenderAll();
        setSelectedObject({
          id: (newObj as any).id,
          type: newObj.type,
          left: Math.round(newObj.left || 0),
          top: Math.round(newObj.top || 0),
          width: Math.round(curWidth),
          height: Math.round(curHeight),
          angle: Math.round(newObj.angle || 0),
          fill: typeof newObj.fill === 'string' ? newObj.fill : undefined,
          stroke: typeof newObj.stroke === 'string' ? newObj.stroke : undefined,
          strokeWidth: newObj.strokeWidth,
          opacity: newObj.opacity,
          isLocked: !!newObj.lockMovementX,
          shapeType: props.shapeType
        });
        return;
      }
    }

    // Target text object directly or inside a group (e.g. sticky note)
    let textTarget: any =
      activeObj.type === 'i-text' || activeObj.type === 'text' || activeObj.type === 'textbox'
        ? activeObj
        : activeObj.type === 'group'
        ? (activeObj as Group).getObjects().find((obj) => obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox')
        : null;

    if (textTarget) {
      if (props.textColor !== undefined) {
        textTarget.set('fill', props.textColor);
        if (textTarget.isEditing) {
          textTarget.setSelectionStyles?.({ fill: props.textColor });
        }
      } else if (props.fill !== undefined && !(activeObj as any).isStickyNote && activeObj.type !== 'group') {
        textTarget.set('fill', props.fill);
        if (textTarget.isEditing) {
          textTarget.setSelectionStyles?.({ fill: props.fill });
        }
      }
      if (props.fontFamily !== undefined) {
        textTarget.set('fontFamily', props.fontFamily);
        if (textTarget.isEditing) {
          textTarget.setSelectionStyles?.({ fontFamily: props.fontFamily });
        }
        if (typeof document !== 'undefined' && document.fonts?.load) {
          document.fonts.load(`16px "${props.fontFamily}"`).then(() => {
            if (textTarget) {
              textTarget.initDimensions?.();
              textTarget.set('dirty', true);
              canvas.requestRenderAll();
            }
          }).catch(() => {});
        }
      }
      if (props.fontSize !== undefined) {
        textTarget.set('fontSize', props.fontSize);
        if (textTarget.isEditing) {
          textTarget.setSelectionStyles?.({ fontSize: props.fontSize });
        }
      }
      if (props.fontWeight !== undefined) {
        textTarget.set('fontWeight', props.fontWeight);
        if (textTarget.isEditing) {
          textTarget.setSelectionStyles?.({ fontWeight: props.fontWeight });
        }
      }
      if (props.fontStyle !== undefined) {
        textTarget.set('fontStyle', props.fontStyle);
        if (textTarget.isEditing) {
          textTarget.setSelectionStyles?.({ fontStyle: props.fontStyle });
        }
        if (textTarget.styles) {
          const styles = textTarget.styles;
          Object.keys(styles).forEach((lineKey) => {
            const line = styles[lineKey];
            if (line) {
              Object.keys(line).forEach((charKey: string) => {
                if (line[charKey]) {
                  line[charKey].fontStyle = props.fontStyle;
                }
              });
            }
          });
        }
      }
      if (props.underline !== undefined) {
        textTarget.set('underline', props.underline);
        if (textTarget.isEditing) {
          textTarget.setSelectionStyles?.({ underline: props.underline });
        }
        if (textTarget.styles) {
          const styles = textTarget.styles;
          Object.keys(styles).forEach((lineKey) => {
            const line = styles[lineKey];
            if (line) {
              Object.keys(line).forEach((charKey: string) => {
                if (line[charKey]) {
                  line[charKey].underline = props.underline;
                }
              });
            }
          });
        }
      }
      if (props.textAlign !== undefined) {
        if (activeObj.type === 'i-text' && activeObj === textTarget) {
          // Seamlessly convert standalone plain IText into Textbox so width-based text alignment is visible immediately
          const oldText = activeObj as IText;
          const currentW = Math.max((oldText.width || 0) * (oldText.scaleX || 1), 260);
          const textbox = new Textbox(oldText.text || '', {
            left: oldText.left,
            top: oldText.top,
            width: currentW,
            fontFamily: oldText.fontFamily,
            fontSize: oldText.fontSize,
            fill: oldText.fill,
            stroke: oldText.stroke,
            strokeWidth: oldText.strokeWidth,
            fontWeight: oldText.fontWeight,
            fontStyle: oldText.fontStyle,
            underline: oldText.underline,
            textAlign: props.textAlign as any,
            opacity: oldText.opacity,
            angle: oldText.angle,
            padding: 6
          });
          canvas.remove(oldText);
          canvas.add(textbox);
          canvas.setActiveObject(textbox);
          textTarget = textbox;
        } else {
          textTarget.set('textAlign', props.textAlign);
          if (textTarget.type === 'textbox' && (!textTarget.width || textTarget.width < 200)) {
            textTarget.set('width', 260);
          }
        }
        if (textTarget.isEditing) {
          textTarget.setSelectionStyles?.({ textAlign: props.textAlign });
        }
      }

      textTarget.initDimensions?.();
      textTarget.set('dirty', true);
      activeObj.set('dirty', true);
    }

    canvas.requestRenderAll();
    setSelectedObject((prev) => (prev ? { ...prev, ...props } : null));
  };

  // Perform project save to IndexedDB
  const handleSaveProject = useCallback(async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      setSaveStatus('saving');
      const json = JSON.stringify(canvas.toJSON());
      const thumbnail = canvas.toDataURL({
        format: 'png',
        quality: 0.6,
        multiplier: 0.25
      });

      const project: CanvasProject = {
        id: projectId,
        name: projectName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        canvasData: json,
        backgroundColor: backgroundColor,
        zoom: zoom,
        thumbnail: thumbnail
      };

      await saveProject(project);
      setSaveStatus('saved');
      showToast(`Saved "${projectName}"`);
    } catch (err) {
      console.error('Error saving project:', err);
      setSaveStatus('error');
    }
  }, [projectId, projectName, backgroundColor, zoom, showToast]);

  // Autosave debouncer
  const autosaveTimeoutRef = useRef<number | null>(null);
  const handleCanvasChangeTrigger = useCallback(
    (_json: string) => {
      setSaveStatus('unsaved');
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
      autosaveTimeoutRef.current = window.setTimeout(() => {
        handleSaveProject();
      }, 3500);
    },
    [handleSaveProject]
  );

  // Undo / Redo actions
  const handleUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Trigger undo event on canvas if available
    const historyUndo = (canvas as any).undo;
    if (typeof historyUndo === 'function') {
      historyUndo();
    }
  }, []);

  const handleRedo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const historyRedo = (canvas as any).redo;
    if (typeof historyRedo === 'function') {
      historyRedo();
    }
  }, []);

  // Duplicate selected object
  const handleDuplicateSelected = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    activeObj.clone().then((cloned: FabricObject) => {
      cloned.set({
        left: (cloned.left || 0) + 24,
        top: (cloned.top || 0) + 24,
        evented: true
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      showToast('Object duplicated');
    });
  }, [showToast]);

  // Delete selected object
  const handleDeleteSelected = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      canvas.remove(activeObj);
      canvas.discardActiveObject();
      canvas.renderAll();
      setSelectedObject(null);
    }
  }, []);

  // Lock / Unlock selected object
  const handleToggleLock = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    const isLocked = !activeObj.lockMovementX;
    activeObj.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockRotation: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked
    });

    canvas.renderAll();
    setSelectedObject((prev) => (prev ? { ...prev, isLocked } : null));
    showToast(isLocked ? 'Object locked' : 'Object unlocked');
  }, [showToast]);

  // Bring forward / send backward
  const handleBringForward = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      canvas.bringObjectForward(activeObj);
      canvas.renderAll();
    }
  }, []);

  const handleSendBackward = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      canvas.sendObjectBackwards(activeObj);
      canvas.renderAll();
    }
  }, []);

  // Cut, Copy, Paste
  const handleCopy = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      activeObj.clone().then((cloned: FabricObject) => {
        clipboardRef.current = cloned;
        showToast('Copied to clipboard');
      });
    }
  }, [showToast]);

  const handleCut = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      activeObj.clone().then((cloned: FabricObject) => {
        clipboardRef.current = cloned;
        canvas.remove(activeObj);
        canvas.discardActiveObject();
        canvas.renderAll();
        showToast('Cut to clipboard');
      });
    }
  }, [showToast]);

  const handlePaste = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !clipboardRef.current) return;

    clipboardRef.current.clone().then((cloned: FabricObject) => {
      canvas.discardActiveObject();
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        evented: true
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      showToast('Pasted object');
    });
  }, [showToast]);

  const handleSelectAll = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.discardActiveObject();
    const objs = canvas.getObjects();
    if (objs.length > 0) {
      canvas.setActiveObject(objs[0]); // Select first or group
      canvas.renderAll();
    }
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(4, +(z * 1.2).toFixed(2)));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.25, +(z / 1.2).toFixed(2)));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.renderAll();
    }
  }, []);

  const handleFitScreen = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length === 0) {
      handleResetZoom();
      return;
    }

    // Calculate bounding box of all objects
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    objects.forEach((obj) => {
      const b = obj.getBoundingRect();
      minX = Math.min(minX, b.left);
      minY = Math.min(minY, b.top);
      maxX = Math.max(maxX, b.left + b.width);
      maxY = Math.max(maxY, b.top + b.height);
    });

    const contentW = maxX - minX || 400;
    const contentH = maxY - minY || 300;
    const pad = 80;
    const canvasW = canvas.getWidth();
    const canvasH = canvas.getHeight();

    const scaleX = (canvasW - pad) / contentW;
    const scaleY = (canvasH - pad) / contentH;
    const newZoom = Math.min(2, Math.max(0.3, Math.min(scaleX, scaleY)));

    setZoom(+newZoom.toFixed(2));
    const panX = (canvasW - contentW * newZoom) / 2 - minX * newZoom;
    const panY = (canvasH - contentH * newZoom) / 2 - minY * newZoom;
    canvas.setViewportTransform([newZoom, 0, 0, newZoom, panX, panY]);
    canvas.renderAll();
  }, [handleResetZoom]);

  // Insert image or illustration onto canvas (from Gallery or file upload)
  const handleInsertImage = useCallback(
    async (url: string, name: string) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      try {
        let objectToInsert: FabricObject | null = null;

        // Check if the URL is an SVG (data URI, raw SVG, or .svg file)
        const isSvg =
          url.startsWith('data:image/svg+xml') ||
          url.trim().startsWith('<svg') ||
          url.includes('.svg');

        if (isSvg) {
          // Extract SVG string
          let svgContent = '';
          if (url.startsWith('data:image/svg+xml;base64,')) {
            try {
              svgContent = atob(url.replace('data:image/svg+xml;base64,', ''));
            } catch {
              svgContent = '';
            }
          } else if (url.startsWith('data:image/svg+xml')) {
            const commaIndex = url.indexOf(',');
            if (commaIndex !== -1) {
              try {
                svgContent = decodeURIComponent(url.slice(commaIndex + 1));
              } catch {
                svgContent = url.slice(commaIndex + 1);
              }
            }
          } else if (url.trim().startsWith('<svg')) {
            svgContent = url;
          }

          if (svgContent && svgContent.includes('<svg')) {
            try {
              const { objects, options } = await loadSVGFromString(svgContent);
              const validObjects = (objects || []).filter(
                (o): o is FabricObject => o != null
              );
              if (validObjects.length > 0) {
                const group = util.groupSVGElements(validObjects, options);
                (group as any).subTargetCheck = true;
                (group as any).interactive = true;
                objectToInsert = group;
              }
            } catch (svgErr) {
              console.warn('loadSVGFromString failed, falling back to FabricImage:', svgErr);
            }
          }
        }

        // Fallback or raster image loading (PNG, JPEG, WebP)
        if (!objectToInsert) {
          objectToInsert = await FabricImage.fromURL(url, {
            crossOrigin: 'anonymous'
          });
        }

        if (!objectToInsert) {
          showToast(`Could not load "${name}"`);
          return;
        }

        // Determine natural dimensions
        const rawWidth =
          objectToInsert.getScaledWidth?.() || objectToInsert.width || 200;
        const rawHeight =
          objectToInsert.getScaledHeight?.() || objectToInsert.height || 200;
        const objWidth = rawWidth > 0 && !isNaN(rawWidth) ? rawWidth : 200;
        const objHeight = rawHeight > 0 && !isNaN(rawHeight) ? rawHeight : 200;

        // Scale to a comfortable workspace dimension (max ~280px)
        const maxDim = 280;
        let scale = 1;
        if (objWidth > maxDim || objHeight > maxDim) {
          scale = maxDim / Math.max(objWidth, objHeight);
        }
        if (!scale || isNaN(scale) || scale <= 0) scale = 1;

        objectToInsert.set({
          scaleX: (objectToInsert.scaleX || 1) * scale,
          scaleY: (objectToInsert.scaleY || 1) * scale,
          selectable: true
        });

        canvas.add(objectToInsert);

        // Center directly in the active visible viewport so user immediately sees it
        if (typeof (canvas as any).viewportCenterObject === 'function') {
          (canvas as any).viewportCenterObject(objectToInsert);
        } else {
          canvas.centerObject(objectToInsert);
        }

        objectToInsert.setCoords();
        canvas.setActiveObject(objectToInsert);
        canvas.renderAll();
        setActiveTool('select');
        showToast(`Inserted "${name}"`);
      } catch (err) {
        console.error('Failed to insert illustration/image:', err);
        showToast(`Could not insert "${name}"`);
      }
    },
    [showToast]
  );

  // Insert Sticky Note
  const handleAddStickyNote = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const noteWidth = 200;
    const minNoteHeight = 170;
    const initialNoteColor = settings.stickyColor || '#FAF0D7';

    const initialTextColor =
      settings.color && settings.color.toLowerCase() !== initialNoteColor.toLowerCase()
        ? settings.color
        : '#2B2D2F';

    const stickyNote = new Textbox('Type a thought...', {
      width: noteWidth,
      fontFamily: settings.fontFamily || "'Caveat', cursive",
      fontSize: 22,
      fill: initialTextColor,
      backgroundColor: initialNoteColor,
      stroke: null,
      strokeWidth: 0,
      padding: 18,
      textAlign: settings.textAlign || 'left',
      shadow: new Shadow({
        color: 'rgba(80, 70, 50, 0.16)',
        blur: 12,
        offsetX: 3,
        offsetY: 6
      }),
      editable: true,
      splitByGrapheme: true
    });

    (stickyNote as any).isStickyNote = true;
    (stickyNote as any).cardStroke = '#E2D4B6';
    (stickyNote as any).cardStrokeWidth = 1.5;

    // Enforce minimum card height so note looks like a classic sticky note card
    (stickyNote as any).calcTextHeight = function () {
      const natural = Textbox.prototype.calcTextHeight.call(this);
      return Math.max(minNoteHeight, natural);
    };

    // Custom rounded background renderer for sticky note
    (stickyNote as any)._renderBackground = function (ctx: CanvasRenderingContext2D) {
      if (!this.backgroundColor) return;
      const dim = this._getNonTransformedDimensions();
      const w = dim.x;
      const h = Math.max(minNoteHeight, dim.y);
      const r = 10;
      ctx.save();
      ctx.fillStyle = this.backgroundColor;
      ctx.strokeStyle = (this as any).cardStroke || '#E2D4B6';
      ctx.lineWidth = (this as any).cardStrokeWidth || 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-w / 2, -h / 2, w, h, r);
      } else {
        ctx.rect(-w / 2, -h / 2, w, h);
      }
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      this._removeShadow(ctx);
    };

    // Add visible Delete control button directly on the top-right corner of the note!
    stickyNote.controls.deleteControl = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -12,
      offsetX: 12,
      cursorStyle: 'pointer',
      mouseUpHandler: (_eventData, transformData) => {
        const target = transformData.target;
        const c = target.canvas;
        if (c) {
          c.remove(target);
          c.discardActiveObject();
          c.requestRenderAll();
          setSelectedObject(null);
        }
        return true;
      },
      render: (ctx, left, top) => {
        const size = 22;
        ctx.save();
        ctx.translate(left, top);
        // Button circle
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FDF2F0';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#D99379';
        ctx.stroke();

        // X / Trash icon
        ctx.beginPath();
        const s = 4.5;
        ctx.moveTo(-s, -s);
        ctx.lineTo(s, s);
        ctx.moveTo(s, -s);
        ctx.lineTo(-s, s);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#C24D3E';
        ctx.stroke();
        ctx.restore();
      }
    });

    stickyNote.initDimensions();

    canvas.add(stickyNote);

    // Center in current active viewport
    if (typeof (canvas as any).viewportCenterObject === 'function') {
      (canvas as any).viewportCenterObject(stickyNote);
    } else {
      canvas.centerObject(stickyNote);
    }

    stickyNote.setCoords();
    canvas.setActiveObject(stickyNote);
    canvas.renderAll();
    setActiveTool('select');
    showToast('Added Sticky Note');

    // Automatically enter text editing mode so user can write immediately!
    setTimeout(() => {
      try {
        stickyNote.enterEditing();
        stickyNote.selectAll();
        canvas.requestRenderAll();
      } catch (err) {
        console.warn('Auto enter editing on sticky note:', err);
      }
    }, 60);
  }, [settings.stickyColor, settings.color, settings.fontFamily, settings.textAlign, showToast]);

  // Apply Workspace Templates
  const handleApplyTemplate = useCallback((type: TemplateType) => {
    const canvas = fabricCanvasRef.current;
    setCurrentTemplate(type);

    if (type === 'blank') {
      setBackgroundColor('#FFFFFF');
      setGridType('none');
      setShowGrid(false);
      showToast('Applied Blank White template');
    } else if (type === 'warm') {
      setBackgroundColor('#FFFEFA');
      setGridType('none');
      setShowGrid(false);
      showToast('Applied Warm Botanical Ivory template');
    } else if (type === 'dots') {
      setBackgroundColor('#FAF6EE');
      setGridType('dots');
      setShowGrid(true);
      showToast('Applied Dot Grid template');
    } else if (type === 'grid') {
      setBackgroundColor('#F7F3EB');
      setGridType('grid');
      setShowGrid(true);
      showToast('Applied Graph Paper template');
    } else if (type === 'lined') {
      setBackgroundColor('#FAF7F0');
      setGridType('lined');
      setShowGrid(true);
      showToast('Applied Lined Notebook template');
    } else if (type === 'dark') {
      setBackgroundColor('#1F221E');
      setGridType('dark-grid');
      setShowGrid(true);
      showToast('Applied Dark Slate template');
    } else if (['planner', 'cornell', 'mindmap', 'storyboard', 'kanban'].includes(type)) {
      if (!canvas) return;

      const existingCount = canvas.getObjects().length;
      if (existingCount > 0) {
        const replace = window.confirm(
          'Do you want to clear existing drawings before loading this template?\n\nClick "OK" to start fresh with the template, or "Cancel" to add it alongside your current work.'
        );
        if (replace) {
          canvas.clear();
        }
      }

      // Configure background for structured template
      setBackgroundColor('#FAF6EE');
      setGridType('dots');
      setShowGrid(false);

      if (type === 'planner') {
        createWeeklyPlanner(canvas);
        showToast('Applied Weekly Focus Planner template');
      } else if (type === 'cornell') {
        createCornellNotes(canvas);
        showToast('Applied Cornell Notes template');
      } else if (type === 'mindmap') {
        createMindMap(canvas);
        showToast('Applied Mind Map template');
      } else if (type === 'storyboard') {
        createStoryboard(canvas);
        showToast('Applied Storyboard template');
      } else if (type === 'kanban') {
        createKanbanBoard(canvas);
        showToast('Applied Kanban Board template');
      }

      handleCanvasChangeTrigger(JSON.stringify(canvas.toJSON()));
    }
  }, [showToast, handleCanvasChangeTrigger]);

  // Clear Canvas
  const handleClearCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (confirm('Are you sure you want to clear the entire canvas?')) {
      if (typeof (canvas as any).resetCanvas === 'function') {
        (canvas as any).resetCanvas();
      } else {
        canvas.clear();
        canvas.backgroundColor = backgroundColor;
        canvas.renderAll();
      }
      showToast('Canvas cleared');
    }
  }, [backgroundColor, showToast]);

  // New Project
  const handleNewProject = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const hasStrokes = canvas.getObjects().length > 0;
    if (hasStrokes && saveStatus === 'unsaved') {
      const confirmed = window.confirm(
        'You have unsaved changes. Start a fresh new project?'
      );
      if (!confirmed) return;
    }

    if (typeof (canvas as any).resetCanvas === 'function') {
      (canvas as any).resetCanvas();
    } else {
      canvas.clear();
      canvas.backgroundColor = '#FFFEFA';
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.renderAll();
    }

    setProjectId('proj_' + Date.now());
    setProjectName('Untitled Masterpiece');
    setBackgroundColor('#FFFEFA');
    setZoom(1);
    setSelectedObject(null);
    setActiveTool('select');
    setSaveStatus('saved');
    showToast('Created new project');
  }, [saveStatus, showToast]);

  const handleNewProjectNewTab = useCallback(() => {
    window.open(window.location.origin, '_blank');
  }, []);

  // Open Project from gallery
  const handleSelectProject = useCallback((project: CanvasProject) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      canvas.loadFromJSON(JSON.parse(project.canvasData)).then(() => {
        setProjectId(project.id);
        setProjectName(project.name);
        setBackgroundColor(project.backgroundColor || '#FFFEFA');
        setZoom(project.zoom || 1);
        canvas.backgroundColor = project.backgroundColor || '#FFFEFA';
        canvas.renderAll();
        setSaveStatus('saved');
        showToast(`Opened "${project.name}"`);
      });
    } catch (err) {
      console.error('Error loading project JSON:', err);
      showToast('Failed to open project.');
    }
  }, [showToast]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (e.shiftKey) {
          handleNewProjectNewTab();
        } else {
          handleNewProject();
        }
      } else if (cmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveProject();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportOpen(true);
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateSelected();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'c') {
        handleCopy();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'x') {
        handleCut();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'v') {
        handlePaste();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleSelectAll();
      } else if (cmdOrCtrl && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handleZoomIn();
      } else if (cmdOrCtrl && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (cmdOrCtrl && e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      } else if (cmdOrCtrl && e.key === '1') {
        e.preventDefault();
        handleFitScreen();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      } else if (!cmdOrCtrl && !e.altKey) {
        // Tool shortcut keys
        switch (e.key.toLowerCase()) {
          case 'v': setActiveTool('select'); break;
          case 'p': setActiveTool('pen'); break;
          case 'b': setActiveTool('pencil'); break;
          case 'm': setActiveTool('marker'); break;
          case 'e': setActiveTool('eraser'); break;
          case 't': setActiveTool('text'); break;
          case 's': setActiveTool('shape'); break;
          case 'i': setIsGalleryOpen(true); break;
          case 'l': setActiveTool('line'); break;
          case '?': setIsShortcutsOpen(true); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleUndo,
    handleRedo,
    handleSaveProject,
    handleDuplicateSelected,
    handleCopy,
    handleCut,
    handlePaste,
    handleSelectAll,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleFitScreen,
    handleDeleteSelected,
    handleNewProject,
    handleNewProjectNewTab
  ]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 1. TOP HEADER matching Reference Image 1 */}
      <EditorHeader
        projectName={projectName}
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSaveProject}
        onNewProject={handleNewProject}
        onNewProjectNewTab={handleNewProjectNewTab}
        onOpenProject={() => setIsProjectsOpen(true)}
        onSaveAs={() => {
          const next = prompt('Save project as:', `${projectName} (Copy)`);
          if (next) {
            setProjectId('proj_' + Date.now());
            setProjectName(next);
            handleSaveProject();
          }
        }}
        onRename={() => {
          const next = prompt('Rename project:', projectName);
          if (next) {
            setProjectName(next);
            handleSaveProject();
          }
        }}
        onImportImage={() => setIsGalleryOpen(true)}
        onExport={() => setIsExportOpen(true)}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onDuplicate={handleDuplicateSelected}
        onDelete={handleDeleteSelected}
        onSelectAll={handleSelectAll}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitScreen={handleFitScreen}
        onResetZoom={handleResetZoom}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showProperties={showProperties}
        onToggleProperties={() => setShowProperties(!showProperties)}
        showToolbar={showToolbar}
        onToggleToolbar={() => setShowToolbar(!showToolbar)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
      />

      {/* 2. LEFT TOOLBAR matching Reference Image 1 */}
      {showToolbar && (
        <LeftToolbar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          onOpenMoreTools={() => setIsMoreToolsOpen(!isMoreToolsOpen)}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />
      )}

      {/* 3. MORE TOOLS POPUP */}
      <MoreToolsMenu
        isOpen={isMoreToolsOpen}
        onClose={() => setIsMoreToolsOpen(false)}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onAddStickyNote={handleAddStickyNote}
        onSelectArrowTool={() => setActiveTool('arrow')}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onClearCanvas={handleClearCanvas}
        onApplyTemplate={handleApplyTemplate}
        currentTemplate={currentTemplate}
      />

      {/* 4. CENTRAL CANVAS WORKSPACE matching Reference Image 1 */}
      <CanvasWorkspace
        activeTool={activeTool}
        settings={settings}
        backgroundColor={backgroundColor}
        showGrid={showGrid}
        gridType={gridType}
        zoom={zoom}
        onZoomChange={setZoom}
        onSelectionChange={setSelectedObject}
        onHistoryChange={(u, r) => {
          setCanUndo(u);
          setCanRedo(r);
        }}
        onSaveTrigger={handleCanvasChangeTrigger}
        canvasRefCallback={(c) => {
          fabricCanvasRef.current = c;
          setFabricCanvas(c);
        }}
        onToolChange={setActiveTool}
      />

      {/* 5. RIGHT PROPERTIES PANEL matching Reference Image 1 */}
      {showProperties && (
        <PropertiesPanel
          activeTool={activeTool}
          settings={settings}
          selectedObject={selectedObject}
          onUpdateSettings={handleUpdateSettings}
          onUpdateSelectedObject={handleUpdateSelectedObject}
          onDuplicateSelected={handleDuplicateSelected}
          onDeleteSelected={handleDeleteSelected}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onToggleLock={handleToggleLock}
        />
      )}

      {/* 6. BOTTOM FLOATING BAR matching Reference Image 1 */}
      <BottomFloatingBar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitScreen={handleFitScreen}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        backgroundColor={backgroundColor}
        onChangeBackgroundColor={setBackgroundColor}
      />

      {/* MODALS */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onInsertImage={handleInsertImage}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projectName={projectName}
        fabricCanvas={fabricCanvas}
        onToast={showToast}
      />

      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        currentProjectId={projectId}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onToast={showToast}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onApplyTemplate={handleApplyTemplate}
        currentTemplate={currentTemplate}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* TOAST NOTIFICATION */}
      <Toast message={toastMessage} />
    </div>
  );
}
export default App;
