/**
 * @file Netlify Edge Function — Basic-Auth on the jury area
 * @description `Basic-Auth` in `_headers` is ignored on Netlify's free plan (Pro/Enterprise only), so
 *   the lock lives here: it runs before the CDN cache, on every request to a jury path.
 *   The function is mounted on `/*` and decides itself with a *normalised* path (`lib/jury-path.ts`):
 *   exact-match routes were bypassable with `//jury` and `/JURY/…` (red team, 2026-10-25).
 *   The credential comes only from the env var `JURY_BASIC_AUTH` (scope: Builds + Functions).
 *   Missing variable → 503 on jury paths only (fail closed, never serve the jury area in clear).
 * @see {@link ../../docs/SECURITY.md} §0, §7
 */
import { isAuthorized } from './lib/basic-auth.ts';
import { isJuryPath } from './lib/jury-path.ts';

declare const Netlify: { env: { get(name: string): string | undefined } };

const NO_STORE = { 'Cache-Control': 'no-store' };

export default async function juryAuth(
  request: Request,
  context: { next(): Promise<Response> },
): Promise<Response | undefined> {
  if (!isJuryPath(new URL(request.url).pathname)) return undefined;

  const expected = Netlify.env.get('JURY_BASIC_AUTH');
  if (!expected) {
    return new Response('Espace jury indisponible : configuration manquante.', {
      status: 503,
      headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  if (!isAuthorized(request.headers.get('authorization'), expected)) {
    return new Response('Authentification requise pour accéder à l’espace jury.', {
      status: 401,
      headers: {
        ...NO_STORE,
        'Content-Type': 'text/plain; charset=utf-8',
        'WWW-Authenticate': 'Basic realm="Espace jury", charset="UTF-8"',
      },
    });
  }
  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(response.body, { status: response.status, headers });
}

// `/assets/*` (hashed public bundles) is skipped for speed; it never holds jury content.
export const config = { path: '/*', excludedPath: ['/assets/*'] };
