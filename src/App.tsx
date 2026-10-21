import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Canvas as FabricCanvas,
  FabricImage,
  Rect,
  IText,
  Group,
  FabricObject
} from 'fabric';
import type {
  ToolType,
  ToolSettings,
  SelectedObjectProperties,
  LayerItem
} from './types/canvas';
import type { CanvasProject } from './types/project';
import { saveProject } from './services/db';

import { EditorHeader } from './components/Header/EditorHeader';
import { LeftToolbar } from './components/Toolbar/LeftToolbar';
import { MoreToolsMenu } from './components/Toolbar/MoreToolsMenu';
import { PropertiesPanel } from './components/Properties/PropertiesPanel';
import { BottomFloatingBar } from './components/BottomBar/BottomFloatingBar';
import { CanvasWorkspace } from './components/Canvas/CanvasWorkspace';

import { GalleryModal } from './components/Modals/GalleryModal';
import { ExportModal } from './components/Modals/ExportModal';
import { ProjectsModal } from './components/Modals/ProjectsModal';
import { LayersModal } from './components/Modals/LayersModal';
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
  const [showProperties, setShowProperties] = useState<boolean>(true);
  const [showToolbar, setShowToolbar] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);

  // Undo / Redo
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Layers list
  const [layers, setLayers] = useState<LayerItem[]>([]);

  // Modals state
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
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

    if (props.fill !== undefined) {
      activeObj.set('fill', props.fill);
      if (activeObj.type === 'group') {
        const groupObjects = (activeObj as Group).getObjects();
        if (groupObjects[0]) {
          groupObjects[0].set('fill', props.fill);
        }
      }
    }
    if (props.stroke !== undefined) {
      activeObj.set('stroke', props.stroke);
      if (activeObj.type === 'group') {
        const groupObjects = (activeObj as Group).getObjects();
        if (groupObjects[0]) {
          groupObjects[0].set('stroke', props.stroke);
        }
      }
    }
    if (props.strokeWidth !== undefined) {
      activeObj.set('strokeWidth', props.strokeWidth);
      if (activeObj.type === 'group') {
        const groupObjects = (activeObj as Group).getObjects();
        if (groupObjects[0]) {
          groupObjects[0].set('strokeWidth', props.strokeWidth);
        }
      }
    }
    if (props.opacity !== undefined) activeObj.set('opacity', props.opacity);

    // Target text object directly or inside a group (e.g. sticky note)
    const textTarget =
      activeObj.type === 'i-text' || activeObj.type === 'text'
        ? (activeObj as IText)
        : activeObj.type === 'group'
        ? ((activeObj as Group).getObjects().find((obj) => obj.type === 'i-text' || obj.type === 'text') as IText | undefined)
        : null;

    if (textTarget) {
      if (props.fontFamily !== undefined) {
        textTarget.set('fontFamily', props.fontFamily);
        if ((textTarget as any).isEditing) {
          (textTarget as any).setSelectionStyles?.({ fontFamily: props.fontFamily });
        }
        if (typeof document !== 'undefined' && document.fonts?.load) {
          document.fonts.load(`16px "${props.fontFamily}"`).then(() => {
            textTarget.initDimensions?.();
            textTarget.set('dirty', true);
            canvas.requestRenderAll();
          }).catch(() => {});
        }
      }
      if (props.fontWeight !== undefined) {
        textTarget.set('fontWeight', props.fontWeight);
        if ((textTarget as any).isEditing) {
          (textTarget as any).setSelectionStyles?.({ fontWeight: props.fontWeight });
        }
      }
      if (props.fontStyle !== undefined) {
        textTarget.set('fontStyle', props.fontStyle);
        if ((textTarget as any).isEditing) {
          (textTarget as any).setSelectionStyles?.({ fontStyle: props.fontStyle });
        }
        if ((textTarget as any).styles) {
          const styles = (textTarget as any).styles;
          Object.keys(styles).forEach((lineKey) => {
            const line = styles[lineKey];
            if (line) {
              Object.keys(line).forEach((charKey) => {
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
        if ((textTarget as any).isEditing) {
          (textTarget as any).setSelectionStyles?.({ underline: props.underline });
        }
        if ((textTarget as any).styles) {
          const styles = (textTarget as any).styles;
          Object.keys(styles).forEach((lineKey) => {
            const line = styles[lineKey];
            if (line) {
              Object.keys(line).forEach((charKey) => {
                if (line[charKey]) {
                  line[charKey].underline = props.underline;
                }
              });
            }
          });
        }
      }
      if (props.textAlign !== undefined) {
        textTarget.set('textAlign', props.textAlign);
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

  // Insert image onto canvas (from Gallery or file upload)
  const handleInsertImage = useCallback(
    (url: string, name: string) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      FabricImage.fromURL(url).then((img) => {
        // Scale to reasonable initial size
        const maxDim = 320;
        let scale = 1;
        if ((img.width || 0) > maxDim || (img.height || 0) > maxDim) {
          scale = maxDim / Math.max(img.width || 1, img.height || 1);
        }

        const center = canvas.getCenterPoint();
        img.set({
          left: center.x - ((img.width || 0) * scale) / 2,
          top: center.y - ((img.height || 0) * scale) / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: true
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        setActiveTool('select');
        showToast(`Inserted "${name}"`);
      });
    },
    [showToast]
  );

  // Insert Sticky Note
  const handleAddStickyNote = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const center = canvas.getCenterPoint();
    const noteWidth = 180;
    const noteHeight = 160;

    const bgRect = new Rect({
      width: noteWidth,
      height: noteHeight,
      fill: '#FAF0D7', // warm pastel yellow
      stroke: '#E2D4B6',
      strokeWidth: 1.5,
      rx: 8,
      ry: 8,
      shadow: {
        color: 'rgba(80, 70, 50, 0.15)',
        blur: 10,
        offsetX: 2,
        offsetY: 4
      } as any
    });

    const noteText = new IText('Fresh thought...', {
      left: 16,
      top: 18,
      fontFamily: "'Caveat', cursive",
      fontSize: 22,
      fill: '#30312D',
      width: noteWidth - 32
    });

    const stickyGroup = new Group([bgRect, noteText], {
      left: center.x - noteWidth / 2,
      top: center.y - noteHeight / 2,
      selectable: true
    });

    canvas.add(stickyGroup);
    canvas.setActiveObject(stickyGroup);
    canvas.renderAll();
    setActiveTool('select');
    showToast('Added Sticky Note');
  }, [showToast]);

  // Apply Workspace Templates
  const handleApplyTemplate = useCallback((type: 'blank' | 'dots' | 'grid' | 'warm') => {
    if (type === 'blank') {
      setBackgroundColor('#FFFFFF');
      setShowGrid(false);
    } else if (type === 'warm') {
      setBackgroundColor('#FFFEFA');
      setShowGrid(false);
    } else if (type === 'dots') {
      setBackgroundColor('#FAF6EE');
      setShowGrid(true);
    } else if (type === 'grid') {
      setBackgroundColor('#F7F3EB');
      setShowGrid(true);
    }
  }, []);

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
        onOpenLayers={() => setIsLayersOpen(true)}
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
        onOpenLayers={() => setIsLayersOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onClearCanvas={handleClearCanvas}
        onApplyTemplate={handleApplyTemplate}
      />

      {/* 4. CENTRAL CANVAS WORKSPACE matching Reference Image 1 */}
      <CanvasWorkspace
        activeTool={activeTool}
        settings={settings}
        backgroundColor={backgroundColor}
        showGrid={showGrid}
        zoom={zoom}
        onZoomChange={setZoom}
        onSelectionChange={setSelectedObject}
        onHistoryChange={(u, r) => {
          setCanUndo(u);
          setCanRedo(r);
        }}
        onSaveTrigger={handleCanvasChangeTrigger}
        onLayersUpdate={setLayers}
        canvasRefCallback={(c) => {
          fabricCanvasRef.current = c;
          setFabricCanvas(c);
        }}
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

      <LayersModal
        isOpen={isLayersOpen}
        onClose={() => setIsLayersOpen(false)}
        layers={layers}
        fabricCanvas={fabricCanvas}
        onRefreshLayers={() => {
          // forces layer re-eval
          if (fabricCanvas) fabricCanvas.renderAll();
        }}
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
