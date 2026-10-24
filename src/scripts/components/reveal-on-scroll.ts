/**
 * @file Reveal on scroll
 * @module components/reveal-on-scroll
 * @description Adds `is-visible` to `[data-reveal]` elements entering the viewport.
 */

/**
 * Observes reveal targets and fades them in once.
 * @returns Teardown function disconnecting the observer.
 */
export function initRevealOnScroll(): () => void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

  if (targets.length === 0) {
    return () => undefined;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return () => undefined;
  }

  targets.forEach((target) => target.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  targets.forEach((target) => observer.observe(target));

  return () => observer.disconnect();
}
