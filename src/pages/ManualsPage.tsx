import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { DataTable, FilterChips, PageHeader, SearchField, StatusChip, type Column } from '@/components';
import { getSystem, listManuals, listSystems } from '@/data/repository';
import type { DocumentStatus, Manual, SystemId } from '@/data/types';
import { matchesQuery } from '@/features/search/matches';
import { useQueryParam } from '@/features/search/useQueryParam';

const columns: Column<Manual>[] = [
  { key: 'id', header: 'Document', width: 110, sortValue: (m) => m.id, render: (m) => <Link href={`/manuals/${m.id}`} sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{m.id}</Link> },
  { key: 'title', header: 'Title', sortValue: (m) => m.title, render: (m) => <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{m.title}</Typography> },
  { key: 'system', header: 'System', hideOnMobile: true, sortValue: (m) => getSystem(m.systemId)?.name ?? '', render: (m) => getSystem(m.systemId)?.name },
  { key: 'rev', header: 'Rev', width: 60, hideOnMobile: true, render: (m) => m.revision },
  { key: 'updated', header: 'Updated', width: 120, hideOnMobile: true, sortValue: (m) => m.updated, render: (m) => m.updated },
  { key: 'status', header: 'Status', width: 120, sortValue: (m) => m.status, render: (m) => <StatusChip status={m.status} /> },
];

const STATUSES: { value: DocumentStatus; label: string }[] = [
  { value: 'approved', label: 'Approved' },
  { value: 'in-review', label: 'In review' },
  { value: 'draft', label: 'Draft' },
];

export function ManualsPage() {
  const [q, setQ] = useQueryParam('q');
  const [system, setSystem] = useQueryParam<SystemId>('system');
  const [status, setStatus] = useQueryParam<DocumentStatus>('status');
  const all = listManuals();

  const rows = useMemo(
    () =>
      all.filter(
        (m) =>
          (!system || m.systemId === system) &&
          (!status || m.status === status) &&
          matchesQuery(q, m.id, m.title, m.summary, m.tags.join(' '), getSystem(m.systemId)?.name),
      ),
    [all, q, system, status],
  );

  return (
    <>
      <PageHeader
        overline="Engineering manuals"
        title="Technical Documentation"
        description="Revision-controlled service manuals, assembly guides and inspection procedures, linked to the parts and manufacturing processes they govern."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Engineering Manuals' }]}
      />
      <Card sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ maxWidth: 480 }}>
            <SearchField value={q ?? ''} onChange={setQ} label="Filter manuals" placeholder="Filter by title, ID or keyword…" />
          </Box>
          <FilterChips
            label="System"
            value={system}
            onChange={setSystem}
            options={listSystems()
              .map((s) => ({ value: s.id, label: s.name, count: all.filter((m) => m.systemId === s.id).length }))
              .filter((o) => o.count > 0)}
          />
          <FilterChips label="Status" value={status} onChange={setStatus} options={STATUSES} />
        </Box>
        <Typography variant="body2" color="text.secondary" role="status" sx={{ mb: 2 }}>
          {rows.length} of {all.length} manuals
        </Typography>
        <DataTable
          caption="Engineering manuals"
          columns={columns}
          rows={rows}
          getRowId={(m) => m.id}
          getRowHref={(m) => `/manuals/${m.id}`}
          initialSort={{ key: 'id', direction: 'asc' }}
          emptyTitle="No manuals match these filters"
          emptyDescription="Try removing a filter or searching for a system name."
        />
      </Card>
    </>
  );
}
