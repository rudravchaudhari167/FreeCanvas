export interface CanvasProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  canvasData: string; // Fabric serialized JSON
  backgroundColor: string;
  zoom: number;
  thumbnail?: string; // Data URL preview
  width?: number;
  height?: number;
}

export interface GalleryAsset {
  id: string;
  name: string;
  category: 'uploads' | 'illustrations' | 'stickers' | 'recent';
  url: string; // Data URL or SVG string
  type: 'image' | 'svg';
  createdAt: number;
  width?: number;
  height?: number;
}
