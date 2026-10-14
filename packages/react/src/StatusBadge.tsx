import Box from '@mui/material/Box';
import { TONE_COLORS, type StatusTone } from './tone';

export interface StatusBadgeProps {
  /** Semantic tone. Color is never the only signal: `label` is always rendered. */
  tone: StatusTone;
  /** Visible text, e.g. "Approved". */
  label: string;
  size?: 'small' | 'medium';
  /** Leading dot; decorative. */
  showDot?: boolean;
}

/** Compact, non-interactive status label. Not a live region — announce changes elsewhere. */
export function StatusBadge({ tone, label, size = 'small', showDot = true }: StatusBadgeProps) {
  const c = TONE_COLORS[tone];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        px: size === 'small' ? 2 : 2.5,
        height: size === 'small' ? 22 : 28,
        borderRadius: 1,
        fontSize: size === 'small' ? 12 : 13,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: c.fg,
        bgcolor: c.bg,
        border: 1,
        borderColor: c.border,
      }}
    >
      {showDot && (
        <Box
          component="span"
          aria-hidden
          sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: c.fg, flexShrink: 0 }}
        />
      )}
      {label}
    </Box>
  );
}
