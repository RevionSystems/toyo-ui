import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui';
import { CATALOG, COMPONENT_IDS } from '@shared/catalog';
import { Mono, Section } from './Section';

const PRACTICES = [
  {
    title: 'Names first',
    body: 'Every input requires a label at the type level; icon-only actions need aria-label; tables need a caption.',
  },
  {
    title: 'Keyboard',
    body: 'Native elements first. Skip link, focus moved to main on navigation, ⌘K search, dialogs trap and restore focus.',
  },
  {
    title: 'Visible focus',
    body: 'One global :focus-visible ring (2px, ≥ 3:1 contrast) that components cannot accidentally remove.',
  },
  {
    title: 'Announcements',
    body: 'Alerts choose assertive vs polite by severity; loading and empty states are status regions.',
  },
  {
    title: 'Color',
    body: 'Every text token pair meets 4.5:1 in both schemes (unit-tested). Status always has a text label.',
  },
  { title: 'Motion', body: 'Animations and transitions are reduced to near-zero under prefers-reduced-motion.' },
];

const CHECKS = [
  ['Token contrast', 'Vitest', 'Every semantic text pair, both schemes; focus ring 3:1', 'npm test'],
  [
    'Component behavior',
    'Vitest + Testing Library',
    'Roles, names, keyboard, focus, aria-* states per component',
    'npm test',
  ],
  ['Component axe', 'Vitest + axe-core (jsdom)', 'Every lab entry: playground + gallery', 'npm test'],
  [
    'Page axe with contrast',
    'Playwright + @axe-core/playwright',
    'All component pages, light and dark',
    'npm run test:e2e',
  ],
  ['Live preview check', 'axe-core in the browser', 'Run from the Accessibility tab on any component', 'Component Lab'],
  ['Static analysis', 'eslint-plugin-jsx-a11y', 'All TSX', 'npm run lint'],
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        overline="Foundations"
        title="Accessibility"
        description="Toyo-ui targets WCAG 2.2 AA. These are the practices built into the library and the checks that enforce them."
      />
      <Box sx={{ mb: 6, maxWidth: 900 }}>
        <Alert severity="info" title="Automated checks are not conformance" announce={false}>
          Automated tools catch a subset of issues. Screen-reader, zoom and forced-colors testing are still required
          before release — see the gaps listed below.
        </Alert>
      </Box>
      <Section id="practices" title="Built-in practices">
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
          }}
        >
          {PRACTICES.map((p) => (
            <Card component="li" key={p.title} sx={{ p: 4 }}>
              <Typography variant="h3" component="h3" sx={{ mb: 1 }}>
                {p.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {p.body}
              </Typography>
            </Card>
          ))}
        </Box>
      </Section>
      <Section id="checks" title="Automated checks">
        <Card sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label="Automated accessibility checks">
            <TableHead>
              <TableRow>
                <TableCell>Check</TableCell>
                <TableCell>Tool</TableCell>
                <TableCell>Scope</TableCell>
                <TableCell>Where</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CHECKS.map(([check, tool, scope, where]) => (
                <TableRow key={check}>
                  <TableCell sx={{ fontWeight: 600 }}>{check}</TableCell>
                  <TableCell>{tool}</TableCell>
                  <TableCell>{scope}</TableCell>
                  <TableCell>
                    <Mono>{where}</Mono>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>
      <Section id="per-component" title="Per-component requirements">
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
          {COMPONENT_IDS.map((id) => (
            <Card key={id} sx={{ p: 4 }}>
              <Typography variant="h3" component="h3" sx={{ mb: 1.5 }}>
                <Link href={`/components/${id}`}>{CATALOG[id].name}</Link>
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 4, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {CATALOG[id].accessibility.map((a) => (
                  <Typography key={a} component="li" variant="body2">
                    {a}
                  </Typography>
                ))}
              </Box>
            </Card>
          ))}
        </Box>
      </Section>
      <Section id="gaps" title="Not yet verified">
        <Box component="ul" sx={{ m: 0, pl: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            'Screen-reader passes (VoiceOver + Safari, NVDA + Firefox) on the Component Lab.',
            '200% zoom and WCAG text-spacing overrides.',
            'Windows High Contrast / forced-colors mode.',
            'Dialog and Alert announcement timing across screen readers.',
          ].map((g) => (
            <Typography key={g} component="li">
              {g}
            </Typography>
          ))}
        </Box>
      </Section>
    </>
  );
}
