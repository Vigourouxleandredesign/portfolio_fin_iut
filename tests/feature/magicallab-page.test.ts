/**
 * @file Feature — MagicalLab stage markup (C4)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const html = readFileSync(resolve(process.cwd(), 'pages/projects/magicallab.html'), 'utf8');

describe('C4 — MagicalLab stage', () => {
  it('links the live demo in a new tab', () => {
    expect(html).toContain('https://magicallab.netlify.app/');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('uses portal GLB as CTA (no Mac mockup / no iframe)', () => {
    expect(html).toContain('magic_portal.glb');
    expect(html).toContain('data-glb-showcase');
    expect(html).not.toContain('mac-marble.png');
    expect(html).not.toMatch(/<iframe[^>]+magicallab/i);
  });

  it('shows the robot GLB with lore', () => {
    expect(html).toContain('robot.glb');
    expect(html).toMatch(/petit robot/i);
  });

  it('uses artistic dual-font title and keeps hero atmosphere', () => {
    expect(html).toContain('project-stage__title--artistic');
    expect(html).toContain('project-stage__title-display');
    expect(html).toContain('scene-portal.jpg');
  });

  it('documents keyboard controls for evaluators', () => {
    expect(html.toLowerCase()).toMatch(/flèches|fleches/);
    expect(html).toMatch(/\bF\b/);
  });

  it('has no reflective sheet block', () => {
    expect(html).not.toContain('data-project-reflective');
    expect(html).not.toContain('Fiche réflexion');
  });

  it('uses the full-bleed stage composition', () => {
    expect(html).toContain('project-stage');
    expect(html).toContain('project-stage__compose');
  });

  it('is dated 2026 with the copper cartel', () => {
    expect(html).toContain('N° II · 2026 · Projet front, IUT');
    expect(html).not.toContain('<span>2025</span>');
  });

  it('keeps an accessible h1 name of exactly « MagicalLab »', () => {
    expect(html).toMatch(/<h1[^>]*aria-label="MagicalLab"/);
  });

  it('credits both 3D models', () => {
    expect(html).toContain('Nick Broad');
    expect(html).toContain('CC BY 4.0');
    expect(html).toContain('Modèle 3D du robot&#8239;: Komov, Sketchfab.');
  });

  it('uses the correct French idiom « laisser libre cours »', () => {
    const flat = html.replace(/\s+/g, ' ');
    expect(flat).not.toMatch(/laisser cours/);
    // The « En bref » duplicate of the long version was removed (relecture ML-02): one occurrence left.
    expect(flat.match(/laisser libre cours/g)).toHaveLength(1);
  });
});
