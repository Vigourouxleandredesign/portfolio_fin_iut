/**
 * @file Feature — L13 retouches: Lab Horizon tree visual and last typos
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');
const flat = (path: string): string => read(path).replace(/\s+/g, ' ');

describe('Lab Horizon visual (tree, not the lab bench)', () => {
  it('uses the portrait tree on the home carousel with its exact size', () => {
    const home = flat('pages/index.html');
    expect(home).toMatch(/lab-horizon-arbre-portrait\.webp" alt="" width="702" height="1080"/);
    expect(home).not.toContain('hero-laboratoire.webp');
  });

  it('uses the landscape tree on the catalogue card with its exact size', () => {
    const catalogue = flat('pages/projects.html');
    expect(catalogue).toMatch(/lab-horizon-arbre\.webp" alt="" width="1600" height="900"/);
    expect(catalogue).not.toContain('hero-laboratoire.webp');
  });

  it('keeps the hero of the project page and the share image unchanged', () => {
    expect(read('pages/projects/lab-horizon.html')).toContain('hero-laboratoire.webp');
    expect(read('pages/projects/lab-horizon.html')).toContain('/og/lab-horizon.jpg');
  });
});

describe('last typos', () => {
  const magicallab = flat('pages/projects/magicallab.html');
  const visualcom = flat('pages/projects/visualcom.html');

  it('MagicalLab', () => {
    expect(magicallab).toContain('manipuler un objet .glb avec React Three Fiber');
    expect(magicallab).not.toContain('à travers React et Three Fiber');
    expect(magicallab).toContain('MagicalLab, bibliothèque et planétaire');
    expect(magicallab).not.toContain('orrery');
  });

  it('Visualcom long version', () => {
    expect(visualcom).toContain('quelqu’un de formé à WordPress');
    expect(visualcom).toContain('les non-initiés comme les initiés puissent');
    expect(visualcom).toContain('toute l’équipe utilise Claude Desktop');
  });
});
