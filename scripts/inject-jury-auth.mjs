/**
 * @file Jury area lock — appends Netlify Basic-Auth rules to dist/_headers at build time
 * @description The reflective sheets (`/jury/*`) live on the same Netlify site as the
 *   public portfolio but behind a server-side password. The credential is read from
 *   the Netlify environment variable `JURY_BASIC_AUTH` (`user:password`) and is
 *   written only into the built `dist/_headers` — never into Git.
 *   - On Netlify (`CONTEXT` set) a missing/weak credential FAILS the build, so the
 *     jury pages can never be published unprotected.
 *   - Locally (no `CONTEXT`) it only warns.
 *   Usage: `npm run build && node scripts/inject-jury-auth.mjs` (see netlify.toml)
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
 * Builds the `_headers` block protecting the jury area.
 * @param {string} credential - `user:password`
 * @returns {string}
 */
export function buildJuryHeaders(credential) {
  return JURY_PATHS.map(
    (path) =>
      `\n${path}\n  Basic-Auth: ${credential}\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: private, no-store\n`,
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
  appendFileSync(headersPath, buildJuryHeaders(/** @type {string} */ (credential)));
  console.log(`[jury-auth] Basic-Auth added for ${JURY_PATHS.join(', ')}`);
}

const isCli =
  Boolean(process.argv[1]) &&
  realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
if (isCli) {
  main();
}
