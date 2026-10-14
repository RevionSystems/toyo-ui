import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToyoThemeProvider } from '@toyo-ui/theme';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { createReleaseApi } from './releases';

/** Renders the app exactly as main.tsx does, with an instant fake API and a controllable outage. */
function setup() {
  let outage = false;
  const api = createReleaseApi({ latencyMs: 0, failing: () => outage });
  const user = userEvent.setup();
  render(
    <ToyoThemeProvider>
      <App api={api} outage={{ get: () => outage, set: (on) => (outage = on) }} />
    </ToyoThemeProvider>,
  );
  return { user, setOutage: (on: boolean) => (outage = on) };
}

const table = () => screen.getByRole('table', { name: 'Releases' });
const bodyRows = () => within(table()).getAllByRole('row').slice(1);

describe('Release Console (consumer of @toyo-ui/react via dist)', () => {
  it('loads releases into the table with status badges', async () => {
    setup();
    expect(await screen.findByText('6 of 6 releases')).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(6);
    expect(within(table()).getAllByText('Deployed').length).toBeGreaterThan(0);
    expect(screen.getByRole('region', { name: 'Release summary' })).toHaveTextContent('Failed · 1');
  });

  it('filters, shows an empty state, and clears filters', async () => {
    const { user } = setup();
    await screen.findByText('6 of 6 releases');
    await user.type(screen.getByRole('textbox', { name: 'Filter releases' }), 'payments');
    expect(screen.getByText('2 of 6 releases')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Canary' }));
    expect(screen.getByText('No releases match')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('6 of 6 releases')).toBeInTheDocument();
  });

  it('rolls back a deployed release after confirmation', async () => {
    const { user } = setup();
    await screen.findByText('6 of 6 releases');
    await user.click(screen.getByRole('button', { name: 'Roll back checkout-api 4.12.0' }));

    const dialog = screen.getByRole('dialog', { name: 'Roll back checkout-api 4.12.0?' });
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus());
    await user.click(within(dialog).getByRole('button', { name: 'Roll back' }));

    expect(await screen.findByText('checkout-api 4.12.0 was rolled back.')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const row = within(table()).getByText('checkout-api').closest('tr')!;
    expect(row).toHaveTextContent('Rolled back');
    expect(within(row).queryByRole('button', { name: /Roll back/ })).not.toBeInTheDocument();
  });

  it('keeps the rollback dialog open and explains a failure', async () => {
    const { user, setOutage } = setup();
    await screen.findByText('6 of 6 releases');
    await user.click(screen.getByRole('button', { name: 'Roll back auth-gateway 7.4.0' }));
    setOutage(true);
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Roll back' }));
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('Release service is unavailable (503).');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows an error with retry when the service is down, and recovers', async () => {
    const { user } = setup();
    await screen.findByText('6 of 6 releases');
    await user.click(screen.getByRole('switch', { name: 'Simulate outage' }));
    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Releases could not be loaded');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: 'Simulate outage' }));
    await user.click(within(alert).getByRole('button', { name: 'Retry' }));
    expect(await screen.findByText('6 of 6 releases')).toBeInTheDocument();
  });

  // The longest flow in the suite; allow for CPU contention when all projects run in parallel.
  it('validates the new-release form and schedules a release', { timeout: 20_000 }, async () => {
    const { user } = setup();
    await screen.findByText('6 of 6 releases');
    await user.click(screen.getByRole('button', { name: 'New release' }));
    const dialog = screen.getByRole('dialog', { name: 'Schedule a release' });

    await user.click(within(dialog).getByRole('button', { name: 'Schedule release' }));
    expect(within(dialog).getByRole('textbox', { name: /Service/ })).toHaveAccessibleDescription(
      'Service name is required.',
    );
    expect(within(dialog).getByRole('textbox', { name: /Version/ })).toHaveAttribute('aria-invalid', 'true');

    await user.type(within(dialog).getByRole('textbox', { name: /Service/ }), 'billing-api');
    await user.type(within(dialog).getByRole('textbox', { name: /Version/ }), '1.0');
    await user.type(within(dialog).getByRole('textbox', { name: /Owning team/ }), 'Payments');
    await user.click(within(dialog).getByRole('button', { name: 'Schedule release' }));
    expect(within(dialog).getByRole('textbox', { name: /Version/ })).toHaveAccessibleDescription(
      'Use semantic versioning, e.g. 2.4.0.',
    );

    await user.clear(within(dialog).getByRole('textbox', { name: /Version/ }));
    await user.type(within(dialog).getByRole('textbox', { name: /Version/ }), '1.0.0');
    await user.click(within(dialog).getByRole('button', { name: 'Production' }));
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Schedule release' })).toBeEnabled());
    await user.click(within(dialog).getByRole('button', { name: 'Schedule release' }));

    expect(
      await screen.findByText('billing-api 1.0.0 is scheduled for production.', undefined, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('7 of 7 releases')).toBeInTheDocument();
  });

  it('has no axe violations once loaded', async () => {
    setup();
    await screen.findByText('6 of 6 releases');
    const results = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
