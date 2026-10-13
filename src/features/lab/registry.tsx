import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {
  ConfirmDialog,
  DataTable,
  DomainCard,
  EmptyState,
  Eyebrow,
  FilterChips,
  MetaList,
  PageHeader,
  RelatedList,
  SearchField,
  StatCard,
  StatusChip,
  Wordmark,
  type ConfirmDialogProps,
  type DomainCardProps,
  type EmptyStateProps,
  type EyebrowProps,
  type PageHeaderProps,
  type SearchFieldProps,
  type StatCardProps,
  type Status,
  type StatusChipProps,
  type WordmarkProps,
} from '@/components';
import { getManual, listParts, partsForManual } from '@/data/repository';
import { defineEntry, type AnyLabEntry } from './types';
import { jsx, raw } from './jsx';

const STATUSES: readonly Status[] = ['approved', 'released', 'in-review', 'conditional', 'under-review', 'draft', 'obsolete'];

/* Stateful demos: the playground controls the static props, the demo owns interaction state. */

function SearchFieldDemo(p: Pick<SearchFieldProps, 'label' | 'placeholder' | 'showLabel' | 'size'>) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<string>();
  return (
    <Box sx={{ width: '100%', maxWidth: 420 }}>
      <SearchField {...p} value={value} onChange={setValue} onSubmit={setSubmitted} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Value: “{value}” {submitted !== undefined && `· Last submitted: “${submitted}”`}
      </Typography>
    </Box>
  );
}

function FilterChipsDemo({ label, allLabel, showCounts }: { label: string; allLabel: string; showCounts: boolean }) {
  const [value, setValue] = useState<'braking' | 'battery' | 'chassis' | null>(null);
  return (
    <FilterChips
      label={label}
      allLabel={allLabel}
      value={value}
      onChange={setValue}
      options={[
        { value: 'braking', label: 'Braking', count: showCounts ? 9 : undefined },
        { value: 'battery', label: 'Battery', count: showCounts ? 4 : undefined },
        { value: 'chassis', label: 'Chassis', count: showCounts ? 3 : undefined },
      ]}
    />
  );
}

function ConfirmDialogDemo(p: Pick<ConfirmDialogProps, 'title' | 'description' | 'confirmLabel' | 'cancelLabel' | 'tone'>) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string>();
  return (
    <Box>
      <Button variant="contained" color={p.tone === 'destructive' ? 'error' : 'primary'} onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      {result && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Result: {result}</Typography>}
      <ConfirmDialog
        {...p}
        open={open}
        onConfirm={() => {
          setOpen(false);
          setResult('confirmed');
        }}
        onCancel={() => {
          setOpen(false);
          setResult('cancelled');
        }}
      />
    </Box>
  );
}

const sampleParts = partsForManual(getManual('BR-0012')!).slice(0, 4);

