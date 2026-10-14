import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Control } from './types';

type State = Record<string, unknown>;

export interface PropertiesPanelProps {
  controls: Control<State>[];
  state: State;
  onChange: (name: string, value: unknown) => void;
  onReset: () => void;
}

/** Editable props. Every control is labelled with the prop name it changes. */
export function PropertiesPanel({ controls, state, onChange, onReset }: PropertiesPanelProps) {
  return (
    <Card component="section" aria-labelledby="properties-title" sx={{ p: 4, alignSelf: 'start' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Typography id="properties-title" variant="h2" sx={{ fontSize: 16 }}>
            Properties
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Configure the component props.
          </Typography>
        </Box>
        <Button size="small" variant="outlined" startIcon={<RestartAltIcon />} onClick={onReset}>
          Reset
        </Button>
      </Box>
      <Box
        component="form"
        aria-label="Component properties"
        onSubmit={(e) => e.preventDefault()}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {controls.map((c) => (
          <ControlInput key={c.name} control={c} value={state[c.name]} onChange={(v) => onChange(c.name, v)} />
        ))}
      </Box>
    </Card>
  );
}

function ControlInput({
  control,
  value,
  onChange,
}: {
  control: Control<State>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = control.label ?? control.name;
  switch (control.kind) {
    case 'boolean':
      return (
        <FormControlLabel
          control={<Switch checked={!!value} onChange={(e) => onChange(e.target.checked)} />}
          label={label}
          labelPlacement="start"
          sx={{ mx: 0, justifyContent: 'space-between', '& .MuiFormControlLabel-label': { fontSize: 14 } }}
        />
      );
    case 'select':
      return (
        <TextField
          select
          size="small"
          label={label}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          {control.options.map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
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
      return (
        <TextField size="small" label={label} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
      );
  }
}
