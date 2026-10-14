import { StatusBadge } from '@toyo-ui/react';
import type { ComponentStatus } from '@/catalog/catalog';

const LABEL: Record<ComponentStatus, string> = { stable: 'Stable', beta: 'Beta' };

/** Lifecycle status of a library component, rendered with the library's own StatusBadge. */
export function ComponentStatusBadge({
  status,
  size = 'small',
}: {
  status: ComponentStatus;
  size?: 'small' | 'medium';
}) {
  return <StatusBadge tone={status === 'stable' ? 'success' : 'info'} label={LABEL[status]} size={size} />;
}
