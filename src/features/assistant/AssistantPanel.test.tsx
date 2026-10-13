import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { AssistantPanel } from './AssistantPanel';
import { localProvider } from './provider';

describe('AssistantPanel', () => {
  it('answers the braking discovery question with linked records', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<main><AssistantPanel latencyMs={0} /></main>);

    await user.type(screen.getByRole('textbox', { name: /question/i }), 'Find the documentation for the braking system and its suppliers');
    await user.click(screen.getByRole('button', { name: 'Ask' }));

    const answer = await screen.findByRole('article', { name: /answer to/i });
    expect(within(answer).getByText(/key documents, parts and suppliers for the braking system/i)).toBeInTheDocument();
    expect(within(answer).getByRole('link', { name: /BR-0012/ })).toHaveAttribute('href', '/manuals/BR-0012');
    expect(within(answer).getByRole('link', { name: /Kaneda Brake Systems/ })).toHaveAttribute('href', '/suppliers/SP-1007');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('runs a suggested prompt and shows cited torque', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AssistantPanel latencyMs={0} />);
    await user.click(screen.getByRole('button', { name: /torque for the front caliper bolt/i }));
    expect(await screen.findByText('110 N·m')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Source: manual BR-0012' })).toBeInTheDocument();
  });

  it('auto-runs a deep-linked query', async () => {
    renderWithProviders(<AssistantPanel latencyMs={0} initialQuery="Which manuals reference PT-3320-02A?" autoRun />);
    expect(await screen.findByRole('link', { name: /ABS Sensor Replacement/ })).toBeInTheDocument();
  });

  it('shows an error when the provider fails', async () => {
    const user = userEvent.setup();
    const failing = { ...localProvider, ask: vi.fn().mockRejectedValue(new Error('down')) };
    renderWithProviders(<AssistantPanel latencyMs={0} provider={failing} />);
    await user.type(screen.getByRole('textbox', { name: /question/i }), 'brakes{Enter}');
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not answer/i);
  });
});
