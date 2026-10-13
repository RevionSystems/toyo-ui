/**
 * Component catalog — framework-free metadata about the Toyo-ui library.
 *
 * Shared by the React app (navigation, docs, API explorer) and the AI server (model
 * context and allowlist). It must not import React or MUI so the server can load it.
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

/** Filled in per component as the library is implemented. */
export const CATALOG: Record<
  ComponentId,
  Pick<ComponentDoc, 'id' | 'name' | 'category' | 'summary'> & Partial<ComponentDoc>
> = {
  button: {
    id: 'button',
    name: 'Button',
    category: 'buttons',
    summary: 'Primary, secondary and text actions with loading state.',
  },
  'text-field': {
    id: 'text-field',
    name: 'TextField',
    category: 'inputs',
    summary: 'Labelled text input with helper and error messaging.',
  },
  alert: {
    id: 'alert',
    name: 'Alert',
    category: 'feedback',
    summary: 'Inline status message with optional title and action.',
  },
  'status-badge': {
    id: 'status-badge',
    name: 'StatusBadge',
    category: 'feedback',
    summary: 'Compact status label with consistent tones.',
  },
  'loading-state': {
    id: 'loading-state',
    name: 'LoadingState',
    category: 'feedback',
    summary: 'Announced loading indicator: spinner, bar or skeleton.',
  },
  'empty-state': {
    id: 'empty-state',
    name: 'EmptyState',
    category: 'feedback',
    summary: 'Placeholder for empty lists and zero results.',
  },
  dialog: {
    id: 'dialog',
    name: 'Dialog',
    category: 'overlays',
    summary: 'Modal dialog with labelled title and managed focus.',
  },
  'data-table': {
    id: 'data-table',
    name: 'DataTable',
    category: 'data-display',
    summary: 'Typed, sortable table with empty and loading states.',
  },
};

export const componentsInCategory = (category: CategoryId) =>
  COMPONENT_IDS.filter((id) => CATALOG[id].category === category);

export const isComponentId = (value: string): value is ComponentId =>
  (COMPONENT_IDS as readonly string[]).includes(value);
