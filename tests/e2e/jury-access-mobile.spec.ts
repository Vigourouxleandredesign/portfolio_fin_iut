/**
 * @file E2E — L17-A4: on a phone, the jury area is reachable from a project page (menu or card), never through a PDF link; the menu closes on a tap outside.
 */
import { expect, test } from '@playwright/test';

const PAGES = ['/pages/projects/lab-horizon.html', '/pages/projects/village-jeunes.html'];

test.describe('jury access on mobile (390 px)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of PAGES) {
    test(`${path}: the open menu shows a 44 px « Espace jury » link`, async ({ page }) => {
      await page.goto(path);
      await page.locator('[data-nav-toggle]').click();
      const link = page.locator('#main-nav a[href="/jury"]');
      await expect(link).toBeVisible();
      await expect(link).toHaveAccessibleName('Espace jury (accès protégé par mot de passe)');
      const box = await link.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    });

    test(`${path}: « Aller plus loin » has a card to the jury area`, async ({ page }) => {
      await page.goto(path);
      const card = page.locator('.project-further__card[href^="/jury/"]');
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      await expect(card).toContainText('Lire mes fiches réflexives');
      await expect(page.locator('a[href*="/jury/"][href$=".pdf"]')).toHaveCount(0);
    });
  }
});

test.describe('mobile menu (390 px)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('a tap outside the open menu closes it', async ({ page }) => {
    await page.goto('/pages/projects/visualcom.html');
    const toggle = page.locator('[data-nav-toggle]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.mouse.click(200, 700);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
