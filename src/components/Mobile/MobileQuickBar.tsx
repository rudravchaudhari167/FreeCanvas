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
  RotateCcw,
  Edit3,
  Shapes,
  Check
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
  onEditText?: () => void;
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
  onClearCanvas,
  onEditText
}) => {
  const [showColorRow, setShowColorRow] = useState(false);
  const [showShapeRow, setShowShapeRow] = useState(false);
  const [shapeColorTarget, setShapeColorTarget] = useState<'fill' | 'stroke'>('fill');
  const [showTextModal, setShowTextModal] = useState(false);
  const [editTextValue, setEditTextValue] = useState('');

  // 1. SELECTION CONTEXT: An item is selected on the canvas
  if (selectedObject) {
    const isSticky = !!selectedObject.isStickyNote;
    const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text' || selectedObject.type === 'textbox' || selectedObject.text !== undefined;
    const isShape = !isText && !isSticky && (!!selectedObject.shapeType || ['rect', 'circle', 'ellipse', 'triangle', 'polygon'].includes(selectedObject.type || ''));
    const isLocked = !!selectedObject.isLocked;

    // Determine current color for the preview badge
    let currentColor = selectedObject.fill || '#777D5E';
    if (isSticky) {
      currentColor = selectedObject.backgroundColor || selectedObject.fill || '#FAF0D7';
    } else if (isShape && shapeColorTarget === 'stroke') {
      currentColor = selectedObject.stroke || '#5E6547';
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
      } else if (isShape && shapeColorTarget === 'stroke') {
        onUpdateSelectedObject({ stroke: color, strokeWidth: selectedObject.strokeWidth || 2 });
      } else {
        onUpdateSelectedObject({ fill: color });
      }
      setShowColorRow(false);
    };

    return (
      <>
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
                flexDirection: 'column',
                gap: 6,
                padding: '4px 6px',
                borderBottom: '1px solid #EFE8DE'
              }}
            >
              {/* Fill vs Border toggle for shapes */}
              {isShape && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 2 }}>
                  <div style={{ display: 'flex', backgroundColor: '#EFEAE0', borderRadius: 999, padding: 2, border: '1px solid #E2D9CC' }}>
                    <button
                      type="button"
                      onClick={() => setShapeColorTarget('fill')}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 650,
                        border: 'none',
                        backgroundColor: shapeColorTarget === 'fill' ? '#FFFFFF' : 'transparent',
                        color: shapeColorTarget === 'fill' ? '#30312D' : '#8A857A',
                        cursor: 'pointer'
                      }}
                    >
                      Fill Color
                    </button>
                    <button
                      type="button"
                      onClick={() => setShapeColorTarget('stroke')}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 650,
                        border: 'none',
                        backgroundColor: shapeColorTarget === 'stroke' ? '#FFFFFF' : 'transparent',
                        color: shapeColorTarget === 'stroke' ? '#30312D' : '#8A857A',
                        cursor: 'pointer'
                      }}
                    >
                      Border Color
                    </button>
                  </div>
                  {/* Quick border width selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {[1.5, 3, 5].map((w) => (
                      <button
                        key={w}
                        onClick={() => onUpdateSelectedObject({ strokeWidth: w })}
                        style={{
                          fontSize: 9.5,
                          fontWeight: 600,
                          padding: '2px 5px',
                          borderRadius: 6,
                          border: '1px solid #E2D9CC',
                          backgroundColor: selectedObject.strokeWidth === w ? '#FAF0D7' : '#FFFFFF',
                          color: '#4E504A',
                          cursor: 'pointer'
                        }}
                      >
                        {w}px
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Swatches */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  padding: '2px 0'
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
            </div>
          )}

          {/* Shape Morphing Row (expanded on tap for shapes) */}
          {showShapeRow && isShape && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '6px 4px',
                borderBottom: '1px solid #EFE8DE',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {[
                { type: 'rectangle' as ShapeType, label: 'Rect', icon: <Square size={14} /> },
                { type: 'rounded-rect' as ShapeType, label: 'Rounded', icon: <Square size={14} style={{ borderRadius: 3 }} /> },
                { type: 'circle' as ShapeType, label: 'Circle', icon: <Circle size={14} /> },
                { type: 'triangle' as ShapeType, label: 'Triangle', icon: <Triangle size={14} /> },
                { type: 'star' as ShapeType, label: 'Star', icon: <Star size={14} /> },
                { type: 'heart' as ShapeType, label: 'Heart', icon: <Heart size={14} /> }
              ].map((s) => (
                <button
                  key={s.type}
                  onClick={() => {
                    onUpdateSelectedObject({ shapeType: s.type });
                    setShowShapeRow(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: '3px 7px',
                    borderRadius: 7,
                    border: '1px solid #E2D9CC',
                    backgroundColor: selectedObject.shapeType === s.type ? '#FAF0D7' : '#FFFFFF',
                    color: '#30312D',
                    fontSize: 10.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Main Selection Actions Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            {/* Left: Item Badge & Color Trigger + Edit/Shape Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <button
                onClick={() => {
                  setShowColorRow(!showColorRow);
                  setShowShapeRow(false);
                }}
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
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: currentColor,
                    border: '1px solid rgba(0,0,0,0.15)',
                    display: 'inline-block'
                  }}
                />
                <span style={{ textTransform: 'capitalize', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getItemName()}
                </span>
              </button>

              {/* Edit Text Button for templates & textboxes */}
              {isText && (
                <button
                  onClick={() => {
                    setEditTextValue(selectedObject.text || '');
                    if (onEditText) onEditText();
                    setShowTextModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 9px',
                    borderRadius: 10,
                    backgroundColor: '#EAEEDD',
                    border: '1px solid #C9D5B6',
                    color: '#344A24',
                    fontSize: 12,
                    fontWeight: 650,
                    cursor: 'pointer'
                  }}
                  title="Edit text content"
                >
                  <Edit3 size={13} color="#344A24" />
                  <span>Edit</span>
                </button>
              )}

              {/* Shape Morpher Button for template shapes */}
              {isShape && (
                <button
                  onClick={() => {
                    setShowShapeRow(!showShapeRow);
                    setShowColorRow(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 10,
                    backgroundColor: showShapeRow ? '#E2DDD2' : '#F5EFE5',
                    border: '1px solid #E8DFD3',
                    color: '#30312D',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Change shape"
                >
                  <Shapes size={13} color="#5E6547" />
                  <span>Shape</span>
                </button>
              )}
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

        {/* Dedicated Mobile Text Editor Modal for seamless editing on touch screens */}
        {showTextModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(25, 23, 20, 0.45)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '0 0 20px 0'
            }}
            onClick={() => setShowTextModal(false)}
          >
            <div
              style={{
                width: 'calc(100vw - 24px)',
                maxWidth: 420,
                backgroundColor: '#FFFEFA',
                borderRadius: 20,
                border: '1px solid #E5DCCE',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                animation: 'slideUp 0.18s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Edit3 size={16} color="#5E6547" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#30312D' }}>Edit Template Text</span>
                </div>
                <button
                  onClick={() => setShowTextModal(false)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: '#F5EFE5',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#65635D'
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              <textarea
                value={editTextValue}
                onChange={(e) => setEditTextValue(e.target.value)}
                rows={4}
                autoFocus
                placeholder="Type your text..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1.5px solid #D5CBBF',
                  backgroundColor: '#FAF7F0',
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: '#30312D',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  onClick={() => setShowTextModal(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 10,
                    border: '1px solid #E0D5C7',
                    backgroundColor: '#FAF5EE',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#65635D',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateSelectedObject({ text: editTextValue });
                    setShowTextModal(false);
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#5E6547',
                    fontSize: 13,
                    fontWeight: 650,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 8px rgba(94, 101, 71, 0.35)'
                  }}
                >
                  <Check size={15} color="#FFFFFF" />
                  <span>Update Text</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
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
