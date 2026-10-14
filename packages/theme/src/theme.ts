import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';
import type { ElementType } from 'react';
import { breakpoints, dimensions, elevation, focus, motion, radius, semantic, spacing, typography } from './tokens';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    display: React.CSSProperties;
    code: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    display?: React.CSSProperties;
    code?: React.CSSProperties;
  }
  interface Palette {
    surfaceMuted: string;
    /** Red for text and links; `primary.main` is reserved for fills (see tokens.ts). */
    primaryText: string;
    focusRing: string;
    /** Low-emphasis backgrounds for status tones. */
    tonal: { success: string; warning: string; info: string; error: string };
  }
  interface PaletteOptions {
    surfaceMuted?: string;
    primaryText?: string;
    focusRing?: string;
    tonal?: { success: string; warning: string; info: string; error: string };
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
    code: true;
  }
}

const rem = (n: number) => `${n / 16}rem`;
const { scale, fontFamily } = typography;

export interface ToyoThemeOptions {
  /** Fill accent. Defaults to the scheme's `primary` token. */
  primary?: string;
  /** Red used for text and links. Defaults to the scheme's `primaryText` token. */
  primaryText?: string;
  /** Base corner radius in px (`radius.md`). Small and large radii scale from it. */
  radius?: number;
  /** Spacing unit in px; 4 is the default density. */
  spacingUnit?: number;
  /**
   * `true` (app): CSS variables with light and dark schemes, switched by `data-color-scheme`.
   * `false` (sandbox): a plain theme for one `mode`, scoped to its ThemeProvider subtree.
   */
  cssVariables?: boolean;
  mode?: 'light' | 'dark';
  /**
   * Component used by every MUI Link and link-rendering button (`href`), e.g. a router link.
   * Packages stay router-agnostic; apps inject their router here.
   */
  linkComponent?: ElementType;
  /** Toolbar min-height in px. */
  toolbarHeight?: number;
}

/** Palette accessor that works for both CSS-variables and plain themes. */
const pal = (t: { vars?: Theme['vars']; palette: Theme['palette'] }) => (t.vars ?? t).palette;

function schemePalette(scheme: 'light' | 'dark', o: Pick<ToyoThemeOptions, 'primary' | 'primaryText'> = {}) {
  const s = semantic[scheme];
  return {
    primary: { main: o.primary ?? s.primary, dark: s.primaryHover, contrastText: s.onPrimary },
    error: { main: s.error },
    success: { main: s.success },
    warning: { main: s.warning },
    info: { main: s.info },
    background: { default: s.background, paper: s.surface },
    text: { primary: s.textPrimary, secondary: s.textSecondary },
    divider: s.border,
    surfaceMuted: s.surfaceMuted,
    primaryText: o.primaryText ?? s.primaryText,
    focusRing: s.focusRing,
    tonal: { success: s.successBg, warning: s.warningBg, info: s.infoBg, error: s.errorBg },
  };
}

