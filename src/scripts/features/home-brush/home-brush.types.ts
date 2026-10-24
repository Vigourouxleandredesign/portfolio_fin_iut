/**
 * @file Home brush — type definitions
 * @module features/home-brush
 */

/** An sRGB color, channels in `[0, 255]`. */
export type Rgb = {
  r: number;
  g: number;
  b: number;
};

/**
 * Gouache pigments read once from `variables.css` at init.
 * `stops` run copper → gold → phtalo along a stroke; `shadow` is the 1 px relief shadow.
 */
export type BrushPalette = {
  stops: Rgb[];
  shadow: string;
};

/** A stroke sample in canvas-local CSS-pixel coordinates. */
export type BrushPoint = {
  x: number;
  y: number;
  /** Simulated hand pressure in `[0, 1]` — drives stroke width */
  pressure: number;
};
