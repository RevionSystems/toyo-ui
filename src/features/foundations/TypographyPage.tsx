import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography, { type TypographyProps } from '@mui/material/Typography';
import { CodeBlock } from '@/components/common/CodeBlock';
import { PageHeader } from '@/components/layout/PageHeader';
import { typography } from '@/theme/tokens';
import { Mono, Section } from './Section';

/** Scale token → MUI Typography variant that renders it. */
type ScaleName = keyof typeof typography.scale;
const SCALE_NAMES = Object.keys(typography.scale) as ScaleName[];

const VARIANT: Record<ScaleName, NonNullable<TypographyProps['variant']>> = {
  display: 'display',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'body1',
  small: 'body2',
  caption: 'caption',
  overline: 'overline',
  code: 'code',
};

export default function TypographyPage() {
  return (
    <>
      <PageHeader
        overline="Foundations"
        title="Typography"
        description="Inter for interface text, JetBrains Mono for code and identifiers. Sizes are set in rem so they follow the user's browser font size."
      />
      <Section id="families" title="Families">
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {Object.entries(typography.fontFamily).map(([name, stack]) => (
            <Card key={name} sx={{ p: 4 }}>
              <Typography variant="overline" color="text.secondary">
                {name}
              </Typography>
              <Typography sx={{ fontFamily: stack, fontSize: 28, my: 1 }}>Aa Bb Cc 0123</Typography>
              <Mono>{stack}</Mono>
            </Card>
          ))}
        </Box>
      </Section>
      <Section
        id="scale"
        title="Type scale"
        description="Each step maps to a Typography variant. Headings set hierarchy; the page outline is set by the component prop, not the visual size."
      >
        <Card sx={{ p: { xs: 3, md: 5 } }}>
          {SCALE_NAMES.map((name, i) => {
            const t = typography.scale[name];
            return (
              <Box
                key={name}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '200px 1fr' },
                  gap: 2,
                  py: 3,
                  borderTop: i ? 1 : 0,
                  borderColor: 'divider',
                  alignItems: 'baseline',
                }}
              >
                <Box>
                  <Mono>{name}</Mono>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {t.size}px · {t.lineHeight} · {t.weight} · variant=&quot;{VARIANT[name]}&quot;
                  </Typography>
                </Box>
                <Typography variant={VARIANT[name]} component="p">
                  Build accessible components faster
                </Typography>
              </Box>
            );
          })}
        </Card>
      </Section>
      <Section id="usage" title="Usage">
        <CodeBlock
          label="Typography usage example"
          code={`// Visual style and semantics are independent: an h2-sized title can be an h3 in the outline.\n<Typography variant="h2" component="h3">Properties</Typography>\n<Typography variant="body2" color="text.secondary">Configure the component props.</Typography>\n<Typography variant="code">loadingPosition="start"</Typography>`}
        />
      </Section>
    </>
  );
}
