import type { ComponentDoc } from '../catalog';

export const textFieldDoc: ComponentDoc = {
  id: 'text-field',
  status: 'stable',
  name: 'TextField',
  category: 'inputs',
  summary: 'Labelled text input with helper text, validation and error messaging.',
  purpose:
    'Collects short free-form text. The label is mandatory, errors are linked to the input, and validation runs at a predictable moment (blur) instead of on every keystroke.',
  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Accessible name. Required even when visually hidden.',
    },
    {
      name: 'hideLabel',
      type: 'boolean',
      default: 'false',
      description: 'Hides the label visually; it stays the accessible name.',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Hint under the field, linked via aria-describedby. Replaced by the error when present.',
    },
    {
      name: 'errorMessage',
      type: 'string',
      description: 'Error to show. Its presence sets aria-invalid. Overrides `validate`.',
    },
    {
      name: 'validate',
      type: '(value: string) => string | undefined',
      description: 'Runs on blur, then on each change once an error is showing. Return a message to show an error.',
    },
    { name: 'onChange', type: '(value: string) => void', description: 'Receives the new string value, not the event.' },
    { name: 'value', type: 'string', description: 'Controlled value. Omit for uncontrolled use with `defaultValue`.' },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Marks the field required (native attribute and visual asterisk).',
    },
    { name: 'size', type: "'small' | 'medium'", default: "'medium'", description: 'Control height: 32 / 40px.' },
    { name: 'maxLength', type: 'number', description: 'Enforced character limit with a live "n / max" counter.' },
    { name: 'startIcon', type: 'ReactNode', description: 'Decorative icon inside the start of the field.' },
    {
      name: 'type',
      type: "'text' | 'email' | 'password' | 'search' | 'url' | …",
      default: "'text'",
      description: 'Native input type.',
    },
  ],
  apiDecisions: [
    '`label` is required at the type level — the most common accessibility failure for inputs becomes a compile error.',
    "Replaces MUI's `error` + `helperText` pair with `errorMessage`: one source of truth, so an error can't be flagged without saying what is wrong.",
    "`onChange` receives the string value; consumers don't unwrap `event.target.value` everywhere.",
    'Omits `select` and `multiline`: those deserve their own components with their own accessibility contracts.',
    'Validation is a pure function prop rather than a form library integration, so it works with any form state.',
  ],
  states: ['Default', 'Focus-visible', 'Filled', 'Disabled', 'Error', 'Required', 'With counter', 'Hidden label'],
  accessibility: [
    'The label is a real <label> associated with the input; `hideLabel` keeps it in the accessibility tree.',
    'Helper text and errors are linked through aria-describedby and read after the label.',
    'Error state sets aria-invalid="true"; the message says how to fix the problem, not just that it is wrong.',
    'Validation waits for blur, so screen-reader users are not interrupted while typing.',
    'The character counter is a polite live region and includes "characters used" for context.',
    'Placeholder text is never used as a label substitute.',
  ],
  testing: [
    'Input is reachable by role and accessible name.',
    'Helper text is the accessible description.',
    'validate runs on blur, sets aria-invalid and the error description, and clears as the value is fixed.',
    'errorMessage overrides validate.',
    'onChange receives strings; controlled values are respected.',
    'maxLength is enforced and the counter updates.',
    'No axe violations in the error state.',
  ],
  guidelines: {
    do: [
      'Write labels as nouns ("Email address").',
      'Explain how to fix an error ("Enter a valid email address.").',
      'Use hideLabel only when context makes the purpose obvious, e.g. a search field with an icon.',
    ],
    dont: [
      'Validate on every keystroke before the user leaves the field.',
      'Put instructions only in the placeholder.',
      'Disable submit to signal errors; show them.',
    ],
  },
};
