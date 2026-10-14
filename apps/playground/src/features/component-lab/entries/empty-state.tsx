import Box from '@mui/material/Box';
import { Button, EmptyState, type EmptyStateKind } from '@toyo-ui/react';
import { example, jsx, raw } from '../jsx';
import { defineEntry } from '../types';

interface EmptyStateEntryState {
  kind: EmptyStateKind;
  title: string;
  description: string;
  withAction: boolean;
  actionLabel: string;
  size: 'compact' | 'default';
}

export const emptyStateEntry = defineEntry<EmptyStateEntryState>({
  id: 'empty-state',
  defaults: {
    kind: 'no-results',
    title: 'No components match your filters',
    description: 'Try removing a filter or searching by component name.',
    withAction: true,
    actionLabel: 'Clear filters',
    size: 'default',
  },
  controls: [
    { kind: 'select', name: 'kind', options: ['no-data', 'no-results', 'error'] },
    { kind: 'text', name: 'title' },
    { kind: 'text', name: 'description' },
    { kind: 'boolean', name: 'withAction', label: 'action' },
    { kind: 'text', name: 'actionLabel', label: 'action label' },
    { kind: 'select', name: 'size', options: ['default', 'compact'] },
  ],
  render: (s) => (
    <EmptyState
      kind={s.kind}
      title={s.title}
      description={s.description || undefined}
      size={s.size}
      action={s.withAction ? <Button variant="outline">{s.actionLabel}</Button> : undefined}
    />
  ),
  code: (s) =>
    example({
      components: s.withAction ? ['Button', 'EmptyState'] : ['EmptyState'],
      element: jsx(
        'EmptyState',
        {
          kind: s.kind,
          title: s.title,
          description: s.description || undefined,
          size: s.size,
          action: s.withAction
            ? raw(`<Button variant="outline" onClick={clearFilters}>${s.actionLabel}</Button>`)
            : undefined,
        },
        { defaults: { kind: 'no-data', size: 'default' } },
      ),
    }),
  gallery: [
    {
      title: 'Kinds',
      render: () => (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          <EmptyState size="compact" kind="no-data" title="No components yet" />
          <EmptyState size="compact" kind="no-results" title="No results" />
          <EmptyState size="compact" kind="error" title="Could not load" />
        </Box>
      ),
    },
  ],
});
