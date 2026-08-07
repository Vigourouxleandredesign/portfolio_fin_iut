/**
 * @file Home brush — type definitions
 * @module features/home-brush
 */

/** Splash / chalk pigment colors, read once from `variables.css` at init. */
export type BrushPalette = {
  accents: string[];
};

/** A stroke sample in canvas-local CSS-pixel coordinates. */
export type BrushPoint = {
  x: number;
  y: number;
  /** Simulated hand pressure in `[0, 1]` — drives stroke width */
  pressure: number;
};
