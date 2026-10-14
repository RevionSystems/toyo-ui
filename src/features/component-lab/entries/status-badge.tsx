import Box from '@mui/material/Box';
import { StatusBadge, type StatusTone } from '@/components/ui';
import { example, jsx, raw } from '../jsx';
import { defineEntry } from '../types';

interface StatusBadgeState {
  tone: StatusTone;
  label: string;
  size: 'small' | 'medium';
  showDot: boolean;
}

const row = { display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' } as const;

export const statusBadgeEntry = defineEntry<StatusBadgeState>({
  id: 'status-badge',
  defaults: { tone: 'success', label: 'Approved', size: 'small', showDot: true },
  controls: [
    { kind: 'select', name: 'tone', options: ['success', 'warning', 'error', 'info', 'neutral'] },
    { kind: 'text', name: 'label' },
    { kind: 'select', name: 'size', options: ['small', 'medium'] },
    { kind: 'boolean', name: 'showDot', label: 'show dot' },
  ],
  render: (s) => <StatusBadge tone={s.tone} label={s.label} size={s.size} showDot={s.showDot} />,
  code: (s) =>
    example({
      components: ['StatusBadge'],
      element: jsx(
        'StatusBadge',
        { tone: s.tone, label: s.label, size: s.size, showDot: s.showDot ? undefined : raw('false') },
        { defaults: { size: 'small' } },
      ),
    }),
  gallery: [
    {
      title: 'Tones',
      render: () => (
        <Box sx={row}>
          <StatusBadge tone="success" label="Approved" />
          <StatusBadge tone="warning" label="In review" />
          <StatusBadge tone="error" label="Failing" />
          <StatusBadge tone="info" label="Beta" />
          <StatusBadge tone="neutral" label="Draft" />
        </Box>
      ),
    },
    {
      title: 'Sizes and dot',
      render: () => (
        <Box sx={row}>
          <StatusBadge tone="success" label="Small" />
          <StatusBadge tone="success" label="Medium" size="medium" />
          <StatusBadge tone="info" label="No dot" showDot={false} />
        </Box>
      ),
    },
  ],
});
