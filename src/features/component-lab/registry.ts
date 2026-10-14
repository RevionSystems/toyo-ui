import type { ComponentId } from '@shared/catalog';
import { alertEntry } from './entries/alert';
import { buttonEntry } from './entries/button';
import { dataTableEntry } from './entries/data-table';
import { dialogEntry } from './entries/dialog';
import { emptyStateEntry } from './entries/empty-state';
import { loadingStateEntry } from './entries/loading-state';
import { statusBadgeEntry } from './entries/status-badge';
import { textFieldEntry } from './entries/text-field';
import type { AnyLabEntry } from './types';

/** Every catalog component has a lab entry; the Record type enforces it. */
export const REGISTRY: Record<ComponentId, AnyLabEntry> = {
  button: buttonEntry,
  'text-field': textFieldEntry,
  alert: alertEntry,
  'status-badge': statusBadgeEntry,
  'loading-state': loadingStateEntry,
  'empty-state': emptyStateEntry,
  dialog: dialogEntry,
  'data-table': dataTableEntry,
};

export const getEntry = (id: ComponentId) => REGISTRY[id];
