import type { ComponentDoc } from '../catalog';

export const statusBadgeDoc: ComponentDoc = {
  id: 'status-badge',
  name: 'StatusBadge',
  category: 'feedback',
  summary: 'Compact, non-interactive status label with consistent tones.',
  purpose:
    'Shows the state of a record (approved, failing, draft…) in tables, headers and lists with one shared color language.',
  props: [
    {
      name: 'tone',
      type: "'success' | 'warning' | 'error' | 'info' | 'neutral'",
      required: true,
      description: 'Semantic tone. Shared with Alert.',
    },
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Visible text. Always rendered so color is never the only signal.',
    },
    { name: 'size', type: "'small' | 'medium'", default: "'small'", description: '22 / 28px height.' },
    { name: 'showDot', type: 'boolean', default: 'true', description: 'Leading decorative dot.' },
  ],
  apiDecisions: [
    'Built on a <span>, not MUI `Chip`: a badge is not interactive, and Chip brings click/delete semantics that would need to be suppressed.',
    '`tone` + required `label` instead of a color prop — product code says what the state means, the library decides how it looks.',
    'Tones are shared with Alert through a single `StatusTone` type and `TONE_COLORS` map.',
  ],
  states: ['Success', 'Warning', 'Error', 'Info', 'Neutral', 'Without dot', 'Medium size'],
  accessibility: [
    'The label is real text, so status is available without color (WCAG 1.4.1).',
    'The dot is aria-hidden.',
    'Not a live region: if a status changes in response to user action, announce the change with an Alert or status message.',
    'Tone text on tonal background meets 4.5:1 in both schemes (token tests).',
  ],
  testing: [
    'Every tone renders its label as visible text.',
    'The dot is hidden from assistive technology and optional.',
    'It is not a live region.',
    'No axe violations across tones.',
  ],
  guidelines: {
    do: ['Use the same tone for the same meaning across the product.', 'Keep labels to one or two words.'],
    dont: ['Make badges clickable; use a Button or link next to them.', 'Invent new colors per screen.'],
  },
};
