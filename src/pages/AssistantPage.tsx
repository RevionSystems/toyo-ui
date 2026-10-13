import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'react-router-dom';
import { MetaList, PageHeader } from '@/components';
import { platformStats } from '@/data/repository';
import { AssistantPanel } from '@/features/assistant/AssistantPanel';
import { configuredProvider } from '@/features/assistant/provider';

const STEPS = [
  { title: 'Understand', body: 'Detects the vehicle system (e.g. "caliper" → Braking) and the intent: overview, manuals, parts, suppliers or torque.' },
  { title: 'Retrieve', body: 'Ranks manuals by weighted keyword match, preferring approved documents in the detected system.' },
  { title: 'Expand', body: 'Follows relationships: manuals → referenced parts → approved suppliers. Explicit IDs like PT-3310-12A anchor the search.' },
  { title: 'Cite', body: 'Every record in the answer links to its source. Torque values cite the manual they come from.' },
];

export function AssistantPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const provider = configuredProvider();
  const stats = platformStats();

  return (
    <>
      <PageHeader
        overline="AI engineering assistant"
        title="Ask the engineering database"
        description="Find documentation, parts and suppliers in plain language. Answers are retrieved from the dataset and cite their sources."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI Engineering Assistant' }]}
        meta={<Chip size="small" variant="outlined" label={provider.id === 'local' ? 'Offline demo' : 'Backend proxy'} />}
      />
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, alignItems: 'start' }}>
        <Card sx={{ p: { xs: 4, md: 6 }, minHeight: 480 }}>
          <AssistantPanel key={q} variant="full" initialQuery={q} autoRun />
        </Card>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card component="section" aria-labelledby="how-title" sx={{ p: 4 }}>
            <Typography id="how-title" variant="h5" component="h2" sx={{ mb: 3 }}>How it works</Typography>
            <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3, counterReset: 'step' }}>
              {STEPS.map((s, i) => (
                <Box component="li" key={s.title} sx={{ display: 'flex', gap: 2.5 }}>
                  <Box aria-hidden sx={{ width: 24, height: 24, flexShrink: 0, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{i + 1}</Box>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{s.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.body}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
          <Card component="section" aria-labelledby="config-title" sx={{ p: 4 }}>
            <Typography id="config-title" variant="h5" component="h2" sx={{ mb: 2 }}>Configuration</Typography>
            <MetaList
              dense
              items={[
                { label: 'Provider', value: provider.label },
                { label: 'Live LLM', value: provider.id === 'local' ? 'No' : 'Via backend proxy' },
                { label: 'Indexed', value: `${stats.manuals} manuals · ${stats.parts} parts · ${stats.suppliers} suppliers` },
              ]}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontSize: 12 }}>
              Set <Box component="code" sx={{ fontFamily: 'monospace' }}>VITE_ASSISTANT_ENDPOINT</Box> to route questions through a
              backend that can call a model. Its answers are grounded: unknown record IDs are discarded, and failures
              fall back to the offline engine.
            </Typography>
          </Card>
        </Box>
      </Box>
    </>
  );
}
