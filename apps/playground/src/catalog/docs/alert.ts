import type { ComponentDoc } from '../catalog';

export const alertDoc: ComponentDoc = {
  id: 'alert',
  status: 'stable',
  name: 'Alert',
  category: 'feedback',
  summary: 'Inline status message with optional title, action and dismiss.',
  purpose:
    "Communicates the outcome of an action or a condition that needs attention, inline with the content it relates to. The screen-reader behavior follows the message's urgency.",
  props: [
    {
      name: 'severity',
      type: "'info' | 'success' | 'warning' | 'error'",
      default: "'info'",
      description: 'Tone, icon and live-region role.',
    },
    { name: 'title', type: 'string', description: 'Short bold summary above the message.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'The message.' },
    { name: 'onClose', type: '() => void', description: 'Shows a close button labelled "Dismiss".' },
    { name: 'action', type: 'ReactNode', description: 'Extra action at the end, e.g. a Retry button.' },
    {
      name: 'announce',
      type: 'boolean',
      default: 'true',
      description: 'false removes the live-region role for messages that are present on page load.',
    },
  ],
  apiDecisions: [
    'Maps severity to the ARIA role: error/warning → role="alert" (assertive), info/success → role="status" (polite). MUI uses role="alert" for everything, which interrupts users for routine confirmations.',
    '`announce={false}` covers static alerts; MUI offers no first-class way to opt out of the live region.',
    "Removes MUI's `variant` (standard/filled/outlined) and `color`: Toyo-ui has one alert style built on the contrast-tested tonal tokens.",
    'The close button is labelled "Dismiss" instead of MUI\'s "Close".',
  ],
  states: ['Info', 'Success', 'Warning', 'Error', 'With title', 'With action', 'Dismissible', 'Long content'],
  accessibility: [
    'Errors and warnings use role="alert" and are announced immediately; info and success use role="status" and wait for a pause.',
    'Render the alert container before inserting the message when possible; live regions added with content already inside may not be announced by every screen reader.',
    'The icon is decorative; severity is also conveyed by the title or message text, never by color alone.',
    'Body text uses text.primary on the tonal background (≥ 4.5:1, enforced by token tests).',
    'The dismiss button has an accessible name and is reachable by keyboard.',
  ],
  testing: [
    'Each severity renders the expected role (alert vs status).',
    'announce={false} removes the live role.',
    'Title renders; the dismiss button is labelled and calls onClose.',
    'No axe violations for each severity.',
  ],
  guidelines: {
    do: [
      'Place alerts next to the content they describe.',
      'Pair warnings and errors with a way to resolve them (action or link).',
      'Keep success messages short.',
    ],
    dont: [
      'Use an alert for marketing or decoration.',
      'Stack several alerts; summarise instead.',
      'Auto-dismiss errors — use a Snackbar pattern only for transient success.',
    ],
  },
};
