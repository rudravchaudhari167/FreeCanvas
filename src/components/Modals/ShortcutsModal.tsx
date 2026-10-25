import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const toolShortcuts = [
    { key: 'V', label: 'Select / Move tool' },
    { key: 'P', label: 'Smooth Pen' },
    { key: 'B', label: 'Sketch Pencil' },
    { key: 'M', label: 'Marker / Highlighter' },
    { key: 'E', label: 'Eraser' },
    { key: 'T', label: 'Text tool' },
    { key: 'S', label: 'Shape tool' },
    { key: 'I', label: 'Image / Gallery' },
    { key: 'L', label: 'Straight Line' }
  ];

  const actionShortcuts = [
    { key: '⌘ / Ctrl + Z', label: 'Undo previous action' },
    { key: '⌘ / Ctrl + ⇧ + Z', label: 'Redo undone action' },
    { key: '⌘ / Ctrl + S', label: 'Save project locally' },
    { key: '⌘ / Ctrl + E', label: 'Export artwork' },
    { key: '⌘ / Ctrl + D', label: 'Duplicate selected item' },
    { key: 'Delete / Backspace', label: 'Delete selected item' },
    { key: 'Space + Drag', label: 'Pan around workspace' },
    { key: 'Scroll Wheel', label: 'Zoom in and out' },
    { key: '⌘ / Ctrl + 0', label: 'Reset zoom to 100%' },
    { key: '⌘ / Ctrl + 1', label: 'Fit artwork to screen' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: 560, maxWidth: '94vw', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E8DED2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAF5EE'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Keyboard size={18} color="#5E6547" />
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#30312D' }}>
              Keyboard Shortcuts
            </h2>
          </div>
          <button onClick={onClose} style={{ cursor: 'pointer', color: '#79766F' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18, maxHeight: 440, overflowY: 'auto' }}>
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#8A857A', marginBottom: 8 }}>
              Drawing Tools
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {toolShortcuts.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 8,
                    backgroundColor: '#FAF6F0',
                    border: '1px solid #EBE2D5',
                    fontSize: 12.5
                  }}
                >
                  <span style={{ color: '#4F4D47' }}>{item.label}</span>
                  <kbd
                    style={{
                      padding: '2px 6px',
                      borderRadius: 4,
                      backgroundColor: '#EBE4D8',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#30312D'
                    }}
                  >
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#8A857A', marginBottom: 8 }}>
              Actions & Navigation
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {actionShortcuts.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 8,
                    backgroundColor: '#FAF6F0',
                    border: '1px solid #EBE2D5',
                    fontSize: 12.5
                  }}
                >
                  <span style={{ color: '#4F4D47' }}>{item.label}</span>
                  <kbd
                    style={{
                      padding: '2px 6px',
                      borderRadius: 4,
                      backgroundColor: '#EBE4D8',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#30312D'
                    }}
                  >
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
