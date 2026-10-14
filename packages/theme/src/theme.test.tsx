import { render, screen } from '@testing-library/react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { forwardRef } from 'react';
import { describe, expect, it } from 'vitest';
import { createToyoTheme, semantic, theme, ToyoThemeProvider } from './index';

describe('createToyoTheme', () => {
  it('builds the default CSS-variables theme with both schemes from tokens', () => {
    // Palette values resolve to CSS variables so switching schemes swaps variables, not the theme.
    expect(theme.vars?.palette.primary.main).toContain('--toyo-palette-primary-main');
    expect(theme.palette.primary.main).toBe(semantic.light.primary);
    expect(theme.palette.primaryText).toBe(semantic.light.primaryText);
    expect(theme.palette.tonal.success).toBe(semantic.light.successBg);
    expect(createToyoTheme({ cssVariables: false, mode: 'dark' }).palette.primary.main).toBe(semantic.dark.primary);
  });

  it('builds a plain scoped theme with overrides', () => {
    const t = createToyoTheme({ cssVariables: false, mode: 'dark', primary: '#1C5BBA', radius: 10, spacingUnit: 5 });
    expect(t.vars).toBeUndefined();
    expect(t.palette.mode).toBe('dark');
    expect(t.palette.primary.main).toBe('#1C5BBA');
    expect(t.palette.background.paper).toBe(semantic.dark.surface);
    expect(t.shape.borderRadius).toBe(10);
    expect(t.spacing(2)).toBe('10px');
  });

  it('injects a link component into links and link buttons', () => {
    const FakeRouterLink = forwardRef<HTMLAnchorElement, { href: string; children?: React.ReactNode }>(
      function FakeRouterLink({ href, children, ...rest }, ref) {
        return (
          <a ref={ref} data-router="yes" href={href} {...rest}>
            {children}
          </a>
        );
      },
    );
    const t = createToyoTheme({ cssVariables: false, linkComponent: FakeRouterLink });
    render(
      <ToyoThemeProvider theme={t}>
        <Link href="/a">Docs</Link>
        <Button href="/b">Open</Button>
      </ToyoThemeProvider>,
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('data-router', 'yes');
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('data-router', 'yes');
  });

  it('uses plain anchors when no link component is given', () => {
    render(
      <ToyoThemeProvider>
        <Link href="/a">Docs</Link>
      </ToyoThemeProvider>,
    );
    expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute('data-router');
  });
});

describe('ToyoThemeProvider', () => {
  it('applies the theme to MUI components', () => {
    render(
      <ToyoThemeProvider>
        <Button variant="contained">Save</Button>
      </ToyoThemeProvider>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    // Text transform comes from the Toyo-ui typography token (MUI's default is uppercase).
    expect(getComputedStyle(button).textTransform).toBe('none');
  });
});
