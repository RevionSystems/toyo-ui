import { render, type RenderOptions } from '@testing-library/react';
import { ToyoThemeProvider } from '@toyo-ui/theme';
import type { ReactElement } from 'react';

/** Renders UI inside the Toyo-ui theme, as consumers do. */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(<ToyoThemeProvider>{ui}</ToyoThemeProvider>, options);
}
