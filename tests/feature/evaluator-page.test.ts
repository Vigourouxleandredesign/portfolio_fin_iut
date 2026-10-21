/**
 * @file Feature — evaluator shell markup (C6)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const html = readFileSync(resolve(process.cwd(), 'pages/evaluator.html'), 'utf8');

describe('C6 — evaluator shell', () => {
  it('exposes missing / login / denied / dashboard views', () => {
    expect(html).toContain('data-view-missing');
    expect(html).toContain('data-view-login');
    expect(html).toContain('data-view-denied');
    expect(html).toContain('data-view-dashboard');
  });

  it('is noindex', () => {
    expect(html).toMatch(/noindex/i);
  });
});
