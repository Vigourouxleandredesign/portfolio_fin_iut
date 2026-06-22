/**
 * @file Site metadata — shared constants
 * @module data/site-meta
 * @description Typed site-wide values for pages and future build scripts.
 */

/**
 * Site-wide metadata used across pages.
 */
export type SiteMeta = {
  siteName: string;
  defaultLocale: string;
};

/**
 * Default site metadata.
 */
export const siteMeta: SiteMeta = {
  siteName: 'Portfolio',
  defaultLocale: 'fr',
};
