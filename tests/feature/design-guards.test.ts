/**
 * @file Feature — design guards (C10 colors, C11 inline code, C12 jury link, C13 fonts)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());

/** Recursively list files under `dir` whose name ends with `ext`. */
function listFiles(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listFiles(full, ext);
    return full.endsWith(ext) ? [full] : [];
  });
}

const rel = (file: string): string => relative(root, file).replaceAll('\\', '/');

const cssFiles = listFiles(join(root, 'src/styles'), '.css');
const pageFiles = listFiles(join(root, 'pages'), '.html');
const publicPages = pageFiles.filter((file) => !rel(file).startsWith('pages/jury/'));

describe('C10 — no hard-coded color outside variables.css', () => {
  it('finds no #hex, rgb(), rgba() or hsl() in component/page styles', () => {
    const offenders: string[] = [];
    for (const file of cssFiles) {
      if (rel(file) === 'src/styles/variables.css') continue;
      const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(css)) offenders.push(rel(file));
    }
    expect(offenders).toEqual([]);
  });

  it('ships the shared DA components', () => {
    for (const name of [
      'graded-image',
      'cartel',
      'section-title',
      'light-beam',
      'paint',
      'page-hero',
    ]) {
      expect(existsSync(join(root, `src/styles/components/${name}.css`)), name).toBe(true);
    }
  });
});

describe('C11 — no inline style or script in pages', () => {
  it('has no style="", <style> or <script> without src', () => {
    const offenders: string[] = [];
    for (const file of pageFiles) {
      const html = readFileSync(file, 'utf8');
      const inlineScript = [...html.matchAll(/<script\b([^>]*)>/gi)].some(
        (match) => !/\bsrc\s*=/.test(match[1] ?? ''),
      );
      if (/\sstyle\s*=\s*"/i.test(html) || /<style\b/i.test(html) || inlineScript) {
        offenders.push(rel(file));
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('C12 — jury link in the header only (fix/jury-links, 01/11)', () => {
  it('links /jury from the header of every public page, never from the footer', () => {
    for (const file of publicPages) {
      const html = readFileSync(file, 'utf8');
      const header = /<header class="site-header"[\s\S]*?<\/header>/i.exec(html)?.[0] ?? '';
      const footer = /<footer class="site-footer"[\s\S]*<\/footer>/i.exec(html)?.[0] ?? '';
      expect(header, rel(file)).toContain('href="/jury"');
      expect(footer, rel(file)).not.toContain('href="/jury"');
    }
  });

  it('never links to the protected sheets', () => {
    for (const file of publicPages) {
      expect(readFileSync(file, 'utf8'), rel(file)).not.toContain('/jury/fiches/');
    }
  });
});

describe('C13 — self-hosted fonts', () => {
  const fonts = readFileSync(join(root, 'src/styles/fonts.css'), 'utf8');

  it.each(['ubuntu/400', 'updock/400', 'ubuntu-mono/400', 'ubuntu-mono/700'])(
    'imports @fontsource/%s',
    (face) => {
      expect(fonts).toContain(`@fontsource/${face}.css`);
    },
  );

  it('never calls Google Fonts', () => {
    expect(fonts).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
  });
});
