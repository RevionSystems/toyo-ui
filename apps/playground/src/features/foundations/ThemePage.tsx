import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@mui/material/styles';
import MuiTextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useId, useMemo, useState } from 'react';
import { CodeBlock } from '@/components/common/CodeBlock';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert, Button, StatusBadge, TextField } from '@toyo-ui/react';
import { contrastRatio } from '@toyo-ui/theme';
import { createToyoTheme } from '@toyo-ui/theme';
import { radius as radiusTokens, semantic, spacing as spacingTokens } from '@toyo-ui/theme';
import { Section } from './Section';

const ACCENTS = [
  { label: 'Toyo red (token)', value: semantic.light.primary },
  { label: 'Deep red', value: '#C8102E' },
  { label: 'Signal blue', value: '#1C5BBA' },
  { label: 'Graphite', value: '#33373D' },
  { label: 'Racing green', value: '#16723A' },
  { label: 'Amber (fails AA)', value: '#F2B44C' },
] as const;

interface SandboxState {
  accent: string;
  radius: number;
  spacingUnit: number;
  mode: 'light' | 'dark';
}

const DEFAULTS: SandboxState = {
  accent: semantic.light.primary,
  radius: radiusTokens.md,
  spacingUnit: spacingTokens.unit,
  mode: 'light',
};

export default function ThemePage() {
  const [s, setS] = useState<SandboxState>(DEFAULTS);
  const radiusLabel = useId();
  const densityLabel = useId();
  const set = <K extends keyof SandboxState>(key: K, value: SandboxState[K]) =>
    setS((prev) => ({ ...prev, [key]: value }));

  const surface = semantic[s.mode].surface;
  const onAccent = semantic[s.mode].onPrimary;
  const fillContrast = contrastRatio(onAccent, s.accent);
  const textContrast = contrastRatio(s.accent, surface);
  // Only adopt the accent as the text red when it is readable as text; otherwise keep the token.
  const primaryText = textContrast >= 4.5 ? s.accent : semantic[s.mode].primaryText;

  const sandboxTheme = useMemo(
    () =>
      createToyoTheme({
        cssVariables: false,
        mode: s.mode,
        primary: s.accent,
        primaryText,
        radius: s.radius,
        spacingUnit: s.spacingUnit,
      }),
    [s, primaryText],
  );

  const code = `import { createToyoTheme } from '@toyo-ui/theme';

const theme = createToyoTheme({
  primary: '${s.accent}',${primaryText !== semantic[s.mode].primaryText ? `\n  primaryText: '${primaryText}',` : ''}
  radius: ${s.radius},
  spacingUnit: ${s.spacingUnit},
});

// Resolved values${s.mode === 'dark' ? ' (dark scheme)' : ''}
theme.palette.primary.main   // ${sandboxTheme.palette.primary.main}
theme.palette.primaryText    // ${sandboxTheme.palette.primaryText}
theme.shape.borderRadius     // ${sandboxTheme.shape.borderRadius}
theme.spacing(4)             // ${sandboxTheme.spacing(4)}`;

  return (
    <>
      <PageHeader
        overline="Foundations"
        title="Theme"
        description="One factory, createToyoTheme(), builds every theme from the tokens. Change shared values here and watch real library components re-theme in a scoped sandbox — the rest of the app is unaffected."
      />
      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', lg: '300px minmax(0, 1fr)' },
          alignItems: 'start',
        }}
      >
        <Card
          component="section"
          aria-labelledby="sandbox-controls"
          sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          <Typography id="sandbox-controls" variant="h2" sx={{ fontSize: 16 }}>
            Theme values
          </Typography>
          <MuiTextField
            select
            size="small"
            label="Accent (primary fill)"
            value={s.accent}
            onChange={(e) => set('accent', e.target.value)}
          >
            {ACCENTS.map((a) => (
              <MenuItem key={a.value} value={a.value}>
                <Box
                  component="span"
                  aria-hidden
                  sx={{ display: 'inline-block', width: 12, height: 12, borderRadius: 0.5, bgcolor: a.value, mr: 1.5 }}
                />
                {a.label}
              </MenuItem>
            ))}
          </MuiTextField>
          <Box>
            <Typography id={radiusLabel} variant="body2" sx={{ mb: 1 }}>
              Corner radius: {s.radius}px
            </Typography>
            <Slider
              aria-labelledby={radiusLabel}
              value={s.radius}
              min={0}
              max={14}
              step={1}
              onChange={(_, v) => set('radius', v as number)}
            />
          </Box>
          <Box>
            <Typography id={densityLabel} variant="body2" sx={{ mb: 1 }}>
              Spacing unit (density)
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              fullWidth
              value={s.spacingUnit}
              onChange={(_, v) => v && set('spacingUnit', v)}
              aria-labelledby={densityLabel}
            >
              <ToggleButton value={3}>Compact · 3px</ToggleButton>
              <ToggleButton value={4}>Default · 4px</ToggleButton>
              <ToggleButton value={5}>Roomy · 5px</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <ToggleButtonGroup
            exclusive
            size="small"
            fullWidth
            value={s.mode}
            onChange={(_, v) => v && set('mode', v)}
            aria-label="Sandbox color scheme"
          >
            <ToggleButton value="light">Light</ToggleButton>
            <ToggleButton value="dark">Dark</ToggleButton>
          </ToggleButtonGroup>
          <Box aria-live="polite" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Contrast
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Button label on accent: {fillContrast.toFixed(2)}:1</Typography>
              <StatusBadge
                tone={fillContrast >= 4.5 ? 'success' : 'error'}
                label={fillContrast >= 4.5 ? 'AA' : 'Fails'}
                showDot={false}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Accent as text: {textContrast.toFixed(2)}:1</Typography>
              <StatusBadge
                tone={textContrast >= 4.5 ? 'success' : 'warning'}
                label={textContrast >= 4.5 ? 'AA' : 'Token kept'}
                showDot={false}
              />
            </Box>
          </Box>
          <Button variant="outline" size="small" onClick={() => setS(DEFAULTS)}>
            Reset to tokens
          </Button>
        </Card>

        <Box sx={{ minWidth: 0 }}>
          <Section id="sandbox-preview" title="Sandbox">
            <ThemeProvider theme={sandboxTheme}>
              <Box
                data-testid="theme-sandbox"
                sx={{
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="text">Text</Button>
                </Box>
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <TextField label="Component name" defaultValue="Button" helperText="Use PascalCase." />
                  <TextField label="Version" defaultValue="2.x" errorMessage="Use a full semantic version." />
                </Box>
                <Alert severity="success" title="Published" announce={false}>
                  Button 2.3.0 is available in the registry.
                </Alert>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <StatusBadge tone="success" label="Stable" />
                  <StatusBadge tone="warning" label="In review" />
                  <StatusBadge tone="info" label="Beta" />
                </Box>
              </Box>
            </ThemeProvider>
          </Section>
          <Section id="sandbox-code" title="Equivalent code">
            <CodeBlock code={code} label="Theme factory call for the current sandbox values" />
          </Section>
        </Box>
      </Box>
    </>
  );
}
