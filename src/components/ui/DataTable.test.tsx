import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { DataTable, type Column } from './DataTable';

interface Row {
  id: string;
  name: string;
  tests: number;
}
const rows: Row[] = [
  { id: 'a', name: 'Dialog', tests: 7 },
  { id: 'b', name: 'Alert', tests: 8 },
  { id: 'c', name: 'Button', tests: 9 },
];
const columns: Column<Row>[] = [
  { key: 'name', header: 'Component', render: (r) => r.name, sortValue: (r) => r.name },
  { key: 'tests', header: 'Tests', render: (r) => r.tests, sortValue: (r) => r.tests, align: 'right' },
];
const firstColumn = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((r) => within(r).getAllByRole('cell')[0]!.textContent);

describe('DataTable', () => {
  it('renders a captioned table with a header row and one row per item', () => {
    renderWithProviders(<DataTable caption="Components" columns={columns} rows={rows} getRowId={(r) => r.id} />);
    const table = screen.getByRole('table', { name: 'Components' });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((h) => h.textContent),
    ).toEqual(['Component', 'Tests']);
    expect(firstColumn()).toEqual(['Dialog', 'Alert', 'Button']);
  });

  it('sorts by column and exposes aria-sort', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DataTable caption="Components" columns={columns} rows={rows} getRowId={(r) => r.id} />);
    await user.click(screen.getByRole('button', { name: 'Component' }));
    expect(firstColumn()).toEqual(['Alert', 'Button', 'Dialog']);
    expect(screen.getByRole('columnheader', { name: /Component/ })).toHaveAttribute('aria-sort', 'ascending');
    await user.click(screen.getByRole('button', { name: 'Tests' }));
    await user.click(screen.getByRole('button', { name: 'Tests' }));
    expect(firstColumn()).toEqual(['Button', 'Alert', 'Dialog']);
    expect(screen.getByRole('columnheader', { name: /Tests/ })).toHaveAttribute('aria-sort', 'descending');
  });

  it('shows an empty state when there are no rows', () => {
    renderWithProviders(<DataTable caption="Components" columns={columns} rows={[]} getRowId={(r) => r.id} />);
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  it('marks the table busy and hides skeleton rows from assistive tech while loading', () => {
    renderWithProviders(
      <DataTable caption="Components" columns={columns} rows={rows} getRowId={(r) => r.id} loading />,
    );
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Dialog')).not.toBeInTheDocument();
  });

  it('calls onRowClick with the row', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    renderWithProviders(
      <DataTable caption="Components" columns={columns} rows={rows} getRowId={(r) => r.id} onRowClick={onRowClick} />,
    );
    await user.click(screen.getByText('Alert'));
    expect(onRowClick).toHaveBeenCalledWith(rows[1]);
  });

  it('has no axe violations', async () => {
    const { container } = renderWithProviders(
      <DataTable caption="Components" columns={columns} rows={rows} getRowId={(r) => r.id} />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
