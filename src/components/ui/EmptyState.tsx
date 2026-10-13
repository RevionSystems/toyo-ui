import SearchOffIcon from '@mui/icons-material/SearchOff';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

/** Placeholder for empty lists and zero-result searches. Announced politely to screen readers. */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Box role="status" sx={{ textAlign: 'center', py: 12, px: 4, color: 'text.secondary' }}>
      <Box aria-hidden sx={{ fontSize: 40, display: 'flex', justifyContent: 'center', mb: 2 }}>
        {icon ?? <SearchOffIcon fontSize="inherit" />}
      </Box>
      <Typography variant="h4" component="p" color="text.primary">
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
