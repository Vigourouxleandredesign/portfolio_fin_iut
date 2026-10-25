/**
 * @file Feature — performance and CSP guards from the L8 recette (LCP, CLS, blob textures)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

function htmlPages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlPages(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

describe('fonts — preloaded on every page (no font-swap layout shift)', () => {
  it.each(htmlPages(resolve(root, 'pages')))('%s preloads Ubuntu 400 and 700', (file) => {
    const html = readFileSync(file, 'utf8');
    expect(html).toContain('ubuntu-latin-400-normal.woff2');
    expect(html).toContain('ubuntu-latin-700-normal.woff2');
    expect(html.match(/rel="preload"[^>]*as="font"|as="font"[^>]*rel="preload"/g)).toHaveLength(2);
  });
});

describe('home — LCP', () => {
  const html = read('pages/index.html');
  const entry = read('src/scripts/entries/home.ts');

  it('declares the hero images in the HTML so the browser discovers them early', () => {
    expect(html).toMatch(
      /data-hero-3d-atmosphere\s+src="\/src\/assets\/hero\/hero-atmosphere\.jpg"/,
    );
    expect(html).toMatch(/data-hero-3d-fallback\s+src="\/src\/assets\/hero\/bust-designer\.jpg"/);
    expect(html).not.toMatch(/data-hero-3d-(atmosphere|fallback)\s+src=""/);
  });

  it('starts the heavy 3D bust only once the page is idle', () => {
    expect(entry).toContain('runWhenIdle');
    expect(entry).toMatch(/runWhenIdle\(\(\) => \{[\s\S]*features\/three-scene\/bust-hero/);
  });

  it('ships a light atelier backdrop (WebP, declared in the HTML)', () => {
    expect(html).toContain('marble-atelier-empty.webp');
    expect(existsSync(resolve(root, 'src/assets/moodboard/marble-atelier-empty.webp'))).toBe(true);
    expect(existsSync(resolve(root, 'src/assets/moodboard/marble-atelier-empty.jpg'))).toBe(false);
  });
});

describe('header — no layout shift on mobile', () => {
  it('starts with the navigation list closed (opened only by the toggle)', () => {
    const css = read('src/styles/components/site-header.css');
    const base = /\.site-header__list \{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(base).toContain('display: none');
  });
});

describe('CSP — three.js texture decoding', () => {
  it('allows blob: in connect-src and nothing else new', () => {
    const csp = /Content-Security-Policy: ([^\r\n]+)/.exec(read('public/_headers'))?.[1] ?? '';
    expect(csp).toContain("connect-src 'self' blob:;");
    expect(csp).not.toMatch(/connect-src[^;]*(https?:|\*)/);
  });
});
