import { expect, test } from './fixtures';

test('engineer finds a manual, its parts and their supplier', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /engineering the systems/i })).toBeVisible();

  // Global search: "/" focuses the field from anywhere.
  await page.keyboard.press('/');
  const search = page.getByRole('combobox', { name: /search manuals, parts and suppliers/i });
  await expect(search).toBeFocused();
  await search.fill('front brake');
  await page.getByRole('option', { name: /Front Brake Assembly \(Disc\)/ }).click();

  await expect(page).toHaveURL(/\/manuals\/BR-0012$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Front Brake Assembly (Disc)' })).toBeVisible();

  await page.getByRole('tab', { name: 'Specifications' }).click();
  await expect(page.getByRole('row', { name: /Front caliper bolt\s+110/ })).toBeVisible();

  await page.getByRole('tab', { name: 'Related Parts' }).click();
  await page.getByRole('link', { name: /PT-3310-12A Brake Caliper \(Front\)/ }).click();

  await expect(page).toHaveURL(/\/parts\/PT-3310-12A$/);
  await page.getByRole('link', { name: /Kaneda Brake Systems/ }).click();

  await expect(page).toHaveURL(/\/suppliers\/SP-1007$/);
  // Back the other way: supplier → parts it supplies.
  await expect(page.getByRole('link', { name: /PT-3310-12A/ })).toBeVisible();
});

test('manual filters are reflected in and restored from the URL', async ({ page }) => {
  await page.goto('/manuals');
  await page.getByRole('button', { name: /^Braking System/ }).click();
  await expect(page).toHaveURL(/system=braking/);
  await expect(page.getByRole('status').filter({ hasText: /of 14 manuals/ })).toHaveText('4 of 14 manuals');

  await page.getByRole('searchbox', { name: 'Filter manuals' }).fill('abs');
  await expect(page).toHaveURL(/q=abs/);
  await expect(page.getByRole('link', { name: 'BR-0035' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: /^Braking System/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('searchbox', { name: 'Filter manuals' })).toHaveValue('abs');
});

test('assistant deep link answers with linked, cited records', async ({ page }) => {
  await page.goto('/assistant?q=' + encodeURIComponent('What is the torque for the front caliper bolt?'));
  await expect(page.getByText('110 N·m')).toBeVisible();
  await page.getByRole('link', { name: 'Source: manual BR-0012' }).click();
  await expect(page).toHaveURL(/\/manuals\/BR-0012$/);
});

test('unknown records show a not-found page', async ({ page }) => {
  await page.goto('/parts/PT-0000-00X');
  await expect(page.getByRole('heading', { level: 1, name: 'Part not found' })).toBeVisible();
});
