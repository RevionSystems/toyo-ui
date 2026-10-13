import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Enables sorting on this column. */
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right';
  width?: number | string;
  /** Hide below the `md` breakpoint to keep tables readable on phones. */
  hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
  /** Accessible name for the table. */
  caption: string;
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Makes rows navigable. The first column should contain a real link for keyboard users. */
  getRowHref?: (row: T) => string;
  initialSort?: { key: string; direction: 'asc' | 'desc' };
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Typed, sortable table. Generic over the row type so column renderers stay type-safe. */
export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowId,
  getRowHref,
  initialSort,
  emptyTitle = 'No results',
  emptyDescription,
}: DataTableProps<T>) {
  const navigate = useNavigate();
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

  return (
    <TableContainer>
      <Table size="small" aria-label={caption}>
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
          {sorted.map((row) => {
            const href = getRowHref?.(row);
            return (
              <TableRow
                key={getRowId(row)}
                hover={!!href}
                onClick={
                  href
                    ? (e) => {
                        // Let real links inside the row handle their own clicks.
                        if ((e.target as HTMLElement).closest('a,button')) return;
                        navigate(href);
                      }
                    : undefined
                }
                sx={href ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((c) => (
                  <TableCell key={c.key} align={c.align} sx={c.hideOnMobile ? mobileHidden : undefined}>
                    {c.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {sorted.length === 0 && (
        <Box>
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </Box>
      )}
    </TableContainer>
  );
}
