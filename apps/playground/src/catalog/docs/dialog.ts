import type { ComponentDoc } from '../catalog';

export const dialogDoc: ComponentDoc = {
  id: 'dialog',
  status: 'stable',
  name: 'Dialog',
  category: 'overlays',
  summary: 'Modal dialog with labelled title, managed focus and async confirm.',
  purpose: 'Interrupts the flow to confirm a consequential action or collect a small amount of focused input.',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Visibility.' },
    {
      name: 'onClose',
      type: "(reason: 'escape' | 'backdrop' | 'cancel') => void",
      required: true,
      description: 'Called on Escape, backdrop click or Cancel. Never called while a confirm is pending.',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Dialog name (aria-labelledby). Phrase as a question for confirmations.',
    },
    { name: 'description', type: 'ReactNode', description: 'Consequences (aria-describedby).' },
    { name: 'children', type: 'ReactNode', description: 'Extra content such as a short form.' },
    {
      name: 'onConfirm',
      type: '() => void | Promise<void>',
      description: 'Shows the confirm button. A returned promise keeps the dialog loading until it settles.',
    },
    {
      name: 'confirmLabel',
      type: 'string',
      default: "'Confirm'",
      description: 'Use a verb that names the action ("Delete").',
    },
    { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Safe action.' },
    {
      name: 'tone',
      type: "'default' | 'destructive'",
      default: "'default'",
      description: 'Destructive adds a warning icon, danger-toned confirm and focuses Cancel first.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Controlled loading, combined with the promise-driven state.',
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      default: "'small'",
      description: 'Max width: 444 / 600 / 900px.',
    },
    {
      name: 'container',
      type: 'HTMLElement | null',
      default: 'document.body',
      description: 'Portal target. Render inside a scoped theme or color scheme, or a shadow root.',
    },
  ],
  apiDecisions: [
    'Composes MUI Dialog, DialogTitle, DialogContent and DialogActions into one component with a confirm/cancel contract — the common case needs no assembly.',
    "`onClose` receives a typed reason ('escape' | 'backdrop' | 'cancel') instead of MUI's event + string.",
    '`onConfirm` may return a promise; the dialog owns the pending state, disables Cancel and ignores Escape/backdrop until it settles, preventing double submits and lost requests.',
    'Initial focus follows the WAI-ARIA pattern: Cancel for destructive dialogs, Confirm otherwise. Applied after the enter transition, not with autoFocus, and never overrides focus the user has already moved into the dialog.',
  ],
  states: ['Default', 'Destructive', 'Loading (async confirm)', 'With content', 'Sizes'],
  accessibility: [
    'role="dialog" with aria-modal, named by the title and described by the description.',
    'Focus moves into the dialog on open, is trapped while open, and returns to the trigger on close (MUI focus trap).',
    'Escape closes the dialog unless a confirm is pending.',
    'Destructive dialogs focus the least destructive action first.',
    'If the user starts typing in a field before the enter transition ends, focus stays in that field.',
    'The pending confirm button keeps its label and exposes aria-busy.',
  ],
  testing: [
    'Labelled by title and described by description.',
    'Escape and Cancel call onClose with the right reason.',
    'Initial focus: Cancel when destructive, Confirm otherwise.',
    'Does not steal focus from a field the user is already typing in.',
    'Async confirm shows loading, disables Cancel and blocks Escape until it resolves.',
    'Focus stays inside while tabbing.',
    'No axe violations.',
  ],
  guidelines: {
    do: [
      'Name the object and consequence in the title ("Delete component?").',
      'Use a specific confirm verb.',
      'Return the promise from onConfirm so the dialog can show progress.',
    ],
    dont: [
      'Open a dialog from a dialog.',
      'Use dialogs for information that could be inline.',
      'Put long forms in a small dialog.',
    ],
  },
};
