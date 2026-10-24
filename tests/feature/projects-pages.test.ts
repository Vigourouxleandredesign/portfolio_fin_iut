/**
 * @file Feature — Visualcom stage + dual mockup (C5) + listing links (C2)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('C5 — Visualcom stage + dual-device mockup', () => {
  const html = readFileSync(resolve(process.cwd(), 'pages/projects/visualcom.html'), 'utf8');

  it('uses full-bleed stage composition', () => {
    expect(html).toContain('project-stage');
    expect(html).toContain('project-stage__compose');
  });

  it('keeps dual-device marble shots mockup', () => {
    expect(html).toContain('data-preview-mode="shots"');
    expect(html).toContain('laptop-iphone-marble.png');
    expect(html).toContain('mockup-screens.png');
    expect(html).toContain('project-detail__mockup--laptop-phone');
  });

  it('shows desktop gallery shots (homogeneous format)', () => {
    expect(html).toContain('section-expertises.png');
    expect(html).toContain('section-cap-pilote.png');
    expect(html).toContain('desktop.png');
  });

  it('links mockup / CTA to the live site in a new tab', () => {
    expect(html).toContain('https://visualcom.nc');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe('C2 — projects listing card links', () => {
  const html = readFileSync(resolve(process.cwd(), 'pages/projects.html'), 'utf8');

  it('lists the 9 projects in catalogue order I → IX, Lab Horizon first', () => {
    const hrefs = [...html.matchAll(/class="project-card__link" href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual([
      '/pages/projects/lab-horizon.html',
      '/pages/projects/magicallab.html',
      '/pages/projects/micromonde.html',
      '/pages/projects/village-jeunes.html',
      '/pages/projects/visualcom.html',
      '/pages/projects/hyperloop.html',
      '/pages/projects/back-springboot.html',
      '/pages/projects/pacific-dataviz.html',
      '/pages/projects/borne-2bealive.html',
    ]);
  });

  it('numbers cards with Mono cartel metadata and graded covers', () => {
    for (const numeral of ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']) {
      expect(html).toMatch(new RegExp('project-card__meta">N° ' + numeral + ' · 20'));
    }
    expect(html).toContain('project-card--lab-horizon');
    expect(html.match(/project-card__visual graded-image/g)).toHaveLength(9);
  });

  it('links Lab Horizon card to its case study', () => {
    expect(html).toContain('href="/pages/projects/lab-horizon.html"');
  });

  it('links MagicalLab card to its case study', () => {
    expect(html).toContain('href="/pages/projects/magicallab.html"');
  });

  it('links Micro-monde card to its case study', () => {
    expect(html).toContain('href="/pages/projects/micromonde.html"');
  });

  it('links Visualcom card to its case study', () => {
    expect(html).toContain('href="/pages/projects/visualcom.html"');
  });
});
