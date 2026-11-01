/**
 * @file E2E — D4 accessibility (axe) on critical public routes
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  '/pages/index.html',
  '/pages/projects.html',
  '/pages/projects/lab-horizon.html',
  '/pages/projects/magicallab.html',
  '/pages/contact.html',
  '/pages/jury/index.html',
  '/pages/jury/lab-horizon.html',
  '/pages/cv.html',
];

// Against a deployed site the jury area answers 401 (checked by jury-protection.prod.spec.ts).
const deployed = Boolean(process.env.PLAYWRIGHT_BASE_URL);

for (const route of routes.filter((r) => !(deployed && r.includes('/jury/')))) {
  test(`D4 axe — no critical/serious on ${route}`, async ({ page }) => {
    // Match prefers-reduced-motion so reveal-on-scroll does not use opacity: 0 during axe.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    const blocking = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? ''),
    );

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}

test('D4 skip-link is present on home', async ({ page }) => {
  await page.goto('/pages/index.html');
  await expect(page.locator('a.skip-link')).toHaveCount(1);
});
