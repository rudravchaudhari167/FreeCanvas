import React from 'react';
import {
  X,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Trash2
} from 'lucide-react';
import type { LayerItem } from '../../types/canvas';
import { Canvas as FabricCanvas } from 'fabric';

interface LayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerItem[];
  fabricCanvas: FabricCanvas | null;
  onRefreshLayers: () => void;
}

export const LayersModal: React.FC<LayersModalProps> = ({
  isOpen,
  onClose,
  layers,
  fabricCanvas,
  onRefreshLayers
}) => {
  if (!isOpen) return null;

  const handleToggleVisibility = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    const objs = fabricCanvas.getObjects();
    const target = objs[layer.zIndex];
    if (target) {
      target.visible = !target.visible;
      fabricCanvas.renderAll();
      onRefreshLayers();
    }
  };

  const handleToggleLock = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    const objs = fabricCanvas.getObjects();
    const target = objs[layer.zIndex];
    if (target) {
      const nextLocked = !target.lockMovementX;
      target.lockMovementX = nextLocked;
      target.lockMovementY = nextLocked;
      target.lockRotation = nextLocked;
      target.lockScalingX = nextLocked;
      target.lockScalingY = nextLocked;
      fabricCanvas.renderAll();
      onRefreshLayers();
    }
  };

  const handleSelect = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    const objs = fabricCanvas.getObjects();
    const target = objs[layer.zIndex];
    if (target) {
      fabricCanvas.setActiveObject(target);
      fabricCanvas.renderAll();
      onClose();
    }
  };

  const handleDelete = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    const objs = fabricCanvas.getObjects();
    const target = objs[layer.zIndex];
    if (target) {
      fabricCanvas.remove(target);
      fabricCanvas.renderAll();
      onRefreshLayers();
    }
  };

  const handleMoveUp = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    const objs = fabricCanvas.getObjects();
    const target = objs[layer.zIndex];
    if (target) {
      fabricCanvas.bringObjectForward(target);
      fabricCanvas.renderAll();
      onRefreshLayers();
    }
  };

  const handleMoveDown = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    const objs = fabricCanvas.getObjects();
    const target = objs[layer.zIndex];
    if (target) {
      fabricCanvas.sendObjectBackwards(target);
      fabricCanvas.renderAll();
      onRefreshLayers();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: 440, maxHeight: 520 }}
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
            <Layers size={18} color="#5E6547" />
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#30312D' }}>
              Layers & Objects ({layers.length})
            </h2>
          </div>
          <button onClick={onClose} style={{ cursor: 'pointer', color: '#79766F' }}>
            <X size={18} />
          </button>
        </div>

        {/* Layer list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {layers.length === 0 ? (
            <div
              style={{
                padding: '40px 0',
                textAlign: 'center',
                color: '#8A857A',
                fontSize: 13
              }}
            >
              Canvas is currently empty.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {layers.map((layer) => (
                <div
                  key={layer.id + layer.zIndex}
                  onClick={() => handleSelect(layer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 10,
                    backgroundColor: '#FAF6F0',
                    border: '1px solid #EBE2D5',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5EFE5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAF6F0')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#30312D' }}>
                      {layer.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        backgroundColor: '#EAE4D9',
                        color: '#6F6A60',
                        padding: '2px 6px',
                        borderRadius: 4
                      }}
                    >
                      {layer.type}
                    </span>
                  </div>

                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleToggleVisibility(layer)}
                      title={layer.visible ? 'Hide layer' : 'Show layer'}
                      style={{ padding: 4, color: layer.visible ? '#5E6547' : '#A8A49C', cursor: 'pointer' }}
                    >
                      {layer.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>

                    <button
                      onClick={() => handleToggleLock(layer)}
                      title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                      style={{ padding: 4, color: layer.locked ? '#D99379' : '#A8A49C', cursor: 'pointer' }}
                    >
                      {layer.locked ? <Lock size={15} /> : <Unlock size={15} />}
                    </button>

                    <button
                      onClick={() => handleMoveUp(layer)}
                      title="Move up"
                      style={{ padding: 4, color: '#6A675F', cursor: 'pointer' }}
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      onClick={() => handleMoveDown(layer)}
                      title="Move down"
                      style={{ padding: 4, color: '#6A675F', cursor: 'pointer' }}
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(layer)}
                      title="Delete layer"
                      style={{ padding: 4, color: '#C24D3E', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
