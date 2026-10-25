/**
 * @file Jury path matcher — normalises a request path before deciding if it needs the password
 * @description The CDN serves static files case-insensitively and collapses repeated slashes, so an
 *   exact-match route (`/jury`, `/jury/*`) can be bypassed with `//jury` or `/JURY/…` (red team,
 *   2026-10-25). The guard therefore runs on every path and protects any request whose
 *   *normalised* path has a segment named `jury`. Segments such as `jury-AbC123.js` (public bundles
 *   under `/assets`) are not matched: only the exact segment is.
 * @see {@link ../../../docs/SECURITY.md} §0, §7
 */

const MAX_DECODE_PASSES = 3;

/** Decodes percent-escapes until stable (handles `%252F`), or returns `null` if malformed. */
function decodeFully(path: string): string | null {
  let current = path;
  for (let pass = 0; pass < MAX_DECODE_PASSES; pass += 1) {
    let next: string;
    try {
      next = decodeURIComponent(current);
    } catch {
      return null;
    }
    if (next === current) return current;
    current = next;
  }
  return current;
}

/** Removes C0 control characters and DEL (`jury%00` must still read as `jury`). */
function stripControlChars(value: string): string {
  return Array.from(value)
    .filter((char) => char.charCodeAt(0) > 31 && char.charCodeAt(0) !== 127)
    .join('');
}

/** Lower-cased path segments, with empty and `.` removed and `..` resolved. */
export function normalizeSegments(pathname: string): string[] | null {
  const decoded = decodeFully(pathname);
  if (decoded === null) return null;
  const segments: string[] = [];
  for (const raw of decoded.toLowerCase().split(/[/\\]+/)) {
    const trimmed = stripControlChars(raw).trim();
    // `jury.` / `jury ` must not slip past: drop trailing dots unless the segment is only dots.
    const segment = /^\.+$/.test(trimmed) ? trimmed : trimmed.replace(/\.+$/, '');
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  return segments;
}

/** `true` when the request must be authenticated. Undecodable paths fail closed. */
export function isJuryPath(pathname: string): boolean {
  const segments = normalizeSegments(pathname);
  if (segments === null) return true;
  return segments.includes('jury');
}
