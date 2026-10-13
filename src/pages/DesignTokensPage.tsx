import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components';
import { contrastRatio, wcagLevel } from '@/theme/contrast';
import { elevation, palette, radius, semantic, spacing, typography, type SemanticRole } from '@/theme/tokens';

/** Foreground roles and the background they are checked against. */
const CONTRAST_PAIRS: [SemanticRole, SemanticRole][] = [
  ['textPrimary', 'surface'],
  ['textSecondary', 'surface'],
  ['primary', 'surface'],
  ['onPrimary', 'primary'],
  ['success', 'surface'],
  ['warning', 'surface'],
  ['info', 'surface'],
];

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <Box component="section" aria-labelledby={id} sx={{ mb: 10 }}>
      <Typography id={id} variant="h2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 720 }}>{description}</Typography>
      {children}
    </Box>
  );
}

const Mono = ({ children }: { children: ReactNode }) => (
  <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 12 }}>{children}</Box>
);

export default function DesignTokensPage() {
  return (
    <>
      <PageHeader
        overline="Design system"
        title="Design Tokens"
        description={<>Rendered directly from <Mono>src/theme/tokens.ts</Mono>, the single source of truth consumed by the MUI theme. Contrast ratios are computed live and enforced in unit tests.</>}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Design Tokens' }]}
      />

      <Section id="tokens-palette" title="Palette" description="Raw color scales. Components never reference these directly — they use semantic roles.">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Object.entries(palette).map(([name, scale]) => (
            <Box key={name}>
              <Typography variant="h5" component="h3" sx={{ textTransform: 'capitalize', mb: 1.5 }}>{name}</Typography>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))', gap: 2 }}>
                {Object.entries(scale).map(([step, hex]) => (
                  <Box component="li" key={step}>
                    <Box sx={{ height: 48, borderRadius: 1, bgcolor: hex, border: 1, borderColor: 'divider' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 600, mt: 1 }}>{name}.{step}</Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'monospace' }}>{hex}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Section>

      <Section id="tokens-semantic" title="Semantic roles" description="What components use. Each role resolves per color scheme and is exposed as a CSS variable (e.g. --toyo-palette-primary-main).">
        <Card sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label="Semantic color roles">
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Light</TableCell>
                <TableCell>Dark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Object.keys(semantic.light) as SemanticRole[]).map((role) => (
                <TableRow key={role}>
                  <TableCell><Mono>{role}</Mono></TableCell>
                  {(['light', 'dark'] as const).map((s) => (
                    <TableCell key={s}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 20, height: 20, borderRadius: 0.75, bgcolor: semantic[s][role], border: 1, borderColor: 'divider', flexShrink: 0 }} />
                        <Mono>{semantic[s][role]}</Mono>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>

      <Section id="tokens-contrast" title="Contrast" description="WCAG 2.2 contrast for every text-on-surface pairing the components use. Body text requires AA (4.5:1).">
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {(['light', 'dark'] as const).map((s) => (
            <Card key={s} sx={{ p: 4 }}>
              <Typography variant="h5" component="h3" sx={{ mb: 3, textTransform: 'capitalize' }}>{s} scheme</Typography>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {CONTRAST_PAIRS.map(([fg, bg]) => {
                  const ratio = contrastRatio(semantic[s][fg], semantic[s][bg]);
                  const level = wcagLevel(ratio);
                  return (
                    <Box component="li" key={fg} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box aria-hidden sx={{ width: 44, height: 32, borderRadius: 1, bgcolor: semantic[s][bg], color: semantic[s][fg], display: 'grid', placeItems: 'center', fontWeight: 700, border: 1, borderColor: 'divider' }}>Aa</Box>
                      <Typography sx={{ flex: 1, fontSize: 13 }}><Mono>{fg}</Mono> on <Mono>{bg}</Mono></Typography>
                      <Typography sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{ratio.toFixed(2)}:1</Typography>
                      <Chip size="small" label={level} color={level === 'Fail' || level === 'AA Large' ? 'warning' : 'success'} variant="outlined" />
                    </Box>
                  );
                })}
              </Box>
            </Card>
          ))}
        </Box>
      </Section>

      <Section id="tokens-type" title="Typography" description={`Inter for UI, Source Serif 4 for headings, a system monospace for identifiers.`}>
        <Card sx={{ p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Object.entries(typography.scale).map(([name, t]) => (
            <Box key={name} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' }, gap: 2, alignItems: 'baseline', borderBottom: 1, borderColor: 'divider', pb: 3 }}>
              <Box>
                <Mono>{name}</Mono>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{t.size}px / {t.lineHeight} / {t.weight}</Typography>
              </Box>
              <Typography
                component="p"
                sx={{
                  fontSize: Math.min(t.size, 40),
                  lineHeight: t.lineHeight,
                  fontWeight: t.weight,
                  letterSpacing: `${t.letterSpacing}px`,
                  fontFamily: ['h1', 'h2', 'h3'].includes(name) ? typography.fontFamily.serif : typography.fontFamily.sans,
                  textTransform: name === 'overline' ? 'uppercase' : undefined,
                }}
              >
                Front Brake Assembly
              </Typography>
            </Box>
          ))}
        </Card>
      </Section>

      <Section id="tokens-space" title="Spacing, radius & elevation" description={`A ${spacing.unit}px base grid: theme.spacing(n) = n × ${spacing.unit}px.`}>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" component="h3" sx={{ mb: 3 }}>Spacing</Typography>
            {[1, 2, 3, 4, 6, 8, 12].map((n) => (
              <Box key={n} sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1.5 }}>
                <Mono>{n}</Mono>
                <Box sx={{ height: 10, width: n * spacing.unit, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{n * spacing.unit}px</Typography>
              </Box>
            ))}
          </Card>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" component="h3" sx={{ mb: 3 }}>Radius</Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {Object.entries(radius).map(([name, r]) => (
                <Box key={name} sx={{ textAlign: 'center' }}>
                  <Box sx={{ width: 56, height: 56, border: 2, borderColor: 'text.primary', borderRadius: `${Math.min(r, 28)}px` }} />
                  <Mono>{name}</Mono>
                </Box>
              ))}
            </Box>
          </Card>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" component="h3" sx={{ mb: 3 }}>Elevation</Typography>
            <Box sx={{ display: 'flex', gap: 4 }}>
              {Object.entries(elevation).map(([name, shadow]) => (
                <Box key={name} sx={{ textAlign: 'center' }}>
                  <Box sx={{ width: 80, height: 56, borderRadius: 2, bgcolor: 'background.paper', boxShadow: shadow, mb: 1 }} />
                  <Mono>{name}</Mono>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      </Section>
    </>
  );
}
