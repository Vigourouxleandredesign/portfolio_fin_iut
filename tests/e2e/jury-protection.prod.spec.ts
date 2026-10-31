/**
 * @file E2E (post-deploy) — the jury area must answer 401 without the real credential
 * @description Runs only against a deployed site: `PLAYWRIGHT_BASE_URL=https://… npx playwright test
 *   tests/e2e/jury-protection.prod.spec.ts`. Never uses the real password.
 * @see docs/SECURITY.md §7
 */
import { expect, test } from '@playwright/test';

test.skip(!process.env.PLAYWRIGHT_BASE_URL, 'post-deploy check: set PLAYWRIGHT_BASE_URL');

const PROTECTED = [
  '/jury',
  '/jury/',
  '/jury/developpement-front',
  '/pages/jury/',
  '/pages/jury/index.html',
  '/pages/jury/developpement-front.html',
  '/jury/fiches/visualcom/mission-reflection.pdf',
  '/jury/fiches/village-jeunes/project-sheet.pdf',
  '/jury/fiches/lab-horizon/mission-reflection.pdf',
  '/jury/fiches/lab-horizon/project-sheet.pdf',
  // bypass attempts (red team 2026-10-25): repeated slashes, other letter case, encodings
  '//jury',
  '///jury/',
  '//jury/developpement-front',
  '//pages/jury/index.html',
  '//jury/fiches/visualcom/mission-reflection.pdf',
  '/JURY/fiches/visualcom/mission-reflection.pdf',
  '/Jury/fiches/village-jeunes/project-sheet.pdf',
  '/JURY',
  '/%6aury',
  '/%4aury/fiches/visualcom/mission-reflection.pdf',
];
const PUBLIC = ['/', '/projects', '/cv'];

// Absolute URLs: a relative `//jury` would be parsed as the host `jury`.
const BASE = (process.env.PLAYWRIGHT_BASE_URL ?? '').replace(/\/+$/, '');
const url = (path: string): string => `${BASE}${path}`;

test.describe('jury protection (prod)', () => {
  for (const path of PROTECTED) {
    test(`${path} → 401 without credentials`, async ({ request }) => {
      const response = await request.get(url(path), { maxRedirects: 0 });
      expect(response.status()).toBe(401);
      expect(response.headers()['www-authenticate']).toContain('Basic');
    });

    test(`${path} → 401 with wrong credentials`, async ({ request }) => {
      const response = await request.get(url(path), {
        maxRedirects: 0,
        headers: { Authorization: `Basic ${Buffer.from('nobody:wrong').toString('base64')}` },
      });
      expect(response.status()).toBe(401);
    });
  }

  for (const path of PUBLIC) {
    test(`${path} → 200 (public)`, async ({ request }) => {
      expect((await request.get(url(path))).status()).toBe(200);
    });
  }
});
