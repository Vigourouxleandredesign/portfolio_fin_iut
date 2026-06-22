/**
 * @file Hero reveal — type definitions
 * @module features/hero-reveal
 */

/**
 * Interaction mode for the hero brush.
 */
export type HeroRevealMode = 'hover' | 'drag';

/**
 * Options for the hero scratch-reveal canvas effect.
 */
export type HeroRevealOptions = {
  /** Image drawn on the canvas (scratched away to reveal the base layer) */
  topImageSrc: string;
  /** Brush radius in CSS pixels */
  brushRadius: number;
  /** Softness of the brush edge (0–1) */
  brushSoftness: number;
};
