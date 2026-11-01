/**
 * @file Feature — one-line cartels, tools row, no vertical rule (L14 part C)
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');
/** Prettier wraps long inline markup: compare on whitespace-collapsed HTML (single spaces are kept). */
const flat = (path: string): string => read(path).replace(/\s+/g, ' ').replace(/ >/g, '>');

/** Number → context sentence (L14, written with linking words). */
const CONTEXTS: Record<string, string> = {
  I: 'SAE 501, projet d’équipe à l’IUT de Nouvelle-Calédonie, en 2026',
  II: 'Projet de cours à l’IUT, en 2026',
  III: 'Projet d’équipe à l’Université de la Nouvelle-Calédonie, en 2026',
  IV: 'Alternance chez Visualcom, pour le client Vill’âge Jeunes, en 2026',
  V: 'Alternance chez Visualcom, en 2026',
  VI: 'Devoir Angular de la LP MIAW, en 2026',
  VII: 'TP back-end de la LP MIAW, en 2026',
  VIII: 'Pacific Dataviz Challenge, 2e de la catégorie Pacifique, en 2025',
  IX: 'Mission chez Visualcom, en 2025',
};
const SLUG_NUMBER: Record<string, string> = {
  'lab-horizon': 'I',
  magicallab: 'II',
  micromonde: 'III',
  'village-jeunes': 'IV',
  visualcom: 'V',
  hyperloop: 'VI',
  'back-springboot': 'VII',
  'pacific-dataviz': 'VIII',
  'borne-2bealive': 'IX',
};

const cartelPattern =
  /<span class="cartel__number">N° ([IVX]+)<\/span> <span class="cartel__context">([^<]+)<\/span>/g;

describe('cartels: a number, then a sentence', () => {
  it.each(Object.entries(SLUG_NUMBER))(
    '%s hero cartel is one line with two elements',
    (slug, numeral) => {
      const html = flat(`pages/projects/${slug}.html`);
      const meta = (/<dd class="cartel__meta">([\s\S]*?)<\/dd>/.exec(html)?.[1] ?? '').trim();
      expect(meta).toBe(
        `<span class="cartel__number">N° ${numeral}</span> <span class="cartel__context">${CONTEXTS[numeral]}</span>`,
      );
      expect(html).not.toContain('cartel__stack');
    },
  );

  it('catalogue cards and carousel use the same cartel, 9 and 4 of them', () => {
    const catalogue = [...flat('pages/projects.html').matchAll(cartelPattern)];
    expect(catalogue.map((match) => match[1])).toEqual(Object.values(SLUG_NUMBER));
    for (const [, numeral, context] of catalogue) expect(context).toBe(CONTEXTS[numeral]);
    const carousel = [...flat('pages/index.html').matchAll(cartelPattern)];
    expect(carousel.map((match) => match[1])).toEqual(['I', 'II', 'III', 'IV']);
  });

  it('no cartel contains a separator dot or more than two elements', () => {
    const pages = [
      ...readdirSync(resolve(root, 'pages/projects')).map((name) => `pages/projects/${name}`),
      'pages/projects.html',
      'pages/index.html',
    ];
    for (const page of pages) {
      const html = flat(page);
      for (const meta of html.match(
        /<(?:dd|p) class="(?:cartel__meta|project-card__meta)">[\s\S]*?<\/(?:dd|p)>/g,
      ) ?? []) {
        expect(meta, page).not.toContain(' · ');
        expect((meta.match(/<span /g) ?? []).length, page).toBe(2);
      }
      for (const eyebrow of html.match(/<p class="project-carousel__eyebrow">[\s\S]*?<\/p>/g) ??
        []) {
        expect(eyebrow, page).not.toContain(' · ');
      }
    }
  });

  it('writes each context as a sentence with linking words, never a list of fragments', () => {
    for (const context of Object.values(CONTEXTS)) {
      expect(context).toMatch(/\b(à|chez|de|du|pour|en)\b/);
      expect(context).not.toContain(' - ');
      expect(context).not.toContain('·');
    }
  });
});

describe('cartel style', () => {
  const css = read('src/styles/components/cartel.css');

  it('has no vertical rule and no padding for it', () => {
    const block = /\.cartel \{[^}]*\}/.exec(css)?.[0] ?? '';
    expect(block).not.toContain('border-left');
    expect(block).not.toContain('padding-left');
  });

  it('sets the number in Ubuntu Mono gold with 0.04em spacing and the context in normal case', () => {
    expect(css).toMatch(/\.cartel__number \{[^}]*font-family: var\(--font-mono\)/);
    expect(css).toMatch(/\.cartel__number \{[^}]*letter-spacing: 0\.04em/);
    expect(css).toMatch(/\.cartel__number \{[^}]*color: var\(--color-pigment-gold\)/);
    expect(css).toMatch(/\.cartel__context \{[^}]*text-transform: none/);
    expect(css).toMatch(/\.cartel__meta \{[^}]*column-gap: 0\.875rem/);
  });
});

describe('« Outils » row at the end of each project page', () => {
  it.each(Object.keys(SLUG_NUMBER))('%s has it, before the navigation', (slug) => {
    const html = flat(`pages/projects/${slug}.html`);
    const tools = html.indexOf('class="project-tools"');
    const nav = html.indexOf('<nav class="project-nav"');
    expect(tools).toBeGreaterThan(0);
    expect(tools).toBeLessThan(nav);
    expect(html).toContain('>Outils</h2>');
    const list = /<ul class="project-tools__list">([\s\S]*?)<\/ul>/.exec(html)?.[1] ?? '';
    expect((list.match(/<li>/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it('keeps at most 3 technology pastilles on a catalogue card', () => {
    const cards = flat('pages/projects.html')
      .split(/<article class="project-card /)
      .slice(1);
    for (const card of cards) {
      const tags = /<ul class="project-card__tags">([\s\S]*?)<\/ul>/.exec(card)?.[1] ?? '';
      expect((tags.match(/<li class="project-card__tag">/g) ?? []).length).toBeLessThanOrEqual(3);
    }
  });
});
