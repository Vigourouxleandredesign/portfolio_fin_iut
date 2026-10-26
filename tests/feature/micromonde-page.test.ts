/**
 * @file Feature — Micro-monde page (L3b): Kuby Kolor credit, mobile demo link, no iframe
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const html = readFileSync(resolve(root, 'pages/projects/micromonde.html'), 'utf8');

describe('Micro-monde page', () => {
  it('credits the fresco artist Kuby Kolor', () => {
    expect(html).toContain('Fresques&#8239;: Kuby Kolor.');
    expect(html).toContain('Propositions de fresques de Kuby Kolor');
  });

  it('opens the AR demo in a new tab, safely', () => {
    const links = [...html.matchAll(/<a\b[^>]*micromonde-ar\.netlify\.app[^>]*>/g)].map(
      (m) => m[0],
    );
    expect(links.length).toBeGreaterThan(0);
    for (const tag of links) {
      expect(tag).toContain('target="_blank"');
      expect(tag).toContain('rel="noopener noreferrer"');
    }
  });

  it('embeds no iframe (mobile-only AR)', () => {
    expect(html).not.toMatch(/<iframe/i);
  });

  it('follows the brief and shows the AR captures (no pending TODO left)', () => {
    expect(html).toContain('N° III · 2026 · Nuit de la Science, UNC');
    expect(html).toContain('Blender · 8th Wall · Three.js · Vite · TypeScript');
    expect(html).not.toContain('TODO L6');
    expect(html).not.toContain('[À CONFIRMER]');
    expect(html).not.toMatch(/bient[ôo]t|à venir/i);
  });

  it('only uses Micro-monde assets (plus shared decor and mockups)', () => {
    const sources = [...html.matchAll(/\ssrc="(\/src\/assets\/[^"]+)"/g)].map((m) => m[1]);
    for (const src of sources) {
      expect(src, src).toMatch(
        /^\/src\/assets\/(projects\/micromonde\/|decor\/paint\/|mockups\/|brand\/)/,
      );
      expect(existsSync(resolve(root, src.slice(1))), src).toBe(true);
    }
  });
});
