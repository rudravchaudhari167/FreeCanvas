import React, { useState } from 'react';
import {
  Sliders,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Square,
  Circle,
  Triangle,
  Star,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import type {
  ToolType,
  ToolSettings,
  SelectedObjectProperties,
  ShapeType,
  LineStyle
} from '../../types/canvas';

interface PropertiesPanelProps {
  activeTool: ToolType;
  settings: ToolSettings;
  selectedObject: SelectedObjectProperties | null;
  onUpdateSettings: (newSettings: Partial<ToolSettings>) => void;
  onUpdateSelectedObject: (props: Partial<SelectedObjectProperties>) => void;
  onDuplicateSelected: () => void;
  onDeleteSelected: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onToggleLock: () => void;
}

const PRESET_COLORS = [
  '#777D5E', // Sage Green
  '#EED4C5', // Warm Peach
  '#D99379', // Terracotta
  '#A9A8D0', // Muted Lavender
  '#A9BDD9', // Soft Blue
  '#4A4B46'  // Charcoal
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  activeTool,
  settings,
  selectedObject,
  onUpdateSettings,
  onUpdateSelectedObject,
  onDuplicateSelected,
  onDeleteSelected,
  onBringForward,
  onSendBackward,
  onToggleLock
}) => {
  const [showHexInput, setShowHexInput] = useState(false);
  const [hexValue, setHexValue] = useState(settings.color);

  // Active color either from selected object or tool settings
  const currentColor = selectedObject?.fill || selectedObject?.stroke || settings.color;
  const currentOpacity = Math.round(
    (selectedObject?.opacity !== undefined ? selectedObject.opacity : settings.opacity) * 100
  );
  const currentSize =
    selectedObject?.strokeWidth !== undefined
      ? selectedObject.strokeWidth
      : settings.size;

  const handleColorChange = (hex: string) => {
    setHexValue(hex);
    onUpdateSettings({ color: hex, strokeColor: hex });
    if (selectedObject) {
      if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
        onUpdateSelectedObject({ fill: hex });
      } else if (selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle') {
        onUpdateSelectedObject({ fill: hex });
      } else {
        onUpdateSelectedObject({ stroke: hex });
      }
    }
  };

  const handleSizeChange = (size: number) => {
    onUpdateSettings({ size, strokeWidth: size });
    if (selectedObject) {
      onUpdateSelectedObject({ strokeWidth: size });
    }
  };

  const handleOpacityChange = (pct: number) => {
    const val = pct / 100;
    onUpdateSettings({ opacity: val });
    if (selectedObject) {
      onUpdateSelectedObject({ opacity: val });
    }
  };

  const isTextContext = activeTool === 'text' || selectedObject?.type === 'i-text' || selectedObject?.type === 'text';
  const isShapeContext = activeTool === 'shape' || ['rect', 'circle', 'triangle', 'polygon'].includes(selectedObject?.type || '');
  const isEraserContext = activeTool === 'eraser';
  const isLineContext = activeTool === 'line' || activeTool === 'arrow' || selectedObject?.type === 'line';

  return (
    <aside
      style={{
        position: 'absolute',
        top: 96,
        right: 24,
        zIndex: 40,
        width: 250,
        backgroundColor: 'rgba(253, 251, 247, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid #E8DED2',
        borderRadius: 24,
        padding: '20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxShadow: '0 10px 32px -4px rgba(70, 60, 45, 0.08), 0 2px 8px rgba(70, 60, 45, 0.04)',
        maxHeight: 'calc(100vh - 180px)',
        overflowY: 'auto'
      }}
      aria-label="Properties Panel"
    >
      {/* Panel Header matching Reference Image 1 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Sliders size={18} color="#4A4B46" />
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#30312D',
              letterSpacing: '-0.2px'
            }}
          >
            Properties
          </h2>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 550,
            color: '#676C4F',
            backgroundColor: '#EEF0E5',
            padding: '3px 8px',
            borderRadius: 6,
            letterSpacing: '0.2px'
          }}
        >
          {selectedObject
            ? 'Selected'
            : activeTool === 'pen'
            ? 'Smooth Pen'
            : activeTool === 'pencil'
            ? 'Sketch Pencil'
            : activeTool === 'marker'
            ? 'Marker'
            : activeTool === 'text'
            ? 'Text'
            : activeTool === 'shape'
            ? 'Shape'
            : activeTool === 'eraser'
            ? 'Eraser'
            : 'Workspace'}
        </span>
      </div>

      {/* COLOR SECTION matching Reference Image 1 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Color</span>

        {/* Selected Color preview circle + HEX input box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label
            title="Choose custom color"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: currentColor,
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <input
              type="color"
              value={currentColor.startsWith('#') ? currentColor.slice(0, 7) : '#777D5E'}
              onChange={(e) => handleColorChange(e.target.value)}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
            />
          </label>

          {/* Hex input pill */}
          <div
            onClick={() => setShowHexInput(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAF5EE',
              border: '1px solid #E8DFD3',
              borderRadius: 10,
              padding: '6px 10px',
              fontSize: 12.5,
              fontWeight: 500,
              color: '#30312D',
              cursor: 'pointer'
            }}
          >
            {showHexInput ? (
              <input
                type="text"
                value={hexValue}
                autoFocus
                onBlur={() => setShowHexInput(false)}
                onChange={(e) => {
                  setHexValue(e.target.value);
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    handleColorChange(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setShowHexInput(false);
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 12.5,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  color: '#30312D'
                }}
              />
            ) : (
              <>
                <span>{currentColor.toUpperCase().slice(0, 7)}</span>
                <ChevronDown size={14} color="#8A857A" />
              </>
            )}
          </div>
        </div>

        {/* 6 Preset Color Swatches matching Reference Image 1 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          {PRESET_COLORS.map((color) => {
            const isSelected = currentColor.toLowerCase().startsWith(color.toLowerCase());
            return (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                title={color}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: isSelected ? '2px solid #30312D' : '2px solid #FFFFFF',
                  boxShadow: isSelected ? '0 0 0 1px #777D5E' : '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* SIZE SECTION matching Reference Image 1 */}
      {!isEraserContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Size</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#79766F' }}>{currentSize} px</span>
          </div>
          <input
            type="range"
            min="1"
            max="60"
            value={currentSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
          />
        </div>
      )}

      {/* OPACITY SECTION matching Reference Image 1 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Opacity</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#79766F' }}>{currentOpacity}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={currentOpacity}
          onChange={(e) => handleOpacityChange(Number(e.target.value))}
        />
      </div>

      {/* ERASER SPECIFIC SETTINGS */}
      {isEraserContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4, borderTop: '1px solid #EBE2D5' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Eraser Mode</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => onUpdateSettings({ eraserMode: 'stroke' })}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                backgroundColor: settings.eraserMode === 'stroke' ? '#C9D0BD' : '#F5EFE5',
                color: '#30312D',
                cursor: 'pointer'
              }}
            >
              Stroke
            </button>
            <button
              onClick={() => onUpdateSettings({ eraserMode: 'object' })}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                backgroundColor: settings.eraserMode === 'object' ? '#C9D0BD' : '#F5EFE5',
                color: '#30312D',
                cursor: 'pointer'
              }}
            >
              Object
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 12, color: '#4E504A' }}>Eraser Size</span>
            <span style={{ fontSize: 12, color: '#79766F' }}>{settings.size} px</span>
          </div>
          <input
            type="range"
            min="6"
            max="80"
            value={settings.size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
          />
        </div>
      )}

      {/* TEXT SPECIFIC SETTINGS */}
      {isTextContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 6, borderTop: '1px solid #EBE2D5' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Typography</span>
          {/* Font Family selector */}
          <select
            value={selectedObject?.fontFamily || settings.fontFamily}
            onChange={(e) => {
              onUpdateSettings({ fontFamily: e.target.value });
              if (selectedObject) onUpdateSelectedObject({ fontFamily: e.target.value });
            }}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #E8DFD3',
              backgroundColor: '#FAF5EE',
              fontSize: 12.5,
              color: '#30312D',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Plus Jakarta Sans">Modern Sans</option>
            <option value="Caveat">Handwritten Cursive</option>
            <option value="Newsreader">Elegant Serif</option>
            <option value="monospace">Typewriter</option>
          </select>

          {/* Bold, Italic, Underline buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => {
                const next = !settings.isBold;
                onUpdateSettings({ isBold: next });
                if (selectedObject) onUpdateSelectedObject({ fontWeight: next ? 'bold' : 'normal' });
              }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 8,
                backgroundColor: (selectedObject?.fontWeight === 'bold' || settings.isBold) ? '#C9D0BD' : '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Bold size={15} />
            </button>
            <button
              onClick={() => {
                const next = !settings.isItalic;
                onUpdateSettings({ isItalic: next });
                if (selectedObject) onUpdateSelectedObject({ fontStyle: next ? 'italic' : 'normal' });
              }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 8,
                backgroundColor: (selectedObject?.fontStyle === 'italic' || settings.isItalic) ? '#C9D0BD' : '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Italic size={15} />
            </button>
            <button
              onClick={() => {
                const next = !settings.isUnderline;
                onUpdateSettings({ isUnderline: next });
                if (selectedObject) onUpdateSelectedObject({ underline: next });
              }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 8,
                backgroundColor: (selectedObject?.underline || settings.isUnderline) ? '#C9D0BD' : '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Underline size={15} />
            </button>
          </div>

          {/* Alignment */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                onClick={() => {
                  onUpdateSettings({ textAlign: align });
                  if (selectedObject) onUpdateSelectedObject({ textAlign: align });
                }}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: 8,
                  backgroundColor:
                    (selectedObject?.textAlign === align || settings.textAlign === align)
                      ? '#C9D0BD'
                      : '#F5EFE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {align === 'left' && <AlignLeft size={15} />}
                {align === 'center' && <AlignCenter size={15} />}
                {align === 'right' && <AlignRight size={15} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SHAPE SPECIFIC SETTINGS */}
      {isShapeContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 6, borderTop: '1px solid #EBE2D5' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Shape Selector</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {[
              { id: 'rectangle' as ShapeType, icon: <Square size={16} /> },
              { id: 'circle' as ShapeType, icon: <Circle size={16} /> },
              { id: 'triangle' as ShapeType, icon: <Triangle size={16} /> },
              { id: 'star' as ShapeType, icon: <Star size={16} /> }
            ].map((shape) => (
              <button
                key={shape.id}
                onClick={() => onUpdateSettings({ shapeType: shape.id })}
                style={{
                  padding: '8px',
                  borderRadius: 8,
                  backgroundColor: settings.shapeType === shape.id ? '#C9D0BD' : '#F5EFE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {shape.icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LINE SPECIFIC SETTINGS */}
      {isLineContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 6, borderTop: '1px solid #EBE2D5' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Line Style</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['solid', 'dashed', 'dotted'] as LineStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => onUpdateSettings({ lineStyle: style })}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  backgroundColor: settings.lineStyle === style ? '#C9D0BD' : '#F5EFE5',
                  color: '#30312D',
                  cursor: 'pointer'
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SELECTED OBJECT ACTIONS (Lock, Layering, Duplicate, Delete) */}
      {selectedObject && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 6, borderTop: '1px solid #EBE2D5' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Object Actions</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={onToggleLock}
              title={selectedObject.isLocked ? 'Unlock Object' : 'Lock Object'}
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: 8,
                backgroundColor: selectedObject.isLocked ? '#EED4C5' : '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {selectedObject.isLocked ? <Lock size={15} color="#D99379" /> : <Unlock size={15} />}
            </button>

            <button
              onClick={onBringForward}
              title="Bring Forward"
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: 8,
                backgroundColor: '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowUp size={15} />
            </button>

            <button
              onClick={onSendBackward}
              title="Send Backward"
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: 8,
                backgroundColor: '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowDown size={15} />
            </button>

            <button
              onClick={onDuplicateSelected}
              title="Duplicate (⌘D)"
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: 8,
                backgroundColor: '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Copy size={15} />
            </button>

            <button
              onClick={onDeleteSelected}
              title="Delete Object"
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: 8,
                backgroundColor: '#FDF2F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={15} color="#C24D3E" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
