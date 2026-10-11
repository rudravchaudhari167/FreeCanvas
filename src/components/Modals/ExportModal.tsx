import React, { useState } from 'react';
import { X, Download, FileImage } from 'lucide-react';
import { Canvas as FabricCanvas } from 'fabric';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  fabricCanvas: FabricCanvas | null;
  onToast: (msg: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projectName,
  fabricCanvas,
  onToast
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [transparent, setTransparent] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(2);
  const [filename, setFilename] = useState<string>(projectName || 'my-artwork');

  if (!isOpen) return null;

  const handleExport = () => {
    if (!fabricCanvas) {
      alert('Canvas is not ready for export.');
      return;
    }

    try {
      const originalBg = fabricCanvas.backgroundColor;

      // If transparent PNG requested, clear canvas background temporarily
      if (format === 'png' && transparent) {
        fabricCanvas.backgroundColor = '';
        fabricCanvas.renderAll();
      }

      const dataUrl = fabricCanvas.toDataURL({
        format: format === 'png' ? 'png' : 'jpeg',
        quality: 0.95,
        multiplier: multiplier
      });

      // Restore background
      fabricCanvas.backgroundColor = originalBg;
      fabricCanvas.renderAll();

      // Trigger download
      const link = document.createElement('a');
      link.download = `${filename.trim() || 'artwork'}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger confetti celebration
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#777D5E', '#D99379', '#EED4C5', '#A9BDD9']
      });

      onToast(`Exported "${link.download}" successfully!`);
      onClose();
    } catch (err) {
      console.error('Failed to export artwork:', err);
      alert('Failed to export image. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #E8DED2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAF5EE'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#D8DAC7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5E6547'
              }}
            >
              <Download size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#30312D' }}>
                Export Artwork
              </h2>
              <p style={{ fontSize: 12, color: '#79766F' }}>
                Save your creation to high quality image
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#79766F',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Controls */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Filename */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 550, color: '#4E504A' }}>
              File Name
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="my-artwork"
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #E8DFD3',
                backgroundColor: '#FAF5EE',
                fontSize: 13,
                color: '#30312D',
                outline: 'none'
              }}
            />
          </div>

          {/* Format selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 550, color: '#4E504A' }}>
              Format
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setFormat('png')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  backgroundColor: format === 'png' ? '#5E6547' : '#F5EFE5',
                  color: format === 'png' ? '#FFFEFA' : '#4E504A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease'
                }}
              >
                <FileImage size={15} />
                <span>PNG (Lossless)</span>
              </button>

              <button
                onClick={() => setFormat('jpeg')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  backgroundColor: format === 'jpeg' ? '#5E6547' : '#F5EFE5',
                  color: format === 'jpeg' ? '#FFFEFA' : '#4E504A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease'
                }}
              >
                <FileImage size={15} />
                <span>JPEG (Compressed)</span>
              </button>
            </div>
          </div>

          {/* Scale Resolution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 550, color: '#4E504A' }}>
              Resolution Scale
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { mult: 1, label: '1x (Standard)' },
                { mult: 2, label: '2x (Retina / Sharp)' },
                { mult: 3, label: '3x (Print / Ultra)' }
              ].map((item) => (
                <button
                  key={item.mult}
                  onClick={() => setMultiplier(item.mult)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: multiplier === item.mult ? '#C9D0BD' : '#F5EFE5',
                    color: '#30312D',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transparent Background for PNG */}
          {format === 'png' && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#777D5E', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: '#30312D' }}>
                Transparent background (PNG only)
              </span>
            </label>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 500,
                color: '#79766F',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#5E6547',
                color: '#FFFEFA',
                padding: '9px 20px',
                borderRadius: 12,
                fontSize: 13.5,
                fontWeight: 550,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(94, 101, 71, 0.25)'
              }}
            >
              <Download size={16} />
              <span>Download Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
