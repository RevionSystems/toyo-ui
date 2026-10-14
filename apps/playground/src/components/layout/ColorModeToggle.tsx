import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useColorScheme } from '@mui/material/styles';

/** Switches between light and dark; the choice is persisted by MUI. */
export function ColorModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const resolved = mode === 'system' ? systemMode : mode;
  if (!resolved) return null;
  const next = resolved === 'dark' ? 'light' : 'dark';
  return (
    <Tooltip title={`Switch to ${next} theme`}>
      <IconButton
        onClick={() => setMode(next)}
        aria-label={`Switch to ${next} theme`}
        aria-pressed={resolved === 'dark'}
      >
        {resolved === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
