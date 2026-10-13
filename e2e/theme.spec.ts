import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const bg = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => getComputedStyle(el).backgroundColor);

test('color mode toggle switches schemes and persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const lightBg = await bg(page, 'body');

  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark');
  const darkBg = await bg(page, 'body');
  expect(darkBg).not.toBe(lightBg);
  expect(darkBg).toBe('rgb(10, 11, 12)'); // neutral.950 from tokens

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark');
});

test('lab preview renders dark tokens independently of the page', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/lab/status-chip');
  const preview = '[data-testid="lab-preview"]';
  const before = await bg(page, preview);

  await page.getByRole('group', { name: 'Preview color scheme' }).getByRole('button', { name: 'Dark' }).click();
  await expect.poll(() => bg(page, preview)).not.toBe(before);
  expect(await bg(page, preview)).toBe('rgb(10, 11, 12)');
  // The page itself stays light.
  await expect(page.locator('html')).not.toHaveAttribute('data-color-scheme', 'dark');
});

test('lab controls update the preview and generated code', async ({ page }) => {
  await page.goto('/lab/status-chip');
  await page.getByRole('combobox', { name: 'status' }).click();
  await page.getByRole('option', { name: 'in-review' }).click();
  await expect(page.getByTestId('lab-preview').getByText('In review').first()).toBeVisible();
  await expect(page.getByLabel('StatusChip usage example')).toContainText('<StatusChip status="in-review" />');
});
