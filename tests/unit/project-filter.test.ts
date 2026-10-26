/**
 * @file Unit — project-filter: multi-category cards, keyboard-usable buttons (L5b)
 */
import { describe, expect, it } from 'vitest';
import { initProjectFilter } from '../../src/scripts/components/project-filter';

function mount(): void {
  document.body.innerHTML = `
    <div data-project-filter hidden></div>
    <article data-project-category="web-development 3d" id="a"></article>
    <article data-project-category="interactive-devices 3d" id="b"></article>
    <article data-project-category="product-design 3d" id="c"></article>
    <article data-project-category="webdesign" id="d"></article>
    <article data-project-category="web-development" id="e"></article>
  `;
}

const buttons = (): HTMLButtonElement[] => [
  ...document.querySelectorAll<HTMLButtonElement>('.project-filter__button'),
];

describe('project-filter', () => {
  it('builds « Tout » plus one real button per category present on the cards', () => {
    mount();
    initProjectFilter();
    const values = buttons().map((button) => button.dataset.filterValue);
    expect(values).toEqual([
      'all',
      'interactive-devices',
      'web-development',
      'webdesign',
      'product-design',
      '3d',
    ]);
    expect(buttons().every((button) => button.tagName === 'BUTTON')).toBe(true);
  });

  it('shows every card that carries the chosen category, even among several', () => {
    mount();
    initProjectFilter();
    buttons()
      .find((button) => button.dataset.filterValue === '3d')!
      .click();
    const hidden = [...document.querySelectorAll<HTMLElement>('article')]
      .filter((card) => card.hidden)
      .map((card) => card.id);
    expect(hidden).toEqual(['d', 'e']);
  });

  it('keeps the single-category behaviour and resets with « Tout »', () => {
    mount();
    initProjectFilter();
    buttons()
      .find((button) => button.dataset.filterValue === 'web-development')!
      .click();
    expect(document.getElementById('a')!.hidden).toBe(false);
    expect(document.getElementById('b')!.hidden).toBe(true);
    buttons()[0].click();
    expect(document.querySelectorAll('article[hidden]')).toHaveLength(0);
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('true');
  });
});

describe('project-filter — ?domaine= query parameter (L12)', () => {
  const setSearch = (search: string): void => {
    window.history.replaceState(null, '', `/projects${search}`);
  };

  it('opens on the requested domain', () => {
    mount();
    setSearch('?domaine=3d');
    initProjectFilter();
    const hidden = [...document.querySelectorAll<HTMLElement>('article')]
      .filter((card) => card.hidden)
      .map((card) => card.id);
    expect(hidden).toEqual(['d', 'e']);
    const pressed = buttons().filter((button) => button.getAttribute('aria-pressed') === 'true');
    expect(pressed.map((button) => button.dataset.filterValue)).toEqual(['3d']);
  });

  it('falls back to « Tout » for an unknown value', () => {
    mount();
    setSearch('?domaine=nimportequoi');
    initProjectFilter();
    expect(document.querySelectorAll('article[hidden]')).toHaveLength(0);
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('mirrors the chosen filter in the URL (replaceState) and clears it on « Tout »', () => {
    mount();
    setSearch('');
    const before = window.history.length;
    initProjectFilter();
    buttons()
      .find((button) => button.dataset.filterValue === 'webdesign')!
      .click();
    expect(window.location.search).toBe('?domaine=webdesign');
    buttons()[0].click();
    expect(window.location.search).toBe('');
    expect(window.history.length).toBe(before);
  });
});
