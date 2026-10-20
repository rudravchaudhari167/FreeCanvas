import React, { useState, useEffect } from 'react';
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
  ArrowDown,
  Check
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

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export function parseToRgb(color: string): RGBColor {
  if (!color) return { r: 119, g: 125, b: 94 };
  const trimmed = color.trim().toLowerCase();
  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (match) {
      return {
        r: Math.max(0, Math.min(255, parseInt(match[1], 10) || 0)),
        g: Math.max(0, Math.min(255, parseInt(match[2], 10) || 0)),
        b: Math.max(0, Math.min(255, parseInt(match[3], 10) || 0))
      };
    }
  }
  let hex = trimmed.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return {
    r: isNaN(r) ? 119 : r,
    g: isNaN(g) ? 125 : g,
    b: isNaN(b) ? 94 : b
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function rgbToString(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export const RGB_PALETTES = {
  primaryRGB: [
    { name: 'Pure Red', hex: '#EF4444', rgb: 'rgb(239, 68, 68)' },
    { name: 'Pure Green', hex: '#22C55E', rgb: 'rgb(34, 197, 94)' },
    { name: 'Pure Blue', hex: '#3B82F6', rgb: 'rgb(59, 130, 246)' },
    { name: 'Vibrant Yellow', hex: '#EAB308', rgb: 'rgb(234, 179, 8)' },
    { name: 'Vibrant Cyan', hex: '#06B6D4', rgb: 'rgb(6, 182, 212)' },
    { name: 'Vibrant Magenta', hex: '#D946EF', rgb: 'rgb(217, 70, 239)' },
    { name: 'Clean White', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
    { name: 'Deep Charcoal', hex: '#1E293B', rgb: 'rgb(30, 41, 59)' }
  ],
  botanical: [
    { name: 'Sage Green', hex: '#777D5E', rgb: 'rgb(119, 125, 94)' },
    { name: 'Warm Peach', hex: '#EED4C5', rgb: 'rgb(238, 212, 197)' },
    { name: 'Terracotta', hex: '#D99379', rgb: 'rgb(217, 147, 121)' },
    { name: 'Muted Lavender', hex: '#A9A8D0', rgb: 'rgb(169, 168, 208)' },
    { name: 'Soft Blue', hex: '#A9BDD9', rgb: 'rgb(169, 189, 217)' },
    { name: 'Charcoal', hex: '#4A4B46', rgb: 'rgb(74, 75, 70)' }
  ]
};

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
  const [colorMode, setColorMode] = useState<'rgb' | 'hex'>('rgb');
  const [paletteTab, setPaletteTab] = useState<'rgb' | 'botanical'>('rgb');
  const [copiedRgb, setCopiedRgb] = useState(false);
  const [shapeTarget, setShapeTarget] = useState<'fill' | 'stroke'>('fill');

  const isTextContext = activeTool === 'text' || selectedObject?.type === 'i-text' || selectedObject?.type === 'text';
  const isShapeContext =
    activeTool === 'shape' ||
    ['rect', 'circle', 'triangle', 'polygon'].includes(selectedObject?.type || '');
  const isEraserContext = activeTool === 'eraser' && !selectedObject;
  const isLineContext = activeTool === 'line' || activeTool === 'arrow' || selectedObject?.type === 'line';
  const isStickyContext = activeTool === 'sticky' || selectedObject?.type === 'group';

  // Determine current active color based on context and selected target
  let currentColor = settings.color;
  if (selectedObject) {
    if (isShapeContext) {
      currentColor =
        shapeTarget === 'fill'
          ? (selectedObject.fill || settings.color)
          : (selectedObject.stroke || settings.strokeColor || '#5E6547');
    } else if (isTextContext) {
      currentColor = selectedObject.fill || settings.color;
    } else if (isStickyContext) {
      currentColor = selectedObject.fill || settings.stickyColor || '#FAF0D7';
    } else {
      currentColor = selectedObject.stroke || selectedObject.fill || settings.color;
    }
  } else {
    if (isShapeContext) {
      currentColor =
        shapeTarget === 'fill'
          ? (settings.fillColor || settings.color)
          : (settings.strokeColor || '#5E6547');
    } else if (isStickyContext) {
      currentColor = settings.stickyColor || '#FAF0D7';
    } else {
      currentColor = settings.color;
    }
  }

  // Current RGB channels
  const currentRgb = parseToRgb(currentColor);

  // Sync hexValue state whenever currentColor changes
  useEffect(() => {
    const hex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
    setHexValue(hex);
  }, [currentColor]);

  const currentOpacity = Math.round(
    (selectedObject?.opacity !== undefined ? selectedObject.opacity : settings.opacity) * 100
  );
  const currentSize =
    selectedObject?.strokeWidth !== undefined
      ? selectedObject.strokeWidth
      : settings.size;

  const handleColorChange = (newColor: string) => {
    const rgb = parseToRgb(newColor);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexValue(hex);

    if (isShapeContext) {
      if (shapeTarget === 'fill') {
        onUpdateSettings({ fillColor: newColor, color: newColor });
        if (selectedObject) {
          onUpdateSelectedObject({ fill: newColor });
        }
      } else {
        onUpdateSettings({ strokeColor: newColor });
        if (selectedObject) {
          onUpdateSelectedObject({ stroke: newColor });
        }
      }
    } else if (isTextContext) {
      onUpdateSettings({ color: newColor });
      if (selectedObject) {
        onUpdateSelectedObject({ fill: newColor });
      }
    } else if (isStickyContext) {
      onUpdateSettings({ stickyColor: newColor });
      if (selectedObject) {
        onUpdateSelectedObject({ fill: newColor });
      }
    } else {
      onUpdateSettings({ color: newColor, strokeColor: newColor });
      if (selectedObject) {
        if (
          selectedObject.type === 'rect' ||
          selectedObject.type === 'circle' ||
          selectedObject.type === 'triangle' ||
          selectedObject.type === 'polygon'
        ) {
          onUpdateSelectedObject({ fill: newColor });
        } else {
          onUpdateSelectedObject({ stroke: newColor });
        }
      }
    }
  };

  const handleRgbChannelChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const clamped = Math.max(0, Math.min(255, isNaN(value) ? 0 : value));
    const nextRgb = { ...currentRgb, [channel]: clamped };
    const rgbStr = rgbToString(nextRgb.r, nextRgb.g, nextRgb.b);
    handleColorChange(rgbStr);
  };

  const handleCopyRgb = () => {
    const str = rgbToString(currentRgb.r, currentRgb.g, currentRgb.b);
    navigator.clipboard.writeText(str).then(() => {
      setCopiedRgb(true);
      setTimeout(() => setCopiedRgb(false), 1400);
    });
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

  const getItemBadgeLabel = () => {
    if (selectedObject) {
      const type = selectedObject.type || '';
      if (type === 'i-text' || type === 'text') return 'Text Object';
      if (type === 'rect') return 'Rectangle';
      if (type === 'circle') return 'Circle';
      if (type === 'triangle') return 'Triangle';
      if (type === 'polygon') return 'Star Shape';
      if (type === 'line') return 'Line Object';
      if (type === 'group') return 'Sticky Note';
      if (type === 'path') return 'Drawing Stroke';
      return 'Selected Item';
    }
    if (activeTool === 'pen') return 'Smooth Pen';
    if (activeTool === 'pencil') return 'Sketch Pencil';
    if (activeTool === 'marker') return 'Highlighter';
    if (activeTool === 'text') return 'Text Tool';
    if (activeTool === 'shape') {
      if (settings.shapeType === 'circle') return 'Circle Shape';
      if (settings.shapeType === 'triangle') return 'Triangle Shape';
      if (settings.shapeType === 'star') return 'Star Shape';
      return 'Rectangle Shape';
    }
    if (activeTool === 'line') return 'Straight Line';
    if (activeTool === 'arrow') return 'Arrow Connector';
    if (activeTool === 'sticky') return 'Sticky Note';
    if (activeTool === 'eraser') return 'Eraser';
    return 'Workspace';
  };

  return (
    <aside
      style={{
        position: 'absolute',
        top: 96,
        right: 24,
        zIndex: 40,
        width: 264,
        backgroundColor: 'rgba(253, 251, 247, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid #E8DED2',
        borderRadius: 24,
        padding: '18px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 10px 32px -4px rgba(70, 60, 45, 0.08), 0 2px 8px rgba(70, 60, 45, 0.04)',
        maxHeight: 'calc(100vh - 160px)',
        overflowY: 'auto'
      }}
      aria-label="Properties Panel"
    >
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          {getItemBadgeLabel()}
        </span>
      </div>

      {/* COLOR SECTION WITH FULL RGB SUPPORT (Shown for all items except standalone eraser) */}
      {!isEraserContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Header Row: Label + Format Mode Pill (RGB / HEX) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 550, color: '#4E504A' }}>
              {isShapeContext
                ? shapeTarget === 'fill' ? 'Shape Fill' : 'Shape Border'
                : isTextContext
                ? 'Text Color'
                : isStickyContext
                ? 'Note Color'
                : isLineContext
                ? 'Line Color'
                : 'Item Color'}
            </span>

            {/* RGB / HEX mode toggle buttons */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#FAF5EE',
                border: '1px solid #E8DFD3',
                borderRadius: 8,
                padding: '2px',
                gap: 2
              }}
            >
              <button
                type="button"
                onClick={() => setColorMode('rgb')}
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: colorMode === 'rgb' ? 600 : 500,
                  backgroundColor: colorMode === 'rgb' ? '#C9D0BD' : 'transparent',
                  color: colorMode === 'rgb' ? '#282C1E' : '#79766F',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                RGB
              </button>
              <button
                type="button"
                onClick={() => setColorMode('hex')}
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: colorMode === 'hex' ? 600 : 500,
                  backgroundColor: colorMode === 'hex' ? '#C9D0BD' : 'transparent',
                  color: colorMode === 'hex' ? '#282C1E' : '#79766F',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                HEX
              </button>
            </div>
          </div>

          {/* Shape Dual-Target Tabs (Fill vs Border) */}
          {isShapeContext && (
            <div style={{ display: 'flex', gap: 6, marginTop: -2 }}>
              <button
                type="button"
                onClick={() => setShapeTarget('fill')}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: shapeTarget === 'fill' ? 600 : 500,
                  backgroundColor: shapeTarget === 'fill' ? '#EAE5D9' : '#FAF6EE',
                  color: shapeTarget === 'fill' ? '#30312D' : '#8A857A',
                  border: '1px solid ' + (shapeTarget === 'fill' ? '#D6CBB8' : '#ECE3D5'),
                  cursor: 'pointer'
                }}
              >
                Fill Color
              </button>
              <button
                type="button"
                onClick={() => setShapeTarget('stroke')}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: shapeTarget === 'stroke' ? 600 : 500,
                  backgroundColor: shapeTarget === 'stroke' ? '#EAE5D9' : '#FAF6EE',
                  color: shapeTarget === 'stroke' ? '#30312D' : '#8A857A',
                  border: '1px solid ' + (shapeTarget === 'stroke' ? '#D6CBB8' : '#ECE3D5'),
                  cursor: 'pointer'
                }}
              >
                Border Color
              </button>
            </div>
          )}

          {/* Live Preview Swatch + Color Display / Copy Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label
              title="Click to open color picker"
              style={{
                width: 36,
                height: 36,
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
                value={rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b)}
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

            {/* RGB String with Copy button OR HEX input pill */}
            {colorMode === 'rgb' ? (
              <div
                onClick={handleCopyRgb}
                title="Click to copy RGB code"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FAF5EE',
                  border: '1px solid #E8DFD3',
                  borderRadius: 10,
                  padding: '6px 10px',
                  fontSize: 12,
                  fontWeight: 550,
                  color: '#30312D',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <span>{rgbToString(currentRgb.r, currentRgb.g, currentRgb.b)}</span>
                {copiedRgb ? (
                  <span style={{ fontSize: 11, color: '#38A169', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Check size={12} /> Copied
                  </span>
                ) : (
                  <Copy size={13} color="#8A857A" />
                )}
              </div>
            ) : (
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
                    <span>{rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b).toUpperCase()}</span>
                    <ChevronDown size={14} color="#8A857A" />
                  </>
                )}
              </div>
            )}
          </div>

          {/* INTERACTIVE RGB CHANNEL SLIDERS & NUMERIC INPUTS (Visible in RGB Mode) */}
          {colorMode === 'rgb' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                backgroundColor: '#FAF6EE',
                border: '1px solid #ECE3D5',
                borderRadius: 12,
                padding: '10px 10px'
              }}
            >
              {/* Red Channel (R) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  R
                </span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentRgb.r}
                  onChange={(e) => handleRgbChannelChange('r', Number(e.target.value))}
                  style={{
                    flex: 1,
                    height: 5,
                    background: `linear-gradient(to right, rgb(0, ${currentRgb.g}, ${currentRgb.b}), rgb(255, ${currentRgb.g}, ${currentRgb.b}))`
                  }}
                  title={`Red: ${currentRgb.r}`}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={currentRgb.r}
                  onChange={(e) => handleRgbChannelChange('r', Number(e.target.value))}
                  style={{
                    width: 44,
                    padding: '3px 4px',
                    borderRadius: 6,
                    border: '1px solid #E2D7C5',
                    backgroundColor: '#FFFEFA',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#30312D',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Green Channel (G) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  G
                </span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentRgb.g}
                  onChange={(e) => handleRgbChannelChange('g', Number(e.target.value))}
                  style={{
                    flex: 1,
                    height: 5,
                    background: `linear-gradient(to right, rgb(${currentRgb.r}, 0, ${currentRgb.b}), rgb(${currentRgb.r}, 255, ${currentRgb.b}))`
                  }}
                  title={`Green: ${currentRgb.g}`}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={currentRgb.g}
                  onChange={(e) => handleRgbChannelChange('g', Number(e.target.value))}
                  style={{
                    width: 44,
                    padding: '3px 4px',
                    borderRadius: 6,
                    border: '1px solid #E2D7C5',
                    backgroundColor: '#FFFEFA',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#30312D',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Blue Channel (B) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: '#DBEAFE',
                    color: '#2563EB',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  B
                </span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentRgb.b}
                  onChange={(e) => handleRgbChannelChange('b', Number(e.target.value))}
                  style={{
                    flex: 1,
                    height: 5,
                    background: `linear-gradient(to right, rgb(${currentRgb.r}, ${currentRgb.g}, 0), rgb(${currentRgb.r}, ${currentRgb.g}, 255))`
                  }}
                  title={`Blue: ${currentRgb.b}`}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={currentRgb.b}
                  onChange={(e) => handleRgbChannelChange('b', Number(e.target.value))}
                  style={{
                    width: 44,
                    padding: '3px 4px',
                    borderRadius: 6,
                    border: '1px solid #E2D7C5',
                    backgroundColor: '#FFFEFA',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#30312D',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* RGB PRESET SWATCHES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Palette selection tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11.5, fontWeight: 550, color: '#79766F' }}>
                {paletteTab === 'rgb' ? 'RGB Primary & Spectrum' : 'Botanical Presets'}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setPaletteTab('rgb')}
                  style={{
                    padding: '2px 6px',
                    borderRadius: 5,
                    fontSize: 10.5,
                    fontWeight: paletteTab === 'rgb' ? 600 : 500,
                    backgroundColor: paletteTab === 'rgb' ? '#EAE5D9' : 'transparent',
                    color: paletteTab === 'rgb' ? '#282C1E' : '#8A857A',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  RGB Palette
                </button>
                <button
                  type="button"
                  onClick={() => setPaletteTab('botanical')}
                  style={{
                    padding: '2px 6px',
                    borderRadius: 5,
                    fontSize: 10.5,
                    fontWeight: paletteTab === 'botanical' ? 600 : 500,
                    backgroundColor: paletteTab === 'botanical' ? '#EAE5D9' : 'transparent',
                    color: paletteTab === 'botanical' ? '#282C1E' : '#8A857A',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Earthy
                </button>
              </div>
            </div>

            {/* Swatch grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: paletteTab === 'rgb' ? 'repeat(8, 1fr)' : 'repeat(6, 1fr)',
                gap: 5,
                marginTop: 2
              }}
            >
              {(paletteTab === 'rgb' ? RGB_PALETTES.primaryRGB : RGB_PALETTES.botanical).map((item) => {
                const swatchRgb = parseToRgb(item.rgb);
                const isSelected =
                  currentRgb.r === swatchRgb.r &&
                  currentRgb.g === swatchRgb.g &&
                  currentRgb.b === swatchRgb.b;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleColorChange(item.rgb)}
                    title={`${item.name} • ${item.rgb}`}
                    style={{
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: item.hex,
                      border: isSelected ? '2px solid #30312D' : '2px solid #FFFFFF',
                      boxShadow: isSelected ? '0 0 0 1px #777D5E' : '0 1px 3px rgba(0,0,0,0.12)',
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SIZE / STROKE WIDTH SECTION */}
      {!isEraserContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#4E504A' }}>Size</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#79766F' }}>
              {activeTool === 'pen' && !selectedObject
                ? `${Math.max(3.5, Math.round(currentSize * 1.35 * 10) / 10)} px (Ink)`
                : activeTool === 'pencil' && !selectedObject
                ? `${Math.max(1.2, Math.round(currentSize * 0.42 * 10) / 10)} px (Lead)`
                : activeTool === 'marker' && !selectedObject
                ? `${Math.max(24, Math.round(currentSize * 4.5))} px (Chisel)`
                : `${currentSize} px`}
            </span>
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

      {/* OPACITY SECTION */}
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
