import axe from 'axe-core';

/**
 * Runs axe-core against a rendered container and returns readable violations.
 * Color contrast is disabled because jsdom does not compute styles; contrast is enforced
 * against the tokens in @toyo-ui/theme and re-checked in real browsers by Playwright.
 */
export async function axeViolations(container: Element): Promise<string[]> {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`);
}
