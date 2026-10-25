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
];
const PUBLIC = ['/', '/projects', '/cv'];

test.describe('jury protection (prod)', () => {
  for (const path of PROTECTED) {
    test(`${path} → 401 without credentials`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(401);
      expect(response.headers()['www-authenticate']).toContain('Basic');
    });

    test(`${path} → 401 with wrong credentials`, async ({ request }) => {
      const response = await request.get(path, {
        maxRedirects: 0,
        headers: { Authorization: `Basic ${Buffer.from('nobody:wrong').toString('base64')}` },
      });
      expect(response.status()).toBe(401);
    });
  }

  for (const path of PUBLIC) {
    test(`${path} → 200 (public)`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(200);
    });
  }
});
