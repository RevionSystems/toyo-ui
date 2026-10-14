import Box from '@mui/material/Box';
import { DataTable, StatusBadge, type Column, type StatusTone } from '@toyo-ui/react';
import { example, jsx, raw } from '../jsx';
import { defineEntry } from '../types';

interface ComponentRow {
  id: string;
  name: string;
  version: string;
  tests: number;
  coverage: number;
  status: { tone: StatusTone; label: string };
}

const ROWS: ComponentRow[] = [
  { id: '1', name: 'Button', version: '2.3.0', tests: 9, coverage: 96, status: { tone: 'success', label: 'Stable' } },
  {
    id: '2',
    name: 'TextField',
    version: '2.1.4',
    tests: 7,
    coverage: 91,
    status: { tone: 'success', label: 'Stable' },
  },
  {
    id: '3',
    name: 'Dialog',
    version: '1.8.0',
    tests: 7,
    coverage: 88,
    status: { tone: 'warning', label: 'In review' },
  },
  { id: '4', name: 'DataTable', version: '0.9.2', tests: 6, coverage: 74, status: { tone: 'info', label: 'Beta' } },
  { id: '5', name: 'Carousel', version: '0.1.0', tests: 0, coverage: 0, status: { tone: 'neutral', label: 'Draft' } },
];

const COLUMNS: Column<ComponentRow>[] = [
  { key: 'name', header: 'Component', render: (r) => r.name, sortValue: (r) => r.name },
  { key: 'version', header: 'Version', render: (r) => r.version, hideOnMobile: true },
  { key: 'tests', header: 'Tests', align: 'right', render: (r) => r.tests, sortValue: (r) => r.tests },
  {
    key: 'coverage',
    header: 'Coverage',
    align: 'right',
    render: (r) => `${r.coverage}%`,
    sortValue: (r) => r.coverage,
    hideOnMobile: true,
  },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge tone={r.status.tone} label={r.status.label} /> },
];

interface DataTableState {
  caption: string;
  showCaption: boolean;
  density: 'compact' | 'comfortable';
  loading: boolean;
  empty: boolean;
  sortedByName: boolean;
}

export const dataTableEntry = defineEntry<DataTableState>({
  id: 'data-table',
  defaults: {
    caption: 'Library components',
    showCaption: true,
    density: 'compact',
    loading: false,
    empty: false,
    sortedByName: false,
  },
  controls: [
    { kind: 'text', name: 'caption' },
    { kind: 'boolean', name: 'showCaption', label: 'show caption' },
    { kind: 'select', name: 'density', options: ['compact', 'comfortable'] },
    { kind: 'boolean', name: 'loading' },
    { kind: 'boolean', name: 'empty', label: 'empty rows' },
    { kind: 'boolean', name: 'sortedByName', label: 'initial sort by name' },
  ],
  render: (s) => (
    <Box sx={{ width: '100%' }}>
      <DataTable
        key={String(s.sortedByName)}
        caption={s.caption}
        showCaption={s.showCaption}
        density={s.density}
        loading={s.loading}
        columns={COLUMNS}
        rows={s.empty ? [] : ROWS}
        getRowId={(r) => r.id}
        initialSort={s.sortedByName ? { key: 'name', direction: 'asc' } : undefined}
      />
    </Box>
  ),
  code: (s) =>
    example({
      components: ['DataTable', 'StatusBadge'],
      imports: ["import type { Column } from '@toyo-ui/react';"],
      setup: [
        'const columns: Column<ComponentRow>[] = [',
        "  { key: 'name', header: 'Component', render: (r) => r.name, sortValue: (r) => r.name },",
        "  { key: 'tests', header: 'Tests', align: 'right', render: (r) => r.tests, sortValue: (r) => r.tests },",
        "  { key: 'status', header: 'Status', render: (r) => <StatusBadge tone={r.status.tone} label={r.status.label} /> },",
        '];',
        '',
      ],
      element: jsx(
        'DataTable',
        {
          caption: s.caption,
          showCaption: s.showCaption,
          density: s.density,
          loading: s.loading ? raw('isLoading') : undefined,
          columns: raw('columns'),
          rows: raw(s.empty ? '[]' : 'components'),
          getRowId: raw('(r) => r.id'),
          initialSort: s.sortedByName ? raw("{ key: 'name', direction: 'asc' }") : undefined,
        },
        { defaults: { density: 'compact' } },
      ),
    }),
});
