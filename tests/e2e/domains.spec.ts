/**
 * @file E2E — home domain plaques open the catalogue already filtered (L12 part C)
 */
import { expect, test } from '@playwright/test';

test('« Création 3D » plaque opens the catalogue filtered on 3D', async ({ page }) => {
  await page.goto('/pages/index.html');
  const plate = page.getByRole('link', { name: /Création 3D/ });
  await plate.scrollIntoViewIfNeeded();
  await expect(plate).toContainText('3 projets');
  await plate.click();

  await expect(page).toHaveURL(/\/projects\?domaine=3d$/);
  await expect(page.getByRole('button', { name: 'Création 3D' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  const visible = await page
    .locator('.project-card:not([hidden]) .project-card__title')
    .allInnerTexts();
  expect(visible).toEqual(['MagicalLab', 'Micro-monde', 'Borne tactile 2BeAlive']);
});

test('changing the filter updates the address, « Tout » clears it, an unknown domain shows everything', async ({
  page,
}) => {
  await page.goto('/pages/projects.html?domaine=nimportequoi');
  await expect(page.locator('.project-card:not([hidden])')).toHaveCount(9);

  await page.getByRole('button', { name: 'Webdesign et UI/UX' }).click();
  await expect(page).toHaveURL(/domaine=webdesign$/);
  await expect(page.locator('.project-card:not([hidden])')).toHaveCount(1);

  await page.getByRole('button', { name: 'Tout' }).click();
  await expect(page).not.toHaveURL(/domaine=/);
  await expect(page.locator('.project-card:not([hidden])')).toHaveCount(9);
});

test('« Parcourir par domaine » scrolls to the section and the plaques are keyboard reachable', async ({
  page,
}) => {
  await page.goto('/pages/index.html');
  await page.getByRole('link', { name: 'Parcourir par domaine' }).click();
  await expect(page).toHaveURL(/#domaines$/);
  await page.getByRole('link', { name: /Dispositifs interactifs/ }).focus();
  await expect(page.getByRole('link', { name: /Dispositifs interactifs/ })).toBeFocused();
});
