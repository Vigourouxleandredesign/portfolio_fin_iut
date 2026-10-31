/**
 * @file Feature — Visualcom stage + dual mockup (C5) + listing links (C2)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Catalogue order I → IX (docs/content/projects/_TEMPLATE.md). */
const CATALOGUE_TITLES = [
  'Lab Horizon',
  'MagicalLab',
  'Micro-monde',
  'Vill’âge Jeunes',
  'Visualcom',
  'HyperLoop NC',
  'Bibliothèque Spring Boot',
  'Pacific Dataviz Challenge',
  'Borne tactile 2BeAlive',
];

describe('C5 — Visualcom stage + dual-device mockup', () => {
  const html = readFileSync(resolve(process.cwd(), 'pages/projects/visualcom.html'), 'utf8');

  it('uses full-bleed stage composition', () => {
    expect(html).toContain('project-stage');
    expect(html).toContain('project-stage__compose');
  });

  it('keeps dual-device marble shots mockup', () => {
    expect(html).toContain('data-preview-mode="shots"');
    expect(html).toContain('laptop-iphone-marble.png');
    expect(html).toContain('mockup-screens.png');
    expect(html).toContain('project-detail__mockup--laptop-phone');
  });

  // L15: template v2 replaces the bento galleries; chapter I carries the expertises capture.
  it('illustrates the « need » chapter with the new expertises section', () => {
    expect(html).toContain('section-expertises.png');
  });

  it('adds the AI challenge block without exposing infrastructure details', () => {
    expect(html).toContain('Relier WordPress à l’IA avec des droits limités');
    expect(html.replace(/\s+/g, ' ')).toContain('sans droit de suppression');
    expect(html).not.toContain('refonte.visualcom.nc');
    expect(html).toContain('<span class="cartel__number">N° V</span>');
    expect(html).toContain('Alternance chez Visualcom, en 2026');
  });

  it('keeps the long version one card away (« Lire ma version longue » → #recit-complet)', () => {
    expect(html).toContain('class="project-further__card" href="#recit-complet"');
    expect(html).toContain('id="recit-complet"');
  });

  it('has no leftover Supabase-era evaluator card and no site capture behind the hero', () => {
    expect(html).not.toMatch(/Phase B|évaluateur|data-project-reflective/);
    const atmosphere = /project-stage__atmosphere[\s\S]*?<\/div>/.exec(html)?.[0] ?? '';
    expect(atmosphere).toContain('hero-atmosphere.jpg');
    expect(atmosphere).not.toContain('desktop.webp');
  });

  it('applies the spelling corrections of the long version', () => {
    const flat = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(flat).toContain('J’avais donc une semaine');
    expect(flat).toContain('je pouvais travailler');
    expect(flat).not.toMatch(/J’aurais donc 1 semaine/);
  });

  it('links mockup / CTA to the live site in a new tab', () => {
    expect(html).toContain('https://visualcom.nc');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe('C2 — projects listing card links', () => {
  const html = readFileSync(resolve(process.cwd(), 'pages/projects.html'), 'utf8')
    .replace(/\s+/g, ' ')
    .replace(/ >/g, '>');

  it('lists the 9 projects in catalogue order I → IX, Lab Horizon first', () => {
    const hrefs = [...html.matchAll(/class="project-card__link" href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual([
      '/projects/lab-horizon',
      '/projects/magicallab',
      '/projects/micromonde',
      '/projects/village-jeunes',
      '/projects/visualcom',
      '/projects/hyperloop',
      '/projects/back-springboot',
      '/projects/pacific-dataviz',
      '/projects/borne-2bealive',
    ]);
  });

  it('numbers cards with Mono cartel metadata and graded covers', () => {
    for (const numeral of ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']) {
      expect(html).toMatch(
        new RegExp('project-card__meta"> ?<span class="cartel__number">N° ' + numeral + '</span>'),
      );
    }
    expect(html).toContain('project-card--lab-horizon');
    expect(html.match(/project-card__visual graded-image/g)).toHaveLength(9);
  });

  it('uses the exact titles and descriptions of the case-study pages', () => {
    const titles = [...html.matchAll(/class="project-card__title">([^<]+)</g)].map((m) => m[1]);
    expect(titles).toEqual(CATALOGUE_TITLES);
    expect(html).toContain('La recherche calédonienne expliquée au grand public');
    expect(html).toContain('Finaliste 2025');
    expect(html).not.toContain('Refonte site Visualcom');
    expect(html).not.toContain('(DDEC)');
  });

  it('puts 3D and product-design cards under the filter categories of the template', () => {
    const categories = [...html.matchAll(/data-project-category="([^"]+)"/g)].map((m) =>
      m[1].split(' '),
    );
    expect(categories).toHaveLength(9);
    const flat = new Set(categories.flat());
    for (const id of [
      'interactive-devices',
      'web-development',
      'webdesign',
      'product-design',
      '3d',
    ]) {
      expect(flat.has(id), id).toBe(true);
    }
    expect(categories[8]).toEqual(['product-design', '3d']);
  });

  it('uses the shared title suffix', () => {
    expect(html).toContain('<title>Mes projets | Léandre Vigouroux</title>');
  });

  it('links Lab Horizon card to its case study', () => {
    expect(html).toContain('href="/projects/lab-horizon"');
  });

  it('links MagicalLab card to its case study', () => {
    expect(html).toContain('href="/projects/magicallab"');
  });

  it('links Micro-monde card to its case study', () => {
    expect(html).toContain('href="/projects/micromonde"');
  });

  it('links Visualcom card to its case study', () => {
    expect(html).toContain('href="/projects/visualcom"');
  });
});
