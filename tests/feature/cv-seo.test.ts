/**
 * @file Feature — CV page, contact form, 404 and SEO basics (L5)
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

const PROJECT_SLUGS = readdirSync(resolve(root, 'pages/projects'))
  .filter((name) => name.endsWith('.html'))
  .map((name) => name.replace(/\.html$/, ''));

const PUBLIC_PAGES = [
  'pages/index.html',
  'pages/projects.html',
  'pages/cv.html',
  'pages/contact.html',
  ...PROJECT_SLUGS.map((slug) => `pages/projects/${slug}.html`),
];

describe('CV page', () => {
  const html = read('pages/cv.html');

  it('offers the PDF download and the file exists', () => {
    expect(html).toMatch(/href="\/documents\/cv\.pdf"\s+download/);
    expect(existsSync(resolve(root, 'public/documents/cv.pdf'))).toBe(true);
  });

  it('links the jury area and the Pacific Dataviz distinction', () => {
    expect(html).toContain('Espace jury (fiches réflexives)');
    expect(html).toContain('href="/jury"');
    expect(html).toContain('Finaliste du Pacific Dataviz Challenge 2025');
  });

  it('keeps private details out of the page', () => {
    expect(html).not.toMatch(/MBTI|référence|adresse personnelle/i);
    expect(html).not.toContain('/jury/fiches/');
  });
});

describe('Contact page', () => {
  const html = read('pages/contact.html');

  it('keeps the Netlify form and its honeypot intact', () => {
    expect(html).toContain('data-netlify="true"');
    expect(html).toContain('netlify-honeypot="bot-field"');
    expect(html).toContain('name="bot-field"');
    expect(html).toContain('name="form-name" value="contact"');
  });
});

describe('404 page', () => {
  it('exists, says the room is missing and is the last redirect rule', () => {
    const html = read('pages/404.html');
    expect(html).toContain('Salle introuvable');
    expect(html).toContain('Cette salle n’existe pas (encore).');
    expect(html).toContain('href="/jury"');
    const rules = read('public/_redirects')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    expect(rules[rules.length - 1]).toMatch(/^\/\*\s+\/pages\/404\.html\s+404$/);
  });

  it('is built as a Rollup input', () => {
    expect(read('vite.config.ts')).toContain("notFound: resolve(projectRoot, 'pages/404.html')");
  });
});

describe('SEO — public pages', () => {
  const titles = new Map<string, string>();

  it.each(PUBLIC_PAGES)('%s has the SEO essentials', (page) => {
    const html = read(page);
    expect(html).toContain('<html lang="fr">');
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
    expect(title, 'title').toBeTruthy();
    expect(titles.has(title ?? ''), `duplicate title ${title}`).toBe(false);
    titles.set(title ?? '', page);
    expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]{20,}"/);
    expect(html).toMatch(/<meta\s+property="og:title"/);
    expect(html).toMatch(/<meta\s+property="og:description"/);
    expect(html).toMatch(/<meta\s+property="og:image"/);
    expect(html).toMatch(/<link\s+rel="canonical"\s+href="https:\/\/[^"]+"/);
  });

  it('ships the default social image', () => {
    expect(existsSync(resolve(root, 'public/og-cover.jpg'))).toBe(true);
  });
});

describe('sitemap and robots', () => {
  const sitemap = read('public/sitemap.xml');

  it('lists the public routes and never the jury area', () => {
    for (const slug of PROJECT_SLUGS) {
      expect(sitemap, slug).toContain(`/projects/${slug}</loc>`);
    }
    for (const route of ['/projects</loc>', '/cv</loc>', '/contact</loc>']) {
      expect(sitemap).toContain(route);
    }
    expect(PROJECT_SLUGS).toHaveLength(9);
    expect(sitemap).not.toContain('/jury');
  });

  it('points robots.txt to the sitemap while keeping the jury area closed', () => {
    const robots = read('public/robots.txt');
    expect(robots).toMatch(/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m);
    expect(robots).toContain('Disallow: /jury');
  });
});
