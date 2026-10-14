import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { CodeBlock } from '@/components/common/CodeBlock';
import { Eyebrow } from '@/components/layout/Eyebrow';
import { Button, StatusBadge } from '@/components/ui';
import { testReport, testsForComponent } from '@/features/documentation/testReport';
import { CATALOG, CATEGORIES, COMPONENT_IDS, componentsInCategory, type ComponentId } from '@shared/catalog';

const PROPS_DOCUMENTED = COMPONENT_IDS.reduce((n, id) => n + CATALOG[id].props.length, 0);

function testBadge(id: ComponentId) {
  const tests = testsForComponent(id, testReport).flatMap((g) => g.tests);
  if (!tests.length) return <StatusBadge tone="neutral" label="No report" showDot={false} />;
  const failed = tests.filter((t) => t.status === 'failed').length;
  return failed ? (
    <StatusBadge tone="error" label={`${failed} failing`} />
  ) : (
    <StatusBadge tone="success" label={`${tests.length} tests passing`} />
  );
}

export default function OverviewPage() {
  const stats = [
    { label: 'Components', value: COMPONENT_IDS.length },
    { label: 'Documented props', value: PROPS_DOCUMENTED },
    { label: 'Automated tests', value: testReport ? testReport.totals.tests : '—' },
    { label: 'WCAG target', value: '2.2 AA' },
  ];

  return (
    <>
      <Box
        component="header"
        sx={{
          mb: 6,
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.2fr) minmax(0, 1fr)' },
          alignItems: 'end',
        }}
      >
        <Box>
          <Eyebrow accent>Component library</Eyebrow>
          <Typography variant="display" component="h1" sx={{ mt: 2, mb: 2, fontSize: { xs: 32, md: 40 } }}>
            Toyo-ui components
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 620, mb: 4 }}>
            Typed React components on Material UI, with live previews, generated examples, real TypeScript declarations,
            automated accessibility checks and an AI assistant that composes with the library.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button href="/components/button" endIcon={<ArrowForwardIcon />}>
              Open Component Lab
            </Button>
            <Button variant="outline" href="/engineering/assistant">
              Ask the AI assistant
            </Button>
          </Box>
        </Box>
        <Box component="dl" sx={{ m: 0, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {stats.map((s) => (
            <Card key={s.label} sx={{ p: 3 }}>
              <Typography component="dt" variant="caption" color="text.secondary">
                {s.label}
              </Typography>
              <Typography
                component="dd"
                sx={{ m: 0, fontSize: 26, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
              >
                {s.value}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      {CATEGORIES.map((c) => (
        <Box key={c.id} component="section" aria-labelledby={`cat-${c.id}`} sx={{ mb: 5 }}>
          <Typography id={`cat-${c.id}`} variant="h2" sx={{ mb: 2 }}>
            {c.label}
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
            }}
          >
            {componentsInCategory(c.id).map((id) => (
              <li key={id}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea
                    href={`/components/${id}`}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      justifyContent: 'flex-start',
                      gap: 1.5,
                    }}
                  >
                    <Typography variant="h3" component="h3">
                      {CATALOG[id].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      {CATALOG[id].summary}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      {testBadge(id)}
                      <Typography variant="caption" color="text.secondary">
                        {CATALOG[id].props.length} props
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </li>
            ))}
          </Box>
        </Box>
      ))}

      <Box
        component="section"
        aria-labelledby="quick-start"
        sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' } }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography id="quick-start" variant="h2" sx={{ mb: 1 }}>
            Quick start
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Wrap the app in the theme, then import components from the library barrel. See{' '}
            <Link href="/foundations/theme">Theme</Link> for customisation.
          </Typography>
          <CodeBlock
            label="Quick start example"
            code={`import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme/theme';
import { Button, TextField } from '@/components/ui';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <TextField label="Component name" />
      <Button>Create component</Button>
    </ThemeProvider>
  );
}`}
          />
        </Box>
      </Box>
    </>
  );
}
