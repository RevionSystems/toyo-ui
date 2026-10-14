import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { StatusBadge } from './StatusBadge';
import type { StatusTone } from './tone';

const TONES: StatusTone[] = ['success', 'warning', 'error', 'info', 'neutral'];

describe('StatusBadge', () => {
  it.each(TONES)('%s renders its label as text (color is not the only signal)', (tone) => {
    renderWithProviders(<StatusBadge tone={tone} label={`State ${tone}`} />);
    expect(screen.getByText(`State ${tone}`)).toBeVisible();
  });

  it('hides the decorative dot from assistive technology', () => {
    const { container } = renderWithProviders(<StatusBadge tone="success" label="Approved" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByText('Approved').textContent).toBe('Approved');
  });

  it('can omit the dot', () => {
    const { container } = renderWithProviders(<StatusBadge tone="info" label="Draft" showDot={false} />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('is not a live region', () => {
    renderWithProviders(<StatusBadge tone="error" label="Failed" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderWithProviders(
      <p>
        {TONES.map((t) => (
          <StatusBadge key={t} tone={t} label={t} />
        ))}
      </p>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
