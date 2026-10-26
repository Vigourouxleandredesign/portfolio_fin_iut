/**
 * @file Feature — project page template (DA v3): meta, single h1, alt text, project-nav, cartel
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Catalogue order (docs/content/projects/_TEMPLATE.md). */
const PROJECT_SLUGS = [
  'lab-horizon',
  'magicallab',
  'micromonde',
  'village-jeunes',
  'visualcom',
  'hyperloop',
  'back-springboot',
  'pacific-dataviz',
  'borne-2bealive',
] as const;

/**
 * Pages already migrated to the DA v3 template (cartel + page-hero).
 * Each project lot (L3b/c/d) adds its slugs here when it migrates its pages.
 */
const MIGRATED_SLUGS: readonly string[] = [
  'lab-horizon',
  'micromonde',
  'village-jeunes',
  'hyperloop',
  'back-springboot',
  'pacific-dataviz',
  'borne-2bealive',
];

/** Pages migrated onto the legacy stage layout (project-stage) with DA v3 cartel, beam and graded images. */
const STAGE_MIGRATED_SLUGS: readonly string[] = ['visualcom', 'magicallab'];

const read = (slug: string): string =>
  readFileSync(resolve(process.cwd(), `pages/projects/${slug}.html`), 'utf8');

describe('project pages — shared requirements', () => {
  it.each(PROJECT_SLUGS)('%s has a single h1 and a meta description', (slug) => {
    const html = read(slug);
    expect(html.match(/<h1[\s>]/g), 'h1 count').toHaveLength(1);
    expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]{20,}"/);
  });

  it.each(PROJECT_SLUGS)('%s has no image without an alt attribute', (slug) => {
    const images = read(slug).match(/<img\b[^>]*>/g) ?? [];
    expect(images.length).toBeGreaterThan(0);
    for (const tag of images) {
      expect(tag, tag).toMatch(/\balt=/);
    }
  });

  it.each(PROJECT_SLUGS)('%s ends with a project-nav linking previous and next', (slug) => {
    const html = read(slug);
    const index = PROJECT_SLUGS.indexOf(slug);
    const previous = PROJECT_SLUGS[(index - 1 + PROJECT_SLUGS.length) % PROJECT_SLUGS.length];
    const next = PROJECT_SLUGS[(index + 1) % PROJECT_SLUGS.length];
    const nav = /<nav class="project-nav"[\s\S]*?<\/nav>/.exec(html)?.[0] ?? '';
    expect(nav, 'project-nav block').not.toBe('');
    expect(nav).toContain(`href="/pages/projects/${previous}.html"`);
    expect(nav).toContain(`href="/pages/projects/${next}.html"`);
    expect(nav).toContain('href="/pages/projects.html"');
  });

  it.each(PROJECT_SLUGS)('%s never links to the protected jury sheets', (slug) => {
    expect(read(slug)).not.toContain('/jury/fiches/');
  });
});

const NAV_NAMES: Record<string, string> = {
  'lab-horizon': 'Lab Horizon',
  magicallab: 'MagicalLab',
  micromonde: 'Micro-monde',
  'village-jeunes': 'Vill’âge Jeunes',
  visualcom: 'Visualcom',
  hyperloop: 'HyperLoop NC',
  'back-springboot': 'Bibliothèque Spring Boot',
  'pacific-dataviz': 'Pacific Dataviz Challenge',
  'borne-2bealive': 'Borne tactile 2BeAlive',
};

describe('project pages — consistent naming', () => {
  it.each(PROJECT_SLUGS)('%s title carries the shared suffix', (slug) => {
    expect(read(slug)).toMatch(/<title>[^<]+ — Léandre Vigouroux<\/title>/);
  });

  it.each(PROJECT_SLUGS)('%s navigation names match the catalogue', (slug) => {
    const nav = /<nav class="project-nav"[\s\S]*?<\/nav>/.exec(read(slug))?.[0] ?? '';
    const index = PROJECT_SLUGS.indexOf(slug);
    const previous = PROJECT_SLUGS[(index + PROJECT_SLUGS.length - 1) % PROJECT_SLUGS.length];
    const next = PROJECT_SLUGS[(index + 1) % PROJECT_SLUGS.length];
    expect(nav).toContain(`project-nav__name">${NAV_NAMES[previous]}<`);
    expect(nav).toContain(`project-nav__name">${NAV_NAMES[next]}<`);
  });
});

describe('project pages — DA v3 template', () => {
  it.each(MIGRATED_SLUGS)('%s uses the cartel, page-hero and graded images', (slug) => {
    const html = read(slug);
    expect(html).toContain('class="cartel cartel--');
    expect(html).toContain('class="page-hero project-hero"');
    expect(html).toContain('class="light-beam"');
    // text-only pages (no capture yet) carry a pigment stain instead of a graded image
    expect(html).toMatch(/graded-image__img|paint-mask/);
    expect(html).toMatch(/<meta\s+property="og:image"/);
  });
});

describe('project pages — DA v3 on the stage layout', () => {
  it.each(STAGE_MIGRATED_SLUGS)('%s has a cartel, a light beam and graded visuals', (slug) => {
    const html = read(slug);
    expect(html).toContain('class="cartel cartel--');
    expect(html).toContain('class="light-beam"');
    expect(html).toContain('graded-image__img');
    expect(html).toContain('project-page--');
  });
});

describe('Lab Horizon page', () => {
  const html = read('lab-horizon');

  it('follows the brief: cartel, brief, 4 story blocks, 7 domains', () => {
    expect(html).toContain('N° I · 2026 · SAE 501');
    expect(html).toContain('React 19 · TypeScript · Laravel 12 · MySQL · Docker');
    expect(html.match(/class="project-brief__item"/g)).toHaveLength(3);
    expect(html.match(/<article class="project-story__block/g)).toHaveLength(4);
    expect(html.match(/domaines\/[a-z]+\.webp/g)).toHaveLength(7);
  });

  it('publishes no demo URL, no credential and no unconfirmed claim', () => {
    // The site's own domain is allowed (canonical, share preview): only third-party demos are not.
    expect(html.replaceAll('https://vigourouxleandre.netlify.app', '')).not.toMatch(/netlify\.app/);
    expect(html).not.toMatch(/labhorizon\.nc/);
    expect(html).not.toContain('[À CONFIRMER]');
    expect(html).not.toContain('class="project-takeaway');
    expect(html).toContain('<!-- TODO');
  });
});

describe('Micro-monde page — AR captures (L9)', () => {
  const html = readFileSync(resolve(process.cwd(), 'pages/projects/micromonde.html'), 'utf8');

  it.each([
    'micromonde-ar-hibiscus.webp',
    'micromonde-ar-tortue-avant.webp',
    'micromonde-ar-tortue-apres.webp',
    'micromonde-ar-loriquet.webp',
    'micromonde-ar-loriquet-mobile.webp',
  ])('uses %s', (file) => {
    expect(html).toContain(`shots/${file}`);
  });

  it('keeps the spare capture out of the page and leaves no TODO L6', () => {
    expect(html).not.toContain('micromonde-ar-tortue-mobile');
    expect(html).not.toContain('TODO L6');
  });

  it('serves the lorikeet as a responsive <picture> (portrait under 48 rem)', () => {
    expect(html).toMatch(
      /<picture>\s*<source[^>]*media="\(max-width: 48rem\)"[^>]*micromonde-ar-loriquet-mobile\.webp/,
    );
  });
});
