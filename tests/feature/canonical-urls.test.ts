/**
 * @file Feature — one address per page (L10, REDTEAM P2-2)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveCleanUrl } from '../../vite.config';

const root = resolve(process.cwd());

function htmlPages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlPages(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

describe('internal links use canonical URLs', () => {
  it.each(htmlPages(resolve(root, 'pages')))('%s has no href into /pages/', (file) => {
    const html = readFileSync(file, 'utf8');
    expect(html).not.toMatch(/href=["']\/pages[/"']/);
    expect(html).not.toMatch(/href=["'][^"']*\.html(?:[#?"'])/);
  });
});

describe('public/_redirects', () => {
  const rules = readFileSync(resolve(root, 'public/_redirects'), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => line.trim().split(/\s+/));

  const forced = rules.filter(([, , status]) => status === '301!');
  const rewrites = rules.filter(([, , status]) => status === '200');

  it('forces a 301 from every legacy address of every public page', () => {
    const sources = forced.map(([from]) => from);
    for (const page of ['projects', 'cv', 'contact']) {
      expect(sources).toContain(`/pages/${page}.html`);
      expect(sources).toContain(`/pages/${page}`);
    }
    for (const slug of [
      'lab-horizon',
      'magicallab',
      'micromonde',
      'village-jeunes',
      'visualcom',
      'hyperloop',
      'back-springboot',
      'pacific-dataviz',
      'borne-2bealive',
    ]) {
      expect(sources).toContain(`/pages/projects/${slug}.html`);
      expect(sources).toContain(`/pages/projects/${slug}`);
      expect(forced.find(([from]) => from === `/pages/projects/${slug}.html`)?.[1]).toBe(
        `/projects/${slug}`,
      );
    }
    expect(sources).toContain('/pages/index.html');
  });

  it('never redirects the jury area (the edge function must answer 401 there)', () => {
    for (const [from, to] of rules.filter(([, , status]) => status?.startsWith('301'))) {
      expect(from).not.toMatch(/jury/);
      expect(to).not.toMatch(/jury/);
    }
    expect(rewrites.map(([from]) => from)).toContain('/jury');
  });

  it('keeps the forced redirects ahead of the rewrites and the 404', () => {
    const lastForced = rules.map(([, , s]) => s).lastIndexOf('301!');
    const firstRewrite = rules.findIndex(([, , s]) => s === '200');
    expect(lastForced).toBeLessThan(firstRewrite);
    expect(rules.at(-1)).toEqual(['/*', '/pages/404.html', '404']);
  });
});

describe('local server serves the same canonical URLs', () => {
  it('maps clean URLs to their source page', () => {
    expect(resolveCleanUrl('/')).toBe('/pages/index.html');
    expect(resolveCleanUrl('/projects')).toBe('/pages/projects.html');
    expect(resolveCleanUrl('/projects/')).toBe('/pages/projects.html');
    expect(resolveCleanUrl('/projects/lab-horizon')).toBe('/pages/projects/lab-horizon.html');
    expect(resolveCleanUrl('/cv')).toBe('/pages/cv.html');
    expect(resolveCleanUrl('/jury/developpement-front')).toBe(
      '/pages/jury/developpement-front.html',
    );
  });

  it('ignores assets, unknown pages and legacy paths', () => {
    expect(resolveCleanUrl('/assets/home-abc.js')).toBeNull();
    expect(resolveCleanUrl('/projects/does-not-exist')).toBeNull();
    expect(resolveCleanUrl('/pages/projects.html')).toBeNull();
  });
});
