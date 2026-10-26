/**
 * @file Feature — project navigation cards, gouache arrows on what is clicked, none on illustrations (L14 part D)
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');
const flat = (path: string): string => read(path).replace(/\s+/g, ' ').replace(/ >/g, '>');
const projectPages = readdirSync(resolve(root, 'pages/projects')).map(
  (name) => `pages/projects/${name}`,
);

describe('navigation between projects', () => {
  it.each(projectPages)(
    '%s has exactly two links, each with a decorative gouache arrow',
    (page) => {
      const nav = /<nav class="project-nav"[\s\S]*?<\/nav>/.exec(flat(page))?.[0] ?? '';
      const links = nav.match(/<a [\s\S]*?<\/a>/g) ?? [];
      expect(links).toHaveLength(2);
      expect(links[0]).toContain('project-nav__link--prev');
      expect(links[0]).toContain('arrow-long-copper-left.webp');
      expect(links[0]).toContain('project-nav__label">Précédent<');
      expect(links[1]).toContain('project-nav__link--next');
      expect(links[1]).toContain('arrow-long-copper-right.webp');
      expect(links[1]).toContain('project-nav__label">Suivant<');
      for (const link of links) {
        expect(link).toMatch(/<img class="project-nav__arrow"[^>]* alt=""/);
        expect(link).toMatch(/project-nav__name">[^<]+</);
      }
    },
  );

  const css = read('src/styles/components/project-detail.css');

  it('lays the cards on two columns (one under 48 rem) with a 44 px minimum target', () => {
    expect(css).toMatch(/\.project-nav \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
    expect(css).toMatch(
      /@media \(min-width: 48rem\) \{\s*\.project-nav \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/,
    );
    expect(css).toMatch(/\.project-nav__link \{[^}]*min-height: 2\.75rem/);
  });

  it('moves the arrow 6 px on hover and focus, and not under reduced motion', () => {
    expect(css).toContain('translateX(-6px)');
    expect(css).toContain('translateX(6px)');
    expect(css).toMatch(
      /prefers-reduced-motion: reduce\) \{\s*\.project-nav__arrow \{\s*transition: none;/,
    );
    expect(css).toContain('border-color: var(--color-pigment-copper)');
  });
});

describe('arrows on what is clicked', () => {
  const buttons = read('src/styles/components/button.css');

  it('every arrow file the CSS and the pages use exists', () => {
    for (const name of ['arrow-long-copper-right', 'arrow-short-copper-right']) {
      expect(buttons).toContain(`${name}.webp`);
      expect(existsSync(resolve(root, `src/assets/decor/paint/arrows/${name}.webp`))).toBe(true);
    }
  });

  it('gives the main button the long arrow and the secondary link the short one', () => {
    expect(buttons).toMatch(/\.button--primary::after \{[^}]*arrow-long-copper-right/);
    expect(buttons).toMatch(/\.button--primary::after \{[^}]*filter: brightness\(0\.25\)/);
    expect(buttons).toMatch(/\.button--ghost::after \{[^}]*arrow-short-copper-right/);
  });

  it('turns the long-version block into a copper-outlined action card that lifts on hover', () => {
    const css = read('src/styles/components/project-detail.css');
    expect(css).toMatch(
      /\.project-detail__details \{[^}]*border: 1px solid var\(--color-pigment-copper\)/,
    );
    expect(css).toContain('.project-detail__details:hover:not([open])');
    expect(css).toContain('arrow-long-copper-right.webp');
  });
});

describe('illustrations carry no arrow and no copper outline', () => {
  const css = read('src/styles/components/project-detail.css');

  it('removes the hover outline of gallery items and sets captions in Ubuntu Mono 13 px', () => {
    expect(css).not.toMatch(/\.project-gallery__item:hover/);
    for (const selector of ['.project-gallery__caption', '.project-story__caption']) {
      const start = css.indexOf(`${selector} {`);
      expect(start, selector).toBeGreaterThanOrEqual(0);
      const block = css.slice(start, css.indexOf('}', start));
      expect(block, selector).toContain('font-family: var(--font-mono)');
      expect(block, selector).toContain('font-size: 0.8125rem');
    }
  });

  it.each(projectPages)('%s has no illustration inside a link without a text name', (page) => {
    const html = flat(page);
    for (const link of html.match(/<a [^>]*>[\s\S]*?<\/a>/g) ?? []) {
      if (link.includes('project-nav__link') || link.includes('class="site-header')) continue;
      if (!/<img [^>]*src="\/src\/assets\/projects\//.test(link)) continue;
      const text = link
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const labelled = /aria-label="[^"]+"/.test(link) || /\balt="[^"]+"/.test(link);
      expect(text.length > 0 || labelled, link.slice(0, 120)).toBe(true);
    }
  });
});
