import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_DESTINATIONS } from './navigation';

type Destination = (typeof ALL_DESTINATIONS)[number];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * Header search over components and pages. ⌘K / Ctrl+K focuses it. Free text that
 * matches nothing is sent to the AI assistant as a prompt.
 */
export function CommandSearch() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Autocomplete<Destination, false, false, true>
      freeSolo
      options={ALL_DESTINATIONS}
      groupBy={(o) => o.group}
      getOptionLabel={(o) => (typeof o === 'string' ? o : o.label)}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      onChange={(_, value) => {
        if (value && typeof value !== 'string') navigate(value.href);
        else if (typeof value === 'string' && value.trim())
          navigate(`/engineering/assistant?q=${encodeURIComponent(value.trim())}`);
        setInput('');
        inputRef.current?.blur();
      }}
      noOptionsText="Press Enter to ask the AI assistant"
      sx={{ width: '100%', maxWidth: 520 }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          placeholder="Search components, props, or ask AI…"
          size="small"
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              ...params.slotProps.htmlInput,
              'aria-label': 'Search components and pages, or ask the AI assistant',
            },
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" aria-hidden />
                </InputAdornment>
              ),
              endAdornment: (
                <Box
                  component="kbd"
                  aria-hidden
                  sx={{
                    display: { xs: 'none', sm: 'inline-block' },
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 0.75,
                    px: 1.25,
                    fontSize: 11,
                    color: 'text.secondary',
                  }}
                >
                  {isMac ? '⌘K' : 'Ctrl K'}
                </Box>
              ),
            },
          }}
        />
      )}
    />
  );
}
