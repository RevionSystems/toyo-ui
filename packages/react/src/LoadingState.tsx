import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';

export type LoadingVariant = 'spinner' | 'linear' | 'skeleton';

export interface LoadingStateProps {
  variant?: LoadingVariant;
  /** What is loading. Announced to assistive technology; visible unless `hideLabel`. */
  label?: string;
  hideLabel?: boolean;
  /** 0–100 for determinate progress (spinner and linear). Omit when unknown. */
  progress?: number;
  /** Number of placeholder lines for `skeleton`. */
  lines?: number;
}

/**
 * Announced loading indicator. Wraps the indicator in `role="status"` so the label is read
 * once when loading starts; the indicator itself is a labelled progressbar.
 */
export function LoadingState({
  variant = 'spinner',
  label = 'Loading',
  hideLabel = false,
  progress,
  lines = 3,
}: LoadingStateProps) {
  const determinate = progress !== undefined;
  const value = determinate ? Math.min(100, Math.max(0, progress)) : undefined;
  const labelNode = (
    <Typography variant="body2" color="text.secondary" sx={hideLabel ? visuallyHidden : undefined}>
      {label}
      {determinate && ` — ${Math.round(value!)}%`}
    </Typography>
  );

  if (variant === 'skeleton') {
    return (
      <Box role="status" aria-busy="true" sx={{ width: '100%' }}>
        <Box component="span" sx={visuallyHidden}>
          {label}
        </Box>
        <Box aria-hidden sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Array.from({ length: Math.max(1, lines) }, (_, i) => (
            <Skeleton key={i} variant="rounded" height={14} width={i === lines - 1 && lines > 1 ? '60%' : '100%'} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        flexDirection: variant === 'linear' ? 'column' : 'row',
        alignItems: variant === 'linear' ? 'stretch' : 'center',
        gap: 2,
        width: variant === 'linear' ? '100%' : 'auto',
      }}
    >
      {variant === 'spinner' ? (
        <CircularProgress
          size={24}
          aria-label={label}
          variant={determinate ? 'determinate' : 'indeterminate'}
          value={value}
        />
      ) : (
        <LinearProgress
          aria-label={label}
          variant={determinate ? 'determinate' : 'indeterminate'}
          value={value}
          sx={{ borderRadius: 1 }}
        />
      )}
      {labelNode}
    </Box>
  );
}
