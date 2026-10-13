/**
 * Design tokens — the single source of truth for Toyo-ui's visual language.
 *
 * Tokens are plain data so they can be consumed by the MUI theme, rendered in the
 * Design Tokens page, and validated in tests (e.g. contrast ratios) without React.
 */

export const palette = {
  red: {
    50: '#FDECEE',
    100: '#F9C9CE',
    300: '#EE6B78',
    500: '#E0202F',
    600: '#C8102E',
    700: '#A30D25',
    800: '#7D0A1C',
  },
  neutral: {
    0: '#FFFFFF',
    25: '#FAFAFA',
    50: '#F5F5F6',
    100: '#EBECEE',
    200: '#D9DBDF',
    300: '#BCC0C6',
    400: '#8E939B',
    500: '#6B7079',
    600: '#4D525A',
    700: '#33373D',
    800: '#1F2226',
    850: '#17191C',
    900: '#111315',
    950: '#0A0B0C',
  },
  green: { 50: '#E8F5EC', 600: '#1E7A3C', 300: '#6FCB8C' },
  amber: { 50: '#FFF4E0', 600: '#9A5B00', 300: '#F5B54A' },
  blue: { 50: '#E8F0FB', 600: '#1F5FBF', 300: '#7EAAF0' },
} as const;

export const typography = {
  fontFamily: {
    sans: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    serif: '"Source Serif 4", Georgia, "Times New Roman", serif',
    mono: '"SFMono-Regular", ui-monospace, Menlo, Consolas, monospace',
  },
  scale: {
    display: { size: 52, lineHeight: 1.04, weight: 800, letterSpacing: -1.5 },
    h1: { size: 34, lineHeight: 1.15, weight: 700, letterSpacing: -0.5 },
    h2: { size: 26, lineHeight: 1.2, weight: 600, letterSpacing: -0.25 },
    h3: { size: 20, lineHeight: 1.3, weight: 600, letterSpacing: 0 },
    body: { size: 15, lineHeight: 1.55, weight: 400, letterSpacing: 0 },
    small: { size: 13, lineHeight: 1.45, weight: 400, letterSpacing: 0 },
    overline: { size: 11, lineHeight: 1.6, weight: 600, letterSpacing: 1.6 },
  },
} as const;

/** 4px base grid; MUI `theme.spacing(n)` multiplies by `spacing.unit`. */
export const spacing = { unit: 4 } as const;

export const radius = { none: 0, sm: 4, md: 6, lg: 10, pill: 999 } as const;

export const elevation = {
  card: '0 1px 2px rgba(17, 19, 21, 0.06), 0 1px 1px rgba(17, 19, 21, 0.04)',
  raised: '0 8px 24px rgba(17, 19, 21, 0.10)',
} as const;

export const motion = {
  fast: '120ms',
  base: '200ms',
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const layout = {
  sidebarWidth: 268,
  topbarHeight: 64,
  contentMaxWidth: 1440,
} as const;

/** Semantic color roles per scheme. Components should use these, not raw palette values. */
export const semantic = {
  light: {
    primary: palette.red[600],
    primaryHover: palette.red[700],
    onPrimary: palette.neutral[0],
    background: palette.neutral[25],
    surface: palette.neutral[0],
    surfaceMuted: palette.neutral[50],
    border: palette.neutral[200],
    textPrimary: palette.neutral[900],
    textSecondary: palette.neutral[600],
    success: palette.green[600],
    successBg: palette.green[50],
    warning: palette.amber[600],
    warningBg: palette.amber[50],
    info: palette.blue[600],
    infoBg: palette.blue[50],
  },
  dark: {
    primary: palette.red[300],
    primaryHover: palette.red[100],
    onPrimary: palette.neutral[950],
    background: palette.neutral[950],
    surface: palette.neutral[900],
    surfaceMuted: palette.neutral[850],
    border: palette.neutral[700],
    textPrimary: palette.neutral[50],
    textSecondary: palette.neutral[300],
    success: palette.green[300],
    successBg: '#12301C',
    warning: palette.amber[300],
    warningBg: '#33240A',
    info: palette.blue[300],
    infoBg: '#12233F',
  },
} as const;

export type ColorScheme = keyof typeof semantic;
export type SemanticRole = keyof (typeof semantic)['light'];
