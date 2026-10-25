/**
 * @file Feature — production domain in canonical / share previews / sitemap (red team 2026-10-25)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const SITE = 'https://vigourouxleandre.netlify.app';

function htmlPages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlPages(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

// Indexable pages only: the jury area and the 404 are `noindex` and carry no share preview.
const publicPages = htmlPages(resolve(root, 'pages')).filter(
  (file) =>
    !file.includes(`${sep}jury${sep}`) && !readFileSync(file, 'utf8').includes('content="noindex'),
);

describe('production domain', () => {
  it('leaves no placeholder domain anywhere in pages or public', () => {
    const files = [
      ...htmlPages(resolve(root, 'pages')),
      resolve(root, 'public/robots.txt'),
      resolve(root, 'public/sitemap.xml'),
    ];
    for (const file of files) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/remplacer-par-le-domaine/i);
    }
  });

  it.each(publicPages)('%s has an absolute canonical and og:image on the site domain', (file) => {
    const html = readFileSync(file, 'utf8');
    expect(html).toMatch(new RegExp(`<link rel="canonical" href="${SITE}[^"]*"`));
    const image = /property="og:image"\s+content="([^"]+)"/.exec(html)?.[1] ?? '';
    expect(image.startsWith(`${SITE}/`)).toBe(true);
    expect(existsSync(resolve(root, 'public', image.slice(SITE.length + 1)))).toBe(true);
    expect(html).toContain('name="twitter:card"');
  });

  it('points robots.txt and the sitemap at the same domain', () => {
    expect(readFileSync(resolve(root, 'public/robots.txt'), 'utf8')).toContain(
      `Sitemap: ${SITE}/sitemap.xml`,
    );
    const locs = [
      ...readFileSync(resolve(root, 'public/sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g),
    ];
    expect(locs.length).toBeGreaterThan(10);
    for (const [, loc] of locs) expect(loc.startsWith(`${SITE}/`)).toBe(true);
  });
});
