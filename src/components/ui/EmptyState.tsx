import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type EmptyStateKind = 'no-data' | 'no-results' | 'error';

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Picks the default icon. */
  kind?: EmptyStateKind;
  /** Overrides the default icon. Decorative. */
  icon?: ReactNode;
  /** Recovery action, e.g. "Clear filters". */
  action?: ReactNode;
  size?: 'compact' | 'default';
}

const ICONS: Record<EmptyStateKind, ReactNode> = {
  'no-data': <InboxOutlinedIcon fontSize="inherit" />,
  'no-results': <SearchOffIcon fontSize="inherit" />,
  error: <ErrorOutlineIcon fontSize="inherit" />,
};

/** Placeholder for empty collections. Uses `role="status"` so changes into this state are announced. */
export function EmptyState({ title, description, kind = 'no-data', icon, action, size = 'default' }: EmptyStateProps) {
  return (
    <Box role="status" sx={{ textAlign: 'center', py: size === 'compact' ? 6 : 12, px: 4, color: 'text.secondary' }}>
      <Box
        aria-hidden
        sx={{
          fontSize: size === 'compact' ? 32 : 44,
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
          color: kind === 'error' ? 'error.main' : 'text.secondary',
        }}
      >
        {icon ?? ICONS[kind]}
      </Box>
      <Typography component="p" sx={{ fontSize: size === 'compact' ? 14 : 16, fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ mt: 1, maxWidth: 420, mx: 'auto' }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 4 }}>{action}</Box>}
    </Box>
  );
}
