/**
 * @file Feature — writing guards on the visible text of the pages (L12 part E, proofreading of 26/10)
 * @description Visible text = text nodes, `<title>`, `<meta content>`, `alt`, `aria-label`. Quotes of the
 *   jury sheets (`<blockquote>`, and the sheet text itself marked `data-verbatim`, Léandre's own words) are
 *   excluded. Comments, scripts, styles are not text.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());

function htmlPages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlPages(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

/** Everything a visitor (or a screen reader, or a search engine snippet) can read on the page. */
function visibleText(html: string): string[] {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|blockquote)\b[\s\S]*?<\/\1>/gi, '')
    // L18: the reflective sheets are Léandre's words, published verbatim (and only them).
    .replace(/<(article|p)\b[^>]*\bdata-verbatim\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const attributes = [
    ...cleaned.matchAll(/\b(?:alt|aria-label|title)="([^"]*)"/g),
    ...cleaned.matchAll(/<meta\b[^>]*\bcontent="([^"]*)"/g),
  ].map((match) => match[1]);
  const nodes = cleaned
    .replace(/<[^>]*>/g, '|')
    .split('|')
    .map((text) => text.trim())
    .filter(Boolean);
  return [...attributes, ...nodes].map((text) => text.replace(/\s+/g, ' '));
}

const pages = htmlPages(resolve(root, 'pages')).map((file) => ({
  name: relative(root, file).split(sep).join('/'),
  texts: visibleText(readFileSync(file, 'utf8')),
}));

describe('writing rules (AGENTS.md « Règles d’écriture »)', () => {
  it.each(pages)('$name has no long dash (U+2014)', ({ texts }) => {
    expect(texts.filter((text) => text.includes('—'))).toEqual([]);
  });

  it.each(pages)('$name has no ampersand in a sentence or title', ({ texts }) => {
    expect(texts.filter((text) => /\S\s(?:&|&amp;)\s\S/.test(text))).toEqual([]);
  });

  it.each(pages)('$name always writes UI/UX, never UX/UI', ({ texts }) => {
    expect(texts.filter((text) => text.includes('UX/UI'))).toEqual([]);
  });

  it.each(pages)('$name has none of the wordings removed by the review', ({ texts }) => {
    const removed =
      /(ouvre une fiche|\bstaff\b|\bmockup\b|sanctuaire|exigeant|brèches? sur le site)/i;
    expect(texts.filter((text) => removed.test(text))).toEqual([]);
  });

  it('writes « E-mail » with a hyphen on the contact form', () => {
    const contact = pages.find((page) => page.name === 'pages/contact.html');
    expect(contact?.texts).toContain('E-mail');
    expect(contact?.texts).not.toContain('Email');
  });

  it('leaves the text of the jury sheets untouched', () => {
    const jury = readFileSync(resolve(root, 'pages/jury/village-jeunes.html'), 'utf8');
    expect(jury).toContain('<article class="jury-sheet" data-verbatim>');
    expect(jury).toContain('Ayant déjà fait de la création de parcours utilisateur');
  });

  it('applies the rules everywhere else on the jury pages', () => {
    const texts = visibleText(
      readFileSync(resolve(root, 'pages/jury/village-jeunes.html'), 'utf8'),
    );
    expect(texts).toContain('Sommaire');
    expect(texts.join(' ')).not.toContain('Ayant déjà fait');
  });
});

describe('the guard itself', () => {
  it('reads titles, meta, alt, aria-label and text nodes but not comments, scripts or blockquotes', () => {
    const sample = `<title>A — B</title><meta name="description" content="C &amp; D" />
      <!-- E — F --><script>const g = "H — I";</script>
      <img alt="J — K" /><a aria-label="L — M">N</a><p>O — P</p><blockquote>Q — R</blockquote>
      <article class="jury-sheet" data-verbatim><p>S — T</p></article><p>U — V</p>`;
    const texts = visibleText(sample).join('|');
    expect(texts).toContain('A — B');
    expect(texts).toContain('C &amp; D');
    expect(texts).toContain('J — K');
    expect(texts).toContain('L — M');
    expect(texts).toContain('O — P');
    expect(texts).not.toContain('E — F');
    expect(texts).not.toContain('H — I');
    expect(texts).not.toContain('Q — R');
    expect(texts).not.toContain('S — T');
    expect(texts).toContain('U — V');
  });
});
