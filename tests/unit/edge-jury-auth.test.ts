/**
 * @file Unit — jury Edge Function logic (Basic-Auth parsing and comparison)
 */
import { describe, expect, it } from 'vitest';
import {
  isAuthorized,
  parseBasicAuth,
  safeEqual,
} from '../../netlify/edge-functions/lib/basic-auth';

// Throwaway value generated for the test run: not a real secret.
const expected = `jury:${crypto.randomUUID()}`;
const basic = (credential: string): string => `Basic ${btoa(credential)}`;

describe('edge jury auth — parseBasicAuth', () => {
  it('decodes a well-formed Basic header', () => {
    expect(parseBasicAuth(basic('user:pass-word'))).toBe('user:pass-word');
  });

  it('returns null for absent, wrong-scheme or invalid base64 headers', () => {
    expect(parseBasicAuth(null)).toBeNull();
    expect(parseBasicAuth('')).toBeNull();
    expect(parseBasicAuth(`Bearer ${btoa(expected)}`)).toBeNull();
    expect(parseBasicAuth('Basic !!!not-base64!!!')).toBeNull();
    expect(parseBasicAuth('Basic')).toBeNull();
  });
});

describe('edge jury auth — safeEqual', () => {
  it('compares values exactly, including different lengths', () => {
    expect(safeEqual('abc', 'abc')).toBe(true);
    expect(safeEqual('abc', 'abd')).toBe(false);
    expect(safeEqual('abc', 'abcd')).toBe(false);
    expect(safeEqual('', '')).toBe(true);
    expect(safeEqual('a', '')).toBe(false);
  });
});

describe('edge jury auth — isAuthorized', () => {
  it('accepts only the exact credential', () => {
    expect(isAuthorized(basic(expected), expected)).toBe(true);
  });

  it('refuses missing header, wrong scheme, wrong or different-length password', () => {
    expect(isAuthorized(null, expected)).toBe(false);
    expect(isAuthorized(`Bearer ${btoa(expected)}`, expected)).toBe(false);
    expect(isAuthorized(basic('nobody:wrong'), expected)).toBe(false);
    expect(isAuthorized(basic(`${expected}x`), expected)).toBe(false);
    expect(isAuthorized(basic(expected.slice(0, -1)), expected)).toBe(false);
  });

  it('refuses everything when no credential is configured', () => {
    expect(isAuthorized(basic(':'), '')).toBe(false);
    expect(isAuthorized(basic('a:b'), undefined)).toBe(false);
  });
});
