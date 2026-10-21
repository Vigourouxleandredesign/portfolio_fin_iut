/**
 * @file Unit — home-brush reduced-motion no-op (B11)
 */
import { describe, expect, it, vi } from 'vitest';
import { initHomeBrush } from '../../src/scripts/features/home-brush/home-brush';

describe('home-brush', () => {
  it('no-ops under prefers-reduced-motion', () => {
    document.body.innerHTML = `<main><canvas data-home-brush></canvas></main>`;
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    const root = document.querySelector('main')!;
    const teardown = initHomeBrush(root);
    expect(() => teardown()).not.toThrow();
  });
});
