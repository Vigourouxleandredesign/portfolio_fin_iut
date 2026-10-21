/**
 * @file Unit — reveal-on-scroll (B5)
 */
import { describe, expect, it, vi } from 'vitest';
import { initRevealOnScroll } from '../../src/scripts/components/reveal-on-scroll';

describe('reveal-on-scroll', () => {
  it('marks all targets visible under prefers-reduced-motion', () => {
    document.body.innerHTML = `<div data-reveal></div><div data-reveal></div>`;
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    initRevealOnScroll();
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      expect(el.classList.contains('is-visible')).toBe(true);
    });
  });
});
