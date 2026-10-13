import { describe, expect, it } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { registry } from './registry';

describe('component lab registry', () => {
  it('has unique ids and documents every control as a prop', () => {
    expect(new Set(registry.map((e) => e.id)).size).toBe(registry.length);
    for (const entry of registry) {
      expect(entry.props.length, entry.name).toBeGreaterThan(0);
      expect(entry.guidelines.do.length + entry.guidelines.dont.length, entry.name).toBeGreaterThan(0);
    }
  });

  it.each(registry.map((e) => [e.name, e] as const))('%s renders with defaults and has no axe violations', async (_, entry) => {
    const { container } = renderWithProviders(<main>{entry.render(entry.defaults)}</main>);
    expect(container.textContent?.length ?? 0).toBeGreaterThan(0);
    expect(await axeViolations(container)).toEqual([]);
  });

  it.each(registry.map((e) => [e.name, e] as const))('%s generates a code snippet', (_, entry) => {
    const code = entry.code(entry.defaults);
    expect(code).toContain(`<${entry.name}`);
    expect(code).not.toContain('undefined');
    expect(code).not.toContain('[object Object]');
  });
});
