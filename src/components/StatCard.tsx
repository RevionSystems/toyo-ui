import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  /** Supporting context under the value. */
  hint?: string;
  icon?: ReactNode;
}

/** Single key metric with label and optional context. */
export function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <Card sx={{ p: 4, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Typography variant="body2" color="text.secondary" component="p">
          {label}
        </Typography>
        {icon && <Box aria-hidden sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>}
      </Box>
      <Typography sx={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', mt: 1, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>
          {hint}
        </Typography>
      )}
    </Card>
  );
}
