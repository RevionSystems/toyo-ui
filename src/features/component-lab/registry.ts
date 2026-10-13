import type { ComponentId } from '@shared/catalog';
import { buttonEntry } from './entries/button';
import type { AnyLabEntry } from './types';

/** Lab entries by component. Components without an entry yet show their docs only. */
export const REGISTRY: Partial<Record<ComponentId, AnyLabEntry>> = {
  button: buttonEntry,
};

export const getEntry = (id: ComponentId) => REGISTRY[id];
