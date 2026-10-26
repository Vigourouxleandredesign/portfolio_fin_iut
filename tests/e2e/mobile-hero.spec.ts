/**
 * @file E2E — phone / tablet home hero: the image is the hero, no empty band above or below it (L12 part D)
 */
import { expect, test } from '@playwright/test';

for (const [width, height] of [
  [375, 812],
  [390, 844],
  [768, 1024],
] as const) {
  test.describe(`touch ${width}×${height}`, () => {
    test.use({ viewport: { width, height }, hasTouch: true, isMobile: true });

    test('the title sits on the image, the buttons are in the first screen, nothing overflows', async ({
      page,
    }) => {
      await page.goto('/pages/index.html');
      await page.waitForLoadState('load');
      await page.waitForTimeout(2500);

      const box = async (selector: string): Promise<{ top: number; bottom: number }> => {
        const rect = await page.locator(selector).first().boundingBox();
        if (!rect) throw new Error(`${selector} not rendered`);
        return { top: rect.y, bottom: rect.y + rect.height };
      };
      const image = await box('[data-hero-3d-fallback]');
      const creative = await box('.hero-3d__word--creative');
      const actions = await box('.hero-3d__actions');

      // The title starts inside the picture (no gap above the bust), the buttons come right after it.
      expect(creative.top).toBeGreaterThanOrEqual(image.top);
      expect(creative.top - image.top).toBeLessThan(image.bottom - image.top);
      expect(actions.top - image.bottom).toBeLessThan(80);
      expect(actions.bottom).toBeLessThanOrEqual(height);

      // No 3D on touch: the picture stays, covers its stage and is not letterboxed.
      await expect(page.locator('.hero-3d--active')).toHaveCount(0);
      const fit = await page
        .locator('[data-hero-3d-fallback]')
        .evaluate((element) => getComputedStyle(element).objectFit);
      expect(fit).toBe('cover');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  });
}

test('the hero picture declares its real proportions (1024×576)', async ({ page }) => {
  await page.goto('/pages/index.html');
  const image = page.locator('[data-hero-3d-fallback]');
  await expect(image).toHaveAttribute('width', '1024');
  await expect(image).toHaveAttribute('height', '576');
});
