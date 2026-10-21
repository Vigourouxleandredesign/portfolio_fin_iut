/**
 * @file Unit — project-carousel (B4)
 */
import { describe, expect, it } from 'vitest';
import { initProjectCarousel } from '../../src/scripts/components/project-carousel';

function mountCarousel(count: number): HTMLElement {
  const slides = Array.from({ length: count }, (_, i) => {
    const current = i === 0 ? ' data-current' : '';
    return `<div data-carousel-slide${current}></div>`;
  }).join('');
  document.body.innerHTML = `
    <div data-project-carousel>
      ${slides}
      <button data-carousel-prev type="button">Prev</button>
      <button data-carousel-next type="button">Next</button>
    </div>
  `;
  return document.querySelector('[data-project-carousel]')!;
}

describe('project-carousel', () => {
  it('no-ops teardown when there are no slides', () => {
    document.body.innerHTML = `<div data-project-carousel></div>`;
    const root = document.querySelector<HTMLElement>('[data-project-carousel]')!;
    const teardown = initProjectCarousel(root);
    expect(() => teardown()).not.toThrow();
  });

  it('advances current slide on next', () => {
    const root = mountCarousel(3);
    initProjectCarousel(root);
    root.querySelector<HTMLButtonElement>('[data-carousel-next]')!.click();
    const slides = [...root.querySelectorAll('[data-carousel-slide]')];
    expect(slides[1].hasAttribute('data-current')).toBe(true);
    expect(slides[0].hasAttribute('data-current')).toBe(false);
  });
});
