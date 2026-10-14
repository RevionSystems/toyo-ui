import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderRoutes } from '@/test/render';
import { routes } from './routes';

describe('routes', () => {
  it.each([
    ['/', 'Toyo-ui components'],
    ['/components/dialog', 'Dialog'],
    ['/foundations/tokens', 'Colors & Tokens'],
    ['/foundations/typography', 'Typography'],
    ['/foundations/spacing', 'Spacing, shape & dimensions'],
    ['/foundations/theme', 'Theme'],
    ['/foundations/accessibility', 'Accessibility'],
    ['/engineering/api', 'API Explorer'],
    ['/engineering/tests', 'Test Explorer'],
    ['/engineering/docs', 'Documentation'],
    ['/nope', 'Page not found'],
    // The AI assistant was removed; its old route must not resolve.
    ['/engineering/assistant', 'Page not found'],
  ])('%s renders one h1 and passes axe', async (path, title) => {
    const { container } = renderRoutes(routes, path);
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('lists components in the sidebar with status and marks the current one', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/components/loading-state');
    // jsdom has no layout, so the shell renders its mobile drawer, closed.
    await user.click(await screen.findByRole('button', { name: 'Open navigation' }));
    const nav = await screen.findByRole('navigation', { name: 'Primary' });
    const current = within(nav).getByRole('link', { name: /LoadingState/ });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveTextContent('Beta');
    expect(within(nav).getByRole('link', { name: 'Button' })).not.toHaveAttribute('aria-current');
    expect(within(nav).getByRole('link', { name: 'Button' })).not.toHaveTextContent('Beta');
  });
});

describe('navigation and search', () => {
  it('has no AI entries in the primary navigation', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/');
    await user.click(await screen.findByRole('button', { name: 'Open navigation' }));
    const nav = await screen.findByRole('navigation', { name: 'Primary' });
    expect(within(nav).queryByText(/\bAI\b|assistant/i)).not.toBeInTheDocument();
  });

  it('opens the highlighted component with Enter', async () => {
    const user = userEvent.setup();
    const { router } = renderRoutes(routes, '/');
    const search = await screen.findByRole('combobox', { name: 'Search components and pages' });
    await user.type(search, 'Dialog{Enter}');
    expect(router.state.location.pathname).toBe('/components/dialog');
  });
});

describe('API Explorer', () => {
  it('filters props by component and text', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/engineering/api');
    await screen.findByRole('heading', { level: 1, name: 'API Explorer' });
    await user.click(screen.getByRole('button', { name: /^Dialog · / }));
    await user.type(screen.getByRole('searchbox', { name: 'Filter props' }), 'promise');
    const table = screen.getByRole('table', { name: 'Component props' });
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.textContent?.startsWith('Dialog'))).toBe(true);
    expect(rows.some((r) => r.textContent?.includes('onConfirm'))).toBe(true);
    expect(screen.getByText(`${rows.length} of`, { exact: false })).toBeInTheDocument();
  });
});

describe('Theme sandbox', () => {
  it('updates the generated factory call and contrast verdict', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/foundations/theme');
    await screen.findByRole('heading', { level: 1, name: 'Theme' });
    await user.click(screen.getByRole('combobox', { name: 'Accent (primary fill)' }));
    await user.click(await screen.findByRole('option', { name: /Amber/ }));
    const code = screen.getByLabelText(/Theme factory call/);
    expect(code).toHaveTextContent("primary: '#F2B44C'");
    expect(screen.getByText(/Button label on accent/)).toHaveTextContent(/1\.\d\d:1|2\.\d\d:1/);
    expect(screen.getAllByText('Fails').length).toBeGreaterThan(0);
  });

  it('does not change the application theme', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/foundations/theme');
    await screen.findByRole('heading', { level: 1, name: 'Theme' });
    await user.click(
      screen.getByRole('group', { name: 'Sandbox color scheme' }).querySelector('button[value="dark"]')!,
    );
    expect(document.documentElement.getAttribute('data-color-scheme')).not.toBe('dark');
  });
});
