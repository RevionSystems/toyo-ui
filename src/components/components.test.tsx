import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { ConfirmDialog, DataTable, FilterChips, SearchField, type Column } from '.';

interface Row { id: string; name: string; kg: number }
const rows: Row[] = [
  { id: 'A', name: 'Caliper', kg: 3.9 },
  { id: 'B', name: 'Bolt', kg: 0.12 },
  { id: 'C', name: 'Rotor', kg: 9.8 },
];
const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', render: (r) => r.name, sortValue: (r) => r.name },
  { key: 'kg', header: 'Weight', render: (r) => r.kg, sortValue: (r) => r.kg, align: 'right' },
];
const bodyNames = () => screen.getAllByRole('row').slice(1).map((r) => within(r).getAllByRole('cell')[0]!.textContent);

describe('DataTable', () => {
  it('sorts numerically and toggles direction, exposing aria-sort', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DataTable caption="Parts" columns={columns} rows={rows} getRowId={(r) => r.id} />);
    expect(screen.getByRole('table', { name: 'Parts' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Weight' }));
    expect(bodyNames()).toEqual(['Bolt', 'Caliper', 'Rotor']);
    expect(screen.getByRole('columnheader', { name: /Weight/ })).toHaveAttribute('aria-sort', 'ascending');

    await user.click(screen.getByRole('button', { name: 'Weight' }));
    expect(bodyNames()).toEqual(['Rotor', 'Caliper', 'Bolt']);
    expect(screen.getByRole('columnheader', { name: /Weight/ })).toHaveAttribute('aria-sort', 'descending');
  });

  it('shows an empty state when there are no rows', () => {
    renderWithProviders(<DataTable caption="Parts" columns={columns} rows={[]} getRowId={(r) => r.id} emptyTitle="Nothing here" />);
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here');
  });

  it('navigates on row click', async () => {
    const user = userEvent.setup();
    const { router } = renderWithProviders(
      <DataTable caption="Parts" columns={columns} rows={rows} getRowId={(r) => r.id} getRowHref={(r) => `/parts/${r.id}`} />,
    );
    await user.click(screen.getByText('Rotor'));
    expect(router.state.location.pathname).toBe('/parts/C');
  });
});

describe('FilterChips', () => {
  function Harness({ onChange }: { onChange: (v: string | null) => void }) {
    const [value, setValue] = useState<'a' | 'b' | null>(null);
    return (
      <FilterChips
        label="System"
        value={value}
        onChange={(v) => { setValue(v); onChange(v); }}
        options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta', count: 2 }]}
      />
    );
  }

  it('is a labelled group with pressed state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Harness onChange={onChange} />);
    const group = screen.getByRole('group', { name: 'System' });
    expect(within(group).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(within(group).getByRole('button', { name: 'Beta · 2' }));
    expect(onChange).toHaveBeenLastCalledWith('b');
    expect(within(group).getByRole('button', { name: 'Beta · 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(group).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('SearchField', () => {
  it('clears on Escape and submits on Enter', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    function Harness() {
      const [v, setV] = useState('');
      return <SearchField value={v} onChange={setV} label="Filter" onSubmit={onSubmit} />;
    }
    renderWithProviders(<Harness />);
    const box = screen.getByRole('searchbox', { name: 'Filter' });
    await user.type(box, 'brake{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('brake');
    await user.keyboard('{Escape}');
    expect(box).toHaveValue('');
  });
});

describe('ConfirmDialog', () => {
  it('is labelled, focuses the safe action and maps Escape to cancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    renderWithProviders(
      <ConfirmDialog open title="Supersede revision B?" description="This cannot be undone." confirmLabel="Supersede" onConfirm={onConfirm} onCancel={onCancel} />,
    );
    const dialog = screen.getByRole('dialog', { name: 'Supersede revision B?' });
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
    await user.click(within(dialog).getByRole('button', { name: 'Supersede' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
