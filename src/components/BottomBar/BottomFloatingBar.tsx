import React, { useState, useRef, useEffect } from 'react';
import {
  Minus,
  Plus,
  Maximize2,
  ChevronDown,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import type { BackgroundPreset } from '../../types/canvas';
import { useIsMobile } from '../../hooks/useIsMobile';

interface BottomFloatingBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitScreen: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  backgroundColor: string;
  onChangeBackgroundColor: (color: string) => void;
}

const BG_PRESETS: { name: string; color: BackgroundPreset }[] = [
  { name: 'Warm White', color: '#FFFEFA' },
  { name: 'Pure White', color: '#FFFFFF' },
  { name: 'Cream Ivory', color: '#F7F3E9' },
  { name: 'Light Gray', color: '#F0F0EB' },
  { name: 'Pale Sage', color: '#EAEEDD' },
  { name: 'Soft Peach', color: '#FCEEE7' }
];

export const BottomFloatingBar: React.FC<BottomFloatingBarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitScreen,
  showGrid,
  onToggleGrid,
  backgroundColor,
  onChangeBackgroundColor
}) => {
  const isMobile = useIsMobile(768);
  const [showBgDropdown, setShowBgDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowBgDropdown(false);
      }
    };
    if (showBgDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBgDropdown]);

  const zoomPercent = Math.round(zoom * 100);

  return (
    <nav
      style={{
        position: isMobile ? 'fixed' : 'absolute',
        bottom: isMobile ? 68 : 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 35,
        backgroundColor: 'rgba(253, 251, 247, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid #E8DED2',
        borderRadius: 9999,
        padding: isMobile ? '3px 8px' : '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 6 : 12,
        boxShadow: '0 8px 30px -4px rgba(70, 60, 45, 0.08), 0 2px 8px rgba(70, 60, 45, 0.04)',
        height: isMobile ? 38 : 48
      }}
      aria-label="Canvas View Controls"
    >
      {/* Zoom Controls: [- 100% +] */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={onZoomOut}
          title="Zoom Out (⌘-)"
          style={iconBtnStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DE')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Minus size={15} color="#4A4B46" />
        </button>

        <button
          onClick={onResetZoom}
          title="Reset Zoom to 100% (⌘0)"
          style={{
            fontSize: 12.5,
            fontWeight: 550,
            color: '#30312D',
            padding: '2px 6px',
            borderRadius: 6,
            minWidth: 46,
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DE')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {zoomPercent}%
        </button>

        <button
          onClick={onZoomIn}
          title="Zoom In (⌘+)"
          style={iconBtnStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DE')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Plus size={15} color="#4A4B46" />
        </button>
      </div>

      <div style={dividerStyle} />

      {/* Fit to Screen Button matching Reference Image 1 */}
      <button
        onClick={onFitScreen}
        title="Fit artwork to screen"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          borderRadius: 8,
          fontSize: 12.5,
          fontWeight: 500,
          color: '#30312D',
          cursor: 'pointer',
          transition: 'background-color 0.15s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DE')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <Maximize2 size={15} color="#676B55" />
        <span>Fit</span>
      </button>

      <div style={dividerStyle} />

      {!isMobile && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleGrid();
            }}
            title={showGrid ? 'Hide Grid Guide' : 'Show Grid Guide'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              padding: '4px 6px',
              borderRadius: 8,
              cursor: 'pointer',
              outline: 'none',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DE')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div
              className={`switch-track ${showGrid ? 'active' : ''}`}
              style={{ pointerEvents: 'none' }}
            >
              <div className="switch-thumb" />
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: '#30312D' }}>Grid</span>
          </button>

          <div style={dividerStyle} />
        </>
      )}

      {/* Background Dropdown matching Reference Image 1 */}
      <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
        {!isMobile && (
          <button
            onClick={() => setShowBgDropdown(!showBgDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 8px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 500,
              color: '#30312D',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DE')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ImageIcon size={15} color="#676B55" />
            <span>Background</span>
            <ChevronDown size={13} color="#79766F" style={{ transform: showBgDropdown ? 'rotate(180deg)' : 'none' }} />
          </button>
        )}

        {/* Selected background color preview swatch with dropdown arrow */}
        <button
          onClick={() => setShowBgDropdown(!showBgDropdown)}
          title="Change canvas background color"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 6px',
            borderRadius: 8,
            border: '1px solid #E8DFD3',
            backgroundColor: '#FAF5EE',
            cursor: 'pointer'
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              backgroundColor: backgroundColor,
              border: '1px solid #DED6CA',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)'
            }}
          />
          <ChevronDown size={12} color="#8A857A" />
        </button>

        {showBgDropdown && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              right: 0,
              width: 200,
              backgroundColor: '#FFFEFA',
              border: '1px solid #E8DED2',
              borderRadius: 14,
              padding: '6px 0',
              boxShadow: '0 8px 24px -4px rgba(70, 60, 45, 0.12)',
              zIndex: 100,
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            <div
              style={{
                padding: '4px 12px 6px',
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#8A857A',
                letterSpacing: '0.6px'
              }}
            >
              Canvas Surface
            </div>
            {BG_PRESETS.map((preset) => {
              const isSelected = backgroundColor.toLowerCase() === preset.color.toLowerCase();
              return (
                <button
                  key={preset.color}
                  onClick={() => {
                    onChangeBackgroundColor(preset.color);
                    setShowBgDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    fontSize: 12.5,
                    color: '#30312D',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F2EA')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        backgroundColor: preset.color,
                        border: '1px solid #D8CFC3'
                      }}
                    />
                    <span>{preset.name}</span>
                  </div>
                  {isSelected && <Check size={14} color="#777D5E" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

const iconBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease'
};

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 20,
  backgroundColor: '#E5DCD0'
};
