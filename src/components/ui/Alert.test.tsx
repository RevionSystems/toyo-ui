import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { Alert, type AlertSeverity } from './Alert';

describe('Alert', () => {
  it.each<[AlertSeverity, 'alert' | 'status']>([
    ['error', 'alert'],
    ['warning', 'alert'],
    ['info', 'status'],
    ['success', 'status'],
  ])('%s uses role="%s"', (severity, role) => {
    renderWithProviders(<Alert severity={severity}>Message</Alert>);
    expect(screen.getByRole(role)).toHaveTextContent('Message');
  });

  it('does not announce when announce is false', () => {
    renderWithProviders(
      <Alert severity="error" announce={false}>
        Static
      </Alert>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
  });

  it('renders the title and a labelled dismiss button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(
      <Alert severity="warning" title="Unsaved changes" onClose={onClose}>
        Save before leaving.
      </Alert>,
    );
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each<AlertSeverity>(['info', 'success', 'warning', 'error'])('%s has no axe violations', async (severity) => {
    const { container } = renderWithProviders(
      <Alert severity={severity} title="Title">
        Body
      </Alert>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
