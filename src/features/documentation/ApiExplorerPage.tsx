import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { FilterChips } from '@/components/common/FilterChips';
import { SearchField } from '@/components/common/SearchField';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, StatusBadge, type Column } from '@/components/ui';
import { CATALOG, COMPONENT_IDS, type ComponentId } from '@shared/catalog';

interface PropRow {
  key: string;
  component: ComponentId;
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}

const ROWS: PropRow[] = COMPONENT_IDS.flatMap((id) =>
  CATALOG[id].props.map((p) => ({
    key: `${id}.${p.name}`,
    component: id,
    name: p.name,
    type: p.type,
    default: p.default,
    required: !!p.required,
    description: p.description,
  })),
);

const COLUMNS: Column<PropRow>[] = [
  {
    key: 'component',
    header: 'Component',
    sortValue: (r) => CATALOG[r.component].name,
    render: (r) => <Link href={`/components/${r.component}`}>{CATALOG[r.component].name}</Link>,
  },
  {
    key: 'name',
    header: 'Prop',
    sortValue: (r) => r.name,
    render: (r) => (
      <Box
        component="span"
        sx={{ fontFamily: 'monospace', fontWeight: 600, display: 'inline-flex', gap: 1.5, alignItems: 'center' }}
      >
        {r.name}
        {r.required && <StatusBadge tone="info" label="required" showDot={false} />}
      </Box>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    render: (r) => (
      <Box component="code" sx={{ fontSize: 12, color: 'text.secondary', wordBreak: 'break-word' }}>
        {r.type}
      </Box>
    ),
  },
  {
    key: 'default',
    header: 'Default',
    hideOnMobile: true,
    render: (r) => (
      <Box component="code" sx={{ fontSize: 12 }}>
        {r.default ?? '—'}
      </Box>
    ),
  },
  {
    key: 'description',
    header: 'Description',
    hideOnMobile: true,
    render: (r) => <Typography variant="body2">{r.description}</Typography>,
  },
];

export default function ApiExplorerPage() {
  const [query, setQuery] = useState('');
  const [component, setComponent] = useState<ComponentId | null>(null);
  const [requiredOnly, setRequiredOnly] = useState<'required' | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter(
      (r) =>
        (!component || r.component === component) &&
        (!requiredOnly || r.required) &&
        (!q || `${CATALOG[r.component].name} ${r.name} ${r.type} ${r.description}`.toLowerCase().includes(q)),
    );
  }, [query, component, requiredOnly]);

  return (
    <>
      <PageHeader
        overline="Engineering"
        title="API Explorer"
        description="Every documented prop across the library in one searchable table. Documentation is checked against the real TypeScript interfaces by the registry tests."
      />
      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ maxWidth: 420 }}>
            <SearchField
              value={query}
              onChange={setQuery}
              label="Filter props"
              placeholder="Prop name, type or description…"
            />
          </Box>
          <FilterChips
            label="Component"
            value={component}
            onChange={setComponent}
            options={COMPONENT_IDS.map((id) => ({
              value: id,
              label: CATALOG[id].name,
              count: CATALOG[id].props.length,
            }))}
          />
          <FilterChips
            label="Show"
            allLabel="All props"
            value={requiredOnly}
            onChange={setRequiredOnly}
            options={[{ value: 'required', label: 'Required only' }]}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" role="status" sx={{ mb: 2 }}>
          {rows.length} of {ROWS.length} props
        </Typography>
        <DataTable
          caption="Component props"
          columns={COLUMNS}
          rows={rows}
          getRowId={(r) => r.key}
          initialSort={{ key: 'component', direction: 'asc' }}
        />
      </Card>
    </>
  );
}
