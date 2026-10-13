import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ConfirmDialog, FilterChips, SearchField, type ConfirmDialogProps, type SearchFieldProps } from '@/components';

/* Stateful demos: the playground controls the static props, the demo owns interaction state. */

export function SearchFieldDemo(p: Pick<SearchFieldProps, 'label' | 'placeholder' | 'showLabel' | 'size'>) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<string>();
  return (
    <Box sx={{ width: '100%', maxWidth: 420 }}>
      <SearchField {...p} value={value} onChange={setValue} onSubmit={setSubmitted} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Value: “{value}” {submitted !== undefined && `· Last submitted: “${submitted}”`}
      </Typography>
    </Box>
  );
}

export function FilterChipsDemo({ label, allLabel, showCounts }: { label: string; allLabel: string; showCounts: boolean }) {
  const [value, setValue] = useState<'braking' | 'battery' | 'chassis' | null>(null);
  return (
    <FilterChips
      label={label}
      allLabel={allLabel}
      value={value}
      onChange={setValue}
      options={[
        { value: 'braking', label: 'Braking', count: showCounts ? 9 : undefined },
        { value: 'battery', label: 'Battery', count: showCounts ? 4 : undefined },
        { value: 'chassis', label: 'Chassis', count: showCounts ? 3 : undefined },
      ]}
    />
  );
}

export function ConfirmDialogDemo(p: Pick<ConfirmDialogProps, 'title' | 'description' | 'confirmLabel' | 'cancelLabel' | 'tone'>) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string>();
  return (
    <Box>
      <Button variant="contained" color={p.tone === 'destructive' ? 'error' : 'primary'} onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      {result && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Result: {result}</Typography>}
      <ConfirmDialog
        {...p}
        open={open}
        onConfirm={() => {
          setOpen(false);
          setResult('confirmed');
        }}
        onCancel={() => {
          setOpen(false);
          setResult('cancelled');
        }}
      />
    </Box>
  );
}
