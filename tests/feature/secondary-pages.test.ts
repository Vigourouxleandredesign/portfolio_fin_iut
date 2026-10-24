/**
 * @file Feature — secondary / bonus project pages (L3d): honesty, safety, no dead links
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const read = (slug: string): string =>
  readFileSync(resolve(root, `pages/projects/${slug}.html`), 'utf8');

const SECONDARY = ['hyperloop', 'back-springboot', 'pacific-dataviz', 'borne-2bealive'] as const;

describe('secondary pages — shared', () => {
  it.each(SECONDARY)('%s only references assets that exist, with no placeholder text', (slug) => {
    const html = read(slug);
    for (const [, src] of html.matchAll(/\ssrc="(\/src\/assets\/[^"]+)"/g)) {
      expect(existsSync(resolve(root, src.slice(1))), src).toBe(true);
    }
    expect(html).not.toContain('[À CONFIRMER]');
    expect(html).not.toMatch(/à intégrer|arrivera|bient[ôo]t|Phase B|DOCX/i);
  });
});

describe('HyperLoop NC', () => {
  const html = read('hyperloop');

  it('uses the WebP images and states that visuals are AI-generated', () => {
    for (const file of [
      'reference-train.webp',
      'classe-standard.webp',
      'classe-confort.webp',
      'classe-premium.webp',
      'accueil-agent.webp',
    ]) {
      expect(html).toContain(file);
    }
    expect(html).toContain('Tous les visuels sont générés par IA');
    expect(html).not.toMatch(/\.jpg"/);
  });

  it('lists the six languages without presenting a real client project', () => {
    expect(html).toContain('Six langues');
    expect(html).toContain('imaginaire mais crédible');
  });
});

describe('Spring Boot library page', () => {
  const html = read('back-springboot');

  it('publishes no credential from HELP.md', () => {
    expect(html).not.toMatch(/michel|admin(?!istrat)|root|password|mot de passe :/i);
    expect(html).not.toMatch(/localhost|127\.0\.0\.1/);
  });

  it('is text-only with a TODO for the local captures', () => {
    expect(html).toContain('<!-- TODO L6');
    expect(html).toContain('Des droits par rôle');
  });
});

describe('Pacific Dataviz page', () => {
  const html = read('pacific-dataviz');

  it('says « finaliste », never « primée », and is dated 2025', () => {
    expect(html).toContain('finaliste');
    expect(html).not.toMatch(/prim[ée]e?s?\b/i);
    expect(html).toContain('N° VIII · 2025');
    expect(html).not.toContain('2024');
  });

  it('drops the leftover borne / Taïwan copy', () => {
    const withoutNav = html.replace(/<nav class="project-nav"[\s\S]*?<\/nav>/, '');
    expect(withoutNav).not.toMatch(/Taïwan|borne|Production/i);
  });

  it('keeps the Figma embed allowed by the CSP, with an open-in-new-tab fallback', () => {
    expect(html).toContain('https://leandredatavizchallenge.figma.site/');
    expect(html).toContain('Ouvrir la réalisation');
    const headers = readFileSync(resolve(root, 'public/_headers'), 'utf8');
    expect(headers).toContain('https://*.figma.site');
  });
});

describe('Borne 2BeAlive page', () => {
  const html = read('borne-2bealive');

  it('removes the dead pre-order iframe and link', () => {
    expect(html).not.toContain('precommande-borne');
    expect(html).not.toMatch(/<iframe/i);
    expect(html).not.toContain('visualcom.nc');
  });

  it('shows the 3D model through the lazy GLB showcase, served from public/', () => {
    expect(html).toContain('data-glb-showcase');
    expect(html).toContain('data-glb-src="/documents/elements/borne.glb"');
    expect(existsSync(resolve(root, 'public/documents/elements/borne.glb'))).toBe(true);
  });
});
