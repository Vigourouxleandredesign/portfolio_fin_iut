/**
 * @file Feature — project page template v2 (L15): section order, one key chapter, no « En bref »
 * @see docs/work-packages/WP-L15-gabarit-projet-v2.md
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Pages migrated to the v2 template (L15 adds each slug when its page is done). */
const V2_SLUGS = ['visualcom', 'village-jeunes'] as const;

const read = (slug: string): string =>
  readFileSync(resolve(process.cwd(), `pages/projects/${slug}.html`), 'utf8');

/** Index of the first match of `needle`, or -1. */
const at = (html: string, needle: string): number => html.indexOf(needle);

describe('project page v2 — structure', () => {
  it.each(V2_SLUGS)('%s follows hero, (essentials), story, tools, navigation', (slug) => {
    const html = read(slug);
    const order = [
      at(html, '<h1'),
      at(html, 'class="project-thread"'),
      at(html, 'class="project-tools"'),
      at(html, '<nav class="project-nav"'),
    ];
    for (const index of order) expect(index, slug).toBeGreaterThan(-1);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    const essentials = at(html, 'class="project-essentials"');
    if (essentials > -1) {
      expect(essentials).toBeGreaterThan(order[0]);
      expect(essentials).toBeLessThan(order[1]);
      expect(html.match(/class="project-essentials__value"/g)?.length).toBeLessThanOrEqual(3);
    }
  });

  it.each(V2_SLUGS)('%s tells its story in numbered chapters with one key chapter', (slug) => {
    const html = read(slug);
    const chapters = html.match(/<li class="project-thread__chapter[ "]/g) ?? [];
    expect(chapters.length).toBeGreaterThanOrEqual(3);
    expect(chapters.length).toBeLessThanOrEqual(4);
    expect(html.match(/project-thread__chapter--key/g) ?? []).toHaveLength(1);
    expect(html).toContain('id="histoire"');
    expect(html).toContain('href="#histoire"');
  });

  it.each(V2_SLUGS)('%s has no « En bref » block and no bento galleries', (slug) => {
    const html = read(slug);
    expect(html).not.toMatch(/>\s*En bref\s*</);
    expect(html).not.toContain('project-detail__snapshot');
    expect(html).not.toContain('project-brief');
    expect(html).not.toContain('project-detail__gallery');
  });

  it.each(V2_SLUGS)('%s keeps action cards inside « Aller plus loin » only', (slug) => {
    const html = read(slug);
    const further = /<section class="project-further"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
    const cards = html.match(/class="project-further__card"/g) ?? [];
    expect(further.match(/class="project-further__card"/g) ?? []).toHaveLength(cards.length);
  });
});
