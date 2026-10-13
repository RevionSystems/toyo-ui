import Chip from '@mui/material/Chip';
import type { DocumentStatus, PartStatus, SupplierStatus } from '@/data/types';

export type Status = DocumentStatus | PartStatus | SupplierStatus;
type Tone = 'success' | 'warning' | 'info' | 'neutral';

const STATUS_META: Record<Status, { label: string; tone: Tone }> = {
  approved: { label: 'Approved', tone: 'success' },
  released: { label: 'Released', tone: 'success' },
  'in-review': { label: 'In review', tone: 'warning' },
  conditional: { label: 'Conditional', tone: 'warning' },
  'under-review': { label: 'Under review', tone: 'info' },
  draft: { label: 'Draft', tone: 'neutral' },
  obsolete: { label: 'Obsolete', tone: 'neutral' },
};

export interface StatusChipProps {
  status: Status;
  size?: 'small' | 'medium';
}

/** Lifecycle status for documents, parts and suppliers, mapped to a consistent tone. */
export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const { label, tone } = STATUS_META[status];
  return (
    <Chip
      label={label}
      size={size}
      sx={(theme) => {
        if (tone === 'neutral') {
          return { bgcolor: 'surfaceMuted', color: 'text.secondary', border: 1, borderColor: 'divider' };
        }
        const palette = (theme.vars ?? theme).palette;
        const main = palette[tone].main;
        // Text/background pairs are contrast-tested in tokens.test.ts.
        return {
          color: main,
          bgcolor: palette.tonal[tone],
          border: `1px solid color-mix(in srgb, ${main} 30%, transparent)`,
        };
      }}
    />
  );
}
