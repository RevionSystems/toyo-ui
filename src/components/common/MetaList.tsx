import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

export interface MetaItem {
  label: string;
  value: ReactNode;
}

export interface MetaListProps {
  items: MetaItem[];
  /** Tighter rows for side panels. */
  dense?: boolean;
  /** Width of the label column. */
  labelWidth?: number | string;
}

/** Two-column label/value list rendered as a semantic description list. */
export function MetaList({ items, dense = false, labelWidth = '38%' }: MetaListProps) {
  return (
    <Box
      component="dl"
      sx={{
        m: 0,
        display: 'grid',
        gridTemplateColumns: `minmax(150px, ${typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth}) 1fr`,
      }}
    >
      {items.map(({ label, value }) => (
        <Box
          key={label}
          sx={{ display: 'contents', '& > *': { py: dense ? 1.75 : 2.5, borderBottom: 1, borderColor: 'divider' } }}
        >
          <Box component="dt" sx={{ color: 'text.secondary', fontSize: 13, pr: 3 }}>
            {label}
          </Box>
          <Box component="dd" sx={{ m: 0, fontSize: 13, fontWeight: 500 }}>
            {value}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
