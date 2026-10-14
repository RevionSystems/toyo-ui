import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { useMemo, useState, type ReactNode } from 'react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Enables sorting; return numbers for numeric sort. */
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right';
  width?: number | string;
  /** Hide below the `md` breakpoint to keep tables readable on phones. */
  hideOnMobile?: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface DataTableProps<T> {
  /** Accessible name; rendered as a caption (visually hidden unless `showCaption`). */
  caption: string;
  showCaption?: boolean;
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Row click handler. Also render a link or button in a cell for keyboard users. */
  onRowClick?: (row: T) => void;
  initialSort?: { key: string; direction: SortDirection };
  /** Shows skeleton rows and sets aria-busy. */
  loading?: boolean;
  density?: 'compact' | 'comfortable';
  /** Replaces the default empty state. */
  emptyState?: ReactNode;
}

/** Typed, sortable table. Generic over the row type so column renderers are type-checked at the call site. */
export function DataTable<T>({
  caption,
  showCaption = false,
  columns,
  rows,
  getRowId,
  onRowClick,
  initialSort,
  loading = false,
  density = 'compact',
  emptyState,
}: DataTableProps<T>) {
  const [sort, setSort] = useState(initialSort);

  const sorted = useMemo(() => {
    const col = sort && columns.find((c) => c.key === sort.key);
    if (!col?.sortValue || !sort) return rows;
    const get = col.sortValue;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      return (typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))) * dir;
    });
  }, [rows, columns, sort]);

  const toggleSort = (key: string) =>
    setSort((s) => ({ key, direction: s?.key === key && s.direction === 'asc' ? 'desc' : 'asc' }));

  const mobileHidden = { display: { xs: 'none', md: 'table-cell' } } as const;
  const empty = !loading && sorted.length === 0;

  return (
    <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5 }}>
      <Table
        size={density === 'compact' ? 'small' : 'medium'}
        aria-busy={loading || undefined}
        // MUI styles captions (bottom, secondary color) on its Table root; override there.
        sx={{
          '& caption': showCaption
            ? {
                captionSide: 'top',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: 14,
                color: 'text.primary',
                px: 4,
                py: 3,
              }
            : {},
        }}
      >
        <Box component="caption" sx={showCaption ? undefined : visuallyHidden}>
          {caption}
        </Box>
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableCell
                key={c.key}
                align={c.align}
                sx={{ width: c.width, ...(c.hideOnMobile ? mobileHidden : {}) }}
                sortDirection={sort?.key === c.key ? sort.direction : false}
              >
                {c.sortValue ? (
                  <TableSortLabel
                    active={sort?.key === c.key}
                    direction={sort?.key === c.key ? sort.direction : 'asc'}
                    onClick={() => toggleSort(c.key)}
                  >
                    {c.header}
                  </TableSortLabel>
                ) : (
                  c.header
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: 3 }, (_, i) => (
                <TableRow key={`skeleton-${i}`} aria-hidden>
                  {columns.map((c) => (
                    <TableCell key={c.key} sx={c.hideOnMobile ? mobileHidden : undefined}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : sorted.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  hover={!!onRowClick}
                  onClick={
                    onRowClick
                      ? (e) => {
                          // Let interactive elements inside the row handle their own clicks.
                          if ((e.target as HTMLElement).closest('a,button,input')) return;
                          onRowClick(row);
                        }
                      : undefined
                  }
                  sx={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {columns.map((c) => (
                    <TableCell key={c.key} align={c.align} sx={c.hideOnMobile ? mobileHidden : undefined}>
                      {c.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          {empty && (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ borderBottom: 0 }}>
                {emptyState ?? (
                  <EmptyState
                    kind="no-results"
                    size="compact"
                    title="No results"
                    description="Try adjusting your filters."
                  />
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
