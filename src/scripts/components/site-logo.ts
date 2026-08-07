/**
 * @file Site logo — resolve Vite asset URL
 * @module components/site-logo
 * @description Sets logo `src` from the bundled SVG so the mark loads in
 *   `vite` / `vite build` regardless of `public/` path quirks.
 */

import logoUrl from '../../assets/brand/logo-leandre.svg';

/**
 * Assigns the bundled logo URL to every `[data-site-logo]` image.
 */
export function initSiteLogo(): void {
  document.querySelectorAll<HTMLImageElement>('[data-site-logo]').forEach((img) => {
    img.src = logoUrl;
  });
}
