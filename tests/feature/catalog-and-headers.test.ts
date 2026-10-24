/**
 * @file Feature — headers CSP whitelist (C8) + pages catalog (C7) + no private area (C9)
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());

const PUBLIC_PAGES = [
  'pages/index.html',
  'pages/projects.html',
  'pages/cv.html',
  'pages/contact.html',
];

const PROJECT_SLUGS = [
  'lab-horizon',
  'visualcom',
  'village-jeunes',
  'magicallab',
  'micromonde',
  'hyperloop',
  'back-springboot',
  'pacific-dataviz',
  'borne-2bealive',
];

describe('C7 — page catalog exists', () => {
  it('ships all public routes', () => {
    for (const page of PUBLIC_PAGES) {
      expect(existsSync(resolve(root, page)), page).toBe(true);
    }
  });

  it('ships case-study HTML for each catalogue slug', () => {
    for (const slug of PROJECT_SLUGS) {
      const path = resolve(root, `pages/projects/${slug}.html`);
      expect(existsSync(path), slug).toBe(true);
    }
  });

  it('project detail folder only contains html case studies we expect or extras as html', () => {
    const dir = resolve(root, 'pages/projects');
    const files = readdirSync(dir).filter((n) => n.endsWith('.html'));
    expect(files.length).toBeGreaterThanOrEqual(PROJECT_SLUGS.length);
  });
});

describe('C8 — security headers source', () => {
  const headers = readFileSync(resolve(root, 'public/_headers'), 'utf8');

  it('does not use wildcard https: frame-src', () => {
    expect(headers).not.toMatch(/frame-src[^;]*https:\s*;/);
    expect(headers).not.toMatch(/frame-src\s+https:\s*;/);
  });

  it('whitelists known embed origins', () => {
    expect(headers).toContain('https://visualcom.nc');
    expect(headers).toContain('https://magicallab.netlify.app');
  });

  it('keeps a locked-down CSP (no third-party data origins, no plugins, no framing)', () => {
    expect(headers).not.toMatch(/supabase/i);
    expect(headers).toMatch(/connect-src 'self';/);
    expect(headers).toContain("object-src 'none'");
    expect(headers).toContain("frame-ancestors 'none'");
    expect(headers).toMatch(/style-src 'self';/);
  });
});

describe('C9 — no private area in the public build (SECURITY §0)', () => {
  it('ships no evaluator / auth page', () => {
    expect(existsSync(resolve(root, 'pages/evaluator.html'))).toBe(false);
  });

  it('does not depend on a backend SDK', () => {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
    };
    expect(Object.keys(pkg.dependencies ?? {}).some((name) => name.includes('supabase'))).toBe(
      false,
    );
  });

  it('routes every case study listed in the catalogue', () => {
    const redirects = readFileSync(resolve(root, 'public/_redirects'), 'utf8');
    for (const slug of PROJECT_SLUGS) {
      expect(redirects, slug).toContain(`/projects/${slug} `);
    }
  });
});
