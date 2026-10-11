import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Search,
  Trash2,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import type { GalleryAsset } from '../../types/project';
import {
  getGalleryAssets,
  saveGalleryAsset,
  deleteGalleryAsset
} from '../../services/db';
import { PRESET_ILLUSTRATIONS, PRESET_STICKERS } from '../../services/sampleAssets';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (url: string, name: string) => void;
}

type TabType = 'uploads' | 'illustrations' | 'stickers' | 'recent';

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onInsertImage
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('illustrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [userUploads, setUserUploads] = useState<GalleryAsset[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved user uploads from IndexedDB
  useEffect(() => {
    if (isOpen) {
      loadUploads();
    }
  }, [isOpen]);

  const loadUploads = async () => {
    const assets = await getGalleryAssets('uploads');
    setUserUploads(assets);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, WebP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const newAsset: GalleryAsset = {
        id: 'upload_' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'uploads',
        url: dataUrl,
        type: 'image',
        createdAt: Date.now()
      };

      await saveGalleryAsset(newAsset);
      await loadUploads();
      setActiveTab('uploads');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAsset = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteGalleryAsset(id);
    await loadUploads();
  };

  if (!isOpen) return null;

  // Filter assets based on active tab and search query
  let currentList: GalleryAsset[] = [];
  if (activeTab === 'uploads') currentList = userUploads;
  else if (activeTab === 'illustrations') currentList = PRESET_ILLUSTRATIONS;
  else if (activeTab === 'stickers') currentList = PRESET_STICKERS;
  else if (activeTab === 'recent') currentList = [...userUploads, ...PRESET_ILLUSTRATIONS].slice(0, 8);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    currentList = currentList.filter((item) => item.name.toLowerCase().includes(q));
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: 680, height: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
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
              <Sparkles size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#30312D' }}>
                Creative Botanical Gallery
              </h2>
              <p style={{ fontSize: 12, color: '#79766F' }}>
                Browse curated botanical art, stickers, or upload your own images
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE8DE')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search and Tabs Bar */}
        <div
          style={{
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            borderBottom: '1px solid #F0E8DD'
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'illustrations' as TabType, label: 'Illustrations' },
              { id: 'stickers' as TabType, label: 'Stickers' },
              { id: 'uploads' as TabType, label: `My Uploads (${userUploads.length})` },
              { id: 'recent' as TabType, label: 'Recent' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  backgroundColor: activeTab === tab.id ? '#5E6547' : '#F5EFE5',
                  color: activeTab === tab.id ? '#FFFEFA' : '#4A4843',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              width: 180,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search
              size={14}
              color="#8A857A"
              style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: 8,
                border: '1px solid #E8DFD3',
                backgroundColor: '#FAF5EE',
                fontSize: 12.5,
                color: '#30312D',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Upload Button & Dropzone when in 'uploads' tab */}
          {activeTab === 'uploads' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#777D5E' : '#DCD2C4'}`,
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: isDragging ? '#F4F6EE' : '#FAF6F0',
                cursor: 'pointer',
                marginBottom: 20,
                transition: 'all 0.2s ease'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#EAE5DB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5E6547'
                }}
              >
                <Upload size={18} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 550, color: '#30312D' }}>
                Upload an image or drop file here
              </div>
              <div style={{ fontSize: 11.5, color: '#8A857A' }}>
                Supports PNG, JPG, WebP, and SVG images
              </div>
            </div>
          )}

          {/* Grid of Assets */}
          {currentList.length === 0 ? (
            <div
              style={{
                padding: '40px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#8A857A'
              }}
            >
              <ImageIcon size={32} opacity={0.5} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>No assets found</div>
              <div style={{ fontSize: 12 }}>
                {activeTab === 'uploads'
                  ? 'Upload images using the box above to use them in your canvas.'
                  : 'Try searching with a different keyword.'}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: 16
              }}
            >
              {currentList.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onInsertImage(asset.url, asset.name);
                    onClose();
                  }}
                  style={{
                    position: 'relative',
                    borderRadius: 14,
                    border: '1px solid #EBE2D5',
                    backgroundColor: '#FAF6F0',
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(70, 60, 45, 0.08)';
                    e.currentTarget.style.borderColor = '#C5CBB7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#EBE2D5';
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 90,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={asset.url}
                      alt={asset.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: '#4F4D47',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%'
                    }}
                  >
                    {asset.name}
                  </span>

                  {asset.category === 'uploads' && (
                    <button
                      onClick={(e) => handleDeleteAsset(e, asset.id)}
                      title="Delete asset"
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#C24D3E',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
