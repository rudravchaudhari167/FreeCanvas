import React, { useState } from 'react';
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  Sliders,
  X,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  StickyNote,
  PenTool,
  Pencil,
  Highlighter,
  Bold,
  RotateCcw
} from 'lucide-react';
import type {
  ToolType,
  ToolSettings,
  SelectedObjectProperties,
  ShapeType
} from '../../types/canvas';

interface MobileQuickBarProps {
  activeTool: ToolType;
  settings: ToolSettings;
  selectedObject: SelectedObjectProperties | null;
  onSelectTool: (tool: ToolType) => void;
  onUpdateSettings: (newSettings: Partial<ToolSettings>) => void;
  onUpdateSelectedObject: (props: Partial<SelectedObjectProperties>) => void;
  onDuplicateSelected: () => void;
  onDeleteSelected: () => void;
  onToggleLock: () => void;
  onOpenProperties: () => void;
  onDeselect: () => void;
  onAddStickyNote?: (color?: string) => void;
  onClearCanvas?: () => void;
}

// Quick curated colors for 1-tap mobile selection & drawing
const QUICK_PALETTE = [
  { name: 'Sage', color: '#777D5E' },
  { name: 'Slate', color: '#30312D' },
  { name: 'Terracotta', color: '#CC7A60' },
  { name: 'Ocean', color: '#3B7AC4' },
  { name: 'Amber', color: '#D9822B' },
  { name: 'Lavender', color: '#8E85B2' },
  { name: 'White', color: '#FFFFFF' }
];

