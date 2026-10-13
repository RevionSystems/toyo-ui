import { createTheme, type Theme } from '@mui/material/styles';
import { LinkBehavior } from '@/components/LinkBehavior';
import { elevation, layout, motion, radius, semantic, spacing, typography } from './tokens';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    display: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    display?: React.CSSProperties;
  }
  interface Palette {
    surfaceMuted: string;
    /** Low-emphasis backgrounds for status tones (chips, banners). */
    tonal: { success: string; warning: string; info: string };
  }
  interface PaletteOptions {
    surfaceMuted?: string;
    tonal?: { success: string; warning: string; info: string };
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
  }
}

const px = (n: number) => `${n / 16}rem`;
const { scale, fontFamily } = typography;

function schemePalette(scheme: 'light' | 'dark') {
  const s = semantic[scheme];
  return {
    primary: { main: s.primary, dark: s.primaryHover, contrastText: s.onPrimary },
    success: { main: s.success },
    warning: { main: s.warning },
    info: { main: s.info },
    background: { default: s.background, paper: s.surface },
    text: { primary: s.textPrimary, secondary: s.textSecondary },
    divider: s.border,
    surfaceMuted: s.surfaceMuted,
    tonal: { success: s.successBg, warning: s.warningBg, info: s.infoBg },
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
      fontFamily: fontFamily.sans,
      fontSize: `clamp(2.25rem, 4vw, ${px(scale.display.size)})`,
      lineHeight: scale.display.lineHeight,
      fontWeight: scale.display.weight,
      letterSpacing: `${scale.display.letterSpacing / 16}rem`,
    },
    h1: {
      fontFamily: fontFamily.serif,
      fontSize: px(scale.h1.size),
      lineHeight: scale.h1.lineHeight,
      fontWeight: 600,
      letterSpacing: `${scale.h1.letterSpacing / 16}rem`,
    },
    h2: {
      fontFamily: fontFamily.serif,
      fontSize: px(scale.h2.size),
      lineHeight: scale.h2.lineHeight,
      fontWeight: scale.h2.weight,
    },
    h3: {
      fontFamily: fontFamily.serif,
      fontSize: px(scale.h3.size),
      lineHeight: scale.h3.lineHeight,
      fontWeight: scale.h3.weight,
    },
    h4: { fontSize: px(16), fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: px(14), fontWeight: 600 },
    h6: { fontSize: px(13), fontWeight: 600 },
    body1: { fontSize: px(scale.body.size), lineHeight: scale.body.lineHeight },
    body2: { fontSize: px(scale.small.size), lineHeight: scale.small.lineHeight },
    overline: {
      fontSize: px(scale.overline.size),
      lineHeight: scale.overline.lineHeight,
      fontWeight: scale.overline.weight,
      letterSpacing: `${scale.overline.letterSpacing / 16}rem`,
    },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { WebkitFontSmoothing: 'antialiased' },
        'code, pre': { fontFamily: fontFamily.mono },
        ':focus-visible': { outlineOffset: 2 },
      },
    },
    MuiButtonBase: { defaultProps: { LinkComponent: LinkBehavior } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: radius.sm, paddingInline: 20, minHeight: 40 },
        sizeSmall: { minHeight: 32, paddingInline: 12 },
        outlined: ({ theme }) => ({
          borderColor: theme.vars.palette.text.primary,
          color: theme.vars.palette.text.primary,
        }),
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderRadius: radius.lg, boxShadow: elevation.card } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: radius.sm, fontWeight: 600 } },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, minHeight: 44, paddingInline: 12 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          fontWeight: 600,
          color: theme.vars.palette.text.secondary,
          fontSize: px(12),
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }),
      },
    },
    MuiLink: { defaultProps: { underline: 'hover', component: LinkBehavior } },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
  transitions: {
    duration: { shortest: parseInt(motion.fast), short: parseInt(motion.base) },
  },
  mixins: { toolbar: { minHeight: layout.topbarHeight } },
});