export const registry: AnyLabEntry[] = [
  defineEntry<WordmarkProps>({
    id: 'wordmark',
    name: 'Wordmark',
    category: 'Brand',
    description: 'Brand lockup with monogram, wordmark and optional product line.',
    defaults: { size: 'md', product: 'Engineering Hub', tagline: 'Engineering knowledge & component platform' },
    controls: [
      { kind: 'select', name: 'size', options: ['sm', 'md'] },
      { kind: 'text', name: 'product' },
      { kind: 'text', name: 'tagline' },
    ],
    render: (p) => <Wordmark {...p} />,
    code: (p) => jsx('Wordmark', { ...p }, { defaults: { size: 'md' } }),
    props: [
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Visual size of the mark.' },
      { name: 'product', type: 'string', description: 'Product line next to the mark.' },
      { name: 'tagline', type: 'string', description: 'Descriptor under the product line; hidden without `product`.' },
    ],
    guidelines: {
      do: ['Use once per screen, in the app bar.', 'Wrap in a link to home with an accessible name.'],
      dont: ['Recolor the monogram outside the primary token.', 'Use as a decorative element in content.'],
    },
  }),

  defineEntry<EyebrowProps & { label: string }>({
    id: 'eyebrow',
    name: 'Eyebrow',
    category: 'Layout',
    description: 'Small uppercase label that introduces a section or card.',
    defaults: { label: 'Engineering manuals', accent: true, index: undefined, component: 'p', children: null },
    controls: [
      { kind: 'text', name: 'label' },
      { kind: 'boolean', name: 'accent' },
      { kind: 'number', name: 'index', min: 0, max: 12 },
      { kind: 'select', name: 'component', options: ['p', 'span', 'h2', 'h3'] },
    ],
    render: ({ label, ...p }) => <Eyebrow {...p}>{label}</Eyebrow>,
    code: ({ label, accent, index, component }) => jsx('Eyebrow', { accent, index, component }, { defaults: { component: 'p' }, children: label }),
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Label text.' },
      { name: 'accent', type: 'boolean', default: 'false', description: 'Shows the red accent rule.' },
      { name: 'index', type: 'number', description: 'Zero-padded sequence prefix ("01").' },
      { name: 'component', type: "'p' | 'span' | 'h2' | 'h3'", default: "'p'", description: 'Semantic element. Use a heading only when it is the section title.' },
    ],
    guidelines: {
      do: ['Pair with a heading that carries the real title.', 'Keep to two or three words.'],
      dont: ['Use as the only heading of a section.', 'Use accent on more than one label per view.'],
    },
  }),

  defineEntry<StatusChipProps>({
    id: 'status-chip',
    name: 'StatusChip',
    category: 'Data display',
    description: 'Lifecycle status for documents, parts and suppliers, mapped to a consistent tone.',
    defaults: { status: 'approved', size: 'small' },
    controls: [
      { kind: 'select', name: 'status', options: STATUSES },
      { kind: 'select', name: 'size', options: ['small', 'medium'] },
    ],
    render: (p) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        <StatusChip {...p} />
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', opacity: 0.85 }} aria-label="All statuses">
          {STATUSES.map((s) => <StatusChip key={s} status={s} />)}
        </Box>
      </Box>
    ),
    code: (p) => jsx('StatusChip', { ...p }, { defaults: { size: 'small' } }),
    props: [
      { name: 'status', type: STATUSES.map((s) => `'${s}'`).join(' | '), required: true, description: 'Domain status; label and tone are derived.' },
      { name: 'size', type: "'small' | 'medium'", default: "'small'", description: 'Chip size.' },
    ],
    guidelines: {
      do: ['Pass the domain status, not a color.', 'Show next to the revision it describes.'],
      dont: ['Override the tone per screen; add a status to the map instead.', 'Rely on color alone — the label is always rendered.'],
    },
  }),

  defineEntry<PageHeaderProps>({
    id: 'page-header',
    name: 'PageHeader',
    category: 'Layout',
    description: "Top-of-page heading block. Renders the page's single h1, breadcrumbs, meta and actions.",
    defaults: {
      title: 'Front Brake Assembly (Disc)',
      overline: 'BR-0012 · Braking System',
      description: 'Assembly, inspection and service information for the front disc brake.',
      breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Manuals', href: '/manuals' }, { label: 'BR-0012' }],
    },
    controls: [
      { kind: 'text', name: 'title' },
      { kind: 'text', name: 'overline' },
      { kind: 'text', name: 'description' },
    ],
    render: (p) => (
      <Box sx={{ width: '100%' }}>
        <PageHeader {...p} meta={<StatusChip status="approved" />} actions={<Button variant="outlined" size="small">Copy link</Button>} />
      </Box>
    ),
    code: (p) =>
      jsx('PageHeader', {
        title: p.title,
        overline: p.overline || undefined,
        description: typeof p.description === 'string' ? p.description || undefined : undefined,
        breadcrumbs: raw("[{ label: 'Home', href: '/' }, { label: 'BR-0012' }]"),
        meta: raw('<StatusChip status="approved" />'),
        actions: raw('<Button>Copy link</Button>'),
      }),
    props: [
      { name: 'title', type: 'string', required: true, description: 'Rendered as the page h1.' },
      { name: 'overline', type: 'string', description: 'Eyebrow above the title.' },
      { name: 'description', type: 'ReactNode', description: 'Lead paragraph.' },
      { name: 'breadcrumbs', type: 'Crumb[]', description: 'Trail; the last crumb is marked aria-current="page".' },
      { name: 'meta', type: 'ReactNode', description: 'Inline metadata under the title.' },
      { name: 'actions', type: 'ReactNode', description: 'Right-aligned actions; wrap on small screens.' },
    ],
    guidelines: {
      do: ['Use exactly once per page.', 'Keep actions to two; move the rest into a menu.'],
      dont: ['Put another h1 on the page.', 'Use for card or section titles.'],
    },
  }),

  defineEntry<DomainCardProps>({
    id: 'domain-card',
    name: 'DomainCard',
    category: 'Navigation',
    description: 'Navigational card for a knowledge domain. The whole card is a single link.',
    defaults: {
      index: 3,
      overline: 'Parts & Assemblies',
      title: 'Parts & Assemblies',
      description: 'Component information, part numbers and specifications.',
      image: '/img/brake-caliper.jpg',
      imageAlt: '',
      meta: ['29 parts', '17 assemblies'],
      href: '/parts',
    },
    controls: [
      { kind: 'number', name: 'index', min: 1, max: 9 },
      { kind: 'text', name: 'overline' },
      { kind: 'text', name: 'title' },
      { kind: 'text', name: 'description' },
      { kind: 'select', name: 'image', options: ['/img/brake-caliper.jpg', '/img/warehouse.jpg', '/img/assembly-line.jpg', '/img/manual.jpg'] },
    ],
    render: (p) => <Box sx={{ width: 300 }}><DomainCard {...p} /></Box>,
    code: (p) => jsx('DomainCard', { ...p, imageAlt: undefined, meta: raw(JSON.stringify(p.meta).replace(/"/g, "'")) }),
    props: [
      { name: 'title', type: 'string', required: true, description: 'Card heading (h3).' },
      { name: 'description', type: 'string', required: true, description: 'One-sentence summary.' },
      { name: 'image', type: 'string', required: true, description: 'Image URL, cropped to 2:1.' },
      { name: 'href', type: 'string', required: true, description: 'Destination; routed client-side.' },
      { name: 'overline', type: 'string', required: true, description: 'Domain label above the image.' },
      { name: 'index', type: 'number', description: 'Sequence number.' },
      { name: 'imageAlt', type: 'string', default: "''", description: 'Alt text; empty marks the image decorative.' },
      { name: 'meta', type: 'string[]', default: '[]', description: 'Footer facts, dot-separated.' },
    ],
    guidelines: {
      do: ['Render inside a list (ul/li) when showing several.', 'Leave imageAlt empty when the title already says it.'],
      dont: ['Nest buttons or links inside — the card is already a link.', 'Use for content that is not a destination.'],
    },
  }),

  defineEntry<{ dense: boolean; labelWidth: number }>({
    id: 'meta-list',
    name: 'MetaList',
    category: 'Data display',
    description: 'Two-column label/value list rendered as a semantic description list (dl).',
    defaults: { dense: false, labelWidth: 180 },
    controls: [
      { kind: 'boolean', name: 'dense' },
      { kind: 'number', name: 'labelWidth', min: 120, max: 300, step: 10 },
    ],
    render: (p) => (
      <Box sx={{ width: '100%', maxWidth: 520 }}>
        <MetaList
          {...p}
          items={[
            { label: 'Document number', value: 'BR-0012' },
            { label: 'System', value: 'Braking System' },
            { label: 'Applies to', value: 'Global Platform (2022–)' },
            { label: 'Estimated read time', value: '12 minutes' },
          ]}
        />
      </Box>
    ),
    code: (p) => jsx('MetaList', { dense: p.dense, labelWidth: p.labelWidth, items: raw("[{ label: 'System', value: 'Braking System' }]") }, { defaults: { labelWidth: 180 } }),
    props: [
      { name: 'items', type: 'MetaItem[]', required: true, description: '{ label: string; value: ReactNode }.' },
      { name: 'dense', type: 'boolean', default: 'false', description: 'Tighter rows for side panels.' },
      { name: 'labelWidth', type: 'number | string', default: "'38%'", description: 'Maximum label column width.' },
    ],
    guidelines: {
      do: ['Use for read-only properties of one record.'],
      dont: ['Use for tabular data across records — use DataTable.'],
    },
  }),

  defineEntry<StatCardProps>({
    id: 'stat-card',
    name: 'StatCard',
    category: 'Data display',
    description: 'A single key metric with label and optional context.',
    defaults: { label: 'On-time delivery', value: '98.4%', hint: 'Trailing 12 months' },
    controls: [
      { kind: 'text', name: 'label' },
      { kind: 'text', name: 'value' },
      { kind: 'text', name: 'hint' },
    ],
    render: (p) => <Box sx={{ width: 240 }}><StatCard {...p} hint={p.hint || undefined} /></Box>,
    code: (p) => jsx('StatCard', { label: p.label, value: String(p.value), hint: p.hint || undefined }),
    props: [
      { name: 'label', type: 'string', required: true, description: 'What is measured.' },
      { name: 'value', type: 'string | number', required: true, description: 'Pre-formatted value.' },
      { name: 'hint', type: 'string', description: 'Period or comparison context.' },
      { name: 'icon', type: 'ReactNode', description: 'Decorative icon (hidden from assistive tech).' },
    ],
    guidelines: {
      do: ['Format numbers before passing them in.', 'State the period in the hint.'],
      dont: ['Show more than four in a row.'],
    },
  }),

  defineEntry<EmptyStateProps & { withAction: boolean }>({
    id: 'empty-state',
    name: 'EmptyState',
    category: 'Feedback',
    description: 'Placeholder for empty lists and zero-result searches; announced via role="status".',
    defaults: { title: 'No manuals match these filters', description: 'Try removing a filter or searching for a system name.', withAction: true },
    controls: [
      { kind: 'text', name: 'title' },
      { kind: 'text', name: 'description' },
      { kind: 'boolean', name: 'withAction', label: 'action' },
    ],
    render: ({ withAction, ...p }) => <EmptyState {...p} action={withAction ? <Button variant="outlined">Clear filters</Button> : undefined} />,
    code: ({ withAction, title, description }) => jsx('EmptyState', { title, description, action: withAction ? raw('<Button>Clear filters</Button>') : undefined }),
    props: [
      { name: 'title', type: 'string', required: true, description: 'What is empty.' },
      { name: 'description', type: 'string', description: 'How to get results.' },
      { name: 'icon', type: 'ReactNode', description: 'Overrides the default icon.' },
      { name: 'action', type: 'ReactNode', description: 'Recovery action.' },
    ],
    guidelines: {
      do: ['Tell the user how to recover.'],
      dont: ['Blame the user ("You entered nothing").'],
    },
  }),

  defineEntry<{ title: string; withViewAll: boolean; empty: boolean }>({
    id: 'related-list',
    name: 'RelatedList',
    category: 'Navigation',
    description: 'Compact, linked list of related records — the backbone of cross-entity navigation.',
    defaults: { title: 'Parts', withViewAll: true, empty: false },
    controls: [
      { kind: 'text', name: 'title' },
      { kind: 'boolean', name: 'withViewAll', label: 'viewAllHref' },
      { kind: 'boolean', name: 'empty', label: 'empty items' },
    ],
    render: (p) => (
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <RelatedList
          title={p.title}
          viewAllHref={p.withViewAll ? '/parts' : undefined}
          items={p.empty ? [] : sampleParts.map((x) => ({ id: x.id, code: x.id, primary: x.name, secondary: x.assembly, trailing: <StatusChip status={x.status} />, href: `/parts/${x.id}` }))}
        />
      </Box>
    ),
    code: (p) => jsx('RelatedList', { title: p.title, viewAllHref: p.withViewAll ? '/parts' : undefined, items: raw("parts.map((p) => ({ id: p.id, code: p.id, primary: p.name, href: `/parts/${p.id}` }))") }),
    props: [
      { name: 'title', type: 'string', required: true, description: 'Section heading; the count is appended.' },
      { name: 'items', type: 'RelatedItem[]', required: true, description: '{ id, code?, primary, secondary?, trailing?, href }.' },
      { name: 'viewAllHref', type: 'string', description: 'Adds a "View all" link.' },
      { name: 'icon', type: 'ReactNode', default: 'document icon', description: 'Row icon.' },
      { name: 'emptyMessage', type: 'string', default: "'No related records.'", description: 'Shown when items is empty.' },
      { name: 'headingLevel', type: "'h2' | 'h3' | 'h4'", default: "'h3'", description: 'Keeps the document outline correct.' },
    ],
    guidelines: {
      do: ['Set headingLevel to fit the page outline.', 'Use code for identifiers engineers scan for.'],
      dont: ['Put more than ~10 items; link to a filtered list instead.'],
    },
  }),

  defineEntry<Pick<SearchFieldProps, 'label' | 'placeholder' | 'showLabel' | 'size'>>({
    id: 'search-field',
    name: 'SearchField',
    category: 'Inputs',
    description: 'Controlled search input. Escape clears, Enter submits.',
    defaults: { label: 'Filter manuals', placeholder: 'Filter by title, ID or keyword…', showLabel: false, size: 'small' },
    controls: [
      { kind: 'text', name: 'label' },
      { kind: 'text', name: 'placeholder' },
      { kind: 'boolean', name: 'showLabel' },
      { kind: 'select', name: 'size', options: ['small', 'medium'] },
    ],
    render: (p) => <SearchFieldDemo {...p} />,
    code: (p) => jsx('SearchField', { value: raw('query'), onChange: raw('setQuery'), ...p }, { defaults: { size: 'small' } }),
    props: [
      { name: 'value', type: 'string', required: true, description: 'Controlled value.' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Receives the string, not the event.' },
      { name: 'label', type: 'string', required: true, description: 'Accessible name; visible only with showLabel.' },
      { name: 'placeholder', type: 'string', description: 'Example input — never a substitute for the label.' },
      { name: 'showLabel', type: 'boolean', default: 'false', description: 'Renders a visible floating label.' },
      { name: 'onSubmit', type: '(value: string) => void', description: 'Called on Enter.' },
      { name: 'size', type: "'small' | 'medium'", default: "'small'", description: 'Input density.' },
      { name: 'fullWidth', type: 'boolean', default: 'true', description: 'Stretch to the container.' },
    ],
    guidelines: {
      do: ['Always provide a label, even when hidden.', 'Sync the value to the URL for list pages.'],
      dont: ['Debounce away immediate feedback on small, local datasets.'],
    },
  }),

  defineEntry<{ label: string; allLabel: string; showCounts: boolean }>({
    id: 'filter-chips',
    name: 'FilterChips',
    category: 'Inputs',
    description: 'Single-select chip filter with an "All" reset. Generic over the option value type.',
    defaults: { label: 'System', allLabel: 'All', showCounts: true },
    controls: [
      { kind: 'text', name: 'label' },
      { kind: 'text', name: 'allLabel' },
      { kind: 'boolean', name: 'showCounts', label: 'counts' },
    ],
    render: (p) => <FilterChipsDemo {...p} />,
    code: (p) =>
      jsx('FilterChips<SystemId>', {
        label: p.label,
        allLabel: p.allLabel,
        value: raw('system'),
        onChange: raw('setSystem'),
        options: raw(p.showCounts ? "[{ value: 'braking', label: 'Braking', count: 9 }]" : "[{ value: 'braking', label: 'Braking' }]"),
      }, { defaults: { allLabel: 'All' } }),
    props: [
      { name: 'label', type: 'string', required: true, description: 'Group label (aria-labelledby).' },
      { name: 'options', type: 'FilterOption<V>[]', required: true, description: '{ value: V; label: string; count?: number }.' },
      { name: 'value', type: 'V | null', required: true, description: 'Selected value; null means All.' },
      { name: 'onChange', type: '(value: V | null) => void', required: true, description: 'Selection handler.' },
      { name: 'allLabel', type: 'string', default: "'All'", description: 'Reset chip text.' },
    ],
    guidelines: {
      do: ['Use for ≤ 10 options.', 'Show counts when they help choose.'],
      dont: ['Use for multi-select — selection state is exposed as aria-pressed on one chip.'],
    },
  }),

  defineEntry<{ caption: string; sortable: boolean; empty: boolean }>({
    id: 'data-table',
    name: 'DataTable',
    category: 'Data display',
    description: 'Typed, sortable table. Generic over the row type so column renderers are type-checked.',
    defaults: { caption: 'Parts', sortable: true, empty: false },
    controls: [
      { kind: 'text', name: 'caption' },
      { kind: 'boolean', name: 'sortable' },
      { kind: 'boolean', name: 'empty', label: 'empty rows' },
    ],
    render: (p) => (
      <Box sx={{ width: '100%' }}>
        <DataTable
          caption={p.caption}
          rows={p.empty ? [] : listParts().slice(0, 5)}
          getRowId={(r) => r.id}
          columns={[
            { key: 'id', header: 'Part no.', render: (r) => <Box component="span" sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{r.id}</Box>, sortValue: p.sortable ? (r) => r.id : undefined },
            { key: 'name', header: 'Name', render: (r) => r.name, sortValue: p.sortable ? (r) => r.name : undefined },
            { key: 'kg', header: 'Weight (kg)', align: 'right', render: (r) => r.weightKg, sortValue: p.sortable ? (r) => r.weightKg : undefined },
            { key: 'status', header: 'Status', render: (r) => <StatusChip status={r.status} /> },
          ]}
        />
      </Box>
    ),
    code: (p) =>
      `const columns: Column<Part>[] = [\n  { key: 'id', header: 'Part no.', render: (p) => p.id${p.sortable ? ', sortValue: (p) => p.id' : ''} },\n  { key: 'kg', header: 'Weight', align: 'right', render: (p) => p.weightKg${p.sortable ? ', sortValue: (p) => p.weightKg' : ''} },\n];\n\n` +
      jsx('DataTable', { caption: p.caption, columns: raw('columns'), rows: raw('parts'), getRowId: raw('(p) => p.id'), getRowHref: raw('(p) => `/parts/${p.id}`') }),
    props: [
      { name: 'caption', type: 'string', required: true, description: 'Accessible table name.' },
      { name: 'columns', type: 'Column<T>[]', required: true, description: '{ key, header, render, sortValue?, align?, width?, hideOnMobile? }.' },
      { name: 'rows', type: 'T[]', required: true, description: 'Row data.' },
      { name: 'getRowId', type: '(row: T) => string', required: true, description: 'Stable React key.' },
      { name: 'getRowHref', type: '(row: T) => string', description: 'Makes rows clickable. Also render a real link in the first cell for keyboard users.' },
      { name: 'initialSort', type: "{ key: string; direction: 'asc' | 'desc' }", description: 'Initial sort.' },
      { name: 'emptyTitle', type: 'string', default: "'No results'", description: 'EmptyState title.' },
    ],
    guidelines: {
      do: ['Provide sortValue for numbers so they sort numerically.', 'Hide secondary columns on mobile with hideOnMobile.'],
      dont: ['Rely on row click alone for navigation.', 'Use for > 500 rows without virtualization.'],
    },
  }),

  defineEntry<Pick<ConfirmDialogProps, 'title' | 'description' | 'confirmLabel' | 'cancelLabel' | 'tone'>>({
    id: 'confirm-dialog',
    name: 'ConfirmDialog',
    category: 'Feedback',
    description: 'Two-action confirmation dialog with labelled title, safe default focus and Escape-to-cancel.',
    defaults: {
      title: 'Supersede revision B?',
      description: 'BR-0012 Rev B will be marked superseded. Linked manufacturing processes will reference the new revision.',
      confirmLabel: 'Supersede',
      cancelLabel: 'Cancel',
      tone: 'destructive',
    },
    controls: [
      { kind: 'text', name: 'title' },
      { kind: 'text', name: 'description' },
      { kind: 'text', name: 'confirmLabel' },
      { kind: 'text', name: 'cancelLabel' },
      { kind: 'select', name: 'tone', options: ['default', 'destructive'] },
    ],
    render: (p) => <ConfirmDialogDemo {...p} />,
    code: (p) =>
      jsx('ConfirmDialog', {
        open: raw('open'),
        title: p.title,
        description: typeof p.description === 'string' ? p.description : undefined,
        confirmLabel: p.confirmLabel,
        cancelLabel: p.cancelLabel,
        tone: p.tone,
        onConfirm: raw('handleConfirm'),
        onCancel: raw('() => setOpen(false)'),
      }, { defaults: { confirmLabel: 'Confirm', cancelLabel: 'Cancel', tone: 'default' } }),
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Visibility.' },
      { name: 'title', type: 'string', required: true, description: 'Phrase as a question.' },
      { name: 'description', type: 'ReactNode', description: 'Consequences of confirming.' },
      { name: 'confirmLabel', type: 'string', default: "'Confirm'", description: 'Use a verb ("Supersede"), not "OK".' },
      { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Safe action; receives initial focus.' },
      { name: 'tone', type: "'default' | 'destructive'", default: "'default'", description: 'Destructive styles the confirm action as an error.' },
      { name: 'onConfirm', type: '() => void', required: true, description: 'Confirm handler.' },
      { name: 'onCancel', type: '() => void', required: true, description: 'Cancel, Escape and backdrop click.' },
    ],
    guidelines: {
      do: ['Name the object and the consequence.', 'Use for irreversible or wide-impact actions only.'],
      dont: ['Stack dialogs.', 'Use for information — use an inline Alert.'],
    },
  }),
];

export const getEntry = (id: string) => registry.find((e) => e.id === id);
