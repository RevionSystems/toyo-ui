import type { ReactNode } from 'react';

/** An editable prop in the playground. `name` is constrained to the component's prop keys. */
export type Control<P> =
  | { kind: 'text'; name: keyof P & string; label?: string }
  | { kind: 'boolean'; name: keyof P & string; label?: string }
  | { kind: 'number'; name: keyof P & string; label?: string; min: number; max: number; step?: number }
  | { kind: 'select'; name: keyof P & string; label?: string; options: readonly string[] };

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface LabEntry<P> {
  id: string;
  name: string;
  category: 'Brand' | 'Layout' | 'Data display' | 'Inputs' | 'Feedback' | 'Navigation';
  description: string;
  /** Initial playground values. Only fields with a control are editable. */
  defaults: P;
  controls: Control<P>[];
  render: (props: P) => ReactNode;
  /** Usage snippet reflecting the current playground values. */
  code: (props: P) => string;
  props: PropDoc[];
  guidelines: { do: string[]; dont: string[] };
}

/** Erases the prop type so entries for different components can share one array. */
export type AnyLabEntry = LabEntry<Record<string, unknown>>;
export const defineEntry = <P>(entry: LabEntry<P>): AnyLabEntry => entry as unknown as AnyLabEntry;
