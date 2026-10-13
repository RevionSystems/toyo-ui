import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { semantic } from './tokens';

/*
 * Color contrast is enforced here, against the tokens, because jsdom cannot compute
 * rendered colors for axe's color-contrast rule.
 */
describe.each(['light', 'dark'] as const)('%s scheme contrast', (scheme) => {
  const s = semantic[scheme];
  it.each([
    ['textPrimary on background', s.textPrimary, s.background],
    ['textPrimary on surface', s.textPrimary, s.surface],
    ['textSecondary on surface', s.textSecondary, s.surface],
    ['textSecondary on surfaceMuted', s.textSecondary, s.surfaceMuted],
    ['primary on surface', s.primary, s.surface],
    ['onPrimary on primary', s.onPrimary, s.primary],
    ['success on surface', s.success, s.surface],
    ['warning on surface', s.warning, s.surface],
    ['info on surface', s.info, s.surface],
  ])('%s meets WCAG AA (4.5:1)', (_, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('contrastRatio', () => {
  it('matches known reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });
});
