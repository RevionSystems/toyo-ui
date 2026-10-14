/**
 * Design tokens — the single source of truth for Toyo-ui's visual language.
 *
 * Plain data, no React: consumed by the MUI theme (`theme.ts`), rendered by the Foundations
 * pages, and validated in tests (contrast) without a DOM.
 */

export const palette = {
  red: {
    50: '#FEECEE',
    100: '#FCC8CD',
    300: '#FF6B75',
    500: '#EB0A1E',
    600: '#C8102E',
    700: '#A10A1C',
  },
  graphite: {
    0: '#FFFFFF',
    25: '#F8F9FA',
    50: '#F4F5F6',
    100: '#ECEEF0',
    200: '#D9DCE0',
    300: '#BEC2C8',
    400: '#8C9299',
    500: '#60666D',
    600: '#4A4F55',
    700: '#33373D',
    800: '#202124',
    850: '#1A1C1F',
    900: '#141518',
    950: '#0D0E10',
  },
  green: { 50: '#E7F4EC', 600: '#16723A', 300: '#6ACB8A', 900: '#10301C' },
  amber: { 50: '#FFF3DE', 600: '#8F5600', 300: '#F2B44C', 900: '#33240A' },
  blue: { 50: '#E8F0FB', 600: '#1C5BBA', 300: '#82AEF2', 900: '#12233F' },
} as const;

export const typography = {
  fontFamily: {
    sans: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace',
  },
  scale: {
    display: { size: 40, lineHeight: 1.1, weight: 700, letterSpacing: -0.8 },
    h1: { size: 28, lineHeight: 1.2, weight: 700, letterSpacing: -0.4 },
    h2: { size: 20, lineHeight: 1.3, weight: 650, letterSpacing: -0.2 },
    h3: { size: 16, lineHeight: 1.4, weight: 600, letterSpacing: 0 },
    body: { size: 14, lineHeight: 1.55, weight: 400, letterSpacing: 0 },
    small: { size: 13, lineHeight: 1.45, weight: 400, letterSpacing: 0 },
    caption: { size: 12, lineHeight: 1.4, weight: 400, letterSpacing: 0 },
    overline: { size: 11, lineHeight: 1.6, weight: 600, letterSpacing: 1.4 },
    code: { size: 13, lineHeight: 1.65, weight: 400, letterSpacing: 0 },
  },
} as const;

/** 4px base grid; MUI `theme.spacing(n)` = n × 4px. */
export const spacing = { unit: 4, scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] } as const;

export const radius = { none: 0, sm: 4, md: 6, lg: 8, pill: 999 } as const;

export const elevation = {
  0: 'none',
  1: '0 1px 2px rgba(32, 33, 36, 0.06)',
  2: '0 2px 8px rgba(32, 33, 36, 0.08)',
  3: '0 12px 32px rgba(32, 33, 36, 0.14)',
} as const;

/** Control dimensions shared by Button, TextField and other interactive components. */
export const dimensions = {
  control: { small: 32, medium: 40, large: 48 },
  iconSize: { small: 16, medium: 20, large: 24 },
  /** Minimum pointer target (WCAG 2.2 SC 2.5.8 requires 24px; we use 32px). */
  minTarget: 32,
} as const;

/** Focus indicator. Applied globally via `:focus-visible`; never removed without a replacement. */
export const focus = { width: 2, offset: 2 } as const;

export const motion = {
  duration: { fast: 120, base: 200 },
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

/** Viewport breakpoints in px (MUI's defaults, made explicit so apps can share them). */
export const breakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } as const;

/** Border widths. Colors come from the `border` semantic role. */
export const border = { hairline: 1, emphasis: 2 } as const;

/**
 * Semantic roles per color scheme. Components use these, never raw palette values.
 * `primary` is the accent for fills; `primaryText` is the red used for text and links,
 * because `primary` falls below 4.5:1 on muted surfaces.
 */
export const semantic = {
  light: {
    primary: palette.red[500],
    primaryHover: palette.red[600],
    primaryText: palette.red[600],
    onPrimary: palette.graphite[0],
    background: palette.graphite[50],
    surface: palette.graphite[0],
    surfaceMuted: palette.graphite[25],
    border: palette.graphite[200],
    textPrimary: palette.graphite[800],
    textSecondary: palette.graphite[500],
    focusRing: palette.red[600],
    success: palette.green[600],
    successBg: palette.green[50],
    warning: palette.amber[600],
    warningBg: palette.amber[50],
    info: palette.blue[600],
    infoBg: palette.blue[50],
    error: palette.red[600],
    errorBg: palette.red[50],
  },
  dark: {
    primary: palette.red[300],
    primaryHover: palette.red[100],
    primaryText: palette.red[300],
    onPrimary: palette.graphite[950],
    background: palette.graphite[950],
    surface: palette.graphite[900],
    surfaceMuted: palette.graphite[850],
    border: palette.graphite[700],
    textPrimary: palette.graphite[100],
    textSecondary: palette.graphite[300],
    focusRing: palette.red[300],
    success: palette.green[300],
    successBg: palette.green[900],
    warning: palette.amber[300],
    warningBg: palette.amber[900],
    info: palette.blue[300],
    infoBg: palette.blue[900],
    error: palette.red[300],
    errorBg: '#3A1216',
  },
} as const;

export type ColorScheme = keyof typeof semantic;
export type SemanticRole = keyof (typeof semantic)['light'];
