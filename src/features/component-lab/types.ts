import type { ComponentId } from '@shared/catalog';
import type { ReactNode } from 'react';

/** An editable prop in the playground. `name` is constrained to the playground state's keys. */
export type Control<P> =
  | { kind: 'text'; name: keyof P & string; label?: string }
  | { kind: 'boolean'; name: keyof P & string; label?: string }
  | { kind: 'number'; name: keyof P & string; label?: string; min: number; max: number; step?: number }
  | { kind: 'select'; name: keyof P & string; label?: string; options: readonly string[] };

export interface GallerySection {
  title: string;
  render: () => ReactNode;
}

/**
 * Everything the lab needs to render a component interactively. Documentation
 * (props, accessibility, tests, guidelines) lives in `shared/catalog.ts`.
 *
 * `P` is the playground state: usually the component's props, with non-serialisable
 * values (icons, callbacks) represented by names so they can be edited and printed.
 */
export interface LabEntry<P> {
  id: ComponentId;
  defaults: P;
  controls: Control<P>[];
  /** Live preview of the configured instance. */
  render: (state: P) => ReactNode;
  /** Usage example generated from the same state as the preview. */
  code: (state: P) => string;
  /** Static showcase of variants and states. */
  gallery?: GallerySection[];
}

/** Erases `P` so entries for different components can share one registry. */
export type AnyLabEntry = LabEntry<Record<string, unknown>>;
export const defineEntry = <P>(entry: LabEntry<P>): AnyLabEntry => entry as unknown as AnyLabEntry;
