import { expect, test } from './fixtures';

test.describe('mobile layout', () => {
  for (const path of ['/', '/manuals', '/parts/PT-3310-12A', '/lab/data-table', '/assistant', '/tokens']) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('navigation drawer opens, navigates and closes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Parts & Assemblies' }).click();
    await expect(page).toHaveURL(/\/parts$/);
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
  });
});
