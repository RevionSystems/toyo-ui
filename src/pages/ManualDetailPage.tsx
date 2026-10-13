import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import LinkIcon from '@mui/icons-material/Link';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, RelatedList, StatusChip } from '@/components';
import { getManual, getSystem, manualsForSystem, suppliersForManual } from '@/data/repository';
import { ManualTabs } from '@/features/manuals/ManualTabs';
import { NotFoundPage } from './NotFoundPage';

export function ManualDetailPage() {
  const { manualId = '' } = useParams();
  const manual = getManual(manualId);
  const [copied, setCopied] = useState(false);
  if (!manual) return <NotFoundPage entity="Manual" />;

  const system = getSystem(manual.systemId);
  const suppliers = suppliersForManual(manual);
  const siblings = manualsForSystem(manual.systemId).filter((m) => m.id !== manual.id);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      /* Clipboard can be unavailable (permissions, insecure origin); the URL bar still works. */
    }
  };

  return (
    <>
      <PageHeader
        overline={`${manual.id} · ${system?.name ?? ''}`}
        title={manual.title}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Engineering Manuals', href: '/manuals' }, { label: manual.id }]}
        meta={
          <>
            <StatusChip status={manual.status} />
            <Typography variant="body2" color="text.secondary">Rev {manual.revision}</Typography>
            <Typography variant="body2" color="text.secondary">Updated {manual.updated}</Typography>
          </>
        }
        actions={
          <>
            <Button variant="outlined" size="small" startIcon={<LinkIcon />} onClick={copyLink}>Copy link</Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<AutoAwesomeOutlinedIcon />}
              href={`/assistant?q=${encodeURIComponent(`Which parts and suppliers are associated with ${manual.id}?`)}`}
            >
              Ask assistant
            </Button>
          </>
        }
      />
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, alignItems: 'start' }}>
        <Card sx={{ p: { xs: 4, md: 6 } }}>
          <ManualTabs manual={manual} />
        </Card>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{ p: 4 }}>
            <RelatedList
              title="Suppliers"
              headingLevel="h2"
              icon={<LocalShippingOutlinedIcon fontSize="small" />}
              items={suppliers.map((s) => ({ id: s.id, code: s.id, primary: s.name, secondary: s.country, href: `/suppliers/${s.id}` }))}
            />
          </Card>
          <Card sx={{ p: 4 }}>
            <RelatedList
              title={`More in ${system?.name ?? 'this system'}`}
              headingLevel="h2"
              viewAllHref={`/manuals?system=${manual.systemId}`}
              items={siblings.map((m) => ({ id: m.id, code: m.id, primary: m.title, trailing: <StatusChip status={m.status} />, href: `/manuals/${m.id}` }))}
            />
          </Card>
        </Box>
      </Box>
      <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} message="Link copied to clipboard" />
    </>
  );
}
