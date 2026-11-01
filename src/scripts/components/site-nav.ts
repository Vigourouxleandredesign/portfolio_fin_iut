/**
 * @file Site navigation — mobile disclosure
 * @module components/site-nav
 * @description Toggles the main nav list on small screens; Escape or a tap outside closes it. Markup stays in HTML for SEO.
 */

/**
 * Wires the mobile navigation toggle.
 * @returns Teardown function removing listeners.
 */
export function initSiteNav(): () => void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const list = document.querySelector<HTMLElement>('[data-nav-list]');

  if (!toggle || !list) {
    return () => undefined;
  }

  const setOpen = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    list.dataset.navOpen = String(open);
  };

  const onToggle = (): void => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  };

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  };

  /** A tap or click outside the open menu closes it (phones: the menu covers the page). */
  const onPointerdown = (event: PointerEvent): void => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    const target = event.target;
    if (target instanceof Node && !list.contains(target) && !toggle.contains(target)) {
      setOpen(false);
    }
  };

  setOpen(false);
  toggle.hidden = false;
  toggle.addEventListener('click', onToggle);
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('pointerdown', onPointerdown);

  return () => {
    toggle.removeEventListener('click', onToggle);
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('pointerdown', onPointerdown);
  };
}
