/**
 * @file Playwright configuration — local preview E2E
 * @description D0 smoke, D4 a11y, D5 perf smoke against vite preview.
 * @see docs/TESTING.md
 */
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  workers: process.env.CI ? 1 : 2,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npx vite preview --host 127.0.0.1 --port 4173',
        url: baseURL,
        // Never test a stale server already listening on 4173: same result locally and in CI.
        reuseExistingServer: false,
        timeout: 180_000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
