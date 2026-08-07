/**
 * @file Hero reveal — canvas brush mask
 * @module features/hero-reveal
 * @description Top image on canvas; brush reveals base image. Hover on desktop, drag on touch.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import type { HeroRevealOptions } from './hero-reveal.types';

const DEFAULT_OPTIONS: Omit<HeroRevealOptions, 'topImageSrc'> = {
  brushRadius: 72,
  brushSoftness: 0.55,
};

/**
 * Mounts the hero brush reveal on the given root element.
 * @param root - Element with `[data-hero-reveal]`
 * @param options - Top image URL and brush settings
 * @returns Teardown function (removes listeners)
 */
export function initHeroReveal(
  root: HTMLElement,
  options: HeroRevealOptions,
): () => void {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  const baseImage = root.querySelector<HTMLImageElement>('.hero__image--base');
  const canvas = root.querySelector<HTMLCanvasElement>('.hero__canvas');

  if (!baseImage || !canvas) {
    console.warn('[hero-reveal] Missing .hero__image--base or .hero__canvas');
    return () => undefined;
  }

  if (prefersReducedMotion) {
    canvas.remove();
    return () => undefined;
  }

  const config = { ...DEFAULT_OPTIONS, ...options };
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.warn('[hero-reveal] Could not get 2d context');
    return () => undefined;
  }

  const mode: 'hover' | 'drag' = window.matchMedia(
    '(hover: hover) and (pointer: fine)',
  ).matches
    ? 'hover'
    : 'drag';

  const topImage = new Image();
  topImage.decoding = 'async';
  topImage.src = config.topImageSrc;

  let isDrawing = false;
  let lastPoint: { x: number; y: number } | null = null;
  let layoutWidth = 0;
  let layoutHeight = 0;

  const paintTopLayer = (): void => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, layoutWidth, layoutHeight);
    if (topImage.complete && topImage.naturalWidth > 0) {
      drawImageCover(ctx, topImage, layoutWidth, layoutHeight);
    }
  };

  const resize = (): void => {
    const rect = root.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    layoutWidth = rect.width;
    layoutHeight = rect.height;
    canvas.width = Math.floor(layoutWidth * dpr);
    canvas.height = Math.floor(layoutHeight * dpr);
    canvas.style.width = `${layoutWidth}px`;
    canvas.style.height = `${layoutHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintTopLayer();
  };

  const scratch = (x: number, y: number): void => {
    const { brushRadius, brushSoftness } = config;
    const inner = brushRadius * (1 - brushSoftness);

    ctx.globalCompositeOperation = 'destination-out';
    const gradient = ctx.createRadialGradient(x, y, inner, x, y, brushRadius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  const scratchLine = (x: number, y: number): void => {
    if (lastPoint) {
      const distance = Math.hypot(x - lastPoint.x, y - lastPoint.y);
      const step = Math.max(config.brushRadius * 0.35, 1);
      const steps = Math.ceil(distance / step);
      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        scratch(
          lastPoint.x + (x - lastPoint.x) * t,
          lastPoint.y + (y - lastPoint.y) * t,
        );
      }
    } else {
      scratch(x, y);
    }
    lastPoint = { x, y };
  };

  const handlePoint = (x: number, y: number): void => {
    scratchLine(x, y);
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (mode !== 'drag') return;
    isDrawing = true;
    lastPoint = null;
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = getLocalPoint(event, canvas);
    handlePoint(x, y);
  };

  const onPointerMove = (event: PointerEvent): void => {
    const { x, y } = getLocalPoint(event, canvas);

    if (mode === 'hover') {
      handlePoint(x, y);
      return;
    }

    if (!isDrawing) return;
    handlePoint(x, y);
  };

  const onPointerUp = (): void => {
    isDrawing = false;
    lastPoint = null;
  };

  const onPointerLeave = (): void => {
    if (mode === 'hover') {
      lastPoint = null;
    }
  };

  const onTopImageLoad = (): void => {
    paintTopLayer();
  };

  topImage.addEventListener('load', onTopImageLoad);
  if (topImage.complete) {
    onTopImageLoad();
  }

  canvas.style.pointerEvents = 'auto';
  root.classList.add(`hero--mode-${mode}`);
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);

  return () => {
    topImage.removeEventListener('load', onTopImageLoad);
    resizeObserver.disconnect();
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    canvas.style.pointerEvents = 'none';
    root.classList.remove(`hero--mode-${mode}`);
  };
}

function getLocalPoint(
  event: PointerEvent,
  canvas: HTMLCanvasElement,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/**
 * Draws an image with CSS `object-fit: cover` + `object-position: center top`.
 * Must stay in sync with `.hero__image` in `hero.css`, otherwise the bust
 * jumps between the base `<img>` and the canvas top layer.
 */
function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
): void {
  const imageAspect = image.naturalWidth / image.naturalHeight;
  const boxAspect = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageAspect > boxAspect) {
    // Image wider than box — crop left/right, keep top edge.
    drawWidth = height * imageAspect;
    offsetX = (width - drawWidth) / 2;
    offsetY = 0;
  } else {
    // Image taller than box — crop bottom, keep top edge (center top).
    drawHeight = width / imageAspect;
    offsetX = 0;
    offsetY = 0;
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}
