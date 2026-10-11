import React from 'react';
import {
  MousePointer2,
  PenTool,
  Pencil,
  Highlighter,
  Eraser,
  Type,
  Shapes,
  Image as ImageIcon,
  Slash,
  MoreHorizontal
} from 'lucide-react';
import type { ToolType } from '../../types/canvas';

interface LeftToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onOpenMoreTools: () => void;
  onOpenGallery: () => void;
}

interface ToolDefinition {
  id: ToolType;
  name: string;
  shortcut: string;
  icon: React.ReactNode;
}

export const LeftToolbar: React.FC<LeftToolbarProps> = ({
  activeTool,
  onSelectTool,
  onOpenMoreTools,
  onOpenGallery
}) => {
  const tools: ToolDefinition[] = [
    { id: 'select', name: 'Select / Move', shortcut: 'V', icon: <MousePointer2 size={19} /> },
    { id: 'pen', name: 'Smooth Pen', shortcut: 'P', icon: <PenTool size={19} /> },
    { id: 'pencil', name: 'Sketch Pencil', shortcut: 'B', icon: <Pencil size={19} /> },
    { id: 'marker', name: 'Marker / Highlighter', shortcut: 'M', icon: <Highlighter size={19} /> },
    { id: 'eraser', name: 'Eraser', shortcut: 'E', icon: <Eraser size={19} /> },
    { id: 'text', name: 'Editable Text', shortcut: 'T', icon: <Type size={19} /> },
    { id: 'shape', name: 'Geometric Shapes', shortcut: 'S', icon: <Shapes size={19} /> },
    { id: 'image', name: 'Insert Image', shortcut: 'I', icon: <ImageIcon size={19} /> },
    { id: 'line', name: 'Straight Line', shortcut: 'L', icon: <Slash size={19} /> }
  ];

  return (
    <aside
      style={{
        position: 'absolute',
        top: 96,
        left: 24,
        zIndex: 40,
        backgroundColor: 'rgba(253, 251, 247, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid #E8DED2',
        borderRadius: 24,
        padding: '10px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 8px 30px -4px rgba(70, 60, 45, 0.08), 0 2px 8px rgba(70, 60, 45, 0.04)',
        width: 52
      }}
      aria-label="Drawing Tools"
    >
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <div key={tool.id} className="tooltip-wrap">
            <button
              onClick={() => {
                if (tool.id === 'image') {
                  onOpenGallery();
                } else {
                  onSelectTool(tool.id);
                }
              }}
              aria-label={tool.name}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isActive ? '#C9D0BD' : 'transparent',
                color: isActive ? '#282C1E' : '#4E504A',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#EFE9DE';
                  e.currentTarget.style.color = '#2E302A';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#4E504A';
                }
              }}
            >
              {tool.icon}
            </button>
            <span className="tooltip-content right">
              {tool.name} ({tool.shortcut})
            </span>
          </div>
        );
      })}

      {/* Divider */}
      <div
        style={{
          width: 28,
          height: 1,
          backgroundColor: '#EBE2D5',
          margin: '2px 0'
        }}
      />

      {/* More Tools Button matching Reference Image 1 */}
      <div className="tooltip-wrap">
        <button
          onClick={onOpenMoreTools}
          aria-label="More Tools"
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: activeTool === 'more' ? '#C9D0BD' : 'transparent',
            color: '#4E504A',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#EFE9DE';
            e.currentTarget.style.color = '#2E302A';
          }}
          onMouseLeave={(e) => {
            if (activeTool !== 'more') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#4E504A';
            }
          }}
        >
          <MoreHorizontal size={20} />
        </button>
        <span className="tooltip-content right">More Tools & Extras</span>
      </div>
    </aside>
  );
};