/** Builds a Toyo-ui theme. Every value comes from `tokens.ts` unless overridden. */
export function createToyoTheme(o: ToyoThemeOptions = {}): Theme {
  const r = o.radius ?? radius.md;
  const rSm = Math.round(r * 0.67);
  const rLg = r + 2;
  const schemes: ThemeOptions =
    o.cssVariables === false
      ? { palette: { mode: o.mode ?? 'light', ...schemePalette(o.mode ?? 'light', o) } }
      : {
          cssVariables: { colorSchemeSelector: 'data-color-scheme', cssVarPrefix: 'toyo' },
          colorSchemes: {
            light: { palette: schemePalette('light', o) },
            dark: { palette: schemePalette('dark', o) },
          },
        };

  return createTheme({
    ...schemes,
    spacing: o.spacingUnit ?? spacing.unit,
    shape: { borderRadius: r },
    typography: {
      fontFamily: fontFamily.sans,
      fontSize: 14,
      display: {
        fontSize: rem(scale.display.size),
        lineHeight: scale.display.lineHeight,
        fontWeight: scale.display.weight,
        letterSpacing: `${scale.display.letterSpacing}px`,
      },
      h1: {
        fontSize: rem(scale.h1.size),
        lineHeight: scale.h1.lineHeight,
        fontWeight: scale.h1.weight,
        letterSpacing: `${scale.h1.letterSpacing}px`,
      },
      h2: {
        fontSize: rem(scale.h2.size),
        lineHeight: scale.h2.lineHeight,
        fontWeight: scale.h2.weight,
        letterSpacing: `${scale.h2.letterSpacing}px`,
      },
      h3: { fontSize: rem(scale.h3.size), lineHeight: scale.h3.lineHeight, fontWeight: scale.h3.weight },
      h4: { fontSize: rem(14), lineHeight: 1.4, fontWeight: 600 },
      h5: { fontSize: rem(13), fontWeight: 600 },
      h6: { fontSize: rem(12), fontWeight: 600 },
      body1: { fontSize: rem(scale.body.size), lineHeight: scale.body.lineHeight },
      body2: { fontSize: rem(scale.small.size), lineHeight: scale.small.lineHeight },
      caption: { fontSize: rem(scale.caption.size), lineHeight: scale.caption.lineHeight },
      overline: {
        fontSize: rem(scale.overline.size),
        lineHeight: scale.overline.lineHeight,
        fontWeight: scale.overline.weight,
        letterSpacing: `${scale.overline.letterSpacing}px`,
      },
      code: { fontFamily: fontFamily.mono, fontSize: rem(scale.code.size), lineHeight: scale.code.lineHeight },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { WebkitFontSmoothing: 'antialiased' },
          'code, pre, kbd': { fontFamily: fontFamily.mono },
          // One focus indicator for every interactive element.
          ':focus-visible': {
            outline: `${focus.width}px solid var(--toyo-palette-focusRing)`,
            outlineOffset: focus.offset,
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              transitionDuration: '0.01ms !important',
              scrollBehavior: 'auto !important',
            },
          },
        },
      },
      MuiButtonBase: o.linkComponent ? { defaultProps: { LinkComponent: o.linkComponent } } : {},
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: rSm,
            minHeight: dimensions.control.medium,
            paddingInline: 16,
            variants: [
              // Text-colored variants use the AA-safe red, not the fill red.
              { props: { variant: 'text', color: 'primary' }, style: { color: pal(theme).primaryText } },
            ],
          }),
          sizeSmall: { minHeight: dimensions.control.small, paddingInline: 12, fontSize: rem(13) },
          sizeLarge: { minHeight: dimensions.control.large, paddingInline: 20, fontSize: rem(15) },
          outlined: ({ theme }) => ({
            borderColor: pal(theme).divider,
            color: pal(theme).text.primary,
            backgroundColor: pal(theme).background.paper,
          }),
        },
      },
      MuiIconButton: { styleOverrides: { root: { borderRadius: rSm } } },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: ({ theme }) => ({ borderColor: pal(theme).divider }),
        },
      },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { borderRadius: rLg, boxShadow: elevation[1] } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({ backgroundColor: pal(theme).background.paper, borderRadius: rSm }),
          notchedOutline: ({ theme }) => ({ borderColor: pal(theme).divider }),
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: rSm, fontWeight: 500 } } },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 44,
            paddingInline: 16,
            '&.Mui-selected': { color: pal(theme).primaryText },
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: ({ theme }) => ({ fontWeight: 600, color: pal(theme).text.secondary, fontSize: rem(12) }),
        },
      },
      MuiLink: {
        defaultProps: { underline: 'always', ...(o.linkComponent ? { component: o.linkComponent } : {}) },
        styleOverrides: { root: ({ theme }) => ({ color: pal(theme).primaryText }) },
      },
      MuiTooltip: { defaultProps: { arrow: true } },
    },
    transitions: { duration: { shortest: motion.duration.fast, short: motion.duration.base } },
    breakpoints: { values: breakpoints },
    mixins: o.toolbarHeight ? { toolbar: { minHeight: o.toolbarHeight } } : {},
  });
}

/** Default theme: CSS variables with light and dark schemes, plain anchors for links. */
export const theme: Theme = createToyoTheme();
