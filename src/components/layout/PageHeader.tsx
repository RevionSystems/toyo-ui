import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

export interface Crumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  overline?: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  /** Right-aligned actions, e.g. buttons. Wraps below the title on small screens. */
  actions?: ReactNode;
  /** Inline metadata under the title (status chips, revision…). */
  meta?: ReactNode;
}

/** Top-of-page heading block. Renders the page's single `h1`. */
export function PageHeader({ title, overline, description, breadcrumbs, actions, meta }: PageHeaderProps) {
  return (
    <Box component="header" sx={{ mb: 6 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 3, fontSize: 13 }}>
          {breadcrumbs.map((c, i) =>
            c.href && i < breadcrumbs.length - 1 ? (
              <Link key={c.label} href={c.href} color="text.secondary">
                {c.label}
              </Link>
            ) : (
              <Typography key={c.label} color="text.primary" sx={{ fontSize: 13 }} aria-current="page">
                {c.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0, flex: '1 1 420px' }}>
          {overline && (
            <Box sx={{ mb: 2 }}>
              <Eyebrow accent>{overline}</Eyebrow>
            </Box>
          )}
          <Typography variant="h1">{title}</Typography>
          {meta && <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', mt: 3 }}>{meta}</Box>}
          {description && (
            <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 720 }}>
              {description}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>{actions}</Box>}
      </Box>
    </Box>
  );
}
