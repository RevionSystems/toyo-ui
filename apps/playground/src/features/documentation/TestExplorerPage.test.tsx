import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import type * as TestReportModule from './testReport';
import type { TestReport } from './testReport';

const state = vi.hoisted(() => ({ report: undefined as TestReport | undefined }));

vi.mock('./testReport', async (importOriginal) => {
  const actual = await importOriginal<typeof TestReportModule>();
  return {
    ...actual,
    get testReport() {
      return state.report;
    },
  };
});

const { default: TestExplorerPage } = await import('./TestExplorerPage');

const REPORT: TestReport = {
  generatedAt: '2026-10-13T12:00:00.000Z',
  durationMs: 3200,
  totals: { files: 2, tests: 3, passed: 2, failed: 1, skipped: 0 },
  files: [
    {
      file: 'packages/react/src/Dialog.test.tsx',
      status: 'failed',
      durationMs: 20,
      tests: [
        { ancestors: ['Dialog'], title: 'closes on Escape', status: 'passed', durationMs: 5 },
        {
          ancestors: ['Dialog'],
          title: 'traps focus',
          status: 'failed',
          durationMs: 7,
          failure: 'AssertionError: expected focus',
        },
      ],
    },
    {
      file: 'shared/catalog.test.ts',
      status: 'passed',
      durationMs: 3,
      tests: [{ ancestors: ['catalog'], title: 'complete', status: 'passed', durationMs: 1 }],
    },
  ],
};

describe('TestExplorerPage', () => {
  it('explains how to generate a report when none exists', () => {
    state.report = undefined;
    renderWithProviders(<TestExplorerPage />);
    expect(screen.getByRole('status')).toHaveTextContent('npm run test:report');
  });

  it('shows totals, failures and links to the component', () => {
    state.report = REPORT;
    renderWithProviders(<TestExplorerPage />);
    expect(screen.getByText('Failing')).toBeInTheDocument();
    expect(screen.getByText('AssertionError: expected focus')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Dialog in the lab' })).toHaveAttribute('href', '/components/dialog');
  });

  it('filters by status and text', async () => {
    state.report = REPORT;
    const user = userEvent.setup();
    renderWithProviders(<TestExplorerPage />);
    await user.click(screen.getByRole('button', { name: 'Failed · 1' }));
    expect(screen.getByText('1 of 3 tests shown')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'All' }));
    await user.type(screen.getByRole('searchbox', { name: 'Filter tests' }), 'catalog');
    expect(screen.getByText('1 of 3 tests shown')).toBeInTheDocument();
  });
});
