import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import type { KeyboardEvent } from 'react';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Accessible label. Visually hidden unless `showLabel` is set. */
  label: string;
  placeholder?: string;
  showLabel?: boolean;
  /** Called on Enter. */
  onSubmit?: (value: string) => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

/** Controlled search input with icon, Escape-to-clear and Enter-to-submit. */
export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  showLabel = false,
  onSubmit,
  size = 'small',
  fullWidth = true,
}: SearchFieldProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      e.preventDefault();
      onChange('');
    }
    if (e.key === 'Enter') onSubmit?.(value);
  };

  return (
    <TextField
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      label={showLabel ? label : undefined}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      slotProps={{
        htmlInput: showLabel ? undefined : { 'aria-label': label },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" aria-hidden />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
