import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { MetaList, PageHeader, RelatedList, StatCard, StatusChip } from '@/components';
import { getSupplier, manualsForPart, partsForSupplier } from '@/data/repository';
import type { Manual } from '@/data/types';
import { NotFoundPage } from './NotFoundPage';

export function SupplierDetailPage() {
  const { supplierId = '' } = useParams();
  const supplier = getSupplier(supplierId);
  if (!supplier) return <NotFoundPage entity="Supplier" />;

  const parts = partsForSupplier(supplier.id);
  const manuals = [...new Map(parts.flatMap((p) => manualsForPart(p.id)).map((m): [string, Manual] => [m.id, m])).values()];
  const primaryCount = parts.filter((p) => p.supplierIds[0] === supplier.id).length;

  return (
    <>
      <PageHeader
        overline={`${supplier.id} · ${supplier.region}`}
        title={supplier.name}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Suppliers', href: '/suppliers' }, { label: supplier.id }]}
        meta={<StatusChip status={supplier.status} />}
      />
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, mb: 4 }}>
        <StatCard label="Parts supplied" value={parts.length} hint={`${primaryCount} as primary source`} />
        <StatCard label="Lead time" value={`${supplier.leadTimeDays} d`} />
        <StatCard label="On-time delivery" value={`${supplier.onTimeRate.toFixed(1)}%`} hint="Trailing 12 months" />
        <StatCard label="Linked manuals" value={manuals.length} />
      </Box>
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, alignItems: 'start' }}>
        <Card sx={{ p: 4 }}>
          <RelatedList
            title="Parts supplied"
            headingLevel="h2"
            icon={<SettingsOutlinedIcon fontSize="small" />}
            items={parts.map((p) => ({
              id: p.id,
              code: p.id,
              primary: p.name,
              secondary: p.assembly,
              trailing: <Chip size="small" label={p.supplierIds[0] === supplier.id ? 'Primary' : 'Alternate'} variant={p.supplierIds[0] === supplier.id ? 'filled' : 'outlined'} />,
              href: `/parts/${p.id}`,
            }))}
          />
        </Card>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Profile</Typography>
            <MetaList
              dense
              items={[
                { label: 'Country', value: supplier.country },
                { label: 'Region', value: supplier.region },
                { label: 'Capabilities', value: supplier.capabilities.join(', ') },
                { label: 'Certifications', value: supplier.certifications.join(', ') },
              ]}
            />
          </Card>
          <Card sx={{ p: 4 }}>
            <RelatedList
              title="Manuals covering these parts"
              headingLevel="h2"
              items={manuals.map((m) => ({ id: m.id, code: m.id, primary: m.title, href: `/manuals/${m.id}` }))}
            />
          </Card>
        </Box>
      </Box>
    </>
  );
}
