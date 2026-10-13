import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { MetaList, PageHeader, RelatedList, StatusChip } from '@/components';
import { getPart, getSystem, listParts, manualsForPart, suppliersForPart } from '@/data/repository';
import { NotFoundPage } from './NotFoundPage';

export function PartDetailPage() {
  const { partId = '' } = useParams();
  const part = getPart(partId);
  if (!part) return <NotFoundPage entity="Part" />;

  const system = getSystem(part.systemId);
  const suppliers = suppliersForPart(part);
  const manuals = manualsForPart(part.id);
  const siblings = listParts().filter((p) => p.assembly === part.assembly && p.id !== part.id);

  return (
    <>
      <PageHeader
        overline={`${part.id} · ${part.assembly}`}
        title={part.name}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Parts & Assemblies', href: '/parts' }, { label: part.id }]}
        meta={
          <>
            <StatusChip status={part.status} />
            <Typography variant="body2" color="text.secondary">Rev {part.revision}</Typography>
          </>
        }
        description={part.description}
        actions={
          <Button
            variant="contained"
            size="small"
            startIcon={<AutoAwesomeOutlinedIcon />}
            href={`/assistant?q=${encodeURIComponent(`Which manuals reference ${part.id}?`)}`}
          >
            Ask assistant
          </Button>
        }
      />
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{ p: { xs: 4, md: 6 }, display: 'grid', gap: 6, gridTemplateColumns: { xs: '1fr', md: part.image ? '1fr 1fr' : '1fr' } }}>
            {part.image && (
              <Box component="img" src={part.image} alt={`${part.name} reference photograph`} sx={{ width: '100%', borderRadius: 1, objectFit: 'cover', aspectRatio: '4 / 3' }} />
            )}
            <Box>
              <Typography variant="h2" sx={{ fontSize: 20, mb: 3 }}>Specification</Typography>
              <MetaList
                items={[
                  { label: 'Part number', value: <Box component="span" sx={{ fontFamily: 'monospace' }}>{part.id}</Box> },
                  { label: 'System', value: system ? <Link href={`/systems/${system.id}`}>{system.name}</Link> : '—' },
                  { label: 'Assembly', value: part.assembly },
                  { label: 'Material', value: part.material },
                  { label: 'Mass', value: `${part.weightKg} kg` },
                  { label: 'Revision', value: part.revision },
                ]}
              />
            </Box>
          </Card>
          <Card sx={{ p: 4 }}>
            <RelatedList
              title="Referenced in manuals"
              headingLevel="h2"
              emptyMessage="No manual references this part yet."
              items={manuals.map((m) => ({ id: m.id, code: m.id, primary: m.title, secondary: `Rev ${m.revision}`, trailing: <StatusChip status={m.status} />, href: `/manuals/${m.id}` }))}
            />
          </Card>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{ p: 4 }}>
            <RelatedList
              title="Sources"
              headingLevel="h2"
              icon={<LocalShippingOutlinedIcon fontSize="small" />}
              items={suppliers.map((s, i) => ({
                id: s.id,
                code: s.id,
                primary: s.name,
                secondary: `${s.country} · ${s.leadTimeDays} d lead`,
                trailing: <Chip size="small" label={i === 0 ? 'Primary' : 'Alternate'} variant={i === 0 ? 'filled' : 'outlined'} />,
                href: `/suppliers/${s.id}`,
              }))}
            />
          </Card>
          <Card sx={{ p: 4 }}>
            <RelatedList
              title={`Also in ${part.assembly}`}
              headingLevel="h2"
              icon={<SettingsOutlinedIcon fontSize="small" />}
              emptyMessage="This is the only part in its assembly."
              items={siblings.map((p) => ({ id: p.id, code: p.id, primary: p.name, href: `/parts/${p.id}` }))}
            />
          </Card>
        </Box>
      </Box>
    </>
  );
}
