/**
 * @file Feature — home featured carousel lineup (DA v3, 4 flagship projects)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const html = readFileSync(resolve(process.cwd(), 'pages/index.html'), 'utf8')
  .replace(/\s+/g, ' ')
  .replace(/ >/g, '>');

const SLIDES = [
  {
    slug: 'lab-horizon',
    numeral: 'N° I',
    meta: 'SAE 501, projet d’équipe à l’IUT de Nouvelle-Calédonie, en 2026',
  },
  { slug: 'magicallab', numeral: 'N° II', meta: 'Projet de cours à l’IUT, en 2026' },
  {
    slug: 'micromonde',
    numeral: 'N° III',
    meta: 'Projet d’équipe à l’Université de la Nouvelle-Calédonie, en 2026',
  },
  {
    slug: 'village-jeunes',
    numeral: 'N° IV',
    meta: 'Alternance chez Visualcom, pour le client Vill’âge Jeunes, en 2026',
  },
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
      expect(html, slug).toContain(`<span class="cartel__number">${numeral}</span>`);
      expect(html, slug).toContain(`<span class="cartel__context">${meta}</span>`);
    }
    expect(html.match(/class="project-carousel__image graded-image__img"/g)).toHaveLength(4);
  });

  it('shows primary tech logos (official logo + name, see tech-logos.test.ts)', () => {
    const carousel = /data-project-carousel[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
    expect(carousel.match(/tech-logo__label">React</g)).toHaveLength(2);
    expect(carousel).toContain('tech-logo__label">Blender<');
    expect(carousel).toContain('tech-logo__label">JavaScript<');
  });

  it('uses the catalogue titles (no « (DDEC) » suffix)', () => {
    expect(html).not.toContain('(DDEC)');
    expect(html).toContain('Voir le projet Vill’âge Jeunes');
    const titles = [...html.matchAll(/project-carousel__title"><span>([^<]+)</g)].map((m) => m[1]);
    expect(titles).toEqual(['Lab Horizon', 'MagicalLab', 'Micro-monde', 'Vill’âge Jeunes']);
  });

  it('no longer ships DA v2 decor on the home page', () => {
    expect(html).not.toContain('home-decor');
  });
});
