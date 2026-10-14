import type { ComponentDoc } from '../catalog';

export const emptyStateDoc: ComponentDoc = {
  id: 'empty-state',
  name: 'EmptyState',
  category: 'feedback',
  summary: 'Placeholder for empty collections, zero results and load failures.',
  purpose: 'Explains why there is nothing to show and offers the next step, instead of leaving a blank area.',
  props: [
    { name: 'title', type: 'string', required: true, description: 'What is empty.' },
    { name: 'description', type: 'string', description: 'Why, and how to get content.' },
    {
      name: 'kind',
      type: "'no-data' | 'no-results' | 'error'",
      default: "'no-data'",
      description: 'Chooses the default icon.',
    },
    { name: 'icon', type: 'ReactNode', description: 'Overrides the default icon. Decorative.' },
    { name: 'action', type: 'ReactNode', description: 'Recovery action, e.g. "Clear filters".' },
    {
      name: 'size',
      type: "'compact' | 'default'",
      default: "'default'",
      description: 'Compact for use inside tables and panels.',
    },
  ],
  apiDecisions: [
    'No MUI equivalent; composed from Box and Typography.',
    '`kind` encodes the three reasons a view is empty so teams use consistent icons and wording.',
    'The title is not a heading: empty states appear inside sections that already have one.',
  ],
  states: ['No data', 'No results', 'Error', 'With action', 'Compact'],
  accessibility: [
    'role="status" announces the empty state when a filter or search produces it.',
    'The icon is decorative and hidden from assistive technology.',
    'The action is a real button or link with a descriptive label.',
  ],
  testing: [
    'Title and description are announced as a status.',
    'The action is operable.',
    'It renders no heading.',
    'No axe violations.',
  ],
  guidelines: {
    do: ['Say how to recover ("Clear filters").', 'Use the error kind when loading failed, with a retry action.'],
    dont: ['Blame the user.', 'Leave an empty table without explanation.'],
  },
};
