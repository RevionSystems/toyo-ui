import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, type Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { theme as defaultTheme } from './theme';

export interface ToyoThemeProviderProps {
  children: ReactNode;
  /** A theme from `createToyoTheme()`. Defaults to the standard Toyo-ui theme. */
  theme?: Theme;
  /** Initial color scheme when the user has not chosen one. Persisted by MUI once changed. */
  defaultMode?: 'light' | 'dark' | 'system';
  /** Renders MUI's CssBaseline (global resets, focus ring, reduced motion). Default `true`. */
  baseline?: boolean;
}

/**
 * Applies the Toyo-ui theme. Use once at the root of an app; components from
 * `@toyo-ui/react` rely on its palette roles (`primaryText`, `tonal.*`, `surfaceMuted`).
 */
export function ToyoThemeProvider({
  children,
  theme = defaultTheme,
  defaultMode = 'system',
  baseline = true,
}: ToyoThemeProviderProps) {
  return (
    <ThemeProvider theme={theme} defaultMode={defaultMode} disableTransitionOnChange>
      {baseline && <CssBaseline enableColorScheme />}
      {children}
    </ThemeProvider>
  );
}
