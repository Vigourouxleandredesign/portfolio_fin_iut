/**
 * @file E2E — D5 perf / console smoke
 */
import { expect, test } from '@playwright/test';

test('D5 home has no pageerror and hero mounts or falls back', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  await page.goto('/pages/index.html');
  await page.waitForTimeout(1500);

  const hero = page.locator('[data-hero-3d], [data-hero-3d-canvas], .hero-3d');
  await expect(hero.first()).toBeVisible({ timeout: 15_000 });

  const fatal = pageErrors.filter((msg) => !/ResizeObserver|Script error/i.test(msg));
  expect(fatal, fatal.join('\n')).toEqual([]);
});

test('D5 reduced-motion home does not crash', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  await page.goto('/pages/index.html');
  await page.waitForTimeout(800);
  expect(pageErrors.filter((m) => !/ResizeObserver/i.test(m))).toEqual([]);
});

test.describe('touch device (390 px, hasTouch)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('D5 home downloads nothing of the 3D bust and shows the static hero', async ({ page }) => {
    const requested: string[] = [];
    page.on('request', (request) => requested.push(request.url()));
    await page.goto('/pages/index.html');
    await page.waitForLoadState('load');
    await page.waitForTimeout(3500);

    const heavy = requested.filter((url) =>
      /bust-[\w-]+\.glb|rapier-[\w-]+\.js|three\.module/.test(url),
    );
    expect(heavy, heavy.join(', ')).toEqual([]);
    await expect(page.locator('[data-hero-3d-fallback]')).toBeVisible();
    await expect(page.locator('.hero-3d--active')).toHaveCount(0);
    await expect(page.locator('.hero-3d__hint')).toBeHidden();
  });
});
