/**
 * @file Unit — jury area lock (Basic-Auth injected at build time, never committed)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
// Plain ESM build script (no type declarations needed: tests are not type-checked by tsc)
import { buildJuryHeaders, JURY_PATHS, validateCredential } from '../../scripts/inject-jury-auth.mjs';

describe('jury auth — credential validation', () => {
  it('rejects a missing, malformed or short credential', () => {
    expect(validateCredential(undefined)).not.toBeNull();
    expect(validateCredential('nopassword')).not.toBeNull();
    expect(validateCredential('jury:short')).not.toBeNull();
    expect(validateCredential('jury:with space in password')).not.toBeNull();
  });

  it('accepts user:password with a long password', () => {
    expect(validateCredential('jury:Correct-Horse-Battery-42')).toBeNull();
  });
});

describe('jury auth — headers block', () => {
  const block: string = buildJuryHeaders('jury:Correct-Horse-Battery-42');

  it('protects every path that can serve jury content', () => {
    for (const path of JURY_PATHS as string[]) {
      expect(block).toContain(`\n${path}\n  Basic-Auth: jury:Correct-Horse-Battery-42`);
    }
    expect(JURY_PATHS).toEqual(expect.arrayContaining(['/jury/*', '/pages/jury/*']));
  });

  it('keeps jury pages out of search engines and caches', () => {
    expect(block).toContain('X-Robots-Tag: noindex, nofollow');
    expect(block).toContain('Cache-Control: private, no-store');
  });
});

describe('jury auth — no credential in Git', () => {
  it('never commits a Basic-Auth rule in public/_headers or netlify.toml', () => {
    const headers = readFileSync(resolve(process.cwd(), 'public/_headers'), 'utf8');
    const toml = readFileSync(resolve(process.cwd(), 'netlify.toml'), 'utf8');
    expect(headers).not.toMatch(/Basic-Auth/i);
    expect(toml).not.toMatch(/JURY_BASIC_AUTH\s*=\s*"[^"<]+:/);
    expect(toml).toContain('inject-jury-auth.mjs');
  });
});
