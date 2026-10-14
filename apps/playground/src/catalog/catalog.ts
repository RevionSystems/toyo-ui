import { alertDoc } from './docs/alert';
import { buttonDoc } from './docs/button';
import { dataTableDoc } from './docs/data-table';
import { dialogDoc } from './docs/dialog';
import { emptyStateDoc } from './docs/empty-state';
import { loadingStateDoc } from './docs/loading-state';
import { statusBadgeDoc } from './docs/status-badge';
import { textFieldDoc } from './docs/text-field';

/**
 * Component catalog — framework-free metadata about the Toyo-ui library.
 *
 * Used by the Component Lab for navigation, documentation and the API Explorer. Kept free of
 * React and MUI so it is plain data that tests can validate on their own.
 */

export const CATEGORIES = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'data-display', label: 'Data Display' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export const COMPONENT_IDS = [
  'button',
  'text-field',
  'alert',
  'status-badge',
  'loading-state',
  'empty-state',
  'dialog',
  'data-table',
] as const;

export type ComponentId = (typeof COMPONENT_IDS)[number];

export interface PropSpec {
  name: string;
  /** TypeScript type as written in the component's props interface. */
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ComponentDoc {
  id: ComponentId;
  /** Export name, e.g. `Button`. */
  name: string;
  category: CategoryId;
  summary: string;
  purpose: string;
  props: PropSpec[];
  /** How this API differs from the underlying MUI component, and why. */
  apiDecisions: string[];
  states: string[];
  accessibility: string[];
  testing: string[];
  guidelines: { do: string[]; dont: string[] };
}

export const CATALOG: Record<ComponentId, ComponentDoc> = {
  button: buttonDoc,
  'text-field': textFieldDoc,
  alert: alertDoc,
  'status-badge': statusBadgeDoc,
  'loading-state': loadingStateDoc,
  'empty-state': emptyStateDoc,
  dialog: dialogDoc,
  'data-table': dataTableDoc,
};

export const componentsInCategory = (category: CategoryId) =>
  COMPONENT_IDS.filter((id) => CATALOG[id].category === category);

export const isComponentId = (value: string): value is ComponentId =>
  (COMPONENT_IDS as readonly string[]).includes(value);
