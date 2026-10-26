/**
 * @file E2E (post-deploy) — legacy addresses redirect (301) to the canonical URL; jury is untouched
 * @description `PLAYWRIGHT_BASE_URL=https://… npx playwright test tests/e2e/canonical-urls.prod.spec.ts`
 */
import { expect, test } from '@playwright/test';

test.skip(!process.env.PLAYWRIGHT_BASE_URL, 'post-deploy check: set PLAYWRIGHT_BASE_URL');

const BASE = (process.env.PLAYWRIGHT_BASE_URL ?? '').replace(/\/+$/, '');

const REDIRECTS: Array<[string, string]> = [
  ['/pages/index.html', '/'],
  ['/pages/', '/'],
  ['/pages/projects.html', '/projects'],
  ['/pages/projects/visualcom.html', '/projects/visualcom'],
  ['/pages/projects/visualcom', '/projects/visualcom'],
  ['/pages/projects/lab-horizon.html', '/projects/lab-horizon'],
  ['/pages/cv.html', '/cv'],
  ['/pages/contact.html', '/contact'],
  ['/cv.html', '/cv'],
];

test.describe('canonical URLs (prod)', () => {
  for (const [from, to] of REDIRECTS) {
    test(`${from} → 301 ${to}`, async ({ request }) => {
      const response = await request.get(`${BASE}${from}`, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(new URL(response.headers()['location'] ?? '', BASE).pathname).toBe(to);
    });
  }

  for (const path of [
    '/',
    '/projects',
    '/projects?domaine=3d',
    '/projects/visualcom',
    '/cv',
    '/contact',
  ]) {
    test(`${path} → 200 without redirect loop`, async ({ request }) => {
      const response = await request.get(`${BASE}${path}`, { maxRedirects: 0 });
      expect(response.status()).toBe(200);
    });
  }

  test('the jury area is not redirected: still 401 on the legacy address', async ({ request }) => {
    const response = await request.get(`${BASE}/pages/jury/index.html`, { maxRedirects: 0 });
    expect(response.status()).toBe(401);
  });
});
