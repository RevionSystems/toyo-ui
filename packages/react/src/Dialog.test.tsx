import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from './test/axe';
import { renderWithProviders } from './test/render';
import { Dialog, type DialogProps } from './Dialog';

function Harness(props: Partial<DialogProps>) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Dialog
        open={open}
        title="Delete component?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        {...props}
        onClose={(reason) => {
          props.onClose?.(reason);
          setOpen(false);
        }}
      />
    </>
  );
}

describe('Dialog', () => {
  it('is labelled by its title and described by its description', () => {
    renderWithProviders(<Harness onConfirm={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'Delete component?' });
    expect(dialog).toHaveAccessibleDescription('This action cannot be undone.');
  });

  it('closes on Escape with reason "escape"', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<Harness onClose={onClose} />);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledWith('escape');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes on Cancel with reason "cancel"', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<Harness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledWith('cancel');
  });

  it('focuses Cancel first in destructive dialogs and Confirm otherwise', async () => {
    const { unmount } = renderWithProviders(<Harness tone="destructive" onConfirm={() => {}} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
    unmount();
    renderWithProviders(<Harness onConfirm={() => {}} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus());
  });

  it('shows loading while an async confirm is pending and blocks dismissal', async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const onClose = vi.fn();
    renderWithProviders(<Harness onConfirm={onConfirm} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));
    expect(within(dialog).getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-busy', 'true');
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();

    resolve();
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: 'Delete' })).not.toHaveAttribute('aria-busy'),
    );
  });

  it('traps focus inside while open', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness onConfirm={() => {}} />);
    const dialog = await screen.findByRole('dialog');
    for (let i = 0; i < 4; i++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('has no axe violations', async () => {
    renderWithProviders(<Harness tone="destructive" onConfirm={() => {}} />);
    expect(await axeViolations(screen.getByRole('dialog'))).toEqual([]);
  });
});

describe('Dialog container', () => {
  it('portals into the given container instead of document.body', () => {
    const host = document.createElement('div');
    host.setAttribute('data-testid', 'host');
    document.body.appendChild(host);
    renderWithProviders(<Dialog open title="Scoped" onClose={() => {}} container={host} />);
    expect(host).toContainElement(screen.getByRole('dialog', { name: 'Scoped' }));
    host.remove();
  });
});

describe('Dialog initial focus', () => {
  it('does not steal focus from a field the user is already typing in', async () => {
    // Initial focus is applied after the enter transition. If the user has already moved focus into the
    // dialog (e.g. started typing), that must win; otherwise keystrokes after the transition are lost.
    const user = userEvent.setup({ delay: null });
    renderWithProviders(
      <Dialog open title="Schedule" onClose={() => {}} onConfirm={() => {}} confirmLabel="Schedule">
        <input aria-label="Service" />
      </Dialog>,
    );
    const field = screen.getByRole('textbox', { name: 'Service' });
    await user.click(field);
    await user.keyboard('billing');
    // Let the enter transition finish.
    await new Promise((r) => setTimeout(r, 400));
    await user.keyboard('-api');
    expect(field).toHaveFocus();
    expect(field).toHaveValue('billing-api');
  });
});
