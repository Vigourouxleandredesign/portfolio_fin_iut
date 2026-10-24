/**
 * @file Feature — Vill’âge Jeunes page (L3b): public site link, key figure, client confidentiality
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const html = readFileSync(resolve(root, 'pages/projects/village-jeunes.html'), 'utf8');

describe('Vill’âge Jeunes page', () => {
  it('links the public site in a new tab, safely', () => {
    const tag = /<a\b[^>]*href="https:\/\/villagejeunes\.nc\/"[^>]*>/.exec(html)?.[0] ?? '';
    expect(tag).toContain('target="_blank"');
    expect(tag).toContain('rel="noopener noreferrer"');
  });

  it('highlights the key figure', () => {
    expect(html).toContain('500 inscriptions');
    expect(html).toContain('underline-copper.webp');
  });

  it('uses the dual-device mockup in shots mode', () => {
    expect(html).toContain('data-preview-mode="shots"');
    expect(html).toContain('project-detail__mockup--laptop-phone');
    expect(html).not.toMatch(/<iframe/i);
  });

  it('uses only Vill’âge Jeunes assets (plus shared decor and mockups) that exist', () => {
    const sources = [...html.matchAll(/\ssrc="(\/src\/assets\/[^"]+)"/g)].map((m) => m[1]);
    for (const src of sources) {
      expect(src, src).toMatch(
        /^\/src\/assets\/(projects\/village-jeunes\/|decor\/paint\/|mockups\/|brand\/)/,
      );
      expect(existsSync(resolve(root, src.slice(1))), src).toBe(true);
    }
  });

  it('exposes no staff screen, repository link or jury sheet', () => {
    expect(html).not.toMatch(/github\.com/i);
    expect(html).not.toContain('/jury/fiches/');
    expect(html).not.toMatch(/staff-|espace-staff|admin/i);
    expect(html).not.toContain('[À CONFIRMER]');
  });
});
