/**
 * @file Site footer — small DOM enhancements
 * @module components/site-footer
 * @description Updates dynamic year in footer without affecting SEO content.
 */

/**
 * Sets the current year on elements matching `[data-year]`.
 */
export function initSiteFooter(): void {
  const year = String(new Date().getFullYear());
  document.querySelectorAll<HTMLElement>('[data-year]').forEach((el) => {
    el.textContent = year;
  });
}
