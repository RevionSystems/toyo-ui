import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useId } from 'react';

export interface FilterOption<V extends string> {
  value: V;
  label: string;
  count?: number;
}

export interface FilterChipsProps<V extends string> {
  label: string;
  options: FilterOption<V>[];
  /** `null` means "All". */
  value: V | null;
  onChange: (value: V | null) => void;
  /** Label for the reset chip. */
  allLabel?: string;
}

/** Single-select chip filter with an "All" option. Exposes pressed state to assistive tech. */
export function FilterChips<V extends string>({
  label,
  options,
  value,
  onChange,
  allLabel = 'All',
}: FilterChipsProps<V>) {
  const labelId = useId();
  const chip = (key: string, text: string, selected: boolean, next: V | null, count?: number) => (
    <Chip
      key={key}
      label={count === undefined ? text : `${text} · ${count}`}
      onClick={() => onChange(next)}
      variant={selected ? 'filled' : 'outlined'}
      color={selected ? 'primary' : 'default'}
      aria-pressed={selected}
      size="small"
    />
  );
  return (
    <Box
      role="group"
      aria-labelledby={labelId}
      sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}
    >
      <Typography id={labelId} variant="body2" color="text.secondary" sx={{ mr: 1 }}>
        {label}
      </Typography>
      {chip('__all', allLabel, value === null, null)}
      {options.map((o) => chip(o.value, o.label, value === o.value, o.value, o.count))}
    </Box>
  );
}
