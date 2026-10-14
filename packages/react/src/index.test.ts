import { describe, expect, it } from 'vitest';
import * as api from './index';

describe('@toyo-ui/react public API', () => {
  it('exports exactly the documented components', () => {
    expect(Object.keys(api).sort()).toEqual([
      'Alert',
      'Button',
      'DataTable',
      'Dialog',
      'EmptyState',
      'LoadingState',
      'StatusBadge',
      'TextField',
    ]);
  });

  it('exports React components', () => {
    for (const [name, value] of Object.entries(api)) {
      // forwardRef components are objects with a render function; others are functions.
      const isComponent =
        typeof value === 'function' || (typeof value === 'object' && value !== null && 'render' in value);
      expect(isComponent, name).toBe(true);
    }
  });
});
