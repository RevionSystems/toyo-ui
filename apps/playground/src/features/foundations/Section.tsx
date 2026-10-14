import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box component="section" aria-labelledby={id} sx={{ mb: 8 }}>
      <Typography id={id} variant="h2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 760 }}>
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
}

export const Mono = ({ children }: { children: ReactNode }) => (
  <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 12.5 }}>
    {children}
  </Box>
);
