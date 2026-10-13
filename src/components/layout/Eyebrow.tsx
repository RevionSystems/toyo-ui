import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface EyebrowProps {
  children: ReactNode;
  /** Shows the red accent rule before the label. */
  accent?: boolean;
  /** Optional index, rendered as a zero-padded prefix ("01"). */
  index?: number;
  /** Semantic element; defaults to a non-heading `p`. */
  component?: 'p' | 'span' | 'h2' | 'h3';
}

/** Small uppercase label that introduces a section or card. */
export function Eyebrow({ children, accent = false, index, component = 'p' }: EyebrowProps) {
  return (
    <Typography
      variant="overline"
      component={component}
      sx={{ display: 'flex', alignItems: 'center', gap: 2.5, color: 'text.primary', m: 0 }}
    >
      {accent && (
        <Box
          component="span"
          aria-hidden
          sx={{ display: 'inline-block', width: 24, height: 2, bgcolor: 'primary.main', flexShrink: 0 }}
        />
      )}
      {index !== undefined && (
        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {String(index).padStart(2, '0')}
        </Box>
      )}
      {children}
    </Typography>
  );
}
