/**
 * @file Feature — jury area (L18): one page per reflective sheet, a matrix of the competences each sheet
 *   puts forward, links that land on the right passage, and « jury text stays out of the bundle »
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');
const flat = (html: string): string => html.replace(/\s+/g, ' ');

/** Sheets in matrix and pager order (Visualcom → Vill’âge Jeunes → Lab Horizon, looping). */
const SHEETS = [
  {
    slug: 'visualcom',
    problem: 'Comment rendre accessible un CMS à l’ère de l’intelligence artificielle',
    anchors: ['travailler-en-equipe', 'conception-interface', 'qualite-securite-performance'],
  },
  {
    slug: 'village-jeunes',
    problem: 'Comment concevoir, développer et documenter une solution front-end',
    anchors: ['analyse-conception-deploiement', 'conception-interface', 'documentation-technique'],
  },
  {
    slug: 'lab-horizon',
    problem: 'En quoi les choix d’architecture et d’organisation d’un projet web en équipe',
    anchors: ['genie-logiciel', 'outils-numeriques-securite', 'autoevaluation'],
  },
] as const;
const SLUGS = SHEETS.map((sheet) => sheet.slug);
const PAGES = ['index', ...SLUGS] as const;
const OLD_PAGES = [
  'developpement-front',
  'qualite-securite-performance',
  'client-gestion-projet',
  'strategie-analyse',
];

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

  it.each(OLD_PAGES)('the old competence page %s is gone', (stem) => {
    expect(existsSync(resolve(root, `pages/jury/${stem}.html`))).toBe(false);
  });

  it('no jury page mentions Quintessence any more', () => {
    for (const file of listFiles(resolve(root, 'pages/jury'), '.html')) {
      expect(readFileSync(file, 'utf8'), relative(root, file)).not.toContain('Quintessence');
    }
  });
});

describe('jury matrix (index)', () => {
  const html = read('pages/jury/index.html');
  const tbody = /<tbody>([\s\S]*?)<\/tbody>/.exec(html)?.[1] ?? '';

  it('is an accessible table: caption, 3 project columns, 8 competence rows', () => {
    expect(flat(html)).toMatch(
      /<caption> ?Compétences mises en avant dans chaque fiche réflexive ?<\/caption>/,
    );
    expect(html.match(/<th scope="col">/g)).toHaveLength(1 + SHEETS.length);
    expect(tbody.match(/<th scope="row">/g)).toHaveLength(8);
    for (const row of tbody.split('</tr>').filter((chunk) => chunk.includes('<th'))) {
      expect(row.match(/<td\b/g)).toHaveLength(SHEETS.length);
    }
  });

  it('every column header opens the project page on the portfolio', () => {
    for (const slug of SLUGS) {
      expect(html).toContain(`class="jury-matrix__project" href="/projects/${slug}"`);
      expect(existsSync(resolve(root, `pages/projects/${slug}.html`)), slug).toBe(true);
    }
    expect(html).toContain('<span class="visually-hidden">Voir le projet </span>');
  });

  it('every dot lands on an existing passage of an existing sheet page', () => {
    const links = [...html.matchAll(/href="\/jury\/([a-z-]+)#([a-z-]+)"/g)];
    expect(links).toHaveLength(9);
    for (const [, slug, anchor] of links) {
      const path = `pages/jury/${slug}.html`;
      expect(existsSync(resolve(root, path)), path).toBe(true);
      expect(read(path), `${slug}#${anchor}`).toContain(`id="${anchor}"`);
    }
    expect(html).toContain('Lire ce passage de la fiche Lab Horizon');
    expect(html).toContain('<span class="visually-hidden">Non traitée dans cette fiche</span>');
  });

  it('lists the three sheets under the table', () => {
    for (const { slug, problem } of SHEETS) {
      expect(html).toContain(`class="jury-card__link" href="/jury/${slug}"`);
      expect(flat(html)).toContain(problem);
    }
  });
});

