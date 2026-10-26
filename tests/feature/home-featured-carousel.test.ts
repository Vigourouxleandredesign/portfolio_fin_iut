/**
 * @file Feature — home featured carousel lineup (DA v3, 4 flagship projects)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const html = readFileSync(resolve(process.cwd(), 'pages/index.html'), 'utf8');

const SLIDES = [
  { slug: 'lab-horizon', numeral: 'N° I', meta: '2026 · SAE 501' },
  { slug: 'magicallab', numeral: 'N° II', meta: '2026 · Projet IUT' },
  { slug: 'micromonde', numeral: 'N° III', meta: '2026 · Nuit de la Science' },
  { slug: 'village-jeunes', numeral: 'N° IV', meta: '2026 · Alternance' },
] as const;

describe('Home featured carousel', () => {
  it('features Lab Horizon, MagicalLab, Micro-monde and Vill’âge Jeunes, in order I → IV', () => {
    const hrefs = [...html.matchAll(/class="project-carousel__link" href="([^"]+)"/g)].map(
      (match) => match[1],
    );
    expect(hrefs).toEqual(SLIDES.map((slide) => `/projects/${slide.slug}`));
  });

  it('keeps Visualcom and Pacific Dataviz out of the carousel', () => {
    expect(html).not.toContain('data-carousel-image="visualcom"');
    expect(html).not.toContain('data-carousel-image="pacific-dataviz"');
  });

  it('gives every slide a graded cover and a cartel at the project pigment', () => {
    for (const { slug, numeral, meta } of SLIDES) {
      expect(html, slug).toContain(`data-carousel-image="${slug}"`);
      expect(html, slug).toContain(`cartel cartel--${slug}`);
      expect(html, slug).toContain(`${numeral} · ${meta}`);
    }
    expect(html.match(/class="project-carousel__image graded-image__img"/g)).toHaveLength(4);
  });

  it('shows primary tech badges', () => {
    expect(html.match(/>React<\/span>/g)).toHaveLength(2);
    expect(html).toContain('>Blender</span>');
    expect(html).toContain('>JS</span>');
  });

  it('uses the catalogue titles (no « (DDEC) » suffix)', () => {
    expect(html).not.toContain('(DDEC)');
    expect(html).toContain('Vill’âge Jeunes — Voir le projet');
    const titles = [...html.matchAll(/project-carousel__title"><span>([^<]+)</g)].map((m) => m[1]);
    expect(titles).toEqual(['Lab Horizon', 'MagicalLab', 'Micro-monde', 'Vill’âge Jeunes']);
  });

  it('no longer ships DA v2 decor on the home page', () => {
    expect(html).not.toContain('home-decor');
  });
});
