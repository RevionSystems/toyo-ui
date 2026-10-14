import { createToyoTheme, ToyoThemeProvider } from '@toyo-ui/theme';
import type { ReactNode } from 'react';
import { LinkBehavior } from '@/components/layout/LinkBehavior';
import { layout } from './layout';

// The packages are router-agnostic; the playground injects React Router for every MUI link.
const theme = createToyoTheme({ linkComponent: LinkBehavior, toolbarHeight: layout.topbarHeight });

export function AppProviders({ children }: { children: ReactNode }) {
  return <ToyoThemeProvider theme={theme}>{children}</ToyoThemeProvider>;
}
