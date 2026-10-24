/**
 * @file E2E — D0 public smoke (shipped routes)
 */
import { expect, test } from '@playwright/test';

test.describe('D0 — public smoke', () => {
  test('home loads with hero target', async ({ page }) => {
    const res = await page.goto('/pages/index.html');
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator('[data-hero-3d], [data-hero-3d-canvas]').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('projects listing → MagicalLab case study', async ({ page }) => {
    await page.goto('/pages/projects.html');
    await page
      .getByRole('link', { name: /MagicalLab/i })
      .first()
      .click();
    await expect(page).toHaveURL(/magicallab\.html/);
    await expect(page.getByRole('heading', { name: 'MagicalLab' })).toBeVisible();
  });

  test('MagicalLab demo CTA opens new tab target', async ({ page }) => {
    await page.goto('/pages/projects/magicallab.html');
    const cta = page.getByRole('link', { name: /Tester la scène/i });
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('href', /magicallab\.netlify\.app/);
  });

  test('Visualcom demo CTA opens live site', async ({ page }) => {
    await page.goto('/pages/projects/visualcom.html');
    const cta = page.getByRole('link', { name: /Voir le site/i }).first();
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('href', /visualcom\.nc/);
    await expect(page.locator('.project-stage')).toBeVisible();
  });

  test('contact form is present with honeypot', async ({ page }) => {
    await page.goto('/pages/contact.html');
    await expect(page.locator('form[data-netlify="true"], form[netlify]').first()).toBeVisible();
    await expect(page.locator('input[name="bot-field"]')).toHaveCount(1);
  });

  test('cv page loads', async ({ page }) => {
    const res = await page.goto('/pages/cv.html');
    expect(res?.ok()).toBeTruthy();
  });

  test('mobile nav toggle works on projects', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pages/projects.html');
    const toggle = page.locator('[data-nav-toggle]');
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
