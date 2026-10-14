import type { ComponentDoc } from '../catalog';

export const loadingStateDoc: ComponentDoc = {
  id: 'loading-state',
  name: 'LoadingState',
  category: 'feedback',
  summary: 'Announced loading indicator: spinner, linear bar or skeleton.',
  purpose:
    'Tells users that content or an operation is in progress, with a label that assistive technology announces once.',
  props: [
    {
      name: 'variant',
      type: "'spinner' | 'linear' | 'skeleton'",
      default: "'spinner'",
      description: 'Spinner for short waits, linear for progress, skeleton for content placeholders.',
    },
    {
      name: 'label',
      type: 'string',
      default: "'Loading'",
      description: 'What is loading. Announced and, unless hidden, visible.',
    },
    { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Hides the label visually only.' },
    { name: 'progress', type: 'number', description: '0–100 for determinate progress (clamped). Omit when unknown.' },
    { name: 'lines', type: 'number', default: '3', description: 'Placeholder lines for the skeleton variant.' },
  ],
  apiDecisions: [
    'One component for three MUI primitives (CircularProgress, LinearProgress, Skeleton) so every loading state gets the same announcement behavior.',
    '`label` defaults to "Loading" — MUI progress indicators have no accessible name by default.',
    'Progress is clamped to 0–100 so bad input never produces invalid aria-valuenow.',
  ],
  states: ['Spinner', 'Linear indeterminate', 'Linear determinate', 'Skeleton', 'Hidden label'],
  accessibility: [
    'Wrapped in role="status" so the label is announced politely once.',
    'Spinner and bar are progressbars named by the label; determinate progress exposes aria-valuenow.',
    'Skeletons set aria-busy and hide the placeholder shapes from assistive technology.',
    'Animations respect prefers-reduced-motion through the global theme rule.',
  ],
  testing: [
    'Each variant is announced with its label.',
    'Determinate progress exposes aria-valuenow and visible percentage.',
    'Progress is clamped.',
    'Skeleton is busy and renders the requested lines.',
    'No axe violations with a hidden label.',
  ],
  guidelines: {
    do: [
      'Say what is loading ("Loading components").',
      'Use skeletons when the layout of the result is known.',
      'Show determinate progress for long operations.',
    ],
    dont: ['Show a spinner for under ~300ms; it flickers.', 'Stack several spinners on one screen.'],
  },
};
