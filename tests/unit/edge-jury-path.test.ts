/**
 * @file Unit — jury path matcher (regression tests for the 2026-10-25 red-team bypasses)
 */
import { describe, expect, it } from 'vitest';
import { isJuryPath, normalizeSegments } from '../../netlify/edge-functions/lib/jury-path';

describe('isJuryPath — protected', () => {
  it.each([
    '/jury',
    '/jury/',
    '/jury/lab-horizon',
    '/pages/jury/',
    '/pages/jury/index.html',
    '/jury/fiches/visualcom/mission-reflection.pdf',
    // bypasses found live on 2026-10-25
    '//jury',
    '///jury',
    '//jury/',
    '//jury/lab-horizon',
    '//pages/jury/index.html',
    '//jury/fiches/visualcom/mission-reflection.pdf',
    '/JURY',
    '/Jury/fiches/visualcom/mission-reflection.pdf',
    '/JURY/fiches/village-jeunes/project-sheet.pdf',
    '/PAGES/JURY/index.html',
    '/pages/Jury/lab-horizon.html',
    // other classic tricks
    '/pages//jury/',
    '/jury/.',
    '/./jury',
    '/x/../jury/fiches/a.pdf',
    '/jury/../jury',
    '/%6aury',
    '/%4AURY/fiches/a.pdf',
    '/jury%2Ffiches',
    '/%252e%252e/jury',
    '/jury.',
    '/jury%20',
    '\\jury\\fiches',
    '/jury%00',
    '/%E0%A4%A',
  ])('%s', (path) => {
    expect(isJuryPath(path)).toBe(true);
  });
});

describe('isJuryPath — public', () => {
  it.each([
    '/',
    '/projects',
    '/projects/lab-horizon',
    '/cv',
    '/contact',
    '/assets/jury-pMmRUyVY.js',
    '/assets/jury-abc.css',
    '/jury-notes',
    '/projects/jurys',
    '/robots.txt',
    '/sitemap.xml',
  ])('%s', (path) => {
    expect(isJuryPath(path)).toBe(false);
  });
});

describe('normalizeSegments', () => {
  it('collapses slashes, lowercases and resolves dot segments', () => {
    expect(normalizeSegments('//A/./b/../C//')).toEqual(['a', 'c']);
  });

  it('returns null on malformed escapes', () => {
    expect(normalizeSegments('/%E0%A4%A')).toBeNull();
  });
});
