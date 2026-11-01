/**
 * @file E2E — the home page stays complete and readable without JavaScript (L10, red team audit of 25/10, P2-1)
 */
import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('home without JavaScript: every image has a source, no veil, nothing hidden but idle carousel slides', async ({
  page,
}) => {
  await page.goto('/pages/index.html');

  const images = await page.locator('img').evaluateAll((nodes) =>
    nodes.map((node) => ({
      src: node.getAttribute('src') ?? '',
      alt: node.getAttribute('alt'),
    })),
  );
  expect(images.length).toBeGreaterThan(10);
  expect(images.filter((image) => image.src === '')).toEqual([]);
  expect(images.filter((image) => image.alt === null)).toEqual([]);

  await expect(page.locator('[data-intro-veil]')).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('main *')]
      .filter(
        (element) =>
          getComputedStyle(element).opacity === '0' &&
          (element.textContent ?? '').trim().length > 20 &&
          // The carousel shows one project at a time; its idle slides / captions are meant to be hidden.
          !element.closest(
            '.project-carousel__slide:not([data-current]), .project-carousel__info:not([data-current])',
          ),
      )
      .map((element) => `${element.tagName}.${String(element.className)}`),
  );
  expect(hidden, hidden.join('\n')).toEqual([]);

  for (const href of ['/projects', '/cv', '/contact']) {
    await expect(page.locator(`header a[href="${href}"]`)).toHaveCount(1);
    await expect(page.locator(`footer a[href="${href}"]`)).toHaveCount(1);
  }
});

test('other public pages are readable without JavaScript', async ({ page }) => {
  for (const route of [
    '/pages/projects.html',
    '/pages/projects/lab-horizon.html',
    '/pages/cv.html',
  ]) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('footer a[href="/contact"]')).toHaveCount(1);
  }
});
