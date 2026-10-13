import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const bg = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => getComputedStyle(el).backgroundColor);

test('color mode toggle switches schemes and persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const lightBg = await bg(page, 'body');

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark');
  const darkBg = await bg(page, 'body');
  expect(darkBg).not.toBe(lightBg);
  expect(darkBg).toBe('rgb(13, 14, 16)'); // graphite.950 from tokens

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark');
});
