/**
 * @file Home brush — continuous gouache stroke segments
 * @module features/home-brush/home-brush-strokes
 * @description Draws solid, opaque round-capped segments along the cursor path.
 *   Width follows pressure (slow = wide) and tapers in at the start / out at the
 *   end of a gesture; color slides copper → gold → phtalo with the distance
 *   travelled (docs/DA.md §6). No blending, a 1 px relief shadow.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import type { BrushPalette, BrushPoint, Rgb } from './home-brush.types';

/** Half-width of the stroke at zero pressure (CSS px) */
const MIN_HALF_WIDTH = 5;
/** Extra half-width contributed by full pressure */
const PRESSURE_HALF_WIDTH = 15;
/** Distance (px) over which the stroke grows from a point to full width */
const TAPER_IN_LENGTH = 70;
/** Distance (px) over which the colors run from the first to the last stop */
const GRADIENT_LENGTH = 900;
/** Length (px) and step count of the tail that closes a gesture */
const TAPER_OUT_LENGTH = 46;
const TAPER_OUT_STEPS = 8;

/**
 * Parses a `#rgb` / `#rrggbb` CSS color. Anything else returns `null`
 * so the brush paints nothing rather than guessing a color.
 */
export function parseHexColor(value: string): Rgb | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) {
    return null;
  }
  const hex = match[1].length === 3 ? [...match[1]].map((char) => char + char).join('') : match[1];
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

/**
 * Color at `progress` (`0..1`) along a gradient of evenly spaced stops,
 * returned as a canvas-ready `rgb()` string. `stops` must not be empty.
 */
export function sampleGradient(stops: readonly Rgb[], progress: number): string {
  const clamped = Math.min(1, Math.max(0, progress));
  const scaled = clamped * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(scaled));
  const from = stops[Math.max(0, index)];
  const to = stops[Math.min(stops.length - 1, index + 1)];
  const t = stops.length === 1 ? 0 : scaled - Math.max(0, index);
  const mix = (a: number, b: number): number => Math.round(a + (b - a) * t);
  return `rgb(${mix(from.r, to.r)}, ${mix(from.g, to.g)}, ${mix(from.b, to.b)})`;
}

function strokeLine(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  halfWidth: number,
  color: string,
  shadow: string,
): void {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = shadow;
  ctx.shadowBlur = 1;
  ctx.shadowOffsetY = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, halfWidth * 2);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Paints one solid segment from `from` to `to`. `travelled` is the distance
 * (px) already covered by the gesture at `from`: it drives the taper-in and
 * the color. Draws nothing when the palette is empty.
 */
export function drawStrokeSegment(
  ctx: CanvasRenderingContext2D,
  from: BrushPoint,
  to: BrushPoint,
  palette: BrushPalette,
  travelled: number,
): void {
  if (palette.stops.length === 0) {
    return;
  }
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  if (length < 0.5) {
    return;
  }

  const pressure = (from.pressure + to.pressure) * 0.5;
  const taperIn = Math.min(1, 0.18 + (travelled + length * 0.5) / TAPER_IN_LENGTH);
  const halfWidth = (MIN_HALF_WIDTH + pressure * PRESSURE_HALF_WIDTH) * taperIn;
  const color = sampleGradient(palette.stops, (travelled + length * 0.5) / GRADIENT_LENGTH);

  strokeLine(ctx, from, to, halfWidth, color, palette.shadow);
}

/**
 * Closes a gesture: a short run of segments narrowing to a point, continuing
 * in the last direction of travel (`angle`, radians).
 */
export function drawStrokeTail(
  ctx: CanvasRenderingContext2D,
  end: BrushPoint,
  angle: number,
  palette: BrushPalette,
  travelled: number,
): void {
  if (palette.stops.length === 0) {
    return;
  }
  const stepLength = TAPER_OUT_LENGTH / TAPER_OUT_STEPS;
  const startHalf = MIN_HALF_WIDTH + end.pressure * PRESSURE_HALF_WIDTH;
  const color = sampleGradient(palette.stops, travelled / GRADIENT_LENGTH);

  let from = { x: end.x, y: end.y };
  for (let i = 1; i <= TAPER_OUT_STEPS; i += 1) {
    const to = {
      x: end.x + Math.cos(angle) * stepLength * i,
      y: end.y + Math.sin(angle) * stepLength * i,
    };
    const halfWidth = startHalf * (1 - i / (TAPER_OUT_STEPS + 1));
    strokeLine(ctx, from, to, halfWidth, color, palette.shadow);
    from = to;
  }
}
