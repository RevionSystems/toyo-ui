import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { DataTable, FilterChips, PageHeader, SearchField, type Column } from '@/components';
import { getSystem, listProcedures, listSystems } from '@/data/repository';
import type { Procedure, SystemId } from '@/data/types';
import { matchesQuery } from '@/features/search/matches';
import { useQueryParam } from '@/features/search/useQueryParam';

const columns: Column<Procedure>[] = [
  { key: 'id', header: 'Process', width: 110, sortValue: (p) => p.id, render: (p) => <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.id}</Box> },
  { key: 'name', header: 'Name', sortValue: (p) => p.name, render: (p) => <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{p.name}</Typography> },
  { key: 'plant', header: 'Plant · Station', hideOnMobile: true, sortValue: (p) => p.plant, render: (p) => `${p.plant} · ${p.station}` },
  { key: 'cycle', header: 'Cycle time', align: 'right', hideOnMobile: true, sortValue: (p) => p.cycleTimeSec, render: (p) => `${p.cycleTimeSec} s` },
  {
    key: 'manuals',
    header: 'Governing manuals',
    render: (p) => (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {p.manualIds.map((id) => <Link key={id} href={`/manuals/${id}`} sx={{ fontFamily: 'monospace', fontSize: 13 }}>{id}</Link>)}
      </Box>
    ),
  },
];

export function ManufacturingPage() {
  const [q, setQ] = useQueryParam('q');
  const [system, setSystem] = useQueryParam<SystemId>('system');
  const all = listProcedures();
  const rows = useMemo(
    () => all.filter((p) => (!system || p.systemId === system) && matchesQuery(q, p.id, p.name, p.plant, p.station, getSystem(p.systemId)?.name)),
    [all, q, system],
  );

  return (
    <>
      <PageHeader
        overline="Manufacturing"
        title="Manufacturing Processes"
        description="Assembly stations, cycle times and the manuals that govern each process."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Manufacturing Processes' }]}
      />
      <Card sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ maxWidth: 480 }}>
            <SearchField value={q ?? ''} onChange={setQ} label="Filter processes" placeholder="Process, plant or station…" />
          </Box>
          <FilterChips
            label="System"
            value={system}
            onChange={setSystem}
            options={listSystems()
              .map((s) => ({ value: s.id, label: s.name, count: all.filter((p) => p.systemId === s.id).length }))
              .filter((o) => o.count > 0)}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" role="status" sx={{ mb: 2 }}>
          {rows.length} of {all.length} processes
        </Typography>
        <DataTable caption="Manufacturing processes" columns={columns} rows={rows} getRowId={(p) => p.id} initialSort={{ key: 'id', direction: 'asc' }} emptyTitle="No processes match" />
      </Card>
    </>
  );
}
