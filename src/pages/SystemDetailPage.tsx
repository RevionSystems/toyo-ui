import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useParams } from 'react-router-dom';
import { PageHeader, RelatedList, StatCard, StatusChip } from '@/components';
import { assembliesFor, getSystem, manualsForSystem, partsForSystem, proceduresForSystem, suppliersForPart } from '@/data/repository';
import { NotFoundPage } from './NotFoundPage';

export function SystemDetailPage() {
  const { systemId = '' } = useParams();
  const system = getSystem(systemId);
  if (!system) return <NotFoundPage entity="System" />;

  const manuals = manualsForSystem(system.id);
  const parts = partsForSystem(system.id);
  const procs = proceduresForSystem(system.id);
  const supplierCount = new Set(parts.flatMap((p) => suppliersForPart(p).map((s) => s.id))).size;

  return (
    <>
      <PageHeader
        overline="Vehicle system"
        title={system.name}
        description={system.description}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vehicle Systems', href: '/systems' }, { label: system.name }]}
      />
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, mb: 4 }}>
        <Box component="img" src={system.image} alt="" sx={{ width: '100%', height: '100%', minHeight: 200, objectFit: 'cover', borderRadius: 2 }} />
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <StatCard label="Manuals" value={manuals.length} />
          <StatCard label="Parts" value={parts.length} hint={`${assembliesFor(parts).size} assemblies`} />
          <StatCard label="Suppliers" value={supplierCount} />
          <StatCard label="Manufacturing processes" value={procs.length} />
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, alignItems: 'start' }}>
        <Card sx={{ p: 4 }}>
          <RelatedList title="Manuals" headingLevel="h2" viewAllHref={`/manuals?system=${system.id}`}
            items={manuals.map((m) => ({ id: m.id, code: m.id, primary: m.title, trailing: <StatusChip status={m.status} />, href: `/manuals/${m.id}` }))} />
        </Card>
        <Card sx={{ p: 4 }}>
          <RelatedList title="Parts" headingLevel="h2" icon={<SettingsOutlinedIcon fontSize="small" />} viewAllHref={`/parts?system=${system.id}`}
            items={parts.map((p) => ({ id: p.id, code: p.id, primary: p.name, href: `/parts/${p.id}` }))} />
        </Card>
        <Card sx={{ p: 4 }}>
          <RelatedList title="Manufacturing" headingLevel="h2" icon={<PrecisionManufacturingOutlinedIcon fontSize="small" />} viewAllHref={`/manufacturing?system=${system.id}`}
            emptyMessage="No manufacturing processes recorded for this system."
            items={procs.map((p) => ({ id: p.id, code: p.id, primary: p.name, secondary: p.station, href: `/manufacturing?q=${p.id}` }))} />
        </Card>
      </Box>
    </>
  );
}
