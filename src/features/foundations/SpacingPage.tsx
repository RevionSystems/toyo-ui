import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui';
import { dimensions, elevation, focus, motion, radius, spacing } from '@/theme/tokens';
import { Mono, Section } from './Section';

export default function SpacingPage() {
  return (
    <>
      <PageHeader
        overline="Foundations"
        title="Spacing, shape & dimensions"
        description={
          <>
            A {spacing.unit}px grid: <Mono>theme.spacing(n)</Mono> and <Mono>sx={'{{ p: n }}'}</Mono> resolve to n ×{' '}
            {spacing.unit}px.
          </>
        }
      />
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <Section id="spacing" title="Spacing scale">
          <Card sx={{ p: 4 }}>
            {spacing.scale
              .filter((n) => n > 0)
              .map((n) => (
                <Box
                  key={n}
                  sx={{ display: 'grid', gridTemplateColumns: '40px 1fr 56px', alignItems: 'center', gap: 2, mb: 1.5 }}
                >
                  <Mono>{n}</Mono>
                  <Box sx={{ height: 10, width: n * spacing.unit, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {n * spacing.unit}px
                  </Typography>
                </Box>
              ))}
          </Card>
        </Section>
        <Section
          id="dimensions"
          title="Control dimensions"
          description="Shared by Button and TextField so controls align in a row."
        >
          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {(Object.entries(dimensions.control) as [keyof typeof dimensions.control, number][]).map(([size, h]) => (
              <Box key={size} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ width: 120 }}>
                  <Mono>{size}</Mono>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {h}px
                  </Typography>
                </Box>
                <Button size={size}>Button</Button>
              </Box>
            ))}
            <Typography variant="body2" color="text.secondary">
              Minimum pointer target: {dimensions.minTarget}px (WCAG 2.2 SC 2.5.8 requires 24px).
            </Typography>
          </Card>
        </Section>
        <Section id="radius" title="Radius">
          <Card sx={{ p: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {Object.entries(radius).map(([name, r]) => (
              <Box key={name} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    border: 2,
                    borderColor: 'text.primary',
                    borderRadius: `${Math.min(r, 28)}px`,
                    mb: 1,
                  }}
                />
                <Mono>{name}</Mono>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {r}px
                </Typography>
              </Box>
            ))}
          </Card>
        </Section>
        <Section
          id="elevation"
          title="Elevation"
          description="Used sparingly: borders separate surfaces; shadows lift overlays."
        >
          <Card sx={{ p: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Object.entries(elevation).map(([level, shadow]) => (
              <Box key={level} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 56,
                    borderRadius: 1.5,
                    bgcolor: 'background.paper',
                    boxShadow: shadow,
                    border: level === '0' ? 1 : 0,
                    borderColor: 'divider',
                    mb: 1,
                  }}
                />
                <Mono>{level}</Mono>
              </Box>
            ))}
          </Card>
        </Section>
        <Section
          id="focus"
          title="Focus indicator"
          description="Applied globally through :focus-visible, so keyboard users always see where they are and mouse users are not distracted."
        >
          <Card sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box
              aria-hidden
              sx={{
                px: 4,
                py: 2,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                outline: `${focus.width}px solid`,
                outlineColor: 'focusRing',
                outlineOffset: focus.offset,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Focused control
            </Box>
            <Typography variant="body2" color="text.secondary">
              {focus.width}px solid <Mono>focusRing</Mono>, {focus.offset}px offset · ≥ 3:1 against surfaces (tested).
            </Typography>
          </Card>
        </Section>
        <Section
          id="motion"
          title="Motion"
          description="Short and functional. Disabled under prefers-reduced-motion by a global theme rule."
        >
          <Card sx={{ p: 4 }}>
            <Typography variant="body2">
              fast <Mono>{motion.duration.fast}ms</Mono> · base <Mono>{motion.duration.base}ms</Mono> · easing{' '}
              <Mono>{motion.easing}</Mono>
            </Typography>
          </Card>
        </Section>
      </Box>
    </>
  );
}
