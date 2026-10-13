import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface WordmarkProps {
  /** Visual size of the mark. */
  size?: 'sm' | 'md';
  /** Optional product line shown next to the mark, e.g. "Engineering Hub". */
  product?: string;
  /** Secondary descriptor under the product line. Hidden when `product` is not set. */
  tagline?: string;
}

/** Toyo-ui brand lockup: monogram, wordmark and optional product line. */
export function Wordmark({ size = 'md', product, tagline }: WordmarkProps) {
  const mark = size === 'sm' ? 28 : 34;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
      <Box
        aria-hidden
        sx={{
          width: mark,
          height: mark,
          borderRadius: 1.5,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 32 32" width={mark * 0.62} height={mark * 0.62} fill="currentColor">
          <path d="M5 6h22v4.4h-8.6V27h-4.8V10.4H5z" />
        </svg>
      </Box>
      <Typography
        component="span"
        sx={{ fontWeight: 800, fontSize: size === 'sm' ? 18 : 22, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
      >
        TOYO<Box component="span" sx={{ color: 'primary.main' }}>-ui</Box>
      </Typography>
      {product && (
        <Box
          sx={{
            borderLeft: 1,
            borderColor: 'divider',
            pl: 3,
            ml: 1,
            minWidth: 0,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Typography component="span" sx={{ display: 'block', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {product}
          </Typography>
          {tagline && (
            <Typography component="span" variant="body2" color="text.secondary" noWrap sx={{ display: 'block', fontSize: 12 }}>
              {tagline}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
