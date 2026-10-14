import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from './test/axe';
import { renderWithProviders } from './test/render';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('announces title and description as a status', () => {
    renderWithProviders(
      <EmptyState title="No components match" description="Clear the filters to see all components." />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('No components match');
    expect(screen.getByRole('status')).toHaveTextContent('Clear the filters to see all components.');
  });

  it('renders a working recovery action', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    renderWithProviders(
      <EmptyState kind="no-results" title="No results" action={<Button onClick={onClear}>Clear filters</Button>} />,
    );
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClear).toHaveBeenCalled();
  });

  it('does not use a heading (it sits inside other sections)', () => {
    renderWithProviders(<EmptyState title="Nothing here" />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderWithProviders(<EmptyState kind="error" title="Could not load" />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
