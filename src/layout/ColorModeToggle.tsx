import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useColorScheme } from '@mui/material/styles';

/** Light/dark switch bound to MUI's persisted color scheme. */
export function ColorModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const resolved = mode === 'system' ? systemMode : mode;
  if (!resolved) return null;
  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      size="small"
      value={resolved}
      onChange={(_, next: 'light' | 'dark' | null) => next && setMode(next)}
      aria-label="Color mode"
    >
      <ToggleButton value="light" sx={{ gap: 1.5, textTransform: 'none' }}>
        <LightModeOutlinedIcon fontSize="small" aria-hidden /> Light
      </ToggleButton>
      <ToggleButton value="dark" sx={{ gap: 1.5, textTransform: 'none' }}>
        <DarkModeOutlinedIcon fontSize="small" aria-hidden /> Dark
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
