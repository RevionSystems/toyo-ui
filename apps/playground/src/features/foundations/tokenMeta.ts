import type { SemanticRole } from '@toyo-ui/theme';

/** Where each semantic role lands in the MUI palette, and the CSS variable the app reads. */
export const ROLE_TO_PALETTE: Record<SemanticRole, string> = {
  primary: 'primary.main',
  primaryHover: 'primary.dark',
  primaryText: 'primaryText',
  onPrimary: 'primary.contrastText',
  background: 'background.default',
  surface: 'background.paper',
  surfaceMuted: 'surfaceMuted',
  border: 'divider',
  textPrimary: 'text.primary',
  textSecondary: 'text.secondary',
  focusRing: 'focusRing',
  success: 'success.main',
  successBg: 'tonal.success',
  warning: 'warning.main',
  warningBg: 'tonal.warning',
  info: 'info.main',
  infoBg: 'tonal.info',
  error: 'error.main',
  errorBg: 'tonal.error',
};

export const cssVarFor = (role: SemanticRole) => `--toyo-palette-${ROLE_TO_PALETTE[role].replace(/\./g, '-')}`;

/** Text/background pairs the components actually use, checked live on the tokens page. */
export const CONTRAST_PAIRS: [SemanticRole, SemanticRole][] = [
  ['textPrimary', 'background'],
  ['textSecondary', 'surface'],
  ['textSecondary', 'surfaceMuted'],
  ['primaryText', 'surfaceMuted'],
  ['onPrimary', 'primary'],
  ['success', 'successBg'],
  ['warning', 'warningBg'],
  ['info', 'infoBg'],
  ['error', 'errorBg'],
];
