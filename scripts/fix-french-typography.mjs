/**
 * @file French typography fixer for the HTML pages (L10, red team audit of 25/10, P3-1)
 * @description Edits **text nodes only** of `pages/**\/*.html` (never attributes, `<head>`, `<script>`,
 *   `<style>`, `<code>`, `<pre>`, `<textarea>`, URLs or comments):
 *   - narrow no-break space (U+202F, written `&#8239;`) before `; : ! ?` and inside « guillemets » ;
 *   - no-break space (U+00A0, written `&nbsp;`) between a number and its unit (`1,2 Mo`, `2 h`, `50 %`).
 *   Idempotent: running it twice changes nothing. `typographyIssues()` is reused by the guard test.
 *   Usage: `node scripts/fix-french-typography.mjs` (rewrites files) · `--check` (exit 1 if a fix is due).
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const NARROW = '&#8239;';
const NBSP = '&nbsp;';

/** Elements whose content is never typography-fixed. */
const SKIP_ELEMENTS = new Set([
  'script',
  'style',
  'code',
  'pre',
  'textarea',
  'svg',
  'kbd',
  'title',
]);

/** Units that follow a number after a no-break space. Single letters need a word boundary check. */
const UNITS = ['Mo', 'Ko', 'Go', 'To', 'ms', 'min', 'km', 'kg', 'Hz', 'fps', 's', 'h', '%', '€'];
const UNIT_PATTERN = UNITS.map((unit) => unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

/** `12 Mo`, `2 h`, `50 %` — but not `2 s’agit` or `3 heures`. */
const NUMBER_UNIT = new RegExp(`(\\d) (${UNIT_PATTERN})(?![\\p{L}’'\\d])`, 'gu');

/** Regular spaces or line breaks (Prettier wraps text) around double punctuation and guillemets. */
const BEFORE_PUNCTUATION = /(^|\S)\s+([;:!?])(?![\p{L}\d])/gu;
const AFTER_OPENING_QUOTE = /«\s+/g;
const BEFORE_CLOSING_QUOTE = /\s+»/g;

/**
 * Fixes one text node.
 * @param {string} text
 * @returns {string}
 */
export function fixText(text) {
  return text
    .replace(AFTER_OPENING_QUOTE, `«${NARROW}`)
    .replace(BEFORE_CLOSING_QUOTE, `${NARROW}»`)
    .replace(BEFORE_PUNCTUATION, `$1${NARROW}$2`)
    .replace(NUMBER_UNIT, `$1${NBSP}$2`);
}

/**
 * Applies `transform` to the text nodes of the `<body>` of an HTML document.
 * @param {string} html
 * @param {(text: string) => string} transform
 * @returns {string}
 */
function mapTextNodes(html, transform) {
  const bodyStart = html.search(/<body[\s>]/i);
  if (bodyStart === -1) return html;
  const head = html.slice(0, bodyStart);
  const body = html.slice(bodyStart);
  const parts = body.split(/(<!--[\s\S]*?-->|<[^>]+>)/);
  let skipDepth = 0;
  let skippedTag = '';
  const out = parts.map((part) => {
    if (part.startsWith('<!--')) return part;
    if (part.startsWith('<')) {
      const match = /^<\/?\s*([a-zA-Z][\w-]*)/.exec(part);
      if (match) {
        const tag = match[1].toLowerCase();
        const closing = part.startsWith('</');
        if (SKIP_ELEMENTS.has(tag) && !part.endsWith('/>')) {
          if (!closing && skipDepth === 0) {
            skipDepth = 1;
            skippedTag = tag;
          } else if (!closing && tag === skippedTag) {
            skipDepth += 1;
          } else if (closing && tag === skippedTag) {
            skipDepth = Math.max(0, skipDepth - 1);
          }
        }
      }
      return part;
    }
    return skipDepth > 0 ? part : transform(part);
  });
  return head + out.join('');
}

/**
 * @param {string} html
 * @returns {string} the HTML with fixed typography in its text nodes
 */
export function fixHtml(html) {
  return mapTextNodes(html, fixText);
}

/**
 * Text fragments that still need a fix (used by the guard test).
 * @param {string} html
 * @returns {string[]}
 */
export function typographyIssues(html) {
  const issues = [];
  mapTextNodes(html, (text) => {
    const fixed = fixText(text);
    if (fixed !== text) {
      const index = [...text].findIndex((char, i) => char !== [...fixed][i]);
      issues.push(text.slice(Math.max(0, index - 20), index + 24).replace(/\s+/g, ' '));
    }
    return text;
  });
  return issues;
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

function main() {
  const check = process.argv.includes('--check');
  let changed = 0;
  for (const file of htmlFiles(resolve(process.cwd(), 'pages'))) {
    const before = readFileSync(file, 'utf8');
    const after = fixHtml(before);
    if (after === before) continue;
    changed += 1;
    if (check)
      console.error(`[typography] ${file}: ${typographyIssues(before).length} fix(es) due`);
    else writeFileSync(file, after, 'utf8');
  }
  console.log(`[typography] ${check ? 'to fix' : 'fixed'}: ${changed} file(s)`);
  if (check && changed > 0) process.exit(1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
