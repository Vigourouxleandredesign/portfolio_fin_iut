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

describe('hero bust — weight budget', () => {
  it('keeps bust.glb under 2 MB (Draco geometry + WebP textures, 1024 px max)', () => {
    const size = statSync(resolve(root, 'src/assets/hero/bust.glb')).size;
    expect(size).toBeLessThan(2 * 1024 * 1024);
  });

  it('declares Draco and WebP as required extensions (loader ships both decoders)', () => {
    const buffer = readFileSync(resolve(root, 'src/assets/hero/bust.glb'));
    const jsonLength = buffer.readUInt32LE(12);
    const json = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8')) as {
      extensionsRequired?: string[];
    };
    expect(json.extensionsRequired).toEqual(
      expect.arrayContaining(['KHR_draco_mesh_compression', 'EXT_texture_webp']),
    );
  });
});

describe('home — opening veil', () => {
  const html = read('pages/index.html');
  const css = read('src/styles/components/intro-veil.css');

  it('ships the veil before the page content, announced as « Chargement de la page »', () => {
    expect(html).toMatch(/<div class="intro-veil" data-intro-veil role="status">/);
    expect(html).toContain('<p class="visually-hidden">Chargement de la page</p>');
    expect(html).not.toContain('sanctuaire');
    expect(html.indexOf('data-intro-veil')).toBeLessThan(html.indexOf('class="skip-link"'));
  });

  it('loads the gate as a same-origin script (CSP script-src self) and no inline script', () => {
    expect(html).toContain('<script src="/intro-gate.js"></script>');
    expect(html).not.toMatch(/<script(?![^>]*\bsrc=)[^>]*>\s*\S/);
    expect(read('public/intro-gate.js')).toContain('intro-skip');
  });

  it('never traps the page: CSS failsafe, reduced-motion off, no-skip class', () => {
    expect(css).toMatch(/animation:\s*intro-veil-failsafe/);
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.intro-veil\s*\{\s*display: none/,
    );
    expect(css).toContain('.intro-skip .intro-veil');
  });

  it('is imported by the home entry only', () => {
    expect(read('src/scripts/entries/home.ts')).toContain('components/intro-veil.css');
    expect(read('src/scripts/entries/home.ts')).toContain('initIntroVeil');
  });
});

describe('cache headers on non-hashed static files (REDTEAM P2-3)', () => {
  const headers = read('public/_headers');

  it('caches draco, share previews, favicon and logo for a bounded time', () => {
    expect(headers).toMatch(/\/draco\/\*\s+Cache-Control: public, max-age=604800/);
    expect(headers).toMatch(/\/og\/\*\s+Cache-Control: public, max-age=86400/);
    expect(headers).toMatch(/\/og-cover\.jpg\s+Cache-Control: public, max-age=86400/);
    expect(headers).toMatch(/\/favicon\.svg\s+Cache-Control: public, max-age=86400/);
    expect(headers).toMatch(/\/logo-leandre\.svg\s+Cache-Control: public, max-age=86400/);
  });

  it('never sets a public cache on the jury area or on /documents', () => {
    const blocks = headers.split(/\r?\n\r?\n/);
    for (const block of blocks) {
      const path = block.trim().split(/\r?\n/)[0] ?? '';
      if (
        path.startsWith('/jury') ||
        path.startsWith('/pages/jury') ||
        path.startsWith('/documents')
      ) {
        expect(block).not.toMatch(/Cache-Control: public/);
      }
    }
  });
});

describe('3D bust — mouse only', () => {
  it('home mounts the bust only through the capability gate', () => {
    const entry = read('src/scripts/entries/home.ts');
    expect(entry).toContain(
      "import { canMountBust } from '../features/three-scene/bust-capability'",
    );
    expect(entry).toMatch(/if \(heroRoot && canMountBust\(\)\)/);
  });

  it('hides the click hint where the 3D is not mounted', () => {
    expect(read('src/styles/components/hero-3d.css')).toMatch(
      /@media \(hover: none\), \(pointer: coarse\), \(prefers-reduced-motion: reduce\)\s*\{\s*\.hero-3d__hint\s*\{\s*display: none/,
    );
  });
});

describe('MagicalLab 3D models — budget and lazy loading', () => {
  it('keeps the GLB files lean (already Draco + WebP 1024 px)', () => {
    const size = (file: string): number =>
      statSync(resolve(root, 'public/documents/elements', file)).size;
    expect(size('robot.glb')).toBeLessThan(1.25 * 1024 * 1024);
    expect(size('magic_portal.glb')).toBeLessThan(650 * 1024);
  });

  it('the entry does not import three.js itself and the showcase is initialised synchronously', () => {
    const entry = read('src/scripts/entries/project-detail.ts');
    expect(entry).not.toMatch(/from 'three'/);
    expect(entry).toContain('initGlbShowcases();');
  });
});
