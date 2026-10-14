import { defineConfig, devices } from '@playwright/test';

const PORT = 5288;
const CHANNEL = process.env.CI ? undefined : 'chrome';
const CONSUMER_PORT = 5289;
export const CONSUMER_URL = `http://127.0.0.1:${CONSUMER_PORT}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    // Locally: the installed Google Chrome. CI: Playwright's bundled Chromium (`playwright install chromium`).
    channel: CHANNEL,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: CHANNEL, viewport: { width: 1440, height: 900 } },
      testIgnore: /responsive\.spec\.ts/,
    },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: CHANNEL }, testMatch: /responsive\.spec\.ts/ },
  ],
  webServer: [
    {
      // CI serves the production build made by `pnpm check`; locally the dev server gives faster feedback.
      command: process.env.CI
        ? `pnpm --filter @toyo-ui/playground exec vite preview --port ${PORT} --strictPort --host 127.0.0.1`
        : `pnpm --filter @toyo-ui/playground exec vite --port ${PORT} --strictPort --host 127.0.0.1`,
      url: `http://127.0.0.1:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      // The consumer resolves the packages' built dist/. CI serves its production build; locally, build packages then dev.
      command: process.env.CI
        ? `pnpm --filter @toyo-ui/consumer-demo exec vite preview --port ${CONSUMER_PORT} --strictPort --host 127.0.0.1`
        : `pnpm build:packages && pnpm --filter @toyo-ui/consumer-demo exec vite --port ${CONSUMER_PORT} --strictPort --host 127.0.0.1`,
      url: CONSUMER_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
