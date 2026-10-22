import React from 'react';
import {
  Rect,
  Circle as FabricCircle,
  Ellipse,
  Triangle as FabricTriangle,
  Polygon,
  Path,
  FabricObject
} from 'fabric';
import type { ShapeType } from '../types/canvas';

export type ShapeCategory = 'all' | 'basic' | 'polygons' | 'stars' | 'arrows' | 'symbols';

export interface ShapeDefinition {
  id: ShapeType;
  name: string;
  category: 'basic' | 'polygons' | 'stars' | 'arrows' | 'symbols';
  icon: React.ReactNode;
}

export const SHAPE_CATEGORIES: Array<{ id: ShapeCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'basic', label: 'Basic' },
  { id: 'polygons', label: 'Polygons' },
  { id: 'stars', label: 'Stars' },
  { id: 'arrows', label: 'Arrows' },
  { id: 'symbols', label: 'Creative' }
];

function createRegularPolygonPoints(sides: number, radius = 50, center = 50) {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    points.push({
      x: Math.round((center + radius * Math.cos(angle)) * 10) / 10,
      y: Math.round((center + radius * Math.sin(angle)) * 10) / 10
    });
  }
  return points;
}

function createStarPoints(pointsCount: number, outerR = 50, innerR = 25, center = 50) {
  const points: Array<{ x: number; y: number }> = [];
  const total = pointsCount * 2;
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / total;
    points.push({
      x: Math.round((center + r * Math.cos(angle)) * 10) / 10,
      y: Math.round((center + r * Math.sin(angle)) * 10) / 10
    });
  }
  return points;
}

