import { expect, test } from './fixtures';

test.describe('mobile layout', () => {
  for (const path of ['/', '/components/button', '/foundations/tokens', '/engineering/assistant']) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('navigation drawer opens, navigates and closes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Inputs' }).click();
    await expect(page).toHaveURL(/\/components\/text-field$/);
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
  });
});
