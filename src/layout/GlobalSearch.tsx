import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENTITY_LABEL, search, type EntityType, type SearchDoc } from '@/features/search/search';

const ICONS: Record<EntityType, React.ReactNode> = {
  manual: <DescriptionOutlinedIcon fontSize="small" />,
  part: <SettingsOutlinedIcon fontSize="small" />,
  supplier: <LocalShippingOutlinedIcon fontSize="small" />,
};

/** Header search across manuals, parts and suppliers. Press "/" anywhere to focus. */
export function GlobalSearch() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const options = useMemo(() => search(input, { limit: 12 }).map((h) => h.doc), [input]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === '/' && !/input|textarea/i.test(target.tagName) && !target.isContentEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Autocomplete<SearchDoc, false, false, true>
      freeSolo
      options={options}
      filterOptions={(o) => o}
      groupBy={(o) => ENTITY_LABEL[o.type]}
      getOptionLabel={(o) => (typeof o === 'string' ? o : o.title)}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      onChange={(_, value) => {
        if (value && typeof value !== 'string') {
          navigate(value.href);
          setInput('');
          inputRef.current?.blur();
        } else if (typeof value === 'string' && value.trim()) {
          navigate(`/assistant?q=${encodeURIComponent(value.trim())}`);
          setInput('');
        }
      }}
      noOptionsText={input ? 'No matches — press Enter to ask the assistant' : 'Type to search'}
      renderOption={({ key, ...props }, o) => (
        <Box component="li" key={key} {...props} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box aria-hidden sx={{ color: 'text.secondary', display: 'flex' }}>{ICONS[o.type]}</Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }} noWrap>{o.title}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }} noWrap>{o.subtitle}</Typography>
          </Box>
        </Box>
      )}
      sx={{ width: '100%', maxWidth: 560 }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          placeholder="Search manuals, parts, suppliers…"
          size="small"
          slotProps={{
            ...params.slotProps,
            htmlInput: { ...params.slotProps.htmlInput, 'aria-label': 'Search manuals, parts and suppliers' },
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
                  sx={{ display: { xs: 'none', sm: 'inline-block' }, border: 1, borderColor: 'divider', borderRadius: 0.75, px: 1.5, fontSize: 11, color: 'text.secondary', fontFamily: 'inherit' }}
                >
                  /
                </Box>
              ),
            },
          }}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.default' } }}
        />
      )}
    />
  );
}
