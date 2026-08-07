/**
 * @file Home brush — continuous painterly stroke segments
 * @module features/home-brush/home-brush-strokes
 * @description Draws short, pressure-aware stroke segments along the cursor
 *   path — several chalk-colored bristles with slight width jitter so the
 *   trail reads as a continuous human brushstroke on a canvas, not a PNG stamp.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import type { BrushPoint } from './home-brush.types';

const BRISTLE_COUNT = 5;
/** Base half-width of the stroke at full pressure (CSS px) */
const BASE_HALF_WIDTH = 22;
/** Extra half-width contributed by pressure */
const PRESSURE_HALF_WIDTH = 28;

/**
 * Paints one continuous segment from `from` to `to` as a bundle of soft
 * chalk bristles. Width follows pressure (+ small human jitter); pigments
 * are picked from the palette so a single stroke carries several colors.
 */
export function drawStrokeSegment(
  ctx: CanvasRenderingContext2D,
  from: BrushPoint,
  to: BrushPoint,
  palette: readonly string[],
): void {
  if (palette.length === 0) {
    return;
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length < 0.5) {
    return;
  }

  const angle = Math.atan2(dy, dx);
  const avgPressure = (from.pressure + to.pressure) * 0.5;
  const humanJitter = 0.85 + Math.random() * 0.35;
  const halfWidth = (BASE_HALF_WIDTH + avgPressure * PRESSURE_HALF_WIDTH) * humanJitter;

  // Dab spacing — continuous ribbon, but loose enough for scattered ovals.
  const step = Math.max(3.2, halfWidth * 0.38);
  const steps = Math.max(1, Math.ceil(length / step));

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';

  for (let bristle = 0; bristle < BRISTLE_COUNT; bristle += 1) {
    const lateralNorm = (bristle - (BRISTLE_COUNT - 1) / 2) / Math.max(BRISTLE_COUNT - 1, 1);
    // Spread bristles farther apart, with per-bristle random offset.
    const lateralBase =
      lateralNorm * halfWidth * (0.95 + Math.random() * 0.7) +
      (Math.random() - 0.5) * halfWidth * 0.55;
    const bristleHalf =
      halfWidth * (0.2 + Math.random() * 0.32) * (1 - Math.abs(lateralNorm) * 0.25);
    const color = palette[Math.floor(Math.random() * palette.length)];
    const alpha = 0.2 + avgPressure * 0.38 + Math.random() * 0.12;

    ctx.fillStyle = color;

    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const pressure = from.pressure + (to.pressure - from.pressure) * t;
      const taper = 0.75 + pressure * 0.35;
      // Scatter each oval off the path so colors don't pile into one line.
      const wobble = (Math.random() - 0.5) * halfWidth * 0.55;
      const alongJitter = (Math.random() - 0.5) * step * 0.9;
      const px =
        from.x +
        dx * t +
        Math.cos(angle) * alongJitter -
        Math.sin(angle) * (lateralBase + wobble);
      const py =
        from.y +
        dy * t +
        Math.sin(angle) * alongJitter +
        Math.cos(angle) * (lateralBase + wobble);
      const radiusX = Math.max(1.4, bristleHalf * taper * (1.15 + Math.random() * 0.55));
      const radiusY = Math.max(0.9, radiusX * (0.3 + Math.random() * 0.28));

      ctx.globalAlpha = Math.min(0.7, alpha * (0.85 + Math.random() * 0.3));
      ctx.beginPath();
      ctx.ellipse(px, py, radiusX, radiusY, angle + (Math.random() - 0.5) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Occasional chalk speck near the stroke for a dry-brush fleck.
  if (Math.random() < 0.14 * avgPressure) {
    const speckT = Math.random();
    const speckX = from.x + dx * speckT - Math.sin(angle) * halfWidth * (0.7 + Math.random());
    const speckY = from.y + dy * speckT + Math.cos(angle) * halfWidth * (0.7 + Math.random());
    const speckR = 1 + Math.random() * 3.5;
    ctx.globalAlpha = 0.35 + Math.random() * 0.3;
    ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
    ctx.beginPath();
    ctx.arc(speckX, speckY, speckR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
