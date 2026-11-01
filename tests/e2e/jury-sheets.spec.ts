/**
 * @file E2E — L18: on a phone, a dot of the jury matrix opens the right passage of the right sheet,
 *   and a project name opens its portfolio page. Local build only (the deployed jury area answers 401).
 */
import { expect, test } from '@playwright/test';

test.skip(
  Boolean(process.env.PLAYWRIGHT_BASE_URL),
  'local only: the deployed jury area is protected',
);

test.describe('jury sheets (390 px)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('the Lab Horizon / génie logiciel dot lands on that passage', async ({ page }) => {
    await page.goto('/pages/jury/index.html');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    const dot = page.locator('a.jury-matrix__link[href="/jury/lab-horizon#genie-logiciel"]');
    await expect(dot).toHaveAccessibleName(/fiche Lab Horizon.*Maîtriser le génie logiciel/);
    const box = await dot.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    await dot.click();

    await expect(page).toHaveURL(/\/jury\/lab-horizon#genie-logiciel$/);
    const passage = page.locator('#genie-logiciel');
    await expect(passage).toHaveText('Maîtriser le génie logiciel');
    await expect(passage).toBeInViewport();
  });

  test('a project name in the matrix opens its portfolio page', async ({ page }) => {
    await page.goto('/pages/jury/index.html');
    await page.locator('a.jury-matrix__project[href="/projects/village-jeunes"]').click();
    await expect(page).toHaveURL(/\/projects\/village-jeunes$/);
    await expect(page.locator('h1')).toContainText('Vill’âge Jeunes');
  });
});
