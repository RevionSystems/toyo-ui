import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { semantic } from './tokens';

/*
 * Color contrast is enforced here, against the tokens, because jsdom cannot compute
 * rendered colors. Browser tests re-check rendered pages with axe.
 */
describe.each(['light', 'dark'] as const)('%s scheme contrast', (scheme) => {
  const s = semantic[scheme];
  const surfaces = { background: s.background, surface: s.surface, surfaceMuted: s.surfaceMuted } as const;

  // Text roles must pass AA (4.5:1) on every surface they can appear on.
  const textRoles = ['textPrimary', 'textSecondary', 'primaryText', 'success', 'warning', 'info', 'error'] as const;
  it.each(textRoles.flatMap((fg) => Object.entries(surfaces).map(([name, bg]) => [fg, name, bg] as const)))(
    '%s on %s meets AA',
    (fg, _name, bg) => {
      expect(contrastRatio(s[fg], bg), `${s[fg]} on ${bg}`).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each([
    ['onPrimary on primary (filled button)', s.onPrimary, s.primary],
    ['success on successBg', s.success, s.successBg],
    ['warning on warningBg', s.warning, s.warningBg],
    ['info on infoBg', s.info, s.infoBg],
    ['error on errorBg', s.error, s.errorBg],
    // Alert body text sits on the tonal backgrounds.
    ['textPrimary on successBg', s.textPrimary, s.successBg],
    ['textPrimary on warningBg', s.textPrimary, s.warningBg],
    ['textPrimary on infoBg', s.textPrimary, s.infoBg],
    ['textPrimary on errorBg', s.textPrimary, s.errorBg],
  ])('%s meets AA', (_, fg, bg) => {
    expect(contrastRatio(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
  });

  // Non-text: focus ring and primary fill must reach 3:1 against the surface (WCAG 1.4.11).
  it.each([
    ['focusRing on surface', s.focusRing, s.surface],
    ['focusRing on background', s.focusRing, s.background],
    ['primary fill on surface', s.primary, s.surface],
  ])('%s meets 3:1 non-text contrast', (_, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(3);
  });
});

describe('contrastRatio', () => {
  it('matches known reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    // The brief's proposed accent: passes on white, fails on the secondary background.
    expect(contrastRatio('#EB0A1E', '#FFFFFF')).toBeCloseTo(4.57, 2);
    expect(contrastRatio('#EB0A1E', '#F4F5F6')).toBeLessThan(4.5);
  });
});
