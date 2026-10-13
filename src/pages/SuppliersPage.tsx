import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { DataTable, FilterChips, PageHeader, SearchField, StatCard, StatusChip, type Column } from '@/components';
import { listSuppliers, partsForSupplier } from '@/data/repository';
import type { Supplier } from '@/data/types';
import { matchesQuery } from '@/features/search/matches';
import { useQueryParam } from '@/features/search/useQueryParam';

type Region = Supplier['region'];
const REGIONS: Region[] = ['Asia', 'Europe', 'North America'];

const columns: Column<Supplier>[] = [
  { key: 'id', header: 'ID', width: 100, sortValue: (s) => s.id, render: (s) => <Link href={`/suppliers/${s.id}`} sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.id}</Link> },
  {
    key: 'name',
    header: 'Supplier',
    sortValue: (s) => s.name,
    render: (s) => (
      <>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{s.name}</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.capabilities.join(', ')}</Typography>
      </>
    ),
  },
  { key: 'country', header: 'Country', hideOnMobile: true, sortValue: (s) => s.country, render: (s) => s.country },
  { key: 'parts', header: 'Parts', align: 'right', hideOnMobile: true, sortValue: (s) => partsForSupplier(s.id).length, render: (s) => partsForSupplier(s.id).length },
  { key: 'lead', header: 'Lead time', align: 'right', hideOnMobile: true, sortValue: (s) => s.leadTimeDays, render: (s) => `${s.leadTimeDays} d` },
  { key: 'otd', header: 'On-time', align: 'right', hideOnMobile: true, sortValue: (s) => s.onTimeRate, render: (s) => `${s.onTimeRate.toFixed(1)}%` },
  { key: 'status', header: 'Status', width: 130, sortValue: (s) => s.status, render: (s) => <StatusChip status={s.status} /> },
];

export function SuppliersPage() {
  const [q, setQ] = useQueryParam('q');
  const [region, setRegion] = useQueryParam<Region>('region');
  const all = listSuppliers();
  const rows = useMemo(
    () => all.filter((s) => (!region || s.region === region) && matchesQuery(q, s.id, s.name, s.country, s.capabilities.join(' '))),
    [all, q, region],
  );
  const avgOtd = all.reduce((n, s) => n + s.onTimeRate, 0) / all.length;
  const avgLead = all.reduce((n, s) => n + s.leadTimeDays, 0) / all.length;

  return (
    <>
      <PageHeader
        overline="Supply chain"
        title="Suppliers & Sourcing"
        description="Approved sources, lead times and delivery performance, with the parts each supplier provides."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Suppliers' }]}
      />
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, mb: 4 }}>
        <StatCard label="Suppliers" value={all.length} hint={`${REGIONS.length} regions`} />
        <StatCard label="Approved" value={all.filter((s) => s.status === 'approved').length} hint="Fully qualified" />
        <StatCard label="Avg. on-time delivery" value={`${avgOtd.toFixed(1)}%`} hint="Trailing 12 months" />
        <StatCard label="Avg. lead time" value={`${Math.round(avgLead)} d`} hint="Order to dock" />
      </Box>
      <Card sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ maxWidth: 480 }}>
            <SearchField value={q ?? ''} onChange={setQ} label="Filter suppliers" placeholder="Name, country or capability…" />
          </Box>
          <FilterChips label="Region" value={region} onChange={setRegion} options={REGIONS.map((r) => ({ value: r, label: r }))} />
        </Box>
        <Typography variant="body2" color="text.secondary" role="status" sx={{ mb: 2 }}>
          {rows.length} of {all.length} suppliers
        </Typography>
        <DataTable
          caption="Suppliers"
          columns={columns}
          rows={rows}
          getRowId={(s) => s.id}
          getRowHref={(s) => `/suppliers/${s.id}`}
          initialSort={{ key: 'name', direction: 'asc' }}
          emptyTitle="No suppliers match"
        />
      </Card>
    </>
  );
}
