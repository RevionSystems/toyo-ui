import { expect, test as base } from '@playwright/test';

/**
 * Every browser test fails if the page logs a console error or throws, which catches
 * React warnings (invalid DOM nesting, key warnings) and runtime exceptions.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));
      await use(errors);
      expect(errors, 'browser console errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
