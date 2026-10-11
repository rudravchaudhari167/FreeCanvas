import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
  onClick: () => void;
}

interface DropdownMenuProps {
  label: string;
  items: MenuItem[];
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 12px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          color: '#30312D',
          backgroundColor: isOpen ? '#EFEAE1' : 'transparent',
          transition: 'all 0.15s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = '#F3ECE2';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span>{label}</span>
        <ChevronDown size={14} color="#79766F" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: 200,
            backgroundColor: '#FFFEFA',
            border: '1px solid #E8DED2',
            borderRadius: 12,
            boxShadow: '0 8px 24px -4px rgba(60, 50, 40, 0.12), 0 2px 6px rgba(60, 50, 40, 0.04)',
            padding: '6px 0',
            zIndex: 1000,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`div-${index}`}
                  style={{
                    height: 1,
                    backgroundColor: '#EFE8DE',
                    margin: '4px 0'
                  }}
                />
              );
            }

            return (
              <button
                key={item.label}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 450,
                  color: item.disabled ? '#B5B1A8' : item.danger ? '#C24D3E' : '#30312D',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.1s ease'
                }}
                onMouseEnter={(e) => {
                  if (!item.disabled) {
                    e.currentTarget.style.backgroundColor = item.danger ? '#FDF2F0' : '#F7F2EA';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span style={{ fontSize: 11, color: '#A09C94', letterSpacing: '0.2px' }}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
