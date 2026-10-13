import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components';
import { getEntry, registry } from '@/features/lab/registry';
import type { AnyLabEntry, Control } from '@/features/lab/types';

const CATEGORIES = [...new Set(registry.map((e) => e.category))];

export default function ComponentLabPage() {
  const { componentId } = useParams();
  const navigate = useNavigate();
  if (!componentId) return <Navigate to={`/lab/${registry[0]!.id}`} replace />;
  const entry = getEntry(componentId);
  if (!entry) return <Navigate to="/lab" replace />;

  return (
    <>
      <PageHeader
        overline="Design system"
        title="Component Lab"
        description="Live previews of the shared Toyo-ui components. Edit props, switch the preview scheme, and copy the generated usage."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Component Lab' }]}
      />
      <Box sx={{ display: 'grid', gap: 6, gridTemplateColumns: { xs: '1fr', md: '220px 1fr' }, alignItems: 'start' }}>
        {/* Component index: select on mobile, list on desktop */}
        <TextField
          select
          size="small"
          label="Component"
          value={entry.id}
          onChange={(e) => navigate(`/lab/${e.target.value}`)}
          sx={{ display: { md: 'none' } }}
        >
          {registry.map((e) => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
        </TextField>
        <Box component="nav" aria-label="Components" sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 88 }}>
          {CATEGORIES.map((cat) => (
            <List key={cat} dense disablePadding subheader={<ListSubheader disableSticky sx={{ bgcolor: 'transparent', px: 2, lineHeight: '28px', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{cat}</ListSubheader>} sx={{ mb: 2 }}>
              {registry.filter((e) => e.category === cat).map((e) => (
                <ListItem key={e.id} disablePadding>
                <ListItemButton
                  href={`/lab/${e.id}`}
                  selected={e.id === entry.id}
                  aria-current={e.id === entry.id ? 'page' : undefined}
                  sx={{ borderRadius: 1, py: 0.75 }}
                >
                  <ListItemText primary={e.name} slotProps={{ primary: { sx: { fontSize: 14, fontWeight: e.id === entry.id ? 600 : 400 } } }} />
                </ListItemButton>
                </ListItem>
              ))}
            </List>
          ))}
        </Box>

        {/* key resets playground state when switching components */}
        <Playground key={entry.id} entry={entry} />
      </Box>
    </>
  );
}

function Playground({ entry }: { entry: AnyLabEntry }) {
  const [values, setValues] = useState<Record<string, unknown>>(entry.defaults);
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);
  const code = entry.code(values);
  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard unavailable; code remains selectable. */
    }
  };

  return (
    <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="h2">{entry.name}</Typography>
          <Chip size="small" label={entry.category} variant="outlined" />
        </Box>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{entry.description}</Typography>
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="overline" component="h3">Preview</Typography>
              <ToggleButtonGroup size="small" exclusive value={scheme} onChange={(_, v) => v && setScheme(v)} aria-label="Preview color scheme">
                <ToggleButton value="light" sx={{ px: 2, py: 0.25, textTransform: 'none' }}>Light</ToggleButton>
                <ToggleButton value="dark" sx={{ px: 2, py: 0.25, textTransform: 'none' }}>Dark</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {/* The theme's color-scheme selector is an attribute, so this scopes dark tokens to the preview. */}
            <Box
              data-color-scheme={scheme}
              data-testid="lab-preview"
              sx={{
                flex: 1,
                minHeight: 240,
                p: { xs: 4, md: 8 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                color: 'text.primary',
                colorScheme: scheme,
                backgroundImage: 'radial-gradient(color-mix(in srgb, currentColor 10%, transparent) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              {entry.render(values)}
            </Box>
          </Box>
          <Box component="section" aria-labelledby="controls-title" sx={{ borderLeft: { lg: 1 }, borderTop: { xs: 1, lg: 0 }, borderColor: 'divider', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography id="controls-title" variant="overline" component="h3">Props</Typography>
              <Button size="small" startIcon={<RestartAltIcon />} onClick={() => setValues(entry.defaults)}>Reset</Button>
            </Box>
            {entry.controls.map((c) => (
              <ControlInput key={c.name} control={c} value={values[c.name]} onChange={(v) => set(c.name, v)} />
            ))}
          </Box>
        </Box>
      </Card>

      <Box component="section" aria-labelledby="code-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="code-title" variant="h4" component="h3">Usage</Typography>
          <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={copy} aria-live="polite">
            {copied ? 'Copied' : 'Copy code'}
          </Button>
        </Box>
        <Box
          component="pre"
          tabIndex={0}
          aria-label={`${entry.name} usage example`}
          sx={{ m: 0, p: 4, borderRadius: 2, overflowX: 'auto', fontSize: 13, lineHeight: 1.6, bgcolor: '#111315', color: '#E6E8EB', border: 1, borderColor: 'divider' }}
        >
          <code>{`import { ${entry.name.replace(/<.*/, '')} } from '@/components';\n\n${code}`}</code>
        </Box>
      </Box>

      <Box component="section" aria-labelledby="api-title">
        <Typography id="api-title" variant="h4" component="h3" sx={{ mb: 2 }}>API</Typography>
        <Card sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label={`${entry.name} props`}>
            <TableHead>
              <TableRow>
                <TableCell>Prop</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Default</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entry.props.map((p) => (
                <TableRow key={p.name}>
                  <TableCell sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {p.name}
                    {p.required && <Box component="span" sx={{ color: 'primary.main' }} aria-label="required">*</Box>}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary', maxWidth: 260 }}>{p.type}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{p.default ?? '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{p.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Box>

      <Box component="section" aria-labelledby="guidelines-title">
        <Typography id="guidelines-title" variant="h4" component="h3" sx={{ mb: 2 }}>Guidelines</Typography>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <GuidelineList kind="do" items={entry.guidelines.do} />
          <GuidelineList kind="dont" items={entry.guidelines.dont} />
        </Box>
      </Box>
    </Box>
  );
}

function GuidelineList({ kind, items }: { kind: 'do' | 'dont'; items: string[] }) {
  const isDo = kind === 'do';
  return (
    <Card sx={{ p: 4, borderTop: 3, borderTopColor: isDo ? 'success.main' : 'primary.main' }}>
      <Typography variant="h5" component="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, color: isDo ? 'success.main' : 'primary.main' }}>
        {isDo ? <CheckCircleOutlineIcon fontSize="small" aria-hidden /> : <DoNotDisturbAltIcon fontSize="small" aria-hidden />}
        {isDo ? 'Do' : "Don't"}
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((i) => <Typography key={i} component="li" variant="body2">{i}</Typography>)}
      </Box>
    </Card>
  );
}

function ControlInput({ control, value, onChange }: { control: Control<Record<string, unknown>>; value: unknown; onChange: (v: unknown) => void }) {
  const label = control.label ?? control.name;
  switch (control.kind) {
    case 'boolean':
      return <FormControlLabel control={<Switch checked={!!value} onChange={(e) => onChange(e.target.checked)} />} label={<Box component="span" sx={{ fontFamily: 'monospace', fontSize: 13 }}>{label}</Box>} />;
    case 'select':
      return (
        <TextField select size="small" label={label} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
          {control.options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
        </TextField>
      );
    case 'number':
      return (
        <TextField
          type="number"
          size="small"
          label={label}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          slotProps={{ htmlInput: { min: control.min, max: control.max, step: control.step ?? 1 } }}
        />
      );
    default:
      return <TextField size="small" label={label} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />;
  }
}
