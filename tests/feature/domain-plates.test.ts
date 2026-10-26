/**
 * @file Feature — home « Ce que je sais faire » section: 5 plaques = 5 catalogue domains (L12 part C)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { skills } from '../../src/data/skills';

const root = resolve(process.cwd());
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');
const flat = (html: string): string =>
  html.replace(/\s+/g, ' ').replace(/ >/g, '>').replace(/> </g, '><');

const home = flat(read('pages/index.html'));
const catalogue = flat(read('pages/projects.html'));

const ORDER = ['interactive-devices', 'web-development', 'webdesign', 'product-design', '3d'];

type Plate = { slug: string; title: string; count: string; logos: string[]; html: string };

const plates: Plate[] = [
  ...home.matchAll(
    /<a class="marble-slab domain-plate" href="\/projects\?domaine=([a-z0-9-]+)"[\s\S]*?<\/a>/g,
  ),
].map((match) => ({
  slug: match[1],
  html: match[0],
  title: /marble-slab__title">([^<]+)</.exec(match[0])?.[1] ?? '',
  count: /marble-slab__meta">([^<]+)</.exec(match[0])?.[1] ?? '',
  logos: [...match[0].matchAll(/tech-logo--([a-z]+)[ "]/g)]
    .map((m) => m[1])
    .filter((name) => !['dark', 'image', 'labelled', 'text'].includes(name)),
}));

/** Cards of the catalogue: categories and logo keys. */
const cards = catalogue
  .split(/<article class="project-card /)
  .slice(1)
  .map((card) => ({
    categories: (/data-project-category="([^"]+)"/.exec(card)?.[1] ?? '').split(' '),
    logos: [...card.matchAll(/tech-logo tech-logo--([a-z]+)/g)]
      .map((m) => m[1])
      .filter((name) => !['dark', 'image', 'labelled', 'text'].includes(name))
      .concat(card.includes('tech-logo--image') ? ['angular'] : []),
  }));

describe('the five domain plaques', () => {
  it('are the five catalogue domains, in the filter order, with « Animation 2D/3D » merged into « Création 3D »', () => {
    expect(plates.map((plate) => plate.slug)).toEqual(ORDER);
    expect(skills.map((skill) => skill.id)).toEqual(ORDER);
    expect(home).not.toContain('Animation 2D/3D');
    expect(plates.map((plate) => plate.title)).toEqual([
      'Dispositifs interactifs',
      'Développement web',
      'Webdesign et UI/UX',
      'Design produit',
      'Création 3D',
    ]);
  });

  it('each link targets a domain that exists in the catalogue filter', () => {
    const known = new Set(cards.flatMap((card) => card.categories));
    for (const plate of plates) expect(known.has(plate.slug), plate.slug).toBe(true);
  });

  it('show the exact number of projects of their domain', () => {
    for (const plate of plates) {
      const expected = cards.filter((card) => card.categories.includes(plate.slug)).length;
      expect(plate.count, plate.slug).toBe(`${expected} projet${expected > 1 ? 's' : ''}`);
    }
  });

  it('show at most 3 logos, all used by the projects of the domain', () => {
    for (const plate of plates) {
      const used = new Set(
        cards.filter((card) => card.categories.includes(plate.slug)).flatMap((card) => card.logos),
      );
      expect(plate.logos.length, plate.slug).toBeLessThanOrEqual(3);
      for (const logo of plate.logos) expect(used.has(logo), `${plate.slug}: ${logo}`).toBe(true);
    }
  });

  it('keep their texts from the review (ACC-16 to ACC-20) and no dash', () => {
    const text = plates.map((plate) => plate.html).join(' ');
    for (const sentence of [
      'Bornes, interfaces tactiles et parcours en réalité augmentée.',
      'Sites et applications web, surtout côté front, avec les bases du back.',
      'Maquettes, design systems et parcours utilisateur.',
      'Croquis, modélisation et fichiers de fabrication d’objets réels.',
      'Modélisation, animation et rendu, jusqu’à l’intégration en temps réel sur le web.',
    ]) {
      expect(text).toContain(sentence);
    }
    expect(text).not.toContain('—');
  });
});

describe('section wiring', () => {
  it('« Parcourir par domaine » scrolls to the section, which has the matching id', () => {
    expect(home).toMatch(/href="#domaines"> ?Parcourir par domaine ?<\/a>/);
    expect(home).toMatch(/<section class="skills-gallery" id="domaines"/);
    expect(home).toContain('Choisissez un domaine pour voir les projets qui s’y rattachent.');
  });

  it('gives each plaque a visible hover / focus state and a bounded layout', () => {
    const css = read('src/styles/components/skills-gallery.css');
    expect(css).toContain('.domain-plate:hover');
    expect(css).toContain('.domain-plate:focus-visible');
    expect(css).toMatch(/\.skills-gallery__track\s*\{[^}]*justify-content: center/);
  });
});