export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  // --- BASIC ---
  {
    id: 'rectangle',
    name: 'Rectangle',
    category: 'basic',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="1" />
      </svg>
    )
  },
  {
    id: 'rounded-rect',
    name: 'Rounded Rectangle',
    category: 'basic',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="6" ry="6" />
      </svg>
    )
  },
  {
    id: 'circle',
    name: 'Circle',
    category: 'basic',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
      </svg>
    )
  },
  {
    id: 'ellipse',
    name: 'Ellipse',
    category: 'basic',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="5.5" />
      </svg>
    )
  },
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'basic',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 3 21 20 3 20" />
      </svg>
    )
  },
  {
    id: 'right-triangle',
    name: 'Right Triangle',
    category: 'basic',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="4 4 4 20 20 20" />
      </svg>
    )
  },
  {
    id: 'trapezoid',
    name: 'Trapezoid',
    category: 'basic',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="7 5 17 5 21 19 3 19" />
      </svg>
    )
  },
  {
    id: 'parallelogram',
    name: 'Parallelogram',
    category: 'basic',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="7 5 21 5 17 19 3 19" />
      </svg>
    )
  },

  // --- POLYGONS ---
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'polygons',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 12 12 22 2 12" />
      </svg>
    )
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'polygons',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 9.5 18 21.5 6 21.5 2 9.5" />
      </svg>
    )
  },
  {
    id: 'polygon',
    name: 'Hexagon',
    category: 'polygons',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" />
      </svg>
    )
  },
  {
    id: 'heptagon',
    name: 'Heptagon',
    category: 'polygons',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 20 6 22 15 17 22 7 22 2 15 4 6" />
      </svg>
    )
  },
  {
    id: 'octagon',
    name: 'Octagon',
    category: 'polygons',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="7.8 2 16.2 2 22 7.8 22 16.2 16.2 22 7.8 22 2 16.2 2 7.8" />
      </svg>
    )
  },

  // --- STARS & BADGES ---
  {
    id: 'star-4',
    name: '4-Point Star',
    category: 'stars',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 14.8 9.2 22 12 14.8 14.8 12 22 9.2 14.8 2 12 9.2 9.2" />
      </svg>
    )
  },
  {
    id: 'star',
    name: '5-Point Star',
    category: 'stars',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
      </svg>
    )
  },
  {
    id: 'star-6',
    name: '6-Point Star',
    category: 'stars',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15 7.5 21 7.5 18 12.5 21 17.5 15 17.5 12 23 9 17.5 3 17.5 6 12.5 3 7.5 9 7.5" />
      </svg>
    )
  },
  {
    id: 'star-8',
    name: '8-Point Star',
    category: 'stars',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 14.5 7 19 5 17 9.5 22 12 17 14.5 19 19 14.5 17 12 22 9.5 17 5 19 7 14.5 2 12 7 9.5 5 5 9.5 7" />
      </svg>
    )
  },
  {
    id: 'badge-12',
    name: '12-Point Badge',
    category: 'stars',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 14.2 4.5 17.3 3.5 18.2 6.5 21.3 7 20.8 10 23 12 20.8 14 21.3 17 18.2 17.5 17.3 20.5 14.2 19.5 12 22 9.8 19.5 6.7 20.5 5.8 17.5 2.7 17 3.2 14 1 12 3.2 10 2.7 7 5.8 6.5 6.7 3.5 9.8 4.5" />
      </svg>
    )
  },
  {
    id: 'sparkle',
    name: 'Sparkle Glint',
    category: 'stars',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 C12 7.5 16.5 12 22 12 C16.5 12 12 16.5 12 22 C12 16.5 7.5 12 2 12 C7.5 12 12 7.5 12 2 Z" />
      </svg>
    )
  },

  // --- ARROWS ---
  {
    id: 'arrow-right',
    name: 'Right Arrow',
    category: 'arrows',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="2 9 13 9 13 4 22 12 13 20 13 15 2 15" />
      </svg>
    )
  },
  {
    id: 'arrow-left',
    name: 'Left Arrow',
    category: 'arrows',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 9 11 9 11 4 2 12 11 20 11 15 22 15" />
      </svg>
    )
  },
  {
    id: 'arrow-up',
    name: 'Up Arrow',
    category: 'arrows',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="9 22 9 11 4 11 12 2 20 11 15 11 15 22" />
      </svg>
    )
  },
  {
    id: 'arrow-down',
    name: 'Down Arrow',
    category: 'arrows',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="9 2 9 13 4 13 12 22 20 13 15 13 15 2" />
      </svg>
    )
  },
  {
    id: 'chevron-right',
    name: 'Chevron',
    category: 'arrows',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="4 3 14 12 4 21 10 21 20 12 10 3" />
      </svg>
    )
  },
  {
    id: 'double-arrow',
    name: 'Double Arrow',
    category: 'arrows',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="2 12 7 6 7 10 17 10 17 6 22 12 17 18 17 14 7 14 7 18" />
      </svg>
    )
  },

  // --- SYMBOLS & CREATIVE ---
  {
    id: 'heart',
    name: 'Heart',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20.5S3 15 3 8.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9 3.5c0 6.5-9 12-9 12z" />
      </svg>
    )
  },
  {
    id: 'shield',
    name: 'Shield',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 3v6c0 5.5-3.5 10-8 11-4.5-1-8-5.5-8-11V5l8-3z" />
      </svg>
    )
  },
  {
    id: 'crescent',
    name: 'Crescent Moon',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 3A10 10 0 1 1 8.5 21 8 8 0 0 0 19 3z" />
      </svg>
    )
  },
  {
    id: 'cross',
    name: 'Plus / Cross',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="9 2 15 2 15 9 22 9 22 15 15 15 15 22 9 22 9 15 2 15 2 9 9 9" />
      </svg>
    )
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H6.5A4.5 4.5 0 0 1 5 10.2 6 6 0 0 1 16.4 8a4.5 4.5 0 0 1 1.1 11z" />
      </svg>
    )
  },
  {
    id: 'speech-bubble',
    name: 'Speech Bubble',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    id: 'thought-bubble',
    name: 'Thought Bubble',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 17H7.5A4.5 4.5 0 0 1 5 9.2 5.5 5.5 0 0 1 15.5 7a4 4 0 0 1 2 10zM5 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      </svg>
    )
  },
  {
    id: 'lightning',
    name: 'Lightning Bolt',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 4 13 11 13 10 22 20 10 13 10" />
      </svg>
    )
  },
  {
    id: 'teardrop',
    name: 'Teardrop Pin',
    category: 'symbols',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 7 4 11 4 15a8 8 0 0 0 16 0c0-4-4-8-8-13z" />
      </svg>
    )
  }
];

