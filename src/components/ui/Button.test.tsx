import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { Button, type ButtonVariant } from './Button';

describe('Button', () => {
  it('calls onClick on click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it.each([
    ['disabled', { disabled: true }],
    ['loading', { loading: true }],
  ])('does not call onClick when %s', async (_, props) => {
    // MUI sets pointer-events: none on disabled buttons; bypass user-event's guard to prove the handler can't fire.
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    renderWithProviders(
      <Button onClick={onClick} {...props}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('keeps its accessible name and exposes aria-busy while loading', () => {
    renderWithProviders(<Button loading>Save changes</Button>);
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders a link when href is set', () => {
    renderWithProviders(<Button href="/components/dialog">Open dialog docs</Button>);
    expect(screen.getByRole('link', { name: 'Open dialog docs' })).toHaveAttribute('href', '/components/dialog');
  });

  it.each<ButtonVariant>(['primary', 'secondary', 'outline', 'text'])(
    '%s variant has no axe violations',
    async (variant) => {
      const { container } = renderWithProviders(<Button variant={variant}>Action</Button>);
      expect(await axeViolations(container)).toEqual([]);
    },
  );
});
