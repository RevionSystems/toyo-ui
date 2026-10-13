import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { PageHeader } from '@/components';

const PRACTICES = [
  { title: 'Semantic structure', body: 'One h1 per page via PageHeader; heading levels are configurable on RelatedList and DomainCard so outlines never skip. Lists render as ul/li, properties as dl.' },
  { title: 'Keyboard', body: 'Skip link to main content; focus moves to main on route change; "/" focuses global search; dialogs trap focus and start on the safe action; every row-click target also has a real link.' },
  { title: 'Names & state', body: 'Icon-only buttons have labels; filter chips expose aria-pressed; active navigation uses aria-current="page"; sortable headers expose aria-sort; result counts and assistant answers are live regions.' },
  { title: 'Color & contrast', body: 'All text/background token pairs meet WCAG AA (4.5:1) in light and dark schemes, enforced by unit tests and re-checked by axe in a real browser. Status is never conveyed by color alone.' },
  { title: 'Responsive', body: 'Navigation collapses into a modal drawer below 1200px; tables hide secondary columns on small screens; layouts are verified for zero horizontal overflow on a 412px phone viewport.' },
];

const CHECKS = [
  { layer: 'Token contrast', tool: 'Vitest', scope: 'Every semantic text/background pair, both schemes', cmd: 'npm test' },
  { layer: 'Component a11y', tool: 'Vitest + axe-core (jsdom)', scope: 'Every Component Lab entry with default props', cmd: 'npm test' },
  { layer: 'Route a11y', tool: 'Vitest + axe-core (jsdom)', scope: 'Every route: single h1, no axe violations', cmd: 'npm test' },
  { layer: 'Browser a11y', tool: 'Playwright + @axe-core/playwright', scope: '12 pages × light/dark, WCAG 2.2 AA incl. color contrast', cmd: 'npm run test:e2e' },
  { layer: 'Keyboard & responsive', tool: 'Playwright', scope: 'Skip link, drawer navigation, no horizontal overflow on mobile', cmd: 'npm run test:e2e' },
  { layer: 'Static analysis', tool: 'ESLint + jsx-a11y', scope: 'All TSX', cmd: 'npm run lint' },
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        overline="Platform quality"
        title="Accessibility & Testing"
        description="How Toyo-ui targets WCAG 2.2 AA, and the automated checks that keep it there."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Accessibility & Testing' }]}
      />
      <Box component="section" aria-labelledby="practices-title" sx={{ mb: 8 }}>
        <Typography id="practices-title" variant="h2" sx={{ mb: 4 }}>Practices</Typography>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' } }}>
          {PRACTICES.map((p) => (
            <Card component="li" key={p.title} sx={{ p: 4 }}>
              <Typography variant="h4" component="h3" sx={{ mb: 1.5 }}>{p.title}</Typography>
              <Typography variant="body2" color="text.secondary">{p.body}</Typography>
            </Card>
          ))}
        </Box>
      </Box>
      <Box component="section" aria-labelledby="checks-title">
        <Typography id="checks-title" variant="h2" sx={{ mb: 1 }}>Automated checks</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Automated tools catch roughly a third to half of accessibility issues. Manual screen-reader passes are still required before release —
          see <Link href="https://www.w3.org/WAI/WCAG22/quickref/" underline="always">WCAG 2.2 quick reference</Link>.
        </Typography>
        <Card sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label="Automated accessibility and quality checks">
            <TableHead>
              <TableRow>
                <TableCell>Layer</TableCell>
                <TableCell>Tool</TableCell>
                <TableCell>Scope</TableCell>
                <TableCell>Command</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CHECKS.map((c) => (
                <TableRow key={c.layer}>
                  <TableCell sx={{ fontWeight: 600 }}>{c.layer}</TableCell>
                  <TableCell>{c.tool}</TableCell>
                  <TableCell>{c.scope}</TableCell>
                  <TableCell><Box component="code" sx={{ fontFamily: 'monospace', fontSize: 12, whiteSpace: 'nowrap' }}>{c.cmd}</Box></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </>
  );
}
