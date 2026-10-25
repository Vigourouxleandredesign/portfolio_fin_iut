/**
 * @file HTTP Basic-Auth helpers for the jury Edge Function
 * @description Pure logic, no Deno / Netlify dependency, so Vitest can test it. The expected
 *   credential (`user:password`) is passed in by the caller and never stored here.
 * @see {@link ../../../docs/SECURITY.md} §0, §7
 */

/**
 * Decodes `Authorization: Basic <base64>` into `user:password`.
 * @returns the decoded credential, or `null` when absent, not Basic, or malformed (never throws)
 */
export function parseBasicAuth(header: string | null): string | null {
  if (!header) return null;
  const match = /^Basic +([A-Za-z0-9+/]+={0,2})$/.exec(header.trim());
  if (!match) return null;
  try {
    const binary = atob(match[1]);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Constant-time string comparison: always walks the longest length, length checked last. */
export function safeEqual(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = 0;
  for (let i = 0; i < length; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0 && a.length === b.length;
}

/** `true` only when the header carries exactly the expected credential; empty `expected` never matches. */
export function isAuthorized(header: string | null, expected: string | undefined): boolean {
  if (!expected) return false;
  const given = parseBasicAuth(header);
  if (given === null) return false;
  return safeEqual(given, expected);
}
