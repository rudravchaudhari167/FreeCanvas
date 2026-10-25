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
  HelpCircle,
  ExternalLink,
  LayoutTemplate,
  Menu,
  X
} from 'lucide-react';
import { DropdownMenu } from './DropdownMenu';
import type { MenuItem } from './DropdownMenu';
import { useIsMobile } from '../../hooks/useIsMobile';

interface EditorHeaderProps {
  projectName: string;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onNewProject: () => void;
  onNewProjectNewTab: () => void;
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
  onOpenTemplates?: () => void;
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
  onNewProjectNewTab,
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
  onOpenTemplates
}) => {
  const isMobile = useIsMobile(768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const fileMenuItems: MenuItem[] = [
    { label: 'New Project', icon: <Plus size={15} />, shortcut: '⌘N', onClick: onNewProject },
    { label: 'New Project (New Tab)', icon: <ExternalLink size={15} />, shortcut: '⌘⇧N', onClick: onNewProjectNewTab },
    { label: 'Open / My Projects', icon: <FolderOpen size={15} />, shortcut: '⌘O', onClick: onOpenProject },
    ...(onOpenTemplates ? [{ label: 'Canvas Templates...', icon: <LayoutTemplate size={15} />, onClick: onOpenTemplates }] : []),
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
    { divider: true, label: 'div2', onClick: () => {} },
    { label: 'Keyboard Shortcuts', icon: <HelpCircle size={15} />, shortcut: '?', onClick: onOpenShortcuts }
  ];

  return (
    <>
      <header
        style={{
          height: isMobile ? 56 : 72,
          width: '100%',
          backgroundColor: 'rgba(248, 243, 236, 0.94)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E8DED2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 12px' : '0 28px',
          position: 'relative',
          zIndex: 50
        }}
      >
        {isMobile ? (
          /* Mobile Header Content */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {/* Left: Brand */}
            <button
              onClick={onOpenProject}
              title="Return to Projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: '2px 4px'
              }}
            >
              <svg width="26" height="26" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 27 C9 15 18 7 30 5 C30 18 21 27 7 27 Z" fill="#777D5E" />
                <path d="M7 27 C13 21 21 14 30 5" stroke="#D8DAC7" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 27 C7 19 12 12 21 9 C20 19 17 25 10 27 Z" fill="#A28469" opacity="0.85" />
              </svg>
              <span
                style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#30312D'
                }}
              >
                FreeCanvas
              </span>
            </button>

            {/* Right: Quick Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Undo */}
              <button
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: canUndo ? '#30312D' : '#C4BFB6',
                  cursor: canUndo ? 'pointer' : 'not-allowed',
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                <Undo2 size={18} />
              </button>

              {/* Redo */}
              <button
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: canRedo ? '#30312D' : '#C4BFB6',
                  cursor: canRedo ? 'pointer' : 'not-allowed',
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                <Redo2 size={18} />
              </button>

              {/* Properties Sheet Toggle */}
              <button
                onClick={onToggleProperties}
                aria-label={showProperties ? 'Hide Properties' : 'Show Properties'}
                title={showProperties ? 'Hide Properties' : 'Show Properties'}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: showProperties ? '#E5EAD9' : 'transparent',
                  color: showProperties ? '#4B5237' : '#4E504A',
                  cursor: 'pointer',
                  border: '1px solid ' + (showProperties ? '#BAC4A7' : '#E8DED2'),
                  transition: 'all 0.15s ease'
                }}
              >
                <Sliders size={17} />
              </button>

              {/* Quick Save */}
              <button
                onClick={onSave}
                aria-label="Save"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: '#5C6347',
                  color: '#FFFEFA',
                  padding: '6px 10px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {saveStatus === 'saved' ? <Check size={14} /> : <Save size={14} />}
                <span>Save</span>
              </button>

              {/* Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isMobileMenuOpen ? '#EFE9DE' : 'transparent',
                  color: '#30312D',
                  cursor: 'pointer',
                  border: '1px solid #E8DED2',
                  marginLeft: 2
                }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        ) : (
          /* Desktop Header Content */
          <>
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
                  transition: 'opacity 0.2s',
                  background: 'transparent',
                  border: 'none'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 27 C9 15 18 7 30 5 C30 18 21 27 7 27 Z" fill="#777D5E" />
                  <path d="M7 27 C13 21 21 14 30 5" stroke="#D8DAC7" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 27 C7 19 12 12 21 9 C20 19 17 25 10 27 Z" fill="#A28469" opacity="0.85" />
                  <path d="M10 27 C13 23 17 17 21 9" stroke="#EED4C5" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
                </svg>

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
                    border: 'none',
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
                    border: 'none',
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

              {/* Sage-Green Save Button */}
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
                  border: 'none',
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

              {/* Circular Account/Settings Icon */}
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
          </>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFEFA',
              borderBottom: '1px solid #E8DED2',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '16px 16px 24px 16px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Project Title & Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: '#F7F3EB',
                borderRadius: 12,
                border: '1px solid #E8DFD3'
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#8A857A', textTransform: 'uppercase' }}>Current Project</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#30312D' }}>{projectName}</div>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onRename();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDD3C5',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#4E504A',
                  cursor: 'pointer'
                }}
              >
                <Edit2 size={13} />
                <span>Rename</span>
              </button>
            </div>

            {/* Section: Project Actions */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#8A857A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                Project & File
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <MobileMenuItem icon={<Plus size={16} />} label="New Project" onClick={() => { setIsMobileMenuOpen(false); onNewProject(); }} />
                <MobileMenuItem icon={<FolderOpen size={16} />} label="My Projects" onClick={() => { setIsMobileMenuOpen(false); onOpenProject(); }} />
                {onOpenTemplates && (
                  <MobileMenuItem icon={<LayoutTemplate size={16} />} label="Templates" onClick={() => { setIsMobileMenuOpen(false); onOpenTemplates(); }} />
                )}
                <MobileMenuItem icon={<ImageIcon size={16} />} label="Import Image" onClick={() => { setIsMobileMenuOpen(false); onImportImage(); }} />
                <MobileMenuItem icon={<Download size={16} />} label="Export Artwork" onClick={() => { setIsMobileMenuOpen(false); onExport(); }} />
                <MobileMenuItem icon={<Save size={16} />} label="Save As..." onClick={() => { setIsMobileMenuOpen(false); onSaveAs(); }} />
              </div>
            </div>

            {/* Section: Edit Actions */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#8A857A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                Edit & Organize
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <MobileMenuItem icon={<Copy size={16} />} label="Copy" onClick={() => { setIsMobileMenuOpen(false); onCopy(); }} />
                <MobileMenuItem icon={<ClipboardPaste size={16} />} label="Paste" onClick={() => { setIsMobileMenuOpen(false); onPaste(); }} />
                <MobileMenuItem icon={<Scissors size={16} />} label="Cut" onClick={() => { setIsMobileMenuOpen(false); onCut(); }} />
                <MobileMenuItem icon={<Copy size={16} />} label="Duplicate" onClick={() => { setIsMobileMenuOpen(false); onDuplicate(); }} />
                <MobileMenuItem icon={<Trash2 size={16} />} label="Delete Selected" danger onClick={() => { setIsMobileMenuOpen(false); onDelete(); }} />
                <MobileMenuItem icon={<Check size={16} />} label="Select All" onClick={() => { setIsMobileMenuOpen(false); onSelectAll(); }} />
              </div>
            </div>

            {/* Section: View & Tools */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#8A857A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                View & Display
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <MobileMenuItem icon={<Grid size={16} />} label={showGrid ? 'Hide Grid' : 'Show Grid'} onClick={() => { setIsMobileMenuOpen(false); onToggleGrid(); }} />
                <MobileMenuItem icon={<Sliders size={16} />} label={showProperties ? 'Hide Properties' : 'Properties Panel'} onClick={() => { setIsMobileMenuOpen(false); onToggleProperties(); }} />
                <MobileMenuItem icon={<Maximize2 size={16} />} label="Fit to Screen" onClick={() => { setIsMobileMenuOpen(false); onFitScreen(); }} />
                <MobileMenuItem icon={<ZoomIn size={16} />} label="Zoom In" onClick={() => { setIsMobileMenuOpen(false); onZoomIn(); }} />
                <MobileMenuItem icon={<ZoomOut size={16} />} label="Zoom Out" onClick={() => { setIsMobileMenuOpen(false); onZoomOut(); }} />
                <MobileMenuItem icon={<HelpCircle size={16} />} label="Shortcuts" onClick={() => { setIsMobileMenuOpen(false); onOpenShortcuts(); }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface MobileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ icon, label, onClick, danger }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EBE2D5',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        color: danger ? '#C24D3E' : '#3C3D37',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.15s ease'
      }}
    >
      <span style={{ color: danger ? '#C24D3E' : '#777D5E', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  );
};
