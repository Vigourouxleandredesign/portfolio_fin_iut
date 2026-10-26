/**
 * @file Jury area build guard — validates the credential, adds noindex / no-store rules to dist/_headers
 * @description The reflective sheets (`/jury/*`) live on the same Netlify site as the public portfolio.
 *   The lock itself is the Edge Function `netlify/edge-functions/jury-auth.ts`, which reads the
 *   Netlify environment variable `JURY_BASIC_AUTH` (`user:password`) at request time.
 *   This script runs at build time and:
 *   - FAILS the Netlify build (`CONTEXT` set) when the credential is missing or weak, so the jury area
 *     can never be published without a password (locally it only warns);
 *   - appends `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private, no-store` rules for the
 *     jury paths to `dist/_headers`.
 *   It NEVER writes the credential into the build output: `Basic-Auth` in `_headers` only works on
 *   Netlify Pro/Enterprise (silently ignored on the free plan), and a secret in a published artifact
 *   is what Netlify's secrets scanner fails builds on.
 *   Usage: `npm run audit:ci && npm run gate && node scripts/inject-jury-auth.mjs` (see netlify.toml)
 * @see {@link ../docs/SECURITY.md} §0, §7
 */
import { appendFileSync, existsSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Every path that can serve jury content (pretty route, built HTML, PDFs). */
export const JURY_PATHS = ['/jury', '/jury/*', '/pages/jury/*'];

/** Minimum password length accepted for the shared jury credential. */
export const MIN_PASSWORD_LENGTH = 16;

/**
 * Validates a `user:password` credential.
 * @param {string | undefined} credential
 * @returns {string | null} error message, or null when valid
 */
export function validateCredential(credential) {
  if (!credential) return 'JURY_BASIC_AUTH is not set';
  const index = credential.indexOf(':');
  if (index <= 0) return 'JURY_BASIC_AUTH must look like user:password';
  const password = credential.slice(index + 1);
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `jury password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (/\s/.test(credential)) return 'JURY_BASIC_AUTH must not contain spaces';
  return null;
}

/**
 * Builds the `_headers` block for the jury area: no indexing, no shared caching. No credential.
 * @returns {string}
 */
export function buildJuryHeaders() {
  return JURY_PATHS.map(
    (path) => `\n${path}\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: private, no-store\n`,
  ).join('');
}

function main() {
  const onNetlify = Boolean(process.env.CONTEXT);
  const credential = process.env.JURY_BASIC_AUTH;
  const error = validateCredential(credential);
  if (error) {
    if (onNetlify) {
      console.error(`[jury-auth] ${error} — refusing to publish the jury area unprotected.`);
      process.exit(1);
    }
    console.warn(`[jury-auth] ${error} — skipped (local build).`);
    return;
  }
  const headersPath = resolve(process.cwd(), 'dist/_headers');
  if (!existsSync(headersPath)) {
    console.error('[jury-auth] dist/_headers not found — run `npm run build` first.');
    process.exit(1);
  }
  appendFileSync(headersPath, buildJuryHeaders());
  console.log(
    `[jury-auth] credential valid; noindex/no-store rules added for ${JURY_PATHS.join(', ')}`,
  );
}

const isCli =
  Boolean(process.argv[1]) &&
  realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
if (isCli) {
  main();
}
