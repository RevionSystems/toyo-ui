import { describe, expect, it } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { CATALOG, COMPONENT_IDS } from '@/catalog/catalog';
import { REGISTRY } from './registry';
import { loadPublicTypes } from './source';

describe.each(COMPONENT_IDS)('%s lab entry', (id) => {
  const entry = REGISTRY[id];
  const name = CATALOG[id].name;

  it('renders playground and gallery with defaults and has no axe violations', async () => {
    const { container } = renderWithProviders(
      <main>
        {entry.render(entry.defaults)}
        {entry.gallery?.map((g) => (
          <section key={g.title} aria-label={g.title}>
            {g.render()}
          </section>
        ))}
      </main>,
    );
    expect(container.textContent?.length).toBeGreaterThan(0);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('generates a complete example that imports and uses the component', () => {
    const code = entry.code(entry.defaults);
    expect(code).toMatch(new RegExp(`import \\{[^}]*\\b${name}\\b[^}]*\\} from '@toyo-ui/react';`));
    expect(code).toContain(`<${name}`);
    expect(code).toContain('export function Example()');
    expect(code).not.toMatch(/=\{undefined\}|="undefined"|\[object Object\]|NaN/);
  });

  it('has a control for every key of its playground state', () => {
    const controlled = entry.controls.map((c) => c.name).sort();
    expect(controlled).toEqual(Object.keys(entry.defaults).sort());
  });

  it('documents only props that exist on the real props interface', async () => {
    const types = await loadPublicTypes(name);
    expect(types, `${name}.tsx exports its props`).toContain(`export interface ${name}Props`);
    const inherited = ['disabled', 'fullWidth', 'href', 'onClick', 'value', 'type', 'required', 'startIcon', 'endIcon'];
    for (const prop of CATALOG[id].props) {
      if (inherited.includes(prop.name)) continue; // inherited from the wrapped MUI component
      expect(types, `${name}.${prop.name}`).toMatch(new RegExp(`\\b${prop.name}\\??:`));
    }
  });
});
