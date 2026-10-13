import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useId } from 'react';

export interface RelatedItem {
  id: string;
  /** Usually the identifier, e.g. a part number. Rendered monospaced. */
  code?: string;
  primary: string;
  secondary?: string;
  trailing?: ReactNode;
  href: string;
}

export interface RelatedListProps {
  title: string;
  items: RelatedItem[];
  /** Shows "View all" linking here when provided. */
  viewAllHref?: string;
  icon?: ReactNode;
  emptyMessage?: string;
  /** Heading level for the list title. */
  headingLevel?: 'h2' | 'h3' | 'h4';
}

/** Compact, linked list of related entities (manuals, parts, suppliers). */
export function RelatedList({
  title,
  items,
  viewAllHref,
  icon = <DescriptionOutlinedIcon fontSize="small" />,
  emptyMessage = 'No related records.',
  headingLevel = 'h3',
}: RelatedListProps) {
  const headingId = useId();
  return (
    <Box component="section" aria-labelledby={headingId}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 }}>
        <Typography id={headingId} variant="h5" component={headingLevel}>
          {title} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>({items.length})</Box>
        </Typography>
        {viewAllHref && items.length > 0 && (
          <Link href={viewAllHref} sx={{ fontSize: 12, fontWeight: 600 }}>
            View all<Box component="span" sx={visuallyHidden}> {title.toLowerCase()}</Box>
          </Link>
        )}
      </Box>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          {emptyMessage}
        </Typography>
      ) : (
        <List dense disablePadding>
          {items.map((item) => (
            <ListItemButton key={item.id} href={item.href} sx={{ px: 1.5, borderRadius: 1, gap: 2, alignItems: 'center' }}>
              <ListItemIcon aria-hidden sx={{ minWidth: 0, color: 'text.secondary' }}>
                {icon}
              </ListItemIcon>
              <Box sx={{ minWidth: 0, flex: 1, py: 0.5 }}>
                {item.code && (
                  <Typography component="span" sx={{ display: 'block', fontFamily: 'monospace', fontSize: 11.5, color: 'text.secondary', lineHeight: 1.4 }}>
                    {item.code}
                  </Typography>
                )}
                <Typography component="span" sx={{ display: 'block', fontSize: 13.5, fontWeight: 500, lineHeight: 1.35 }}>
                  {item.primary}
                </Typography>
                {item.secondary && (
                  <Typography component="span" sx={{ display: 'block', fontSize: 12, color: 'text.secondary', lineHeight: 1.4 }}>
                    {item.secondary}
                  </Typography>
                )}
              </Box>
              {item.trailing}
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;
