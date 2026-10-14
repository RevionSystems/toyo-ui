import { CONSUMER_URL } from '../playwright.config';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: CONSUMER_URL });

test.describe('consumer demo (uses @toyo-ui/* from dist)', () => {
  test('loads releases, rolls one back, and passes axe in both schemes', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('6 of 6 releases')).toBeVisible();

    await page.getByRole('button', { name: 'Roll back checkout-api 4.12.0' }).click();
    const dialog = page.getByRole('dialog', { name: 'Roll back checkout-api 4.12.0?' });
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
    await dialog.getByRole('button', { name: 'Roll back' }).click();
    await expect(page.getByText('checkout-api 4.12.0 was rolled back.')).toBeVisible();

    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`),
        scheme,
      ).toEqual([]);
    }
  });

  test('recovers from a simulated outage', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('6 of 6 releases')).toBeVisible();
    await page.getByRole('switch', { name: 'Simulate outage' }).click();
    await page.getByRole('button', { name: 'Refresh' }).click();
    const alert = page.getByRole('alert');
    await expect(alert).toContainText('Releases could not be loaded');
    await page.getByRole('switch', { name: 'Simulate outage' }).click();
    await alert.getByRole('button', { name: 'Retry' }).click();
    await expect(page.getByText('6 of 6 releases')).toBeVisible();
  });

  test('has no horizontal overflow on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/');
    await expect(page.getByText('6 of 6 releases')).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
