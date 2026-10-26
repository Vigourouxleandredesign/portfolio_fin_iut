/**
 * @file Feature — official technology logos (L12 part B)
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

/** Prettier wraps long inline markup: compare on whitespace-collapsed HTML. */
const flat = (html: string): string =>
  html.replace(/\s+/g, ' ').replace(/ >/g, '>').replace(/> </g, '><');

const home = flat(read('pages/index.html'));
const catalogue = flat(read('pages/projects.html'));
const css = read('src/styles/components/tech-logo.css');
const variables = read('src/styles/variables.css');

/** logo key → [asset file, brand token] — Angular is the official gradient file supplied by Léandre. */
const LOGOS: Record<string, [string, string | null]> = {
  react: ['react.svg', '--color-brand-react'],
  laravel: ['laravel.svg', '--color-brand-laravel'],
  docker: ['docker.svg', '--color-brand-docker'],
  threejs: ['threedotjs.svg', '--color-brand-threejs'],
  blender: ['blender.svg', '--color-brand-blender'],
  javascript: ['javascript.svg', '--color-brand-javascript'],
  wordpress: ['wordpress.svg', '--color-brand-wordpress'],
  springboot: ['springboot.svg', '--color-brand-springboot'],
  figma: ['figma.svg', '--color-brand-figma'],
};

describe('logo assets and colours', () => {
  it.each(Object.entries(LOGOS))(
    '%s has its SVG, its brand token and its mask rule',
    (key, [file, token]) => {
      expect(existsSync(resolve(root, 'src/assets/tech', file))).toBe(true);
      expect(variables).toMatch(new RegExp(`${token}: #[0-9a-f]{6};`));
      expect(css).toContain(`.tech-logo--${key} .tech-logo__icon`);
      expect(css).toContain(`assets/tech/${file}`);
    },
  );

  it('keeps every file of src/assets/tech in use (no orphan)', () => {
    const used = `${css}${home}${catalogue}`;
    for (const file of readdirSync(resolve(root, 'src/assets/tech'))) {
      if (file === 'README.md') continue;
      expect(used, file).toContain(file);
    }
  });

  it('documents the source, version and licence', () => {
    const readme = read('src/assets/tech/README.md');
    expect(readme).toMatch(/Simple Icons/);
    expect(readme).toMatch(/16\.36\.0/);
    expect(readme).toMatch(/CC0/);
    expect(readme).toMatch(/marques de leurs propriétaires/);
  });

  it('ships Angular as the supplied multi-colour file, without embedded metadata', () => {
    const svg = read('src/assets/tech/angular.svg');
    expect(svg).toContain('<title>Angular</title>');
    expect(svg).toContain('linearGradient');
    expect(svg).not.toContain('<metadata');
  });
});

describe('logos are named', () => {
  it.each([
    ['home', home],
    ['catalogue', catalogue],
  ])('every logo of the %s page carries its name as text', (_name, html) => {
    const logos = [...html.matchAll(/<span class="tech-logo[ "][\s\S]*?<\/span><\/span>/g)].map(
      (m) => m[0],
    );
    expect(logos.length).toBeGreaterThan(3);
    for (const logo of logos) {
      const label = /class="tech-logo__label">([^<]+)</.exec(logo)?.[1] ?? '';
      expect(label.trim().length, logo).toBeGreaterThan(1);
    }
  });

  it('hides the decorative mask icon from assistive technology', () => {
    for (const html of [home, catalogue]) {
      for (const icon of html.match(/<span class="tech-logo__icon"[^>]*>/g) ?? []) {
        expect(icon).toContain('aria-hidden="true"');
      }
      for (const image of html.match(/<img class="tech-logo__image"[^>]*>/g) ?? []) {
        expect(image).toContain('alt=""');
      }
    }
  });

  it('shows names on hover and when the card has the focus (no title-only tooltip)', () => {
    expect(css).toContain('.tech-logo:hover .tech-logo__label');
    expect(css).toContain('.project-card:hover .tech-logo__label');
    expect(css).toContain('.project-card:focus-within .tech-logo__label');
    expect(`${home}${catalogue}`).not.toMatch(/class="tech-logo[^"]*"[^>]*\stitle=/);
  });
});

describe('every project shows its technologies as logos', () => {
  const cards = catalogue.split(/<article class="project-card /).slice(1);

  it('lists 9 cards in a <ul> of tags', () => {
    expect(cards).toHaveLength(9);
    for (const card of cards) expect(card).toContain('<ul class="project-card__tags">');
  });

  it('shows at least one official logo on every card, except Borne (no brand technology to cite)', () => {
    for (const card of cards) {
      const slug = /href="\/projects\/([a-z0-9-]+)"/.exec(card)?.[1] ?? '';
      const hasLogo = /tech-logo__icon|tech-logo__image/.test(card);
      if (slug === 'borne-2bealive') {
        expect(hasLogo, slug).toBe(false);
      } else {
        expect(hasLogo, slug).toBe(true);
      }
    }
  });

  it('keeps non-brand tags (AR, UI/UX, Motion…) as text in the same pastille', () => {
    for (const label of ['AR', 'UI/UX', 'Motion', '3D', 'UI']) {
      expect(catalogue).toContain(
        `<span class="tech-logo tech-logo--text"><span class="tech-logo__label">${label}</span></span>`,
      );
    }
  });

  it('shows a labelled logo on each of the 4 carousel covers', () => {
    const badges =
      home.match(/<span class="project-carousel__tech">[\s\S]*?<\/span><\/span><\/span>/g) ?? [];
    expect(badges).toHaveLength(4);
    for (const badge of badges) expect(badge).toContain('tech-logo--labelled');
  });
});

describe('tech logo stylesheet is loaded where logos appear', () => {
  it('is imported by the home and catalogue entries', () => {
    for (const entry of ['home', 'projects']) {
      expect(read(`src/scripts/entries/${entry}.ts`)).toContain('components/tech-logo.css');
    }
    expect(existsSync(join(root, 'src/styles/components/tech-logo.css'))).toBe(true);
  });
});
