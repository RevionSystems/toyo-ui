import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { TextField } from './TextField';

const requiredEmail = (v: string) =>
  !v ? 'Email is required.' : !/^\S+@\S+\.\S+$/.test(v) ? 'Enter a valid email address.' : undefined;

describe('TextField', () => {
  it('is labelled and describes itself with the helper text', () => {
    renderWithProviders(<TextField label="Component name" helperText="Use PascalCase." />);
    const input = screen.getByRole('textbox', { name: 'Component name' });
    expect(input).toHaveAccessibleDescription('Use PascalCase.');
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('keeps an accessible name when the label is visually hidden', () => {
    renderWithProviders(<TextField label="Search components" hideLabel />);
    expect(screen.getByRole('textbox', { name: 'Search components' })).toBeInTheDocument();
  });

  it('validates on blur, links the error, and clears it as the user fixes the value', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TextField label="Email" validate={requiredEmail} />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    await user.type(input, 'not-an-email');
    expect(input).not.toHaveAttribute('aria-invalid', 'true'); // no nagging before blur
    await user.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid email address.');

    await user.clear(input);
    await user.type(input, 'dev@toyo-ui.dev');
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('prefers an explicit errorMessage over validation', () => {
    renderWithProviders(<TextField label="Name" errorMessage="Name is taken." validate={() => undefined} />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAccessibleDescription('Name is taken.');
  });

  it('passes the string value to onChange and supports controlled use', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Controlled() {
      const [v, setV] = useState('');
      return (
        <TextField
          label="Title"
          value={v}
          onChange={(next) => {
            setV(next.toUpperCase());
            onChange(next);
          }}
        />
      );
    }
    renderWithProviders(<Controlled />);
    await user.type(screen.getByRole('textbox', { name: 'Title' }), 'ab');
    expect(onChange).toHaveBeenLastCalledWith('Ab');
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('AB');
  });

  it('enforces maxLength and shows a counter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TextField label="Summary" maxLength={5} />);
    await user.type(screen.getByRole('textbox', { name: 'Summary' }), 'abcdefgh');
    expect(screen.getByRole('textbox', { name: 'Summary' })).toHaveValue('abcde');
    expect(screen.getByText('5 / 5')).toBeInTheDocument();
  });

  it('has no axe violations in error state', async () => {
    const { container } = renderWithProviders(<TextField label="Email" errorMessage="Required." required />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
