/**
 * @file Project detail — expandable narrative
 * @description Optional hash sync when the full case study `<details>` opens.
 */

const DETAILS_SELECTOR = '[data-project-narrative-details]';

/**
 * When narrative details open, set `#recit-complet` for shareable deep links.
 */
export function initProjectDetailNarrative(): void {
  const details = document.querySelector<HTMLDetailsElement>(DETAILS_SELECTOR);
  if (!details) {
    return;
  }

  if (window.location.hash === '#recit-complet') {
    details.open = true;
  }

  details.addEventListener('toggle', () => {
    const hash = '#recit-complet';
    if (details.open) {
      history.replaceState(null, '', hash);
      return;
    }
    if (window.location.hash === hash) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  });
}
