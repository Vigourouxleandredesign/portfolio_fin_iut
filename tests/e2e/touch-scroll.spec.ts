/**
 * @file E2E — on a phone the home brush does not exist and finger scrolling is never intercepted (L14 part A)
 */
import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test('touch: no brush canvas, and a finger swipe scrolls the page', async ({ page }) => {
  await page.goto('/pages/index.html');
  await page.waitForLoadState('load');
  await page.waitForTimeout(2500);

  await expect(page.locator('[data-home-brush]')).toHaveCount(0);

  const before = await page.evaluate(() => window.scrollY);
  // A real finger swipe: touchStart, a series of touchMove, touchEnd (what a phone sends).
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 195, y: 640 }],
  });
  for (let step = 1; step <= 10; step += 1) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 195, y: 640 - step * 40 }],
    });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => window.scrollY);
  expect(after).toBeGreaterThan(before + 100);
});

test('touch: no decorative paint covers text or a control', async ({ page }) => {
  await page.goto('/pages/index.html');
  await page.waitForTimeout(1500);
  const offenders = await page.evaluate(() => {
    const rect = (element: Element): DOMRect => element.getBoundingClientRect();
    const visiblePaints = [...document.querySelectorAll('.paint, .paint-mask')].filter(
      (element) => getComputedStyle(element).display !== 'none' && rect(element).width > 0,
    );
    const targets = [...document.querySelectorAll('a, button, p, h1, h2, h3, li')].filter(
      (element) => rect(element).width > 0 && (element.textContent ?? '').trim().length > 1,
    );
    const offending: string[] = [];
    for (const paint of visiblePaints) {
      if (getComputedStyle(paint).pointerEvents !== 'none') offending.push('pointer-events');
      const a = rect(paint);
      for (const target of targets) {
        const b = rect(target);
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapX > 0 && overlapY > 0 && overlapX * overlapY > 400) {
          offending.push(`${String(paint.className)} over ${target.tagName}`);
        }
      }
    }
    return offending;
  });
  expect(offenders).toEqual([]);
});
