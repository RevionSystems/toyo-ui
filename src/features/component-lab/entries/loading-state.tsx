import Box from '@mui/material/Box';
import { LoadingState, type LoadingVariant } from '@/components/ui';
import { example, jsx } from '../jsx';
import { defineEntry } from '../types';

interface LoadingStateEntryState {
  variant: LoadingVariant;
  label: string;
  hideLabel: boolean;
  determinate: boolean;
  progress: number;
  lines: number;
}

export const loadingStateEntry = defineEntry<LoadingStateEntryState>({
  id: 'loading-state',
  defaults: {
    variant: 'linear',
    label: 'Loading components',
    hideLabel: false,
    determinate: true,
    progress: 64,
    lines: 3,
  },
  controls: [
    { kind: 'select', name: 'variant', options: ['spinner', 'linear', 'skeleton'] },
    { kind: 'text', name: 'label' },
    { kind: 'boolean', name: 'hideLabel', label: 'hide label' },
    { kind: 'boolean', name: 'determinate' },
    { kind: 'number', name: 'progress', min: 0, max: 100, step: 5 },
    { kind: 'number', name: 'lines', min: 1, max: 8 },
  ],
  render: (s) => (
    <Box sx={{ width: '100%', maxWidth: 420, display: 'flex', justifyContent: 'center' }}>
      <LoadingState
        variant={s.variant}
        label={s.label}
        hideLabel={s.hideLabel}
        progress={s.determinate && s.variant !== 'skeleton' ? s.progress : undefined}
        lines={s.lines}
      />
    </Box>
  ),
  code: (s) =>
    example({
      components: ['LoadingState'],
      element: jsx(
        'LoadingState',
        {
          variant: s.variant,
          label: s.label,
          hideLabel: s.hideLabel,
          progress: s.determinate && s.variant !== 'skeleton' ? s.progress : undefined,
          lines: s.variant === 'skeleton' ? s.lines : undefined,
        },
        { defaults: { variant: 'spinner', label: 'Loading', lines: 3 } },
      ),
    }),
  gallery: [
    {
      title: 'Variants',
      render: () => (
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            alignItems: 'center',
          }}
        >
          <LoadingState label="Spinner" />
          <LoadingState variant="linear" label="Linear" />
          <LoadingState variant="skeleton" label="Skeleton" lines={3} />
        </Box>
      ),
    },
  ],
});
