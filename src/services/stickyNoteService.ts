import {
  Textbox,
  Shadow,
  Control,
  controlsUtils
} from 'fabric';

export interface StickySizePreset {
  id: 'mini' | 'normal' | 'large' | 'xl';
  name: string;
  width: number;
  height: number;
  fontSize: number;
}

export const STICKY_SIZE_PRESETS: StickySizePreset[] = [
  { id: 'mini', name: 'Mini', width: 140, height: 115, fontSize: 16 },
  { id: 'normal', name: 'Normal', width: 200, height: 170, fontSize: 22 },
  { id: 'large', name: 'Large', width: 320, height: 260, fontSize: 28 },
  { id: 'xl', name: 'Huge', width: 440, height: 360, fontSize: 34 }
];

export interface CreateStickyNoteOptions {
  text?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Attaches custom sticky note dimensions, card rendering, and resize handles.
 */
export function configureStickyNoteObject(
  stickyNote: Textbox,
  cardHeight: number = 170
): void {
  (stickyNote as any).isStickyNote = true;
  (stickyNote as any).cardStroke = (stickyNote as any).cardStroke || '#E2D4B6';
  (stickyNote as any).cardStrokeWidth = (stickyNote as any).cardStrokeWidth || 1.5;
  (stickyNote as any).cardHeight = (stickyNote as any).cardHeight || cardHeight;

  // Enable smooth, uniform scaling so dragging corner handles proportionally minimizes or maximizes the note
  stickyNote.set({
    lockUniScaling: true,
    lockScalingFlip: true,
    minScaleLimit: 0.2
  });

  // Calculate text height, honoring the user's cardHeight (minimum down to 50px for mini sticky notes)
  (stickyNote as any).calcTextHeight = function () {
    const natural = Textbox.prototype.calcTextHeight.call(this);
    const targetH = (this as any).cardHeight || 60;
    return Math.max(targetH, natural);
  };

  // Custom rounded background renderer for sticky note card
  (stickyNote as any)._renderBackground = function (ctx: CanvasRenderingContext2D) {
    if (!this.backgroundColor) return;
    const dim = this._getNonTransformedDimensions();
    const w = dim.x;
    const targetH = (this as any).cardHeight || 60;
    const h = Math.max(targetH, dim.y);
    const r = 10;
    ctx.save();
    ctx.fillStyle = this.backgroundColor;
    ctx.strokeStyle = (this as any).cardStroke || '#E2D4B6';
    ctx.lineWidth = (this as any).cardStrokeWidth || 1.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-w / 2, -h / 2, w, h, r);
    } else {
      ctx.rect(-w / 2, -h / 2, w, h);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    this._removeShadow(ctx);
  };

  // Bottom-middle handle (mb) directly resizes card height without stretching font
  stickyNote.controls.mb = new Control({
    x: 0,
    y: 0.5,
    cursorStyle: 'ns-resize',
    actionName: 'resizing',
    actionHandler: (eventData, transform, x, y) => {
      const res = controlsUtils.changeHeight(eventData, transform, x, y);
      if (res) {
        (transform.target as any).cardHeight = Math.max(50, Math.round(transform.target.height));
      }
      return res;
    }
  });

  // Hide top-middle handle so vertical height adjustment is cleanly anchored from top
  if (stickyNote.controls.mt) {
    stickyNote.controls.mt.visible = false;
  }

  // Delete control positioned comfortably offset from the top-right corner handle (tr)
  stickyNote.controls.deleteControl = new Control({
    x: 0.5,
    y: -0.5,
    offsetY: -20,
    offsetX: 20,
    cursorStyle: 'pointer',
    mouseUpHandler: (_eventData, transformData) => {
      const target = transformData.target;
      const c = target.canvas;
      if (c) {
        c.remove(target);
        c.discardActiveObject();
        c.requestRenderAll();
      }
      return true;
    },
    render: (ctx, left, top) => {
      const size = 22;
      ctx.save();
      ctx.translate(left, top);
      // Button circle
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FDF2F0';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#D99379';
      ctx.stroke();

      // Trash / X icon
      ctx.beginPath();
      const s = 4.5;
      ctx.moveTo(-s, -s);
      ctx.lineTo(s, s);
      ctx.moveTo(s, -s);
      ctx.lineTo(-s, s);
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#C24D3E';
      ctx.stroke();
      ctx.restore();
    }
  });
}

/**
 * Creates a brand new Sticky Note Fabric Textbox with card styling, controls, and dimensions.
 */
export function createStickyNote(options: CreateStickyNoteOptions = {}): Textbox {
  const width = options.width || 200;
  const cardHeight = options.height || 170;
  const initialNoteColor = options.backgroundColor || '#FAF0D7';
  const initialTextColor =
    options.color && options.color.toLowerCase() !== initialNoteColor.toLowerCase()
      ? options.color
      : '#2B2D2F';

  const stickyNote = new Textbox(options.text || 'Type a thought...', {
    left: options.left,
    top: options.top,
    width,
    fontFamily: options.fontFamily || "'Caveat', cursive",
    fontSize: options.fontSize || 22,
    fill: initialTextColor,
    backgroundColor: initialNoteColor,
    stroke: null,
    strokeWidth: 0,
    padding: 18,
    textAlign: options.textAlign || 'left',
    shadow: new Shadow({
      color: 'rgba(80, 70, 50, 0.16)',
      blur: 12,
      offsetX: 3,
      offsetY: 6
    }),
    editable: true,
    splitByGrapheme: true
  });

  configureStickyNoteObject(stickyNote, cardHeight);
  stickyNote.initDimensions();

  return stickyNote;
}
