import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { DataTable, FilterChips, PageHeader, SearchField, StatusChip, type Column } from '@/components';
import { getSupplier, getSystem, listParts, listSystems } from '@/data/repository';
import type { Part, PartStatus, SystemId } from '@/data/types';
import { matchesQuery } from '@/features/search/matches';
import { useQueryParam } from '@/features/search/useQueryParam';

const columns: Column<Part>[] = [
  { key: 'id', header: 'Part no.', width: 130, sortValue: (p) => p.id, render: (p) => <Link href={`/parts/${p.id}`} sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.id}</Link> },
  {
    key: 'name',
    header: 'Name',
    sortValue: (p) => p.name,
    render: (p) => (
      <>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{p.name}</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{p.assembly}</Typography>
      </>
    ),
  },
  { key: 'system', header: 'System', hideOnMobile: true, sortValue: (p) => getSystem(p.systemId)?.name ?? '', render: (p) => getSystem(p.systemId)?.name },
  { key: 'supplier', header: 'Primary supplier', hideOnMobile: true, render: (p) => getSupplier(p.supplierIds[0] ?? '')?.name ?? '—' },
  { key: 'weight', header: 'Weight (kg)', align: 'right', hideOnMobile: true, sortValue: (p) => p.weightKg, render: (p) => p.weightKg.toLocaleString('en-US') },
  { key: 'status', header: 'Status', width: 120, sortValue: (p) => p.status, render: (p) => <StatusChip status={p.status} /> },
];

const STATUSES: { value: PartStatus; label: string }[] = [
  { value: 'released', label: 'Released' },
  { value: 'in-review', label: 'In review' },
];

export function PartsPage() {
  const [q, setQ] = useQueryParam('q');
  const [system, setSystem] = useQueryParam<SystemId>('system');
  const [status, setStatus] = useQueryParam<PartStatus>('status');
  const all = listParts();

  const rows = useMemo(
    () =>
      all.filter(
        (p) =>
          (!system || p.systemId === system) &&
          (!status || p.status === status) &&
          matchesQuery(q, p.id, p.name, p.assembly, p.description, p.material),
      ),
    [all, q, system, status],
  );

  return (
    <>
      <PageHeader
        overline="Parts & assemblies"
        title="Parts & Assemblies"
        description="Released and in-review components with their assemblies, materials and approved sources."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Parts & Assemblies' }]}
      />
      <Card sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ maxWidth: 480 }}>
            <SearchField value={q ?? ''} onChange={setQ} label="Filter parts" placeholder="Part number, name, assembly or material…" />
          </Box>
          <FilterChips
            label="System"
            value={system}
            onChange={setSystem}
            options={listSystems().map((s) => ({ value: s.id, label: s.name, count: all.filter((p) => p.systemId === s.id).length }))}
          />
          <FilterChips label="Status" value={status} onChange={setStatus} options={STATUSES} />
        </Box>
        <Typography variant="body2" color="text.secondary" role="status" sx={{ mb: 2 }}>
          {rows.length} of {all.length} parts
        </Typography>
        <DataTable
          caption="Parts"
          columns={columns}
          rows={rows}
          getRowId={(p) => p.id}
          getRowHref={(p) => `/parts/${p.id}`}
          initialSort={{ key: 'id', direction: 'asc' }}
          emptyTitle="No parts match these filters"
        />
      </Card>
    </>
  );
}
