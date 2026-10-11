export type ToolType =
  | 'select'
  | 'pen'
  | 'pencil'
  | 'marker'
  | 'eraser'
  | 'text'
  | 'shape'
  | 'image'
  | 'line'
  | 'arrow'
  | 'sticky'
  | 'more';

export type ShapeType =
  | 'rectangle'
  | 'rounded-rect'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'diamond'
  | 'star'
  | 'polygon';

export type EraserMode = 'stroke' | 'object';

export type LineStyle = 'solid' | 'dashed' | 'dotted';

export type BackgroundPreset =
  | '#FFFEFA' // Warm white
  | '#FFFFFF' // Pure white
  | '#F7F3E9' // Cream
  | '#F0F0EB' // Light gray
  | '#EAEEDD' // Pale sage
  | '#FCEEE7'; // Soft peach

export interface ToolSettings {
  color: string;
  size: number;
  opacity: number;
  strokeWidth: number;
  fillColor: string;
  strokeColor: string;
  shapeType: ShapeType;
  eraserMode: EraserMode;
  lineStyle: LineStyle;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: 'left' | 'center' | 'right';
  stickyColor: string;
}

export interface SelectedObjectProperties {
  id?: string;
  type?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  isLocked?: boolean;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  underline?: boolean;
  textAlign?: string;
}

export interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}
