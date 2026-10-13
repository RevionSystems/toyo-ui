import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderRoutes } from '@/test/render';
import { routes } from './routes';

describe('app routes', () => {
  it.each([
    ['/', /engineering the systems/i],
    ['/systems', 'Vehicle Systems'],
    ['/systems/braking', 'Braking System'],
    ['/manuals', 'Technical Documentation'],
    ['/manuals/BR-0012', 'Front Brake Assembly (Disc)'],
    ['/parts', 'Parts & Assemblies'],
    ['/parts/PT-3310-12A', 'Brake Caliper (Front)'],
    ['/suppliers', 'Suppliers & Sourcing'],
    ['/suppliers/SP-1007', 'Kaneda Brake Systems'],
    ['/manufacturing', 'Manufacturing Processes'],
    ['/assistant', 'Ask the engineering database'],
    ['/lab/status-chip', 'Component Lab'],
    ['/tokens', 'Design Tokens'],
    ['/accessibility', 'Accessibility & Testing'],
    ['/nope', 'Page not found'],
    ['/manuals/XX-0000', 'Manual not found'],
  ])('%s renders a single h1 and passes axe', async (path, title) => {
    const { container } = renderRoutes(routes, path);
    const h1 = await screen.findByRole('heading', { level: 1, name: title });
    expect(h1).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('marks the active nav item with aria-current', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/parts/PT-3310-12A');
    // jsdom has no layout, so the app renders its mobile shell with a closed drawer.
    await user.click(await screen.findByRole('button', { name: 'Open navigation' }));
    const nav = await screen.findByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Parts & Assemblies' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('filters manuals from URL params', async () => {
    renderRoutes(routes, '/manuals?system=braking&status=in-review');
    expect(await screen.findByText('1 of 14 manuals')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'BR-0041' })).toBeInTheDocument();
  });

  it('navigates from a manual to a part to its supplier', async () => {
    const user = userEvent.setup();
    const { router } = renderRoutes(routes, '/manuals/BR-0012');
    await user.click(await screen.findByRole('tab', { name: 'Related Parts' }));
    await user.click(screen.getByRole('link', { name: /Brake Caliper \(Front\)/ }));
    expect(router.state.location.pathname).toBe('/parts/PT-3310-12A');
    await user.click(await screen.findByRole('link', { name: /Kaneda Brake Systems/ }));
    expect(router.state.location.pathname).toBe('/suppliers/SP-1007');
  });
});
