/**
 * @file Unit — site-nav + site-footer (B8 / B9)
 */
import { describe, expect, it } from 'vitest';
import { initSiteNav } from '../../src/scripts/components/site-nav';
import { initSiteFooter } from '../../src/scripts/components/site-footer';

describe('site-nav', () => {
  it('toggles aria-expanded on click', () => {
    document.body.innerHTML = `
      <button data-nav-toggle type="button" aria-expanded="false" hidden></button>
      <ul data-nav-list></ul>
    `;
    initSiteNav();
    const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]')!;
    expect(toggle.hidden).toBe(false);
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('site-footer', () => {
  it('sets current year on [data-year]', () => {
    document.body.innerHTML = `<span data-year></span>`;
    initSiteFooter();
    expect(document.querySelector('[data-year]')!.textContent).toBe(
      String(new Date().getFullYear()),
    );
  });
});
