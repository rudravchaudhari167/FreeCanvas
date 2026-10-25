import React, { useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  StickyNote,
  ArrowUpRight,
  LayoutTemplate,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import type { TemplateType } from '../../types/canvas';
import { useIsMobile } from '../../hooks/useIsMobile';

interface MoreToolsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGallery: () => void;
  onAddStickyNote: () => void;
  onSelectArrowTool: () => void;
  onOpenTemplates: () => void;
  onOpenShortcuts: () => void;
  onClearCanvas: () => void;
  onApplyTemplate: (type: TemplateType) => void;
  currentTemplate?: TemplateType;
}

export const MoreToolsMenu: React.FC<MoreToolsMenuProps> = ({
  isOpen,
  onClose,
  onOpenGallery,
  onAddStickyNote,
  onSelectArrowTool,
  onOpenTemplates,
  onOpenShortcuts,
  onClearCanvas,
  onApplyTemplate,
  currentTemplate = 'warm'
}) => {
  const isMobile = useIsMobile(768);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: isMobile ? 'fixed' : 'absolute',
        top: isMobile ? 'auto' : 360,
        bottom: isMobile ? 74 : 'auto',
        left: isMobile ? '50%' : 84,
        transform: isMobile ? 'translateX(-50%)' : 'none',
        zIndex: 55,
        width: isMobile ? 260 : 240,
        maxWidth: 'calc(100vw - 32px)',
        backgroundColor: '#FFFEFA',
        border: '1px solid #E8DED2',
        borderRadius: 16,
        padding: '8px 0',
        boxShadow: '0 12px 32px -4px rgba(70, 60, 45, 0.12), 0 4px 12px rgba(70, 60, 45, 0.05)',
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      <div
        style={{
          padding: '4px 14px 8px',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          color: '#8A857A'
        }}
      >
        Creative Extras
      </div>

      <button
        onClick={() => {
          onOpenGallery();
          onClose();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        style={menuItemStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ImageIcon size={16} color="#777D5E" />
        <span>Botanical Gallery</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddStickyNote();
          onClose();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        style={menuItemStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <StickyNote size={16} color="#D99379" />
        <span>Add Sticky Note</span>
      </button>

      <button
        onClick={() => {
          onSelectArrowTool();
          onClose();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        style={menuItemStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ArrowUpRight size={16} color="#5E6547" />
        <span>Arrow Connector</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenTemplates();
          onClose();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        style={menuItemStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <LayoutTemplate size={16} color="#777D5E" />
        <span>Browse All Templates...</span>
      </button>

      <div style={{ height: 1, backgroundColor: '#EFE8DE', margin: '6px 0' }} />

      <div
        style={{
          padding: '4px 14px 4px',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          color: '#8A857A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>Quick Paper Styles</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, padding: '4px 12px 6px' }}>
        {[
          { id: 'blank' as TemplateType, label: 'Blank' },
          { id: 'warm' as TemplateType, label: 'Warm' },
          { id: 'dots' as TemplateType, label: 'Dot Grid' },
          { id: 'grid' as TemplateType, label: 'Graph' },
          { id: 'lined' as TemplateType, label: 'Lined' },
          { id: 'dark' as TemplateType, label: 'Dark' }
        ].map((item) => {
          const isActive = currentTemplate === item.id;
          return (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                onApplyTemplate(item.id);
                onClose();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                ...templateBtnStyle,
                backgroundColor: isActive ? '#EAEEDD' : '#F8F4ED',
                borderColor: isActive ? '#777D5E' : '#E8DFD3',
                color: isActive ? '#2F3622' : '#4F4D47',
                fontWeight: isActive ? 600 : 500
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ height: 1, backgroundColor: '#EFE8DE', margin: '4px 0' }} />

      <button
        onClick={() => {
          onOpenShortcuts();
          onClose();
        }}
        style={menuItemStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <HelpCircle size={16} color="#79766F" />
        <span>Keyboard Shortcuts</span>
      </button>

      <button
        onClick={() => {
          onClearCanvas();
          onClose();
        }}
        style={{ ...menuItemStyle, color: '#C24D3E' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FDF2F0')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <RotateCcw size={16} color="#C24D3E" />
        <span>Clear Canvas...</span>
      </button>
    </div>
  );
};

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 14px',
  fontSize: 13,
  fontWeight: 450,
  color: '#30312D',
  backgroundColor: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.1s ease'
};

const templateBtnStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: 6,
  backgroundColor: '#F8F4ED',
  border: '1px solid #E8DFD3',
  fontSize: 11,
  fontWeight: 500,
  color: '#4F4D47',
  textAlign: 'center',
  cursor: 'pointer'
};

const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.backgroundColor = '#F7F2EA';
};

const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.backgroundColor = 'transparent';
};
