/**
 * @file Feature — jury area pages (L4): structure, links, noindex, and « jury text stays out of the bundle »
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

const COMPETENCES = [
  'developpement-front',
  'qualite-securite-performance',
  'client-gestion-projet',
  'strategie-analyse',
] as const;
const PAGES = ['index', ...COMPETENCES] as const;

/** Recursively list files under `dir` ending with `ext`. */
function listFiles(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listFiles(full, ext);
    return full.endsWith(ext) ? [full] : [];
  });
}

describe('jury pages — structure', () => {
  it.each(PAGES)('%s exists, is noindex and has a single h1', (stem) => {
    const path = `pages/jury/${stem}.html`;
    expect(existsSync(resolve(root, path)), path).toBe(true);
    const html = read(path);
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain('src="/src/scripts/entries/jury.ts"');
  });

  it('matrix is an accessible table with caption, column and row headers', () => {
    const html = read('pages/jury/index.html');
    expect(html).toMatch(/<caption>\s*Compétences prouvées par projet\s*<\/caption>/);
    expect(html.match(/<th scope="col">/g)?.length).toBeGreaterThanOrEqual(4);
    expect(html.match(/<th scope="row">/g)).toHaveLength(4);
    for (const slug of COMPETENCES) {
      expect(html).toContain(`href="/jury/${slug}"`);
    }
    expect(html).toContain('Voir la preuve Visualcom pour');
    expect(html).toContain('Voir la preuve Quintessence (sans fiche) pour');
  });

  it.each(COMPETENCES)('%s links previous / table / next in a full loop', (slug) => {
    const index = COMPETENCES.indexOf(slug);
    const previous = COMPETENCES[(index + COMPETENCES.length - 1) % COMPETENCES.length];
    const next = COMPETENCES[(index + 1) % COMPETENCES.length];
    const html = read(`pages/jury/${slug}.html`);
    expect(html).toMatch(new RegExp(String.raw`href="/jury/${previous}"\s+rel="prev"`));
    expect(html).toMatch(new RegExp(String.raw`href="/jury/${next}"\s+rel="next"`));
    expect(html).toMatch(/href="\/jury"[^>]*>\s*Retour au tableau/);
  });

  it('every project-proof anchor targeted by the matrix exists on its page', () => {
    const matrix = read('pages/jury/index.html');
    for (const [, slug, anchor] of matrix.matchAll(/href="\/jury\/([a-z-]+)#([a-z-]+)"/g)) {
      expect(read(`pages/jury/${slug}.html`), `${slug}#${anchor}`).toContain(`id="${anchor}"`);
    }
  });
});

describe('jury pages — PDF links', () => {
  it('every sheet link opens in a new tab and points to a file shipped in public/', () => {
    for (const stem of COMPETENCES) {
      const html = read(`pages/jury/${stem}.html`);
      const tags = html.match(/<a\b[^>]*href="\/jury\/fiches\/[^"]+"[^>]*>/g) ?? [];
      expect(tags.length, stem).toBeGreaterThan(0);
      for (const tag of tags) {
        expect(tag).toContain('target="_blank"');
        expect(tag).toContain('rel="noopener"');
        const href = /href="([^"]+)"/.exec(tag)?.[1] ?? '';
        expect(existsSync(resolve(root, `public${href}`)), href).toBe(true);
      }
      expect(html).toMatch(/\(PDF, \d pages\)/);
    }
  });
});

describe('jury area — confidentiality', () => {
  it('keeps jury text out of every TypeScript source (bundles are public)', () => {
    const forbidden = [
      'Fiche de réflexion',
      'Compétences du référentiel',
      'Mes compétences, preuve par preuve',
      'élévation de privilège',
    ];
    for (const file of listFiles(resolve(root, 'src'), '.ts')) {
      const source = readFileSync(file, 'utf8');
      for (const text of forbidden) {
        expect(source, `${relative(root, file)} contains « ${text} »`).not.toContain(text);
      }
    }
  });

  it('routes the 5 pages without a wildcard that would mask the PDFs', () => {
    const redirects = read('public/_redirects');
    expect(redirects).toMatch(/^\/jury\s+\/pages\/jury\/index\.html\s+200$/m);
    for (const slug of COMPETENCES) {
      expect(redirects).toContain(`/jury/${slug}`);
      expect(redirects).toContain(`/pages/jury/${slug}.html`);
    }
    expect(redirects).not.toContain('/jury/*');
  });

  it('asks robots to stay out', () => {
    const robots = read('public/robots.txt');
    expect(robots).toContain('Disallow: /jury');
    expect(robots).toContain('Disallow: /pages/jury');
  });

  it('is registered as Rollup inputs', () => {
    expect(read('vite.config.ts')).toContain('juryPageInputs');
  });

  it('no public page links to a sheet PDF', () => {
    const publicPages = [
      ...listFiles(resolve(root, 'pages'), '.html').filter(
        (file) => !relative(root, file).replaceAll('\\', '/').startsWith('pages/jury/'),
      ),
    ];
    for (const file of publicPages) {
      expect(readFileSync(file, 'utf8'), relative(root, file)).not.toContain('/jury/fiches/');
    }
  });
});