// Quick pastel colors for sticky notes
const STICKY_PALETTE = [
  { name: 'Warm Yellow', color: '#FAF0D7' },
  { name: 'Peach', color: '#FCE6DC' },
  { name: 'Pale Sage', color: '#E8EED9' },
  { name: 'Soft Sky', color: '#DEE9F5' },
  { name: 'Lilac', color: '#EBE5F5' }
];

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  activeTool,
  settings,
  selectedObject,
  onSelectTool,
  onUpdateSettings,
  onUpdateSelectedObject,
  onDuplicateSelected,
  onDeleteSelected,
  onToggleLock,
  onOpenProperties,
  onDeselect,
  onAddStickyNote,
  onClearCanvas
}) => {
  const [showColorRow, setShowColorRow] = useState(false);

  // 1. SELECTION CONTEXT: An item is selected on the canvas
  if (selectedObject) {
    const isSticky = !!selectedObject.isStickyNote;
    const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text' || selectedObject.type === 'textbox';
    const isLocked = !!selectedObject.isLocked;

    // Determine current color for the preview badge
    let currentColor = selectedObject.fill || '#777D5E';
    if (isSticky) {
      currentColor = selectedObject.backgroundColor || selectedObject.fill || '#FAF0D7';
    }

    const getItemName = () => {
      if (isSticky) return 'Sticky Note';
      if (isText) return 'Text';
      if (selectedObject.shapeType) return selectedObject.shapeType;
      if (selectedObject.type === 'rect') return 'Rectangle';
      if (selectedObject.type === 'circle') return 'Circle';
      if (selectedObject.type === 'activeselection') return 'Selection';
      if (selectedObject.type === 'image') return 'Image';
      return 'Object';
    };

    const handleApplyColor = (color: string) => {
      if (isSticky) {
        onUpdateSelectedObject({ backgroundColor: color });
      } else if (isText) {
        onUpdateSelectedObject({ textColor: color, fill: color });
      } else {
        onUpdateSelectedObject({ fill: color });
      }
      setShowColorRow(false);
    };

    return (
      <div
        className="mobile-quick-shelf"
        style={{
          position: 'fixed',
          bottom: 74,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          width: 'calc(100vw - 24px)',
          maxWidth: 440,
          backgroundColor: 'rgba(253, 251, 247, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #E8DED2',
          borderRadius: 18,
          padding: '6px 10px',
          boxShadow: '0 8px 30px -4px rgba(60, 50, 40, 0.16), 0 2px 8px rgba(60, 50, 40, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          animation: 'fadeIn 0.15s ease-out'
        }}
      >
        {/* Top Mini Color Picker Row (expanded on tap) */}
        {showColorRow && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '6px 8px',
              borderBottom: '1px solid #EFE8DE',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {(isSticky ? STICKY_PALETTE : QUICK_PALETTE).map((p) => (
              <button
                key={p.color}
                onClick={() => handleApplyColor(p.color)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  border: p.color.toLowerCase() === '#ffffff' ? '1.5px solid #D5CBBF' : '1.5px solid rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transform: currentColor === p.color ? 'scale(1.2)' : 'none',
                  boxShadow: currentColor === p.color ? '0 2px 6px rgba(0,0,0,0.25)' : 'none',
                  transition: 'transform 0.15s'
                }}
                title={p.name}
              />
            ))}
          </div>
        )}

        {/* Main Selection Actions Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          {/* Left: Item Badge & Quick Color Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setShowColorRow(!showColorRow)}
              title="Tap to change color"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 8px',
                borderRadius: 10,
                backgroundColor: '#F5EFE5',
                border: '1px solid #E8DFD3',
                fontSize: 12,
                fontWeight: 600,
                color: '#30312D',
                cursor: 'pointer'
              }}
            >
              <span
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  backgroundColor: currentColor,
                  border: '1px solid rgba(0,0,0,0.15)',
                  display: 'inline-block'
                }}
              />
              <span style={{ textTransform: 'capitalize', maxWidth: 85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getItemName()}
              </span>
            </button>
          </div>

          {/* Right: Quick Action Buttons (Duplicate, Delete, Lock, Properties, Deselect) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Duplicate Button */}
            <button
              onClick={onDuplicateSelected}
              aria-label="Duplicate item"
              title="Duplicate"
              style={quickBtnStyle}
            >
              <Copy size={16} color="#4A4B46" />
            </button>

            {/* Lock / Unlock */}
            <button
              onClick={onToggleLock}
              aria-label={isLocked ? 'Unlock item' : 'Lock item'}
              title={isLocked ? 'Unlock' : 'Lock'}
              style={{
                ...quickBtnStyle,
                backgroundColor: isLocked ? '#FAF0D7' : 'transparent',
                borderColor: isLocked ? '#DCD0B4' : 'transparent'
              }}
            >
              {isLocked ? <Lock size={16} color="#B5812B" /> : <Unlock size={16} color="#79766F" />}
            </button>

            {/* Open Full Properties Panel */}
            <button
              onClick={onOpenProperties}
              aria-label="Item properties"
              title="Full Properties"
              style={quickBtnStyle}
            >
              <Sliders size={16} color="#5E6547" />
            </button>

            {/* Delete Button (with red tint) */}
            <button
              onClick={onDeleteSelected}
              aria-label="Delete item"
              title="Delete"
              style={{
                ...quickBtnStyle,
                backgroundColor: '#FDF2F0',
                borderColor: '#F3D2CD',
                color: '#D84C4C'
              }}
            >
              <Trash2 size={16} color="#D84C4C" />
            </button>

            {/* Close / Deselect */}
            <button
              onClick={onDeselect}
              aria-label="Deselect"
              title="Deselect"
              style={{ ...quickBtnStyle, marginLeft: 2 }}
            >
              <X size={15} color="#8A857A" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. DRAWING CONTEXT: Pen, Pencil, or Marker is active
  if (activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker') {
    const brushTypes: { id: ToolType; label: string; icon: React.ReactNode }[] = [
      { id: 'pen', label: 'Pen', icon: <PenTool size={14} /> },
      { id: 'pencil', label: 'Pencil', icon: <Pencil size={14} /> },
      { id: 'marker', label: 'Highlighter', icon: <Highlighter size={14} /> }
    ];

    const sizePresets = [
      { label: 'Fine', size: 2, dot: 4 },
      { label: 'Medium', size: 5, dot: 7 },
      { label: 'Bold', size: 12, dot: 11 }
    ];

    return (
      <div
        className="mobile-quick-shelf hide-scrollbar"
        style={{
          position: 'fixed',
          bottom: 74,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          width: 'calc(100vw - 24px)',
          maxWidth: 440,
          backgroundColor: 'rgba(253, 251, 247, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #E8DED2',
          borderRadius: 18,
          padding: '6px 10px',
          boxShadow: '0 8px 30px -4px rgba(60, 50, 40, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: 'fadeIn 0.15s ease-out'
        }}
      >
        {/* Brush Type Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          {brushTypes.map((b) => {
            const isActive = activeTool === b.id;
            return (
              <button
                key={b.id}
                onClick={() => onSelectTool(b.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 7px',
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? '#777D5E' : '#F5EFE5',
                  color: isActive ? '#FFFFFF' : '#4E504A',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {b.icon}
                <span>{b.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: '#EBE2D5', flexShrink: 0 }} />

        {/* 5 Quick Color Swatches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          {QUICK_PALETTE.slice(0, 5).map((p) => {
            const isSelected = settings.color.toLowerCase() === p.color.toLowerCase();
            return (
              <button
                key={p.color}
                onClick={() => onUpdateSettings({ color: p.color, strokeColor: p.color, fillColor: p.color })}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  border: isSelected ? '2px solid #30312D' : '1px solid rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.2)' : 'none',
                  boxShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.25)' : 'none',
                  transition: 'transform 0.15s'
                }}
                title={p.name}
              />
            );
          })}
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: '#EBE2D5', flexShrink: 0 }} />

        {/* 3 Size Dot Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          {sizePresets.map((s) => {
            const isSelected = Math.abs(settings.size - s.size) <= 1;
            return (
              <button
                key={s.label}
                onClick={() => onUpdateSettings({ size: s.size, strokeWidth: s.size })}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected ? '#EBE2D5' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title={s.label}
              >
                <span
                  style={{
                    width: s.dot,
                    height: s.dot,
                    borderRadius: '50%',
                    backgroundColor: isSelected ? '#30312D' : '#79766F'
                  }}
                />
              </button>
            );
          })}

          <button
            onClick={onOpenProperties}
            title="More brush settings"
            style={quickBtnStyle}
          >
            <Sliders size={14} color="#5E6547" />
          </button>
        </div>
      </div>
    );
  }

  // 3. SHAPE CONTEXT: Shape tool is active
  if (activeTool === 'shape') {
    const popularShapes: { type: ShapeType; icon: React.ReactNode; label: string }[] = [
      { type: 'rectangle', icon: <Square size={16} />, label: 'Rect' },
      { type: 'circle', icon: <Circle size={16} />, label: 'Circle' },
      { type: 'triangle', icon: <Triangle size={16} />, label: 'Triangle' },
      { type: 'star', icon: <Star size={16} />, label: 'Star' },
      { type: 'heart', icon: <Heart size={16} />, label: 'Heart' }
    ];

    return (
      <div
        className="mobile-quick-shelf hide-scrollbar"
        style={{
          position: 'fixed',
          bottom: 74,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          width: 'calc(100vw - 24px)',
          maxWidth: 440,
          backgroundColor: 'rgba(253, 251, 247, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #E8DED2',
          borderRadius: 18,
          padding: '6px 10px',
          boxShadow: '0 8px 30px -4px rgba(60, 50, 40, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: 'fadeIn 0.15s ease-out'
        }}
      >
        {/* Quick Shape Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {popularShapes.map((s) => {
            const isSelected = settings.shapeType === s.type;
            return (
              <button
                key={s.type}
                onClick={() => onUpdateSettings({ shapeType: s.type })}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected ? '#777D5E' : '#F5EFE5',
                  color: isActiveColor(isSelected),
                  border: 'none',
                  cursor: 'pointer'
                }}
                title={s.label}
              >
                {s.icon}
              </button>
            );
          })}
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: '#EBE2D5', flexShrink: 0 }} />

        {/* 4 Quick Color Fill Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          {QUICK_PALETTE.slice(0, 4).map((p) => {
            const isSelected = settings.fillColor.toLowerCase() === p.color.toLowerCase();
            return (
              <button
                key={p.color}
                onClick={() => onUpdateSettings({ fillColor: p.color, color: p.color })}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  border: isSelected ? '2px solid #30312D' : '1px solid rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.2)' : 'none'
                }}
                title={p.name}
              />
            );
          })}
        </div>

        {/* All Shapes Button */}
        <button
          onClick={onOpenProperties}
          style={{
            padding: '4px 8px',
            borderRadius: 8,
            backgroundColor: '#F5EFE5',
            border: '1px solid #E8DFD3',
            fontSize: 11.5,
            fontWeight: 600,
            color: '#4A4843',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          All Shapes...
        </button>
      </div>
    );
  }

  // 4. STICKY NOTE CONTEXT: Sticky note tool or quick action
  if (activeTool === 'sticky') {
    return (
      <div
        className="mobile-quick-shelf hide-scrollbar"
        style={{
          position: 'fixed',
          bottom: 74,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          width: 'calc(100vw - 24px)',
          maxWidth: 440,
          backgroundColor: 'rgba(253, 251, 247, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #E8DED2',
          borderRadius: 18,
          padding: '6px 12px',
          boxShadow: '0 8px 30px -4px rgba(60, 50, 40, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          animation: 'fadeIn 0.15s ease-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StickyNote size={16} color="#777D5E" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#30312D' }}>Sticky Color:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {STICKY_PALETTE.map((p) => {
            const isSelected = settings.stickyColor.toLowerCase() === p.color.toLowerCase();
            return (
              <button
                key={p.color}
                onClick={() => {
                  onUpdateSettings({ stickyColor: p.color });
                  if (onAddStickyNote) onAddStickyNote(p.color);
                }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: p.color,
                  border: isSelected ? '2px solid #5C6347' : '1px solid #D5CBBF',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.15)' : 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                title={p.name}
              />
            );
          })}
        </div>

        <button
          onClick={() => onAddStickyNote && onAddStickyNote(settings.stickyColor)}
          style={{
            padding: '5px 10px',
            borderRadius: 8,
            backgroundColor: '#5E6547',
            color: '#FFFEFA',
            border: 'none',
            fontSize: 11.5,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Add Note
        </button>
      </div>
    );
  }

  // 5. TEXT CONTEXT: Text tool active
  if (activeTool === 'text') {
    const textSizes = [
      { label: 'S', size: 16 },
      { label: 'M', size: 24 },
      { label: 'L', size: 36 }
    ];

    return (
      <div
        className="mobile-quick-shelf hide-scrollbar"
        style={{
          position: 'fixed',
          bottom: 74,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          width: 'calc(100vw - 24px)',
          maxWidth: 440,
          backgroundColor: 'rgba(253, 251, 247, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #E8DED2',
          borderRadius: 18,
          padding: '6px 12px',
          boxShadow: '0 8px 30px -4px rgba(60, 50, 40, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          animation: 'fadeIn 0.15s ease-out'
        }}
      >
        {/* Bold Toggle */}
        <button
          onClick={() => onUpdateSettings({ isBold: !settings.isBold })}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            backgroundColor: settings.isBold ? '#777D5E' : '#F5EFE5',
            color: settings.isBold ? '#FFFFFF' : '#30312D',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Toggle Bold"
        >
          <Bold size={15} />
        </button>

        {/* Text Sizes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {textSizes.map((s) => {
            const isSelected = settings.fontSize === s.size;
            return (
              <button
                key={s.label}
                onClick={() => onUpdateSettings({ fontSize: s.size })}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  backgroundColor: isSelected ? '#5E6547' : '#F5EFE5',
                  color: isSelected ? '#FFFFFF' : '#4E504A',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* 4 Text Colors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {QUICK_PALETTE.slice(0, 4).map((p) => {
            const isSelected = settings.color.toLowerCase() === p.color.toLowerCase();
            return (
              <button
                key={p.color}
                onClick={() => onUpdateSettings({ color: p.color })}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  border: isSelected ? '2px solid #30312D' : '1px solid rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.2)' : 'none'
                }}
                title={p.name}
              />
            );
          })}
        </div>

        <button
          onClick={onOpenProperties}
          style={quickBtnStyle}
          title="More text options"
        >
          <Sliders size={14} color="#5E6547" />
        </button>
      </div>
    );
  }

  // 6. ERASER CONTEXT
  if (activeTool === 'eraser') {
    return (
      <div
        className="mobile-quick-shelf hide-scrollbar"
        style={{
          position: 'fixed',
          bottom: 74,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          width: 'calc(100vw - 24px)',
          maxWidth: 440,
          backgroundColor: 'rgba(253, 251, 247, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #E8DED2',
          borderRadius: 18,
          padding: '6px 12px',
          boxShadow: '0 8px 30px -4px rgba(60, 50, 40, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          animation: 'fadeIn 0.15s ease-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => onUpdateSettings({ eraserMode: 'stroke' })}
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 550,
              backgroundColor: settings.eraserMode === 'stroke' ? '#777D5E' : '#F5EFE5',
              color: settings.eraserMode === 'stroke' ? '#FFFFFF' : '#4A4843',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Stroke Eraser
          </button>
          <button
            onClick={() => onUpdateSettings({ eraserMode: 'object' })}
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 550,
              backgroundColor: settings.eraserMode === 'object' ? '#777D5E' : '#F5EFE5',
              color: settings.eraserMode === 'object' ? '#FFFFFF' : '#4A4843',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Object Eraser
          </button>
        </div>

        {onClearCanvas && (
          <button
            onClick={() => {
              if (confirm('Clear entire canvas?')) {
                onClearCanvas();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: 600,
              color: '#D84C4C',
              backgroundColor: '#FDF2F0',
              border: '1px solid #F3D2CD',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            <span>Clear Canvas</span>
          </button>
        )}
      </div>
    );
  }

  return null;
};

const quickBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F5EFE5',
  border: '1px solid #E8DFD3',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};

const isActiveColor = (active: boolean) => (active ? '#FFFFFF' : '#4E504A');
