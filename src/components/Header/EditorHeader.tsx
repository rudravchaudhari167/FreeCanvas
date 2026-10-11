import React from 'react';
import {
  Undo2,
  Redo2,
  Save,
  Check,
  User,
  Plus,
  FolderOpen,
  Edit2,
  Image as ImageIcon,
  Download,
  Copy,
  Trash2,
  Scissors,
  ClipboardPaste,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Sliders,
  Layers,
  HelpCircle
} from 'lucide-react';
import { DropdownMenu } from './DropdownMenu';
import type { MenuItem } from './DropdownMenu';

interface EditorHeaderProps {
  projectName: string;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveAs: () => void;
  onRename: () => void;
  onImportImage: () => void;
  onExport: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  onResetZoom: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showProperties: boolean;
  onToggleProperties: () => void;
  showToolbar: boolean;
  onToggleToolbar: () => void;
  onOpenShortcuts: () => void;
  onOpenLayers: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  projectName,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onNewProject,
  onOpenProject,
  onSaveAs,
  onRename,
  onImportImage,
  onExport,
  onCut,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onSelectAll,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onResetZoom,
  showGrid,
  onToggleGrid,
  showProperties,
  onToggleProperties,
  onOpenShortcuts,
  onOpenLayers
}) => {
  const fileMenuItems: MenuItem[] = [
    { label: 'New Project', icon: <Plus size={15} />, shortcut: '⌘N', onClick: onNewProject },
    { label: 'Open / My Projects', icon: <FolderOpen size={15} />, shortcut: '⌘O', onClick: onOpenProject },
    { divider: true, label: 'div1', onClick: () => {} },
    { label: 'Save', icon: <Save size={15} />, shortcut: '⌘S', onClick: onSave },
    { label: 'Save As...', onClick: onSaveAs },
    { label: 'Rename Project', icon: <Edit2 size={15} />, onClick: onRename },
    { divider: true, label: 'div2', onClick: () => {} },
    { label: 'Import Image...', icon: <ImageIcon size={15} />, onClick: onImportImage },
    { label: 'Export Artwork...', icon: <Download size={15} />, shortcut: '⌘E', onClick: onExport }
  ];

  const editMenuItems: MenuItem[] = [
    { label: 'Undo', icon: <Undo2 size={15} />, shortcut: '⌘Z', disabled: !canUndo, onClick: onUndo },
    { label: 'Redo', icon: <Redo2 size={15} />, shortcut: '⌘⇧Z', disabled: !canRedo, onClick: onRedo },
    { divider: true, label: 'div1', onClick: () => {} },
    { label: 'Cut', icon: <Scissors size={15} />, shortcut: '⌘X', onClick: onCut },
    { label: 'Copy', icon: <Copy size={15} />, shortcut: '⌘C', onClick: onCopy },
    { label: 'Paste', icon: <ClipboardPaste size={15} />, shortcut: '⌘V', onClick: onPaste },
    { label: 'Duplicate', shortcut: '⌘D', onClick: onDuplicate },
    { divider: true, label: 'div2', onClick: () => {} },
    { label: 'Select All', shortcut: '⌘A', onClick: onSelectAll },
    { label: 'Delete', icon: <Trash2 size={15} />, shortcut: 'Del', danger: true, onClick: onDelete }
  ];

  const viewMenuItems: MenuItem[] = [
    { label: 'Zoom In', icon: <ZoomIn size={15} />, shortcut: '⌘+', onClick: onZoomIn },
    { label: 'Zoom Out', icon: <ZoomOut size={15} />, shortcut: '⌘-', onClick: onZoomOut },
    { label: 'Reset Zoom (100%)', shortcut: '⌘0', onClick: onResetZoom },
    { label: 'Fit to Screen', icon: <Maximize2 size={15} />, shortcut: '⌘1', onClick: onFitScreen },
    { divider: true, label: 'div1', onClick: () => {} },
    { label: showGrid ? 'Hide Grid' : 'Show Grid', icon: <Grid size={15} />, onClick: onToggleGrid },
    { label: showProperties ? 'Hide Properties' : 'Show Properties', icon: <Sliders size={15} />, onClick: onToggleProperties },
    { label: 'Layers Panel', icon: <Layers size={15} />, onClick: onOpenLayers },
    { divider: true, label: 'div2', onClick: () => {} },
    { label: 'Keyboard Shortcuts', icon: <HelpCircle size={15} />, shortcut: '?', onClick: onOpenShortcuts }
  ];

  return (
    <header
      style={{
        height: 72,
        width: '100%',
        backgroundColor: 'rgba(248, 243, 236, 0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E8DED2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'relative',
        zIndex: 50
      }}
    >
      {/* Left: Botanical Logo & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button
          onClick={onOpenProject}
          title="Return to Projects"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: 8,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {/* Overlapping botanical leaf logo matching Reference Image 1 */}
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Primary sage green leaf */}
            <path
              d="M7 27 C9 15 18 7 30 5 C30 18 21 27 7 27 Z"
              fill="#777D5E"
            />
            <path
              d="M7 27 C13 21 21 14 30 5"
              stroke="#D8DAC7"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Secondary warm terracotta/olive leaf overlay */}
            <path
              d="M10 27 C7 19 12 12 21 9 C20 19 17 25 10 27 Z"
              fill="#A28469"
              opacity="0.85"
            />
            <path
              d="M10 27 C13 23 17 17 21 9"
              stroke="#EED4C5"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>

          {/* Wordmark in stylized font */}
          <span
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '25px',
              fontWeight: 600,
              color: '#30312D',
              letterSpacing: '-0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>FreeCanvas</span>
            <span
              style={{
                fontSize: 13,
                fontFamily: 'var(--font-sans)',
                fontStyle: 'normal',
                fontWeight: 500,
                color: '#79766F',
                backgroundColor: '#FAF5EE',
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid #E8DFD3'
              }}
              title={projectName}
            >
              {projectName.length > 20 ? projectName.slice(0, 18) + '...' : projectName}
            </span>
          </span>
        </button>

        {/* Center-left: Dropdown menus */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <DropdownMenu label="File" items={fileMenuItems} />
          <DropdownMenu label="Edit" items={editMenuItems} />
          <DropdownMenu label="View" items={viewMenuItems} />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Undo Button */}
        <div className="tooltip-wrap">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: canUndo ? '#30312D' : '#B8B3AA',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              backgroundColor: 'transparent',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (canUndo) e.currentTarget.style.backgroundColor = '#EFE9DE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Undo2 size={19} />
          </button>
          <span className="tooltip-content top">Undo (⌘Z)</span>
        </div>

        {/* Redo Button */}
        <div className="tooltip-wrap">
          <button
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: canRedo ? '#30312D' : '#B8B3AA',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              backgroundColor: 'transparent',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (canRedo) e.currentTarget.style.backgroundColor = '#EFE9DE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Redo2 size={19} />
          </button>
          <span className="tooltip-content top">Redo (⌘⇧Z)</span>
        </div>

        {/* Vertical divider matching Reference Image 1 */}
        <div
          style={{
            width: 1,
            height: 24,
            backgroundColor: '#E0D4C5',
            margin: '0 4px'
          }}
        />

        {/* Save Status pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#79766F',
            marginRight: 2
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor:
                saveStatus === 'saved'
                  ? '#777D5E'
                  : saveStatus === 'unsaved'
                  ? '#D99379'
                  : saveStatus === 'saving'
                  ? '#85A2BA'
                  : '#C24D3E',
              transition: 'background-color 0.3s ease'
            }}
          />
          <span style={{ fontWeight: 500 }}>
            {saveStatus === 'saved'
              ? 'Saved'
              : saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'unsaved'
              ? 'Unsaved'
              : 'Save error'}
          </span>
        </div>

        {/* Sage-Green Save Button matching Reference Image 1 */}
        <button
          onClick={onSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            backgroundColor: '#5C6347',
            color: '#FFFEFA',
            padding: '9px 18px',
            borderRadius: 14,
            fontSize: 13.5,
            fontWeight: 550,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(92, 99, 71, 0.25)',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4F553D';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#5C6347';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {saveStatus === 'saved' ? <Check size={16} /> : <Save size={16} />}
          <span>Save</span>
        </button>

        {/* Circular Account/Settings Icon matching Reference Image 1 */}
        <button
          onClick={onOpenProject}
          title="Account / My Workspace"
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: '#EBE4D8',
            border: '1px solid #DFD6C8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4A4843',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E2D9CC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#EBE4D8';
          }}
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
};
