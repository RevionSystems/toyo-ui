import { describe, expect, it } from 'vitest';
import { CATALOG, CATEGORIES, COMPONENT_IDS, componentsInCategory, isComponentId } from './catalog';

describe('component catalog', () => {
  it('keys match ids and every component is in a known category', () => {
    for (const id of COMPONENT_IDS) {
      expect(CATALOG[id].id).toBe(id);
      expect(CATEGORIES.map((c) => c.id)).toContain(CATALOG[id].category);
    }
  });

  it.each(COMPONENT_IDS)('%s is fully documented', (id) => {
    const doc = CATALOG[id];
    expect(doc.summary.length).toBeGreaterThan(20);
    expect(doc.purpose.length).toBeGreaterThan(20);
    expect(doc.props.length).toBeGreaterThan(0);
    expect(doc.apiDecisions.length).toBeGreaterThan(0);
    expect(doc.states.length).toBeGreaterThan(0);
    expect(doc.accessibility.length).toBeGreaterThan(2);
    expect(doc.testing.length).toBeGreaterThan(2);
    expect(doc.guidelines.do.length + doc.guidelines.dont.length).toBeGreaterThan(1);
    expect(new Set(doc.props.map((p) => p.name)).size).toBe(doc.props.length);
  });

  it('has no empty categories', () => {
    for (const c of CATEGORIES) expect(componentsInCategory(c.id).length, c.id).toBeGreaterThan(0);
  });

  it('narrows component ids', () => {
    expect(isComponentId('dialog')).toBe(true);
    expect(isComponentId('carousel')).toBe(false);
  });
});
