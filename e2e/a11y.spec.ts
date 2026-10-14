import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

/*
 * Full axe scans in a real browser, including color-contrast (which jsdom cannot evaluate).
 * Run in both color schemes.
 */
const PAGES = [
  '/',
  ...['button', 'text-field', 'alert', 'status-badge', 'loading-state', 'empty-state', 'dialog', 'data-table'].map(
    (id) => `/components/${id}`,
  ),
  '/foundations/tokens',
  '/engineering/assistant',
];

for (const scheme of ['light', 'dark'] as const) {
  for (const path of PAGES) {
    test(`${path} has no axe violations (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map(
        (v) =>
          `${v.id} (${v.impact}): ${v.nodes
            .slice(0, 3)
            .map((n) => n.target.join(' '))
            .join(' | ')}`,
      );
      expect(summary).toEqual([]);
    });
  }
}

test('keyboard users can skip to main content', async ({ page }) => {
  await page.goto('/components/button');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});
