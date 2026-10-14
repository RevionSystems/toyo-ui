import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { LoadingState, type LoadingVariant } from './LoadingState';

describe('LoadingState', () => {
  it.each<LoadingVariant>(['spinner', 'linear', 'skeleton'])('%s is announced with its label', (variant) => {
    renderWithProviders(<LoadingState variant={variant} label="Loading components" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading components');
  });

  it('exposes a labelled progressbar with a value when determinate', () => {
    renderWithProviders(<LoadingState variant="linear" label="Uploading" progress={42} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(screen.getByRole('status')).toHaveTextContent('Uploading — 42%');
  });

  it('clamps progress to 0–100', () => {
    renderWithProviders(<LoadingState variant="linear" progress={140} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('marks skeletons busy and hides placeholder shapes', () => {
    const { container } = renderWithProviders(<LoadingState variant="skeleton" lines={4} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(4);
  });

  it('keeps the label available when visually hidden', async () => {
    const { container } = renderWithProviders(<LoadingState hideLabel label="Fetching" />);
    expect(screen.getByRole('status')).toHaveTextContent('Fetching');
    expect(await axeViolations(container)).toEqual([]);
  });
});
