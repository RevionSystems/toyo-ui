import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface WordmarkProps {
  size?: 'sm' | 'md';
  /** Light text for use on dark imagery. */
  inverse?: boolean;
}

/** Toyo-ui lockup: twin slanted bars and the wordmark. */
export function Wordmark({ size = 'md', inverse = false }: WordmarkProps) {
  const h = size === 'sm' ? 16 : 22;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: size === 'sm' ? 1.5 : 2.5 }}>
      <Box component="svg" aria-hidden viewBox="0 0 34 22" sx={{ height: h, width: 'auto', flexShrink: 0 }}>
        <polygon points="9,0 19,0 10,22 0,22" fill={inverse ? '#FFFFFF' : 'currentColor'} />
        <polygon points="24,0 34,0 25,22 15,22" fill="var(--toyo-palette-primary-main)" />
      </Box>
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: size === 'sm' ? 17 : 24,
          letterSpacing: '-0.02em',
          color: inverse ? '#FFFFFF' : 'text.primary',
          lineHeight: 1,
        }}
      >
        Toyo-ui
      </Typography>
    </Box>
  );
}
