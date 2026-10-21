/**
 * @file Unit — project-site-preview (B6)
 */
import { describe, expect, it } from 'vitest';
import { initProjectSitePreview } from '../../src/scripts/components/project-site-preview';

describe('project-site-preview', () => {
  it('skips shot-mode blocks (no iframe wiring)', () => {
    document.body.innerHTML = `
      <div data-project-site-preview data-preview-mode="shots">
        <img alt="" />
      </div>
    `;
    expect(() => initProjectSitePreview()).not.toThrow();
    const block = document.querySelector('[data-project-site-preview]')!;
    expect(block.classList.contains('is-preview-blocked')).toBe(false);
  });

  it('marks block blocked when all iframes error', () => {
    document.body.innerHTML = `
      <div data-project-site-preview>
        <iframe title="a"></iframe>
      </div>
    `;
    initProjectSitePreview();
    const iframe = document.querySelector('iframe')!;
    iframe.dispatchEvent(new Event('error'));
    const block = document.querySelector('[data-project-site-preview]')!;
    expect(block.classList.contains('is-preview-blocked')).toBe(true);
  });
});