export const SHAPE_NAMES: Record<ShapeType, string> = SHAPE_DEFINITIONS.reduce(
  (acc, item) => {
    acc[item.id] = item.name;
    return acc;
  },
  {} as Record<ShapeType, string>
);

export function getShapeName(shapeType?: ShapeType): string {
  if (!shapeType) return 'Geometric Shape';
  return SHAPE_NAMES[shapeType] || shapeType.replace('-', ' ');
}

// Fabric Shape Generator
export function createFabricShape(
  shapeType: ShapeType,
  commonProps: any,
  targetWidth = 100,
  targetHeight = 100
): FabricObject {
  let obj: FabricObject;

  switch (shapeType) {
    case 'rectangle':
      obj = new Rect({
        ...commonProps,
        width: targetWidth,
        height: targetHeight,
        rx: 0,
        ry: 0
      });
      break;

    case 'rounded-rect':
      obj = new Rect({
        ...commonProps,
        width: targetWidth,
        height: targetHeight,
        rx: 16,
        ry: 16
      });
      break;

    case 'circle': {
      const radius = Math.max(targetWidth, targetHeight) / 2;
      obj = new FabricCircle({
        ...commonProps,
        radius
      });
      break;
    }

    case 'ellipse':
      obj = new Ellipse({
        ...commonProps,
        rx: targetWidth / 2,
        ry: targetHeight / 2
      });
      break;

    case 'triangle':
      obj = new FabricTriangle({
        ...commonProps,
        width: targetWidth,
        height: targetHeight
      });
      break;

    case 'right-triangle': {
      const pts = [
        { x: 0, y: 0 },
        { x: 0, y: 100 },
        { x: 100, y: 100 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'trapezoid': {
      const pts = [
        { x: 20, y: 0 },
        { x: 80, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'parallelogram': {
      const pts = [
        { x: 25, y: 0 },
        { x: 100, y: 0 },
        { x: 75, y: 100 },
        { x: 0, y: 100 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'diamond': {
      const pts = [
        { x: 50, y: 0 },
        { x: 100, y: 50 },
        { x: 50, y: 100 },
        { x: 0, y: 50 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'pentagon': {
      const pts = createRegularPolygonPoints(5);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'polygon': {
      // Hexagon
      const pts = createRegularPolygonPoints(6);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'heptagon': {
      const pts = createRegularPolygonPoints(7);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'octagon': {
      const pts = createRegularPolygonPoints(8);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'star-4': {
      const pts = createStarPoints(4, 50, 16);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'star': {
      const pts = createStarPoints(5, 50, 20);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'star-6': {
      const pts = createStarPoints(6, 50, 25);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'star-8': {
      const pts = createStarPoints(8, 50, 22);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'badge-12': {
      const pts = createStarPoints(12, 50, 39);
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'sparkle': {
      const pathData = 'M 50 0 Q 50 50 100 50 Q 50 50 50 100 Q 50 50 0 50 Q 50 50 50 0 Z';
      const pathObj = new Path(pathData, commonProps);
      pathObj.set({
        scaleX: targetWidth / (pathObj.width || 100),
        scaleY: targetHeight / (pathObj.height || 100)
      });
      obj = pathObj;
      break;
    }

    case 'arrow-right': {
      const pts = [
        { x: 0, y: 30 },
        { x: 60, y: 30 },
        { x: 60, y: 10 },
        { x: 100, y: 50 },
        { x: 60, y: 90 },
        { x: 60, y: 70 },
        { x: 0, y: 70 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 80)
      });
      obj = poly;
      break;
    }

    case 'arrow-left': {
      const pts = [
        { x: 40, y: 10 },
        { x: 40, y: 30 },
        { x: 100, y: 30 },
        { x: 100, y: 70 },
        { x: 40, y: 70 },
        { x: 40, y: 90 },
        { x: 0, y: 50 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 80)
      });
      obj = poly;
      break;
    }

    case 'arrow-up': {
      const pts = [
        { x: 50, y: 0 },
        { x: 90, y: 40 },
        { x: 70, y: 40 },
        { x: 70, y: 100 },
        { x: 30, y: 100 },
        { x: 30, y: 40 },
        { x: 10, y: 40 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 80),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'arrow-down': {
      const pts = [
        { x: 30, y: 0 },
        { x: 70, y: 0 },
        { x: 70, y: 60 },
        { x: 90, y: 60 },
        { x: 50, y: 100 },
        { x: 10, y: 60 },
        { x: 30, y: 60 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 80),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'chevron-right': {
      const pts = [
        { x: 0, y: 0 },
        { x: 60, y: 50 },
        { x: 0, y: 100 },
        { x: 40, y: 100 },
        { x: 100, y: 50 },
        { x: 40, y: 0 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'double-arrow': {
      const pts = [
        { x: 0, y: 50 },
        { x: 30, y: 20 },
        { x: 30, y: 38 },
        { x: 70, y: 38 },
        { x: 70, y: 20 },
        { x: 100, y: 50 },
        { x: 70, y: 80 },
        { x: 70, y: 62 },
        { x: 30, y: 62 },
        { x: 30, y: 80 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 60)
      });
      obj = poly;
      break;
    }

    case 'heart': {
      const pathData = 'M 50 85 C 10 55 0 25 25 10 C 40 2 48 15 50 22 C 52 15 60 2 75 10 C 100 25 90 55 50 85 Z';
      const pathObj = new Path(pathData, commonProps);
      pathObj.set({
        scaleX: targetWidth / (pathObj.width || 77),
        scaleY: targetHeight / (pathObj.height || 78)
      });
      obj = pathObj;
      break;
    }

    case 'shield': {
      const pathData = 'M 50 5 L 90 20 C 90 60 70 85 50 98 C 30 85 10 60 10 20 Z';
      const pathObj = new Path(pathData, commonProps);
      pathObj.set({
        scaleX: targetWidth / (pathObj.width || 80),
        scaleY: targetHeight / (pathObj.height || 93)
      });
      obj = pathObj;
      break;
    }

    case 'crescent': {
      const pathData = 'M 70 5 C 35 15 15 45 20 75 C 25 95 45 105 75 95 C 45 85 35 60 45 35 C 50 22 60 12 70 5 Z';
      const pathObj = new Path(pathData, commonProps);
      pathObj.set({
        scaleX: targetWidth / (pathObj.width || 56),
        scaleY: targetHeight / (pathObj.height || 94)
      });
      obj = pathObj;
      break;
    }

    case 'cross': {
      const pts = [
        { x: 35, y: 0 },
        { x: 65, y: 0 },
        { x: 65, y: 35 },
        { x: 100, y: 35 },
        { x: 100, y: 65 },
        { x: 65, y: 65 },
        { x: 65, y: 100 },
        { x: 35, y: 100 },
        { x: 35, y: 65 },
        { x: 0, y: 65 },
        { x: 0, y: 35 },
        { x: 35, y: 35 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 100),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'cloud': {
      const pathData = 'M 25 65 A 15 15 0 0 1 20 40 A 25 25 0 0 1 60 25 A 25 25 0 0 1 85 45 A 18 18 0 0 1 80 65 Z';
      const pathObj = new Path(pathData, commonProps);
      pathObj.set({
        scaleX: targetWidth / (pathObj.width || 71),
        scaleY: targetHeight / (pathObj.height || 45)
      });
      obj = pathObj;
      break;
    }

    case 'speech-bubble': {
      const pathData = 'M 10 15 C 10 6.7 16.7 0 25 0 L 75 0 C 83.3 0 90 6.7 90 15 L 90 55 C 83.3 63.3 73.3 70 65 70 L 40 70 L 20 90 L 25 70 L 25 70 C 16.7 70 10 63.3 10 55 Z';
      const pathObj = new Path(pathData, commonProps);
      pathObj.set({
        scaleX: targetWidth / (pathObj.width || 80),
        scaleY: targetHeight / (pathObj.height || 90)
      });
      obj = pathObj;
      break;
    }

    case 'thought-bubble': {
      const pathData = 'M 25 60 A 14 14 0 0 1 20 38 A 20 20 0 0 1 50 20 A 22 22 0 0 1 82 35 A 16 16 0 0 1 85 58 A 18 18 0 0 1 60 68 A 20 20 0 0 1 25 60 Z M 16 75 A 4 4 0 1 1 16 83 A 4 4 0 1 1 16 75 Z M 8 88 A 2.5 2.5 0 1 1 8 93 A 2.5 2.5 0 1 1 8 88 Z';
      const pathObj = new Path(pathData, commonProps);
      pathObj.set({
        scaleX: targetWidth / (pathObj.width || 83),
        scaleY: targetHeight / (pathObj.height || 76)
      });
      obj = pathObj;
      break;
    }

    case 'lightning': {
      const pts = [
        { x: 55, y: 0 },
        { x: 15, y: 55 },
        { x: 45, y: 55 },
        { x: 35, y: 100 },
        { x: 85, y: 42 },
        { x: 55, y: 42 }
      ];
      const poly = new Polygon(pts, commonProps);
      poly.set({
        scaleX: targetWidth / (poly.width || 70),
        scaleY: targetHeight / (poly.height || 100)
      });
      obj = poly;
      break;
    }

    case 'teardrop': {
      const pathData = 'M 50 5 C 70 35 85 55 85 70 A 35 35 0 1 1 15 70 C 15 55 30 35 50 5 Z';
      const pathObj = new Path(pathData, commonProps);
      pathObj.set({
        scaleX: targetWidth / (pathObj.width || 70),
        scaleY: targetHeight / (pathObj.height || 100)
      });
      obj = pathObj;
      break;
    }

    default:
      obj = new Rect({
        ...commonProps,
        width: targetWidth,
        height: targetHeight,
        rx: 0,
        ry: 0
      });
  }

  (obj as any).shapeType = shapeType;
  return obj;
}

// Resizes a shape object interactively during canvas drag
export function resizeShapeObject(
  obj: FabricObject,
  width: number,
  height: number,
  left: number,
  top: number
) {
  if (obj instanceof FabricCircle) {
    const radius = Math.max(width, height) / 2;
    obj.set({ radius, left, top });
  } else if (obj instanceof Ellipse) {
    obj.set({ rx: width / 2, ry: height / 2, left, top });
  } else if (obj instanceof Rect || obj instanceof FabricTriangle) {
    obj.set({ width, height, left, top });
  } else if (obj instanceof Polygon || obj instanceof Path) {
    const baseW = obj.width || 100;
    const baseH = obj.height || 100;
    const scaleX = Math.max(0.01, width / baseW);
    const scaleY = Math.max(0.01, height / baseH);
    obj.set({ scaleX, scaleY, left, top });
  }
}

// Applies standard default dimensions on single-click (<10px drag)
export function applyDefaultShapeDimensions(
  obj: FabricObject,
  startX: number,
  startY: number
) {
  if (obj instanceof FabricCircle) {
    obj.set({ radius: 50, left: startX - 50, top: startY - 50 });
  } else if (obj instanceof Ellipse) {
    obj.set({ rx: 65, ry: 45, left: startX - 65, top: startY - 45 });
  } else if (obj instanceof FabricTriangle) {
    obj.set({ width: 110, height: 100, left: startX - 55, top: startY - 50 });
  } else if (obj instanceof Rect) {
    obj.set({ width: 130, height: 90, left: startX - 65, top: startY - 45 });
  } else if (obj instanceof Polygon || obj instanceof Path) {
    const targetW = 110;
    const targetH = 100;
    const baseW = obj.width || 100;
    const baseH = obj.height || 100;
    const scaleX = targetW / baseW;
    const scaleY = targetH / baseH;
    obj.set({
      scaleX,
      scaleY,
      left: startX - (baseW * scaleX) / 2,
      top: startY - (baseH * scaleY) / 2
    });
  }
}
