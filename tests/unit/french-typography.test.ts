/**
 * @file Unit — French typography fixer + guard on the published pages (L10, red team audit of 25/10, P3-1)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
// Plain ESM script (no type declarations needed: tests are not type-checked by tsc)
import { fixHtml, fixText, typographyIssues } from '../../scripts/fix-french-typography.mjs';

const NARROW = '&#8239;';
const NBSP = '&nbsp;';

describe('fixText', () => {
  it('puts a narrow no-break space before ; : ! ?', () => {
    expect(fixText('un projet : une idée ; et alors ? bravo !')).toBe(
      `un projet${NARROW}: une idée${NARROW}; et alors${NARROW}? bravo${NARROW}!`,
    );
  });

  it('also fixes a punctuation mark that Prettier wrapped onto its own line', () => {
    expect(fixText('MySQL et Redis\n   : tout tourne')).toBe(
      `MySQL et Redis${NARROW}: tout tourne`,
    );
  });

  it('keeps a narrow no-break space inside « guillemets », even across line breaks', () => {
    expect(fixText('il dit « bonjour tout\n   le monde »')).toBe(
      `il dit «${NARROW}bonjour tout\n   le monde${NARROW}»`,
    );
  });

  it('binds a number to its unit with a no-break space', () => {
    expect(fixText('1,2 Mo en 30 s, soit 2 h et 50 %')).toBe(
      `1,2${NBSP}Mo en 30${NBSP}s, soit 2${NBSP}h et 50${NBSP}%`,
    );
  });

  it('leaves alone what is not a unit or not a double punctuation', () => {
    for (const text of [
      'plus de 500 inscriptions',
      '2 s’agit',
      '3 heures',
      'à 10:30 sur https://exemple.test/a?b=1',
      'Clic gauche&nbsp;: peindre',
      'déjà&#8239;: fait',
    ]) {
      expect(fixText(text)).toBe(text);
    }
  });

  it('is idempotent', () => {
    const once = fixText('une idée : « oui » ; 12 Mo ?');
    expect(fixText(once)).toBe(once);
  });
});

describe('fixHtml — text nodes only', () => {
  const html = `<!doctype html><html><head><title>Titre : test</title><meta name="description" content="a : b" /></head>
<body><p class="x : y" title="a : b">Un titre : suite</p><code>a : b</code><pre>c : d</pre>
<script>const a = b ? c : d;</script><style>a:hover { color: red }</style><!-- note : garde --></body></html>`;

  it('only rewrites the visible text', () => {
    const fixed = fixHtml(html);
    expect(fixed).toContain(`Un titre${NARROW}: suite`);
    expect(fixed).toContain('<title>Titre : test</title>');
    expect(fixed).toContain('content="a : b"');
    expect(fixed).toContain('title="a : b"');
    expect(fixed).toContain('<code>a : b</code>');
    expect(fixed).toContain('<pre>c : d</pre>');
    expect(fixed).toContain('const a = b ? c : d;');
    expect(fixed).toContain('<!-- note : garde -->');
  });
});

function htmlPages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlPages(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

describe('published pages respect French typography', () => {
  it.each(htmlPages(resolve(process.cwd(), 'pages')))('%s', (file) => {
    const issues: string[] = typographyIssues(readFileSync(file, 'utf8'));
    expect(issues, `run « node scripts/fix-french-typography.mjs »:\n${issues.join('\n')}`).toEqual(
      [],
    );
  });
});
