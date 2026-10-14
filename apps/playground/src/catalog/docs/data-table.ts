import type { ComponentDoc } from '../catalog';

export const dataTableDoc: ComponentDoc = {
  id: 'data-table',
  name: 'DataTable',
  category: 'data-display',
  summary: 'Typed, sortable table with loading, empty and responsive states.',
  purpose:
    'Displays records with a few comparable attributes, sortable by column, with consistent loading and empty states.',
  props: [
    {
      name: 'caption',
      type: 'string',
      required: true,
      description: 'Accessible table name, rendered as <caption> (visually hidden by default).',
    },
    { name: 'showCaption', type: 'boolean', default: 'false', description: 'Shows the caption visually.' },
    {
      name: 'columns',
      type: 'Column<T>[]',
      required: true,
      description: '{ key, header, render(row), sortValue?(row), align?, width?, hideOnMobile? }',
    },
    {
      name: 'rows',
      type: 'T[]',
      required: true,
      description: 'Row data. The row type flows into every column renderer.',
    },
    { name: 'getRowId', type: '(row: T) => string', required: true, description: 'Stable React key.' },
    {
      name: 'onRowClick',
      type: '(row: T) => void',
      description: 'Row click handler. Also put a link or button in a cell for keyboard users.',
    },
    { name: 'initialSort', type: "{ key: string; direction: 'asc' | 'desc' }", description: 'Initial sort.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Skeleton rows and aria-busy.' },
    { name: 'density', type: "'compact' | 'comfortable'", default: "'compact'", description: 'Row height.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Replaces the default EmptyState.' },
  ],
  apiDecisions: [
    'Generic over the row type: `DataTable<Part>` type-checks every `render` and `sortValue` at the call site.',
    'Declarative columns instead of composing MUI Table* primitives by hand on every screen.',
    '`sortValue` returns numbers for numeric sort, so "10" never sorts before "9".',
    "`onRowClick` instead of a router-specific href: the library doesn't depend on the app's router.",
    'No pagination or virtualization yet — appropriate up to a few hundred rows (documented limitation).',
  ],
  states: [
    'Default',
    'Sorted asc/desc',
    'Loading',
    'Empty',
    'Clickable rows',
    'Comfortable density',
    'Mobile (hidden columns)',
  ],
  accessibility: [
    'A real <table> with <caption>, column headers and cells — screen readers announce headers as users move between cells.',
    'Sortable headers are buttons and expose aria-sort on the header cell.',
    'Loading sets aria-busy on the table; skeleton rows are aria-hidden.',
    'Row click is a convenience only: keyboard users need a link or button inside the row.',
    'hideOnMobile removes secondary columns below 900px rather than forcing horizontal scrolling.',
  ],
  testing: [
    'Caption names the table; headers and rows render.',
    'Clicking a header sorts and sets aria-sort; second click reverses.',
    'Empty rows show the empty state.',
    'Loading sets aria-busy and hides data.',
    'onRowClick receives the row.',
    'No axe violations.',
  ],
  guidelines: {
    do: [
      'Provide sortValue for numeric and date columns.',
      'Right-align numbers.',
      'Keep the first column as the identifier.',
    ],
    dont: ['Put more than ~7 columns on mobile.', 'Use for layout.', 'Rely on row click alone for navigation.'],
  },
};
