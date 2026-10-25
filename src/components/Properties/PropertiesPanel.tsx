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
  Lock,
  Unlock,
  Copy,
  Trash2,
  Check,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react';
import type {
  ToolType,
  ToolSettings,
  SelectedObjectProperties,
  LineStyle
} from '../../types/canvas';
import { TEXT_STYLES, FONT_CATEGORIES } from '../../constants/fonts';
import { useIsMobile } from '../../hooks/useIsMobile';
import { STICKY_SIZE_PRESETS } from '../../services/stickyNoteService';
import {
  SHAPE_DEFINITIONS,
  SHAPE_CATEGORIES,
  getShapeName,
  type ShapeCategory
} from '../../constants/shapes';

interface PropertiesPanelProps {
  activeTool: ToolType;
  settings: ToolSettings;
  selectedObject: SelectedObjectProperties | null;
  onUpdateSettings: (newSettings: Partial<ToolSettings>) => void;
  onUpdateSelectedObject: (props: Partial<SelectedObjectProperties>) => void;
  onDuplicateSelected: () => void;
  onDeleteSelected: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onToggleLock: () => void;
  onClose?: () => void;
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

// Curated 14 swatches: Row 1 RGB Spectrum & Row 2 Botanical Earthy
export const CURATED_SWATCHES = [
  // Row 1: RGB Spectrum & Modern Accents
  { name: 'Red', hex: '#D84C4C', rgb: 'rgb(216, 76, 76)' },
  { name: 'Green', hex: '#2E8B57', rgb: 'rgb(46, 139, 87)' },
  { name: 'Blue', hex: '#3B7AC4', rgb: 'rgb(59, 122, 196)' },
  { name: 'Amber', hex: '#D9822B', rgb: 'rgb(217, 130, 43)' },
  { name: 'Purple', hex: '#7E68AA', rgb: 'rgb(126, 104, 170)' },
  { name: 'Pure White', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
  { name: 'Charcoal Slate', hex: '#2B2D2F', rgb: 'rgb(43, 45, 47)' },
  // Row 2: Botanical & Warm Earth Tones
  { name: 'Sage Green', hex: '#777D5E', rgb: 'rgb(119, 125, 94)' },
  { name: 'Warm Blush', hex: '#E8C8B5', rgb: 'rgb(232, 200, 181)' },
  { name: 'Terracotta', hex: '#CC7A60', rgb: 'rgb(204, 122, 96)' },
  { name: 'Muted Lavender', hex: '#A09EC4', rgb: 'rgb(160, 158, 196)' },
  { name: 'Soft Sky', hex: '#9CB4CE', rgb: 'rgb(156, 180, 206)' },
  { name: 'Warm Cream', hex: '#F4EBD9', rgb: 'rgb(244, 235, 217)' },
  { name: 'Deep Earth', hex: '#4A4B46', rgb: 'rgb(74, 75, 70)' }
];

export const TEXT_QUICK_SWATCHES = [
  { name: 'Charcoal', hex: '#2B2D2F' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Crimson', hex: '#D84C4C' },
  { name: 'Botanical Green', hex: '#3D6B35' },
  { name: 'Ocean Blue', hex: '#2B6CB0' },
  { name: 'Terracotta', hex: '#CC7A60' },
  { name: 'Royal Purple', hex: '#7E68AA' },
  { name: 'Golden Amber', hex: '#D9822B' },
  { name: 'Deep Forest', hex: '#1C402E' },
  { name: 'Rose Pink', hex: '#D15876' }
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  activeTool,
  settings,
  selectedObject,
  onUpdateSettings,
  onUpdateSelectedObject,
  onDuplicateSelected,
  onDeleteSelected,
  onToggleLock,
  onClose
}) => {
  const isMobile = useIsMobile(768);
  const [showHexInput, setShowHexInput] = useState(false);
  const [hexValue, setHexValue] = useState(settings.color);
  const [colorMode, setColorMode] = useState<'rgb' | 'hex'>('rgb');
  const [copiedRgb, setCopiedRgb] = useState(false);
  const [shapeTarget, setShapeTarget] = useState<'fill' | 'stroke'>('fill');
  const [stickyColorTarget, setStickyColorTarget] = useState<'note' | 'text'>('note');
  const [selectedShapeCategory, setSelectedShapeCategory] = useState<ShapeCategory>('all');

  const isStickyContext =
    activeTool === 'sticky' ||
    selectedObject?.type === 'group' ||
    !!selectedObject?.isStickyNote;
  const isTextContext =
    !isStickyContext &&
    (activeTool === 'text' ||
      selectedObject?.type === 'i-text' ||
      selectedObject?.type === 'text' ||
      selectedObject?.type === 'textbox');
  const hasTextProperties =
    isTextContext ||
    isStickyContext ||
    (selectedObject?.type === 'group' && selectedObject?.text !== undefined) ||
    selectedObject?.text !== undefined;
  const isShapeContext =
    activeTool === 'shape' ||
    ['rect', 'circle', 'ellipse', 'triangle', 'polygon', 'path'].includes(selectedObject?.type || '') ||
    !!selectedObject?.shapeType;
  const isEraserContext = activeTool === 'eraser' && !selectedObject;
  const isLineContext = activeTool === 'line' || activeTool === 'arrow' || selectedObject?.type === 'line';

  // Determine current active color
  let currentColor = settings.color;
  if (selectedObject) {
    if (isShapeContext) {
      currentColor =
        shapeTarget === 'fill'
          ? (selectedObject.fill || settings.color)
          : (selectedObject.stroke || settings.strokeColor || '#5E6547');
    } else if (isStickyContext) {
      if (stickyColorTarget === 'text') {
        currentColor = selectedObject.textColor || settings.color || '#30312D';
      } else {
        currentColor = selectedObject.backgroundColor || selectedObject.fill || settings.stickyColor || '#FAF0D7';
      }
    } else if (isTextContext) {
      currentColor = selectedObject.textColor || selectedObject.fill || settings.color;
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
      if (stickyColorTarget === 'text') {
        currentColor = settings.color || '#30312D';
      } else {
        currentColor = settings.stickyColor || '#FAF0D7';
      }
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
        onUpdateSelectedObject({ fill: newColor, textColor: newColor });
      }
    } else if (isStickyContext) {
      if (stickyColorTarget === 'text') {
        onUpdateSettings({ color: newColor });
        if (selectedObject) {
          onUpdateSelectedObject({ textColor: newColor });
        }
      } else {
        onUpdateSettings({ stickyColor: newColor });
        if (selectedObject) {
          onUpdateSelectedObject({ backgroundColor: newColor });
        }
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

  const handleTextColorChange = (newColor: string) => {
    onUpdateSettings({ color: newColor });
    if (selectedObject) {
      onUpdateSelectedObject({ textColor: newColor });
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
      if (selectedObject.isStickyNote) return 'Sticky Note';
      const type = selectedObject.type || '';
      if (type === 'activeselection') return 'All Selected Items';
      if (type === 'group') return 'Sticker';
      if (type === 'i-text' || type === 'text' || type === 'textbox') return 'Text';
      if (selectedObject.shapeType) return getShapeName(selectedObject.shapeType);
      if (type === 'rect') return 'Rectangle';
      if (type === 'circle') return 'Circle';
      if (type === 'ellipse') return 'Ellipse';
      if (type === 'triangle') return 'Triangle';
      if (type === 'polygon') return 'Polygon';
      if (type === 'path') return 'Shape / Path';
      if (type === 'line') return 'Line';
      return 'Selected Item';
    }
    if (activeTool === 'pen') return 'Smooth Pen';
    if (activeTool === 'pencil') return 'Sketch Pencil';
    if (activeTool === 'marker') return 'Highlighter';
    if (activeTool === 'text') return 'Text Tool';
    if (activeTool === 'shape') {
      return getShapeName(settings.shapeType);
    }
    if (activeTool === 'line') return 'Straight Line';
    if (activeTool === 'arrow') return 'Arrow Connector';
    if (activeTool === 'sticky') return 'Sticky Note';
    if (activeTool === 'eraser') return 'Eraser';
    return 'Workspace';
  };

  return (
    <aside
      className={isMobile ? 'mobile-bottom-sheet' : undefined}
      style={{
        position: isMobile ? 'fixed' : 'absolute',
        top: isMobile ? 'auto' : 96,
        bottom: isMobile ? 0 : 'auto',
        left: isMobile ? 0 : 'auto',
        right: isMobile ? 0 : 24,
        zIndex: 60,
        width: isMobile ? '100vw' : 254,
        maxWidth: isMobile ? '100vw' : undefined,
        backgroundColor: 'rgba(253, 251, 247, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid #E8DED2',
        borderBottom: isMobile ? 'none' : '1px solid #E8DED2',
        borderRadius: isMobile ? '24px 24px 0 0' : 22,
        padding: isMobile ? '10px 18px 28px 18px' : '16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 13,
        boxShadow: isMobile
          ? '0 -10px 40px rgba(0, 0, 0, 0.16)'
          : '0 12px 34px -4px rgba(70, 60, 45, 0.08), 0 2px 8px rgba(70, 60, 45, 0.04)',
        maxHeight: isMobile ? '76vh' : 'calc(100vh - 150px)',
        overflowY: 'auto'
      }}
      aria-label="Properties Panel"
    >
      {/* Mobile Grab Handle */}
      {isMobile && (
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#D5CBBF',
            margin: '0 auto 4px auto'
          }}
        />
      )}

      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Sliders size={16} color="#4A4B46" />
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#30312D',
              letterSpacing: '-0.2px'
            }}
          >
            Properties
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 550,
              color: '#676C4F',
              backgroundColor: '#EEF0E5',
              padding: '2.5px 7px',
              borderRadius: 6,
              letterSpacing: '0.2px'
            }}
          >
            {getItemBadgeLabel()}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close Properties"
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FAF5EE',
                border: '1px solid #E2D7C8',
                color: '#55534E',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* AESTHETIC & MINIMAL COLOR SECTION */}
      {!isEraserContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Header Row: Context Label + Clean Micro Segmented Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4E504A', letterSpacing: '-0.1px' }}>
              {isShapeContext
                ? shapeTarget === 'fill' ? 'Fill Color' : 'Border Color'
                : isTextContext
                ? 'Text Color'
                : isStickyContext
                ? 'Note Color'
                : isLineContext
                ? 'Line Color'
                : 'Color'}
            </span>

            {/* Understated micro pill: RGB / HEX */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#EFEAE0',
                borderRadius: 999,
                padding: '1.5px',
                border: '1px solid #E2D9CC'
              }}
            >
              <button
                type="button"
                onClick={() => setColorMode('rgb')}
                style={{
                  padding: '1.5px 7px',
                  borderRadius: 999,
                  fontSize: 9.5,
                  fontWeight: 650,
                  letterSpacing: '0.4px',
                  border: 'none',
                  backgroundColor: colorMode === 'rgb' ? '#FFFFFF' : 'transparent',
                  color: colorMode === 'rgb' ? '#30312D' : '#8A857A',
                  boxShadow: colorMode === 'rgb' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                RGB
              </button>
              <button
                type="button"
                onClick={() => setColorMode('hex')}
                style={{
                  padding: '1.5px 7px',
                  borderRadius: 999,
                  fontSize: 9.5,
                  fontWeight: 650,
                  letterSpacing: '0.4px',
                  border: 'none',
                  backgroundColor: colorMode === 'hex' ? '#FFFFFF' : 'transparent',
                  color: colorMode === 'hex' ? '#30312D' : '#8A857A',
                  boxShadow: colorMode === 'hex' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                HEX
              </button>
            </div>
          </div>

          {/* Shape Dual-Target Tabs (Fill vs Border) */}
          {isShapeContext && (
            <div
              style={{
                display: 'flex',
                backgroundColor: '#EFEAE0',
                borderRadius: 8,
                padding: '2px',
                border: '1px solid #E2D9CC'
              }}
            >
              <button
                type="button"
                onClick={() => setShapeTarget('fill')}
                style={{
                  flex: 1,
                  padding: '3px 0',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: shapeTarget === 'fill' ? 600 : 500,
                  backgroundColor: shapeTarget === 'fill' ? '#FFFFFF' : 'transparent',
                  color: shapeTarget === 'fill' ? '#30312D' : '#8A857A',
                  border: 'none',
                  boxShadow: shapeTarget === 'fill' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Fill
              </button>
              <button
                type="button"
                onClick={() => setShapeTarget('stroke')}
                style={{
                  flex: 1,
                  padding: '3px 0',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: shapeTarget === 'stroke' ? 600 : 500,
                  backgroundColor: shapeTarget === 'stroke' ? '#FFFFFF' : 'transparent',
                  color: shapeTarget === 'stroke' ? '#30312D' : '#8A857A',
                  border: 'none',
                  boxShadow: shapeTarget === 'stroke' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Border
              </button>
            </div>
          )}

          {/* Target Toggle for Sticky Notes & Stickers with text: Note/Base vs Text */}
          {isStickyContext && (
            <div
              style={{
                display: 'flex',
                backgroundColor: '#F0EAE1',
                borderRadius: 8,
                padding: 2,
                gap: 2
              }}
            >
              <button
                type="button"
                onClick={() => setStickyColorTarget('note')}
                style={{
                  flex: 1,
                  padding: '3px 0',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: stickyColorTarget === 'note' ? 600 : 500,
                  backgroundColor: stickyColorTarget === 'note' ? '#FFFFFF' : 'transparent',
                  color: stickyColorTarget === 'note' ? '#30312D' : '#8A857A',
                  border: 'none',
                  boxShadow: stickyColorTarget === 'note' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {selectedObject?.type === 'group' ? 'Sticker Base' : 'Card Color'}
              </button>
              <button
                type="button"
                onClick={() => setStickyColorTarget('text')}
                style={{
                  flex: 1,
                  padding: '3px 0',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: stickyColorTarget === 'text' ? 600 : 500,
                  backgroundColor: stickyColorTarget === 'text' ? '#FFFFFF' : 'transparent',
                  color: stickyColorTarget === 'text' ? '#30312D' : '#8A857A',
                  border: 'none',
                  boxShadow: stickyColorTarget === 'text' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Text Color
              </button>
            </div>
          )}

          {/* Integrated Color Capsule Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FAF6EF',
              border: '1px solid #E8DFD3',
              borderRadius: 11,
              padding: '4px 8px 4px 6px',
              gap: 8,
              transition: 'border-color 0.15s ease'
            }}
          >
            {/* Integrated Circular Swatch */}
            <label
              title="Click to open color picker"
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: currentColor,
                border: '2px solid #FFFFFF',
                boxShadow: '0 1px 4px rgba(48, 49, 45, 0.14), inset 0 0 0 1px rgba(0,0,0,0.06)',
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

            {colorMode === 'rgb' ? (
              <div
                onClick={handleCopyRgb}
                title="Click to copy RGB value"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    color: '#30312D',
                    letterSpacing: '-0.2px'
                  }}
                >
                  rgb({currentRgb.r}, {currentRgb.g}, {currentRgb.b})
                </span>
                {copiedRgb ? (
                  <span style={{ fontSize: 10, color: '#38A169', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 600 }}>
                    <Check size={11} /> Copied
                  </span>
                ) : (
                  <Copy size={12} color="#9E9A90" style={{ opacity: 0.7 }} />
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
                      fontSize: 11.5,
                      fontWeight: 500,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      color: '#30312D'
                    }}
                  />
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 500,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        color: '#30312D'
                      }}
                    >
                      {rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b).toUpperCase()}
                    </span>
                    <ChevronDown size={12} color="#9E9A90" style={{ opacity: 0.7 }} />
                  </>
                )}
              </div>
            )}
          </div>

          {/* SLENDER & UNBOXED RGB CHANNEL SLIDERS */}
          {colorMode === 'rgb' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '2px 0' }}>
              {[
                {
                  key: 'r' as const,
                  label: 'R',
                  val: currentRgb.r,
                  color: '#C24D3E',
                  trackGrad: 'linear-gradient(to right, rgba(194, 77, 62, 0.25), rgba(194, 77, 62, 0.95))'
                },
                {
                  key: 'g' as const,
                  label: 'G',
                  val: currentRgb.g,
                  color: '#427A5B',
                  trackGrad: 'linear-gradient(to right, rgba(66, 122, 91, 0.25), rgba(66, 122, 91, 0.95))'
                },
                {
                  key: 'b' as const,
                  label: 'B',
                  val: currentRgb.b,
                  color: '#4A6FA5',
                  trackGrad: 'linear-gradient(to right, rgba(74, 111, 165, 0.25), rgba(74, 111, 165, 0.95))'
                }
              ].map((ch) => (
                <div key={ch.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: ch.color,
                      width: 11,
                      textAlign: 'center',
                      userSelect: 'none'
                    }}
                  >
                    {ch.label}
                  </span>
                  <input
                    type="range"
                    className="rgb-channel-slider"
                    min="0"
                    max="255"
                    value={ch.val}
                    onChange={(e) => handleRgbChannelChange(ch.key, Number(e.target.value))}
                    style={{
                      flex: 1,
                      background: ch.trackGrad
                    }}
                  />
                  <input
                    type="number"
                    className="rgb-num-input"
                    min="0"
                    max="255"
                    value={ch.val}
                    onChange={(e) => handleRgbChannelChange(ch.key, Number(e.target.value))}
                    style={{
                      width: 32,
                      padding: '1.5px 0',
                      borderRadius: 4,
                      border: 'none',
                      backgroundColor: 'rgba(235, 227, 215, 0.55)',
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      color: '#30312D',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* REFINED COLOR PALETTE SWATCHES (RGB Spectrum + Earthy in 2 Rows of 7) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9.5, fontWeight: 650, color: '#9E9A90', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                Palette
              </span>
              <span style={{ fontSize: 9.5, color: '#B5AE9F' }}>
                RGB & Botanical
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 6
              }}
            >
              {CURATED_SWATCHES.map((item) => {
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
                      width: '100%',
                      aspectRatio: '1 / 1',
                      padding: 0,
                      borderRadius: '50%',
                      backgroundColor: item.hex,
                      border: isSelected ? '1.5px solid #FFFFFF' : '1px solid rgba(0,0,0,0.06)',
                      boxShadow: isSelected
                        ? '0 0 0 1.5px #FAF6EE, 0 0 0 3px #777D5E, 0 1px 3px rgba(0,0,0,0.1)'
                        : '0 1px 2px rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                      transition: 'all 0.15s ease',
                      boxSizing: 'border-box'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STICKY NOTE SIZE & SCALE SECTION */}
      {selectedObject?.isStickyNote && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: '10px 12px',
            backgroundColor: '#F8F4EC',
            borderRadius: 14,
            border: '1px solid #E6DCCD'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 650, color: '#3E403B' }}>Sticky Note Size</span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: '#676C4F',
                backgroundColor: '#EEF0E5',
                padding: '2px 7px',
                borderRadius: 6
              }}
            >
              {Math.round(selectedObject.width || 200)} × {Math.round(selectedObject.height || 170)} px
            </span>
          </div>

          {/* Quick Preset Buttons (Minimize, Normal, Maximize, XL) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
            {STICKY_SIZE_PRESETS.map((preset) => {
              const currentW = selectedObject.width || 200;
              const isSelected =
                preset.id === 'mini'
                  ? currentW <= 160
                  : preset.id === 'normal'
                  ? currentW > 160 && currentW <= 250
                  : preset.id === 'large'
                  ? currentW > 250 && currentW <= 360
                  : currentW > 360;

              return (
                <button
                  key={preset.id}
                  type="button"
                  title={`${preset.name} (${preset.width}×${preset.height}px, ${preset.fontSize}px text)`}
                  onClick={() =>
                    onUpdateSelectedObject({
                      width: preset.width,
                      height: preset.height,
                      fontSize: preset.fontSize
                    })
                  }
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 3px',
                    borderRadius: 8,
                    border: isSelected ? '1.5px solid #737B5D' : '1px solid #DFD5C6',
                    backgroundColor: isSelected ? '#E2E8D5' : '#FFFDF9',
                    cursor: 'pointer',
                    gap: 2,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {preset.id === 'mini' && <Minimize2 size={13} color="#55584D" />}
                  {preset.id === 'normal' && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#55584D', lineHeight: 1 }}>M</span>
                  )}
                  {preset.id === 'large' && <Maximize2 size={13} color="#55584D" />}
                  {preset.id === 'xl' && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#55584D', lineHeight: 1 }}>XL</span>
                  )}
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: '#4A4C44' }}>{preset.name}</span>
                </button>
              );
            })}
          </div>

          {/* Width Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 550, color: '#5C5E57' }}>Card Width</span>
              <span style={{ fontSize: 10.5, fontWeight: 500, color: '#7E8076' }}>
                {Math.round(selectedObject.width || 200)} px
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="500"
              value={Math.round(selectedObject.width || 200)}
              onChange={(e) => onUpdateSelectedObject({ width: Number(e.target.value) })}
            />
          </div>

          {/* Height Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 550, color: '#5C5E57' }}>Card Height</span>
              <span style={{ fontSize: 10.5, fontWeight: 500, color: '#7E8076' }}>
                {Math.round(selectedObject.height || 170)} px
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="450"
              value={Math.round(selectedObject.height || 170)}
              onChange={(e) => onUpdateSelectedObject({ height: Number(e.target.value) })}
            />
          </div>

          {/* Font Size Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 550, color: '#5C5E57' }}>Text Size</span>
              <span style={{ fontSize: 10.5, fontWeight: 500, color: '#7E8076' }}>
                {Math.round(selectedObject.fontSize || 22)} px
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              value={Math.round(selectedObject.fontSize || 22)}
              onChange={(e) => onUpdateSelectedObject({ fontSize: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      {/* SIZE / STROKE WIDTH SECTION (For tools & non-sticky items) */}
      {!isEraserContext && !selectedObject?.isStickyNote && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4E504A' }}>Size</span>
            <span style={{ fontSize: 11.5, fontWeight: 500, color: '#79766F' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#4E504A' }}>Opacity</span>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: '#79766F' }}>{currentOpacity}%</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 4, borderTop: '1px solid #EBE2D5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11.5, color: '#4E504A' }}>Eraser Size</span>
            <span style={{ fontSize: 11.5, color: '#79766F' }}>{settings.size} px</span>
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
      {hasTextProperties && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 6, borderTop: '1px solid #EBE2D5' }}>
          {/* Direct Text Editor (Mobile-friendly & quick edits) */}
          {selectedObject && (selectedObject.text !== undefined || selectedObject.type === 'textbox' || selectedObject.type === 'i-text' || selectedObject.isStickyNote) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#4E504A' }}>Text Content</span>
                <span style={{ fontSize: 10, color: '#8F8B81' }}>Direct Edit</span>
              </div>
              <textarea
                value={selectedObject.text || ''}
                rows={3}
                placeholder="Type your text here..."
                onChange={(e) => onUpdateSelectedObject({ text: e.target.value })}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #E2D7C8',
                  backgroundColor: '#FAF5EE',
                  fontSize: 13,
                  color: '#30312D',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: (selectedObject.fontFamily || 'Plus Jakarta Sans'),
                  lineHeight: 1.4,
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4E504A' }}>Typography</span>
            <span style={{ fontSize: 10, fontWeight: 500, color: '#8F8B81' }}>50 Styles</span>
          </div>

          {/* Font Family selector */}
          {(() => {
            const rawFont = (selectedObject?.fontFamily || settings.fontFamily || 'Plus Jakarta Sans').replace(/['"]/g, '').split(',')[0].trim();
            const matchedFont = TEXT_STYLES.find((f) => f.family.toLowerCase() === rawFont.toLowerCase())?.family || 'Plus Jakarta Sans';

            return (
              <select
                value={matchedFont}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const font = e.target.value;
                  onUpdateSettings({ fontFamily: font });
                  onUpdateSelectedObject({ fontFamily: font });
                  e.target.blur();
                }}
                style={{
                  padding: '6px 9px',
                  borderRadius: 8,
                  border: '1px solid #E8DFD3',
                  backgroundColor: '#FAF5EE',
                  fontSize: 12,
                  color: '#30312D',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: matchedFont
                }}
              >
                {FONT_CATEGORIES.map((cat) => (
                  <optgroup key={cat} label={cat}>
                    {TEXT_STYLES.filter((f) => f.category === cat).map((f) => (
                      <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
                        {f.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            );
          })()}

          {/* Bold, Italic, Underline buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            {/* Bold */}
            <button
              type="button"
              title="Bold"
              onClick={() => {
                const isCurrentlyBold = selectedObject
                  ? selectedObject.fontWeight === 'bold' || selectedObject.fontWeight === 700 || selectedObject.fontWeight === '700'
                  : settings.isBold;
                const next = !isCurrentlyBold;
                onUpdateSettings({ isBold: next });
                if (selectedObject) onUpdateSelectedObject({ fontWeight: next ? 'bold' : 'normal' });
              }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 7,
                backgroundColor: (selectedObject
                  ? selectedObject.fontWeight === 'bold' || selectedObject.fontWeight === 700 || selectedObject.fontWeight === '700'
                  : settings.isBold)
                  ? '#C9D0BD'
                  : '#F5EFE5',
                color: '#30312D',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
            >
              <Bold size={14} />
            </button>

            {/* Italic */}
            <button
              type="button"
              title="Italic"
              onClick={() => {
                const isCurrentlyItalic = selectedObject
                  ? selectedObject.fontStyle === 'italic'
                  : settings.isItalic;
                const next = !isCurrentlyItalic;
                onUpdateSettings({ isItalic: next });
                if (selectedObject) onUpdateSelectedObject({ fontStyle: next ? 'italic' : 'normal' });
              }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 7,
                backgroundColor: (selectedObject ? selectedObject.fontStyle === 'italic' : settings.isItalic)
                  ? '#C9D0BD'
                  : '#F5EFE5',
                color: '#30312D',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
            >
              <Italic size={14} />
            </button>

            {/* Underline */}
            <button
              type="button"
              title="Underline"
              onClick={() => {
                const isCurrentlyUnderline = selectedObject
                  ? !!selectedObject.underline
                  : settings.isUnderline;
                const next = !isCurrentlyUnderline;
                onUpdateSettings({ isUnderline: next });
                if (selectedObject) onUpdateSelectedObject({ underline: next });
              }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 7,
                backgroundColor: (selectedObject ? !!selectedObject.underline : settings.isUnderline)
                  ? '#C9D0BD'
                  : '#F5EFE5',
                color: '#30312D',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
            >
              <Underline size={14} />
            </button>
          </div>

          {/* Alignment */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['left', 'center', 'right'] as const).map((align) => {
              const currentAlign = (selectedObject && selectedObject.textAlign) ? selectedObject.textAlign : (settings.textAlign || 'left');
              const isSelected = currentAlign === align;

              return (
                <button
                  key={align}
                  type="button"
                  title={align === 'left' ? 'Align Left' : align === 'center' ? 'Align Center' : 'Align Right'}
                  onClick={() => {
                    onUpdateSettings({ textAlign: align });
                    if (selectedObject) onUpdateSelectedObject({ textAlign: align });
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: 7,
                    border: 'none',
                    backgroundColor: isSelected ? '#C9D0BD' : '#F5EFE5',
                    color: isSelected ? '#252623' : '#6A675F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {align === 'left' && <AlignLeft size={14} />}
                  {align === 'center' && <AlignCenter size={14} />}
                  {align === 'right' && <AlignRight size={14} />}
                </button>
              );
            })}
          </div>

          {/* Dedicated Text Color Option */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 6, borderTop: '1px solid #F0EAE1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: '#4E504A' }}>Text Color</span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontWeight: 600,
                  color: '#6E6B62',
                  backgroundColor: '#F5EFE5',
                  padding: '2px 5px',
                  borderRadius: 4
                }}
              >
                {(selectedObject?.textColor || (isTextContext ? selectedObject?.fill : undefined) || settings.color || '#30312D').toUpperCase()}
              </span>
            </div>

            {/* Swatch row with custom color picker button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {/* Custom native color picker button */}
              <label
                title="Pick custom text color"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: selectedObject?.textColor || (isTextContext ? selectedObject?.fill : undefined) || settings.color || '#30312D',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <input
                  type="color"
                  value={rgbToHex(
                    parseToRgb(selectedObject?.textColor || (isTextContext ? selectedObject?.fill : undefined) || settings.color || '#30312D').r,
                    parseToRgb(selectedObject?.textColor || (isTextContext ? selectedObject?.fill : undefined) || settings.color || '#30312D').g,
                    parseToRgb(selectedObject?.textColor || (isTextContext ? selectedObject?.fill : undefined) || settings.color || '#30312D').b
                  )}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                />
              </label>

              {/* Quick swatches */}
              {TEXT_QUICK_SWATCHES.map((swatch) => {
                const currentActiveText = (
                  selectedObject?.textColor ||
                  (isTextContext ? selectedObject?.fill : undefined) ||
                  settings.color ||
                  '#30312D'
                ).toLowerCase();
                const isMatch = currentActiveText === swatch.hex.toLowerCase();

                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    title={swatch.name}
                    onClick={() => handleTextColorChange(swatch.hex)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: swatch.hex,
                      border: isMatch ? '2px solid #5E6547' : '1.5px solid #FFFFFF',
                      boxShadow: isMatch ? '0 0 0 1.5px #5E6547, 0 1px 2px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.12)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isMatch ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isMatch && (
                      <Check
                        size={10}
                        color={['#FFFFFF', '#FAF0D7', '#F4EBD9'].includes(swatch.hex) ? '#30312D' : '#FFFFFF'}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SHAPE SPECIFIC SETTINGS */}
      {isShapeContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 6, borderTop: '1px solid #EBE2D5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4E504A' }}>Geometric Shapes</span>
            <span style={{ fontSize: 11, color: '#888B7E', textTransform: 'capitalize' }}>
              {getShapeName(selectedObject?.shapeType || settings.shapeType)}
            </span>
          </div>

          {/* Category filter pills */}
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {SHAPE_CATEGORIES.map((cat) => {
              const isCatActive = selectedShapeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedShapeCategory(cat.id)}
                  style={{
                    padding: '3px 7px',
                    borderRadius: 6,
                    fontSize: 10.5,
                    fontWeight: isCatActive ? 600 : 500,
                    border: 'none',
                    backgroundColor: isCatActive ? '#5E6547' : '#F0E8DC',
                    color: isCatActive ? '#FFFFFF' : '#686B5E',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Shape Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 5,
              maxHeight: 180,
              overflowY: 'auto',
              paddingRight: 2
            }}
          >
            {SHAPE_DEFINITIONS.filter(
              (s) => selectedShapeCategory === 'all' || s.category === selectedShapeCategory
            ).map((shape) => {
              const currentActiveShape = selectedObject?.shapeType || settings.shapeType;
              const isSelected = currentActiveShape === shape.id;
              return (
                <button
                  key={shape.id}
                  title={shape.name}
                  onClick={() => {
                    onUpdateSettings({ shapeType: shape.id });
                    if (activeTool === 'select' && selectedObject) {
                      onUpdateSelectedObject({ shapeType: shape.id });
                    }
                  }}
                  style={{
                    padding: '7px 3px',
                    borderRadius: 7,
                    border: isSelected ? '1px solid #777D5E' : '1px solid transparent',
                    backgroundColor: isSelected ? '#C9D0BD' : '#F5EFE5',
                    color: isSelected ? '#282C1E' : '#4E504A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {shape.icon}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* LINE SPECIFIC SETTINGS */}
      {isLineContext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 6, borderTop: '1px solid #EBE2D5' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#4E504A' }}>Line Style</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['solid', 'dashed', 'dotted'] as LineStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => onUpdateSettings({ lineStyle: style })}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: 500,
                  border: 'none',
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

      {/* SELECTED ACTIONS (Lock, Layering, Duplicate, Delete) */}
      {selectedObject && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 6, borderTop: '1px solid #EBE2D5' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#4E504A' }}>Actions</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={onToggleLock}
              title={selectedObject.isLocked ? 'Unlock' : 'Lock'}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 7,
                border: 'none',
                backgroundColor: selectedObject.isLocked ? '#EED4C5' : '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {selectedObject.isLocked ? <Lock size={14} color="#D99379" /> : <Unlock size={14} />}
            </button>

            <button
              onClick={onDuplicateSelected}
              title="Duplicate (⌘D)"
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 7,
                border: 'none',
                backgroundColor: '#F5EFE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Copy size={14} />
            </button>

            <button
              onClick={onDeleteSelected}
              title="Delete Object"
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 7,
                border: 'none',
                backgroundColor: '#FDF2F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} color="#C24D3E" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
