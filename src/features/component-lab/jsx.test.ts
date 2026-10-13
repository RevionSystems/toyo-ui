import { describe, expect, it } from 'vitest';
import { jsx, raw } from './jsx';

describe('jsx snippet generator', () => {
  it('serializes primitives and omits falsy/default props', () => {
    expect(jsx('StatusChip', { status: 'approved', size: 'small' }, { defaults: { size: 'small' } })).toBe(
      '<StatusChip status="approved" />',
    );
    expect(jsx('Eyebrow', { accent: true, index: 2, hidden: false }, { children: 'Label' })).toBe(
      '<Eyebrow accent index={2}>\n  Label\n</Eyebrow>',
    );
  });

  it('wraps long prop lists onto separate lines', () => {
    const out = jsx('DomainCard', {
      title: 'Parts & Assemblies',
      description: 'Component information and part numbers',
      meta: raw("['29 parts']"),
    });
    expect(out.split('\n')[0]).toBe('<DomainCard');
    expect(out).toContain("  meta={['29 parts']}");
    expect(out.endsWith('/>')).toBe(true);
  });
});
