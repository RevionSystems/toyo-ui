import { describe, expect, it } from 'vitest';
import * as api from './index';

describe('@toyo-ui/theme public API', () => {
  it('exports tokens, contrast utilities, the theme factory and the provider', () => {
    expect(Object.keys(api).sort()).toEqual(
      [
        'ToyoThemeProvider',
        'border',
        'breakpoints',
        'contrastRatio',
        'createToyoTheme',
        'dimensions',
        'elevation',
        'focus',
        'luminance',
        'motion',
        'palette',
        'radius',
        'semantic',
        'spacing',
        'theme',
        'typography',
        'wcagLevel',
      ].sort(),
    );
  });
});
