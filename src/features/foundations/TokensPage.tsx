import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui';
import { contrastRatio, wcagLevel } from '@/theme/contrast';
import { palette, semantic, type SemanticRole } from '@/theme/tokens';
import { Mono, Section } from './Section';
import { CONTRAST_PAIRS, ROLE_TO_PALETTE, cssVarFor } from './tokenMeta';

const FLOW = [
  { title: 'tokens.ts', body: 'Plain data: palette scales and semantic roles per scheme.' },
  { title: 'createToyoTheme()', body: 'Maps roles into the MUI palette and component overrides.' },
  { title: 'CSS variables', body: 'MUI emits --toyo-* variables for light and dark.' },
  { title: 'Components', body: "Read roles by path, e.g. sx={{ color: 'primaryText' }}." },
];

const Swatch = ({ color }: { color: string }) => (
  <Box
    aria-hidden
    sx={{ width: 20, height: 20, borderRadius: 0.75, bgcolor: color, border: 1, borderColor: 'divider', flexShrink: 0 }}
  />
);

export default function TokensPage() {
  return (
    <>
      <PageHeader
        overline="Foundations"
        title="Colors & Tokens"
        description={
          <>
            Rendered from <Mono>src/theme/tokens.ts</Mono>, the single source of truth. Components never use raw palette
            values; they use semantic roles, which resolve per color scheme.
          </>
        }
      />

      <Section id="flow" title="How a token reaches a component">
        <Box
          component="ol"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          }}
        >
          {FLOW.map((step, i) => (
            <Card component="li" key={step.title} sx={{ p: 3, position: 'relative' }}>
              <Typography variant="overline" color="text.secondary">
                Step {i + 1}
              </Typography>
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 14 }}>{step.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {step.body}
              </Typography>
              {i < FLOW.length - 1 && (
                <ArrowForwardIcon
                  aria-hidden
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'absolute',
                    right: -14,
                    top: '50%',
                    mt: -1.5,
                    color: 'text.secondary',
                    bgcolor: 'background.default',
                    borderRadius: '50%',
                    zIndex: 1,
                  }}
                />
              )}
            </Card>
          ))}
        </Box>
      </Section>

      <Section
        id="roles"
        title="Semantic roles"
        description="What components use. Change a value in tokens.ts and every component, both schemes and the contrast tests update together."
      >
        <Card sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label="Semantic color roles">
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Light</TableCell>
                <TableCell>Dark</TableCell>
                <TableCell>MUI palette path</TableCell>
                <TableCell>CSS variable</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Object.keys(semantic.light) as SemanticRole[]).map((role) => (
                <TableRow key={role}>
                  <TableCell>
                    <Mono>{role}</Mono>
                  </TableCell>
                  {(['light', 'dark'] as const).map((s) => (
                    <TableCell key={s}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Swatch color={semantic[s][role]} />
                        <Mono>{semantic[s][role]}</Mono>
                      </Box>
                    </TableCell>
                  ))}
                  <TableCell>
                    <Mono>{ROLE_TO_PALETTE[role]}</Mono>
                  </TableCell>
                  <TableCell>
                    <Mono>{cssVarFor(role)}</Mono>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>

      <Section
        id="contrast"
        title="Contrast"
        description="WCAG 2.2 ratios for text/background pairs used by the components, computed from the tokens. tokens.test.ts fails the build if any text pair drops below 4.5:1."
      >
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {(['light', 'dark'] as const).map((s) => (
            <Card key={s} sx={{ p: 3 }}>
              <Typography variant="h3" component="h3" sx={{ mb: 2, textTransform: 'capitalize' }}>
                {s}
              </Typography>
              <Box
                component="ul"
                sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                {CONTRAST_PAIRS.map(([fg, bg]) => {
                  const ratio = contrastRatio(semantic[s][fg], semantic[s][bg]);
                  const level = wcagLevel(ratio);
                  return (
                    <Box component="li" key={`${fg}-${bg}`} sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Box
                        aria-hidden
                        sx={{
                          width: 40,
                          height: 28,
                          borderRadius: 1,
                          bgcolor: semantic[s][bg],
                          color: semantic[s][fg],
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                          border: 1,
                          borderColor: 'divider',
                        }}
                      >
                        Aa
                      </Box>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        <Mono>{fg}</Mono> on <Mono>{bg}</Mono>
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {ratio.toFixed(2)}:1
                      </Typography>
                      <StatusBadge
                        tone={level === 'Fail' || level === 'AA Large' ? 'error' : 'success'}
                        label={level}
                        showDot={false}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Card>
          ))}
        </Box>
      </Section>

      <Section id="palette" title="Palette scales" description="Raw scales the roles are drawn from.">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(palette).map(([name, scale]) => (
            <Box key={name}>
              <Typography variant="h4" component="h3" sx={{ textTransform: 'capitalize', mb: 1 }}>
                {name}
              </Typography>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  m: 0,
                  p: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
                  gap: 1.5,
                }}
              >
                {Object.entries(scale).map(([step, hex]) => (
                  <Box component="li" key={step}>
                    <Box sx={{ height: 40, borderRadius: 1, bgcolor: hex, border: 1, borderColor: 'divider' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 600, mt: 0.5 }}>
                      {name}.{step}
                    </Typography>
                    <Mono>{hex}</Mono>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Section>
    </>
  );
}
