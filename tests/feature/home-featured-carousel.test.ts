/**
 * @file Feature — home featured carousel lineup (2026)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const html = readFileSync(resolve(process.cwd(), 'pages/index.html'), 'utf8');

describe('Home featured carousel', () => {
  it('features MagicalLab, Micro-monde and Vill’âge Jeunes', () => {
    expect(html).toContain('href="/pages/projects/magicallab.html"');
    expect(html).toContain('href="/pages/projects/micromonde.html"');
    expect(html).toContain('href="/pages/projects/village-jeunes.html"');
    expect(html).not.toContain('data-carousel-image="visualcom"');
    expect(html).not.toContain('data-carousel-image="pacific-dataviz"');
  });

  it('marks all three as 2026 with primary tech badges', () => {
    expect(html.match(/· 2026/g)?.length).toBeGreaterThanOrEqual(3);
    expect(html).toContain('>React</span>');
    expect(html).toContain('>Blender</span>');
    expect(html).toContain('>JS</span>');
  });
});