describe('jury sheet pages', () => {
  it.each(SHEETS)('$slug carries its problem statement and its competence anchors', (sheet) => {
    const html = read(`pages/jury/${sheet.slug}.html`);
    expect(flat(html)).toContain(sheet.problem);
    for (const anchor of sheet.anchors) {
      expect(html).toContain(`id="${anchor}"`);
      expect(html).toContain(`href="#${anchor}"`); // table of contents
    }
    expect(html).toContain(`href="/projects/${sheet.slug}"`);
  });

  it.each(SHEETS.map((sheet, index) => [sheet.slug, index] as const))(
    '%s links previous / table / next in a full loop',
    (slug, index) => {
      const previous = SLUGS[(index + SLUGS.length - 1) % SLUGS.length];
      const next = SLUGS[(index + 1) % SLUGS.length];
      const html = read(`pages/jury/${slug}.html`);
      expect(html).toMatch(new RegExp(String.raw`href="/jury/${previous}"\s+rel="prev"`));
      expect(html).toMatch(new RegExp(String.raw`href="/jury/${next}"\s+rel="next"`));
      expect(html).toMatch(/href="\/jury"[^>]*>\s*Retour au tableau/);
    },
  );

  it('keeps Léandre’s text verbatim (sample sentences of each sheet)', () => {
    expect(flat(read('pages/jury/lab-horizon.html'))).toContain(
      'Sur ce projet, chaque choix d’architecture répond à une contrainte précise.',
    );
    expect(flat(read('pages/jury/village-jeunes.html'))).toContain(
      'Ayant déjà fait de la création de parcours utilisateur',
    );
    expect(flat(read('pages/jury/visualcom.html'))).toContain(
      'il a fallu concevoir le skill.md comme un front',
    );
  });
});

describe('jury pages — PDF links', () => {
  it.each(SLUGS)('%s links both sheets, in a new tab, to files shipped in public/', (slug) => {
    const html = read(`pages/jury/${slug}.html`);
    const tags = html.match(/<a\b[^>]*href="\/jury\/fiches\/[^"]+"[^>]*>/g) ?? [];
    expect(tags).toHaveLength(2);
    for (const tag of tags) {
      expect(tag).toContain('target="_blank"');
      expect(tag).toContain('rel="noopener"');
      const href = /href="([^"]+)"/.exec(tag)?.[1] ?? '';
      expect(href.startsWith(`/jury/fiches/${slug}/`), href).toBe(true);
      expect(existsSync(resolve(root, `public${href}`)), href).toBe(true);
    }
    expect(html).toMatch(/Fiche de réflexion \(PDF, \d pages\)/);
    expect(html).toMatch(/Fiche projet \(PDF, \d pages\)/);
  });
});

describe('jury area — confidentiality', () => {
  it('keeps jury text out of every TypeScript source (bundles are public)', () => {
    const forbidden = [
      'Fiche de réflexion',
      'Problématique',
      'Mes fiches réflexives',
      'élévation de privilège',
    ];
    for (const file of listFiles(resolve(root, 'src'), '.ts')) {
      const source = readFileSync(file, 'utf8');
      for (const text of forbidden) {
        expect(source, `${relative(root, file)} contains « ${text} »`).not.toContain(text);
      }
    }
  });

  it('routes the 4 pages without a wildcard that would mask the PDFs', () => {
    const redirects = read('public/_redirects');
    expect(redirects).toMatch(/^\/jury\s+\/pages\/jury\/index\.html\s+200$/m);
    for (const slug of SLUGS) {
      expect(redirects).toMatch(
        new RegExp(String.raw`^/jury/${slug}\s+/pages/jury/${slug}\.html\s+200$`, 'm'),
      );
    }
    for (const stem of OLD_PAGES) {
      expect(redirects).not.toContain(`/jury/${stem}`);
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

  it('no public page links to a sheet PDF; the project cards open the sheet page', () => {
    const publicPages = listFiles(resolve(root, 'pages'), '.html').filter(
      (file) => !relative(root, file).replaceAll('\\', '/').startsWith('pages/jury/'),
    );
    for (const file of publicPages) {
      expect(readFileSync(file, 'utf8'), relative(root, file)).not.toContain('/jury/fiches/');
    }
    for (const slug of SLUGS) {
      expect(read(`pages/projects/${slug}.html`)).toContain(
        `class="project-further__card" href="/jury/${slug}"`,
      );
    }
  });
});
