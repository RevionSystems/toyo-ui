import { createTheme, type Theme } from '@mui/material/styles';
import { LinkBehavior } from '@/components/layout/LinkBehavior';
import { dimensions, elevation, focus, layout, motion, radius, semantic, spacing, typography } from './tokens';

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

function schemePalette(scheme: 'light' | 'dark') {
  const s = semantic[scheme];
  return {
    primary: { main: s.primary, dark: s.primaryHover, contrastText: s.onPrimary },
    error: { main: s.error },
    success: { main: s.success },
    warning: { main: s.warning },
    info: { main: s.info },
    background: { default: s.background, paper: s.surface },
    text: { primary: s.textPrimary, secondary: s.textSecondary },
    divider: s.border,
    surfaceMuted: s.surfaceMuted,
    primaryText: s.primaryText,
    focusRing: s.focusRing,
    tonal: { success: s.successBg, warning: s.warningBg, info: s.infoBg, error: s.errorBg },
  };
}

export const theme: Theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-color-scheme', cssVarPrefix: 'toyo' },
  colorSchemes: {
    light: { palette: schemePalette('light') },
    dark: { palette: schemePalette('dark') },
  },
  spacing: spacing.unit,
  shape: { borderRadius: radius.md },
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
    MuiButtonBase: { defaultProps: { LinkComponent: LinkBehavior } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: radius.sm,
          minHeight: dimensions.control.medium,
          paddingInline: 16,
          variants: [
            // Text-colored variants use the AA-safe red, not the fill red.
            { props: { variant: 'text', color: 'primary' }, style: { color: theme.vars.palette.primaryText } },
          ],
        }),
        sizeSmall: { minHeight: dimensions.control.small, paddingInline: 12, fontSize: rem(13) },
        sizeLarge: { minHeight: dimensions.control.large, paddingInline: 20, fontSize: rem(15) },
        outlined: ({ theme }) => ({
          borderColor: theme.vars.palette.divider,
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.background.paper,
        }),
      },
    },
    MuiIconButton: { styleOverrides: { root: { borderRadius: radius.sm } } },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderRadius: radius.lg, boxShadow: elevation[1] } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({ backgroundColor: theme.vars.palette.background.paper, borderRadius: radius.sm }),
        notchedOutline: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: radius.sm, fontWeight: 500 } } },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 44,
          paddingInline: 16,
          '&.Mui-selected': { color: theme.vars.palette.primaryText },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({ fontWeight: 600, color: theme.vars.palette.text.secondary, fontSize: rem(12) }),
      },
    },
    MuiLink: {
      defaultProps: { underline: 'hover', component: LinkBehavior },
      styleOverrides: { root: ({ theme }) => ({ color: theme.vars.palette.primaryText }) },
    },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
  transitions: { duration: { shortest: motion.duration.fast, short: motion.duration.base } },
  mixins: { toolbar: { minHeight: layout.topbarHeight } },
});
