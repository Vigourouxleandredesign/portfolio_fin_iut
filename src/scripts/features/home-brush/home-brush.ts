/**
 * @file Home brush — continuous painterly chalk stroke
 * @module features/home-brush/home-brush
 * @description Draws a continuous multi-bristle chalk stroke while the left
 *   mouse button is held (or primary pointer is down). Width reacts to
 *   simulated hand pressure (slower → thicker) with slight human jitter.
 *   Text selection is suppressed for the duration of a paint drag. Canvas
 *   uses `mix-blend-mode: screen`. Sits above sections, below the 3D hero.
 *   No-ops under `prefers-reduced-motion`.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import { drawStrokeSegment } from './home-brush-strokes';
import type { BrushPalette, BrushPoint } from './home-brush.types';

/** Minimum travel (CSS px) before a new segment is committed */
const SEGMENT_SPACING = 4;
/** Smoothing for pressure so width doesn't flicker every frame */
const PRESSURE_SMOOTHING = 0.22;
/** Speeds (px/ms) that map to max / min pressure */
const SLOW_SPEED = 0.12;
const FAST_SPEED = 1.8;
/** Primary button bit in `PointerEvent.buttons` (left mouse / touch contact) */
const PRIMARY_BUTTON = 1;
const MAX_DEVICE_PIXEL_RATIO = 2;
const RESIZE_DEBOUNCE_MS = 150;

function readCssColor(variableName: string, fallbackHex: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return value || fallbackHex;
}

function speedToPressure(speedPxPerMs: number): number {
  const t = (speedPxPerMs - SLOW_SPEED) / (FAST_SPEED - SLOW_SPEED);
  const clamped = Math.min(1, Math.max(0, t));
  // Invert: slow movement = high pressure (wider chalk mark).
  return 1 - clamped;
}

/**
 * Mounts the cursor brush over `root` (the homepage `<main>`, which must
 * contain a `[data-home-brush]` canvas).
 * @returns Teardown function (removes listeners, disconnects the observer)
 */
export function initHomeBrush(root: HTMLElement): () => void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return () => undefined;
  }

  const canvas = root.querySelector<HTMLCanvasElement>('[data-home-brush]');
  if (!canvas) {
    return () => undefined;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return () => undefined;
  }

  const palette: BrushPalette = {
    accents: [
      readCssColor('--color-ember', '#b8956c'),
      readCssColor('--color-splash-crimson', '#d4685a'),
      readCssColor('--color-splash-cobalt', '#5a9bc4'),
      readCssColor('--color-splash-gold', '#e0b85a'),
      readCssColor('--color-splash-violet', '#9a78b4'),
      readCssColor('--color-splash-teal', '#5ab894'),
    ],
  };

  let rootRect = root.getBoundingClientRect();
  let lastPoint: BrushPoint | null = null;
  let lastTimestamp = 0;
  let smoothedPressure = 0.55;
  let isPainting = false;

  const resizeCanvas = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
    const widthCss = root.clientWidth;
    const heightCss = root.scrollHeight;
    const nextWidthPx = Math.max(1, Math.round(widthCss * dpr));
    const nextHeightPx = Math.max(1, Math.round(heightCss * dpr));

    if (canvas.width !== nextWidthPx || canvas.height !== nextHeightPx) {
      let snapshot: HTMLCanvasElement | null = null;
      if (canvas.width > 0 && canvas.height > 0) {
        snapshot = document.createElement('canvas');
        snapshot.width = canvas.width;
        snapshot.height = canvas.height;
        snapshot.getContext('2d')?.drawImage(canvas, 0, 0);
      }

      canvas.width = nextWidthPx;
      canvas.height = nextHeightPx;

      if (snapshot) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(snapshot, 0, 0);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    rootRect = root.getBoundingClientRect();
  };
  resizeCanvas();

  let resizeTimeout = 0;
  const scheduleResize = (): void => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(resizeCanvas, RESIZE_DEBOUNCE_MS);
  };
  const updateRect = (): void => {
    rootRect = root.getBoundingClientRect();
  };

  const stopPainting = (): void => {
    isPainting = false;
    lastPoint = null;
    document.documentElement.classList.remove('is-home-brush-painting');
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) {
      return;
    }
    isPainting = true;
    document.documentElement.classList.add('is-home-brush-painting');
    window.getSelection()?.removeAllRanges();
    rootRect = root.getBoundingClientRect();
    lastPoint = {
      x: event.clientX - rootRect.left,
      y: event.clientY - rootRect.top,
      pressure: smoothedPressure,
    };
    lastTimestamp = performance.now();
  };

  const onPointerMove = (event: PointerEvent): void => {
    // Only paint while the primary button stays held.
    if (!isPainting || (event.buttons & PRIMARY_BUTTON) === 0) {
      if (isPainting) {
        stopPainting();
      }
      return;
    }

    // Stops the browser from selecting / highlighting text under the drag.
    event.preventDefault();

    const now = performance.now();
    const pointX = event.clientX - rootRect.left;
    const pointY = event.clientY - rootRect.top;

    if (!lastPoint) {
      lastPoint = { x: pointX, y: pointY, pressure: smoothedPressure };
      lastTimestamp = now;
      return;
    }

    const dx = pointX - lastPoint.x;
    const dy = pointY - lastPoint.y;
    const distance = Math.hypot(dx, dy);
    if (distance < SEGMENT_SPACING) {
      return;
    }

    const dt = Math.max(1, now - lastTimestamp);
    const instantPressure = speedToPressure(distance / dt);
    const noisyPressure = Math.min(1, Math.max(0.12, instantPressure + (Math.random() - 0.5) * 0.18));
    smoothedPressure =
      smoothedPressure * (1 - PRESSURE_SMOOTHING) + noisyPressure * PRESSURE_SMOOTHING;

    const nextPoint: BrushPoint = {
      x: pointX,
      y: pointY,
      pressure: smoothedPressure,
    };

    const steps = Math.max(1, Math.floor(distance / SEGMENT_SPACING));
    let segmentFrom = lastPoint;
    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      const segmentTo: BrushPoint = {
        x: lastPoint.x + dx * t,
        y: lastPoint.y + dy * t,
        pressure: lastPoint.pressure + (nextPoint.pressure - lastPoint.pressure) * t,
      };
      drawStrokeSegment(ctx, segmentFrom, segmentTo, palette.accents);
      segmentFrom = segmentTo;
    }

    lastPoint = nextPoint;
    lastTimestamp = now;
  };

  const onSelectStart = (event: Event): void => {
    if (isPainting) {
      event.preventDefault();
    }
  };

  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', stopPainting);
  window.addEventListener('pointercancel', stopPainting);
  document.addEventListener('selectstart', onSelectStart);
  window.addEventListener('scroll', updateRect, { passive: true });
  window.addEventListener('resize', scheduleResize);

  const resizeObserver = new ResizeObserver(scheduleResize);
  resizeObserver.observe(root);

  return () => {
    stopPainting();
    window.clearTimeout(resizeTimeout);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', stopPainting);
    window.removeEventListener('pointercancel', stopPainting);
    document.removeEventListener('selectstart', onSelectStart);
    window.removeEventListener('scroll', updateRect);
    window.removeEventListener('resize', scheduleResize);
    resizeObserver.disconnect();
  };
}
