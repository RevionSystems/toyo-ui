import type { ComponentDoc } from '../catalog';

export const buttonDoc: ComponentDoc = {
  id: 'button',
  status: 'stable',
  name: 'Button',
  category: 'buttons',
  summary: 'A flexible and accessible button for primary actions, navigation and user interactions.',
  purpose:
    'Triggers an action or navigation. Four semantic variants express emphasis; a built-in loading state covers async actions without layout shift.',
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline' | 'text'",
      default: "'primary'",
      description: 'Visual emphasis. Use one primary action per view.',
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      default: "'medium'",
      description: 'Control height: 32 / 40 / 48px.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Shows a spinner and disables the button; the label stays for a stable accessible name.',
    },
    {
      name: 'loadingPosition',
      type: "'start' | 'center' | 'end'",
      default: "'start'",
      description:
        "Where the spinner appears. 'center' hides the label visually (it stays available to assistive tech).",
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Removes the button from the tab order. Prefer explaining why an action is unavailable.',
    },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches to the container width.' },
    {
      name: 'startIcon',
      type: 'ReactNode',
      description: 'Icon before the label. Decorative; the label provides the name.',
    },
    { name: 'endIcon', type: 'ReactNode', description: 'Icon after the label, e.g. a forward arrow.' },
    { name: 'href', type: 'string', description: 'Renders a link styled as a button; routes client-side.' },
    {
      name: 'onClick',
      type: '(event: React.MouseEvent<HTMLButtonElement>) => void',
      description: 'Click handler. Not called while disabled or loading.',
    },
  ],
  apiDecisions: [
    "Replaces MUI's `variant` × `color` matrix with four semantic variants, so 'secondary' means the same thing everywhere.",
    'Removes `disableElevation`, `disableRipple` and `loadingIndicator`: elevation and feedback are design-system decisions, not per-instance ones.',
    'Keeps every other MUI prop (`href`, `type`, `aria-*`, `onClick`…) through `Omit<MuiButtonProps, …>`, so it remains a drop-in button.',
    "Defaults `loadingPosition` to 'start' (MUI defaults to 'center', which hides the label) so users still see what is in progress.",
    'Forwards its ref, so it works with tooltips, menus and focus management.',
  ],
  states: ['Default', 'Hover', 'Focus-visible', 'Active', 'Disabled', 'Loading', 'Long content'],
  accessibility: [
    'Renders a native <button> (or <a> with href), so Enter and Space work without extra code.',
    'Icon-only usage must pass `aria-label`; icons next to a visible label are decorative.',
    'Loading keeps the label and sets aria-busy; the spinner is a progressbar labelled by the button.',
    'Focus-visible shows the global 2px focus ring with at least 3:1 contrast against the surface.',
    'Disabled buttons cannot receive focus. When users need to know why, show the reason as text nearby.',
    'Minimum target height is 32px (small), above the WCAG 2.2 24px minimum.',
  ],
  testing: [
    'Calls onClick on click and on Enter/Space.',
    'Does not call onClick when disabled or loading.',
    'Exposes aria-busy and keeps its accessible name while loading.',
    'Renders a link when href is set.',
    'Has no axe violations in each variant.',
  ],
  guidelines: {
    do: [
      'Use one primary button per view for the main action.',
      'Write labels as verbs: "Save changes", not "OK".',
      'Use loading for async actions instead of disabling silently.',
    ],
    dont: [
      'Use a button to navigate to another page — pass href so it renders a link.',
      'Place two primary buttons side by side.',
      'Rely on color alone to signal a destructive action; say it in the label.',
    ],
  },
};
