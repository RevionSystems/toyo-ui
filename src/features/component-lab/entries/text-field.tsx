import Box from '@mui/material/Box';
import { TextField } from '@/components/ui';
import { ICON_NAMES, iconImport, iconJsx, iconNode, type IconName } from '../icons';
import { example, jsx, raw } from '../jsx';
import { defineEntry } from '../types';

interface TextFieldState {
  label: string;
  helperText: string;
  placeholder: string;
  size: 'small' | 'medium';
  type: 'text' | 'email' | 'password' | 'search';
  startIcon: IconName;
  required: boolean;
  disabled: boolean;
  hideLabel: boolean;
  validateEmail: boolean;
  errorMessage: string;
  maxLength: number | undefined;
}

const emailRule = "(v) => (/^\\S+@\\S+\\.\\S+$/.test(v) ? undefined : 'Enter a valid email address.')";
const validateEmail = (v: string) => (/^\S+@\S+\.\S+$/.test(v) ? undefined : 'Enter a valid email address.');

export const textFieldEntry = defineEntry<TextFieldState>({
  id: 'text-field',
  defaults: {
    label: 'Email address',
    helperText: "We'll only use this for build notifications.",
    placeholder: 'name@company.com',
    size: 'medium',
    type: 'email',
    startIcon: 'None',
    required: true,
    disabled: false,
    hideLabel: false,
    validateEmail: true,
    errorMessage: '',
    maxLength: undefined,
  },
  controls: [
    { kind: 'text', name: 'label' },
    { kind: 'text', name: 'helperText', label: 'helper text' },
    { kind: 'text', name: 'placeholder' },
    { kind: 'text', name: 'errorMessage', label: 'error message' },
    { kind: 'select', name: 'size', options: ['small', 'medium'] },
    { kind: 'select', name: 'type', options: ['text', 'email', 'password', 'search'] },
    { kind: 'select', name: 'startIcon', label: 'start icon', options: ICON_NAMES },
    { kind: 'number', name: 'maxLength', label: 'max length', min: 1, max: 200 },
    { kind: 'boolean', name: 'required' },
    { kind: 'boolean', name: 'disabled' },
    { kind: 'boolean', name: 'hideLabel', label: 'hide label' },
    { kind: 'boolean', name: 'validateEmail', label: 'validate (email rule)' },
  ],
  render: (s) => (
    <Box sx={{ width: '100%', maxWidth: 380 }}>
      <TextField
        // Remount when the rule changes so a stale validation error doesn't linger.
        key={String(s.validateEmail)}
        fullWidth
        label={s.label}
        helperText={s.helperText || undefined}
        placeholder={s.placeholder || undefined}
        size={s.size}
        type={s.type}
        startIcon={iconNode(s.startIcon)}
        required={s.required}
        disabled={s.disabled}
        hideLabel={s.hideLabel}
        errorMessage={s.errorMessage || undefined}
        validate={s.validateEmail ? validateEmail : undefined}
        maxLength={s.maxLength}
      />
    </Box>
  ),
  code: (s) =>
    example({
      components: ['TextField'],
      imports: [iconImport(s.startIcon)].filter((l): l is string => !!l),
      element: jsx(
        'TextField',
        {
          label: s.label,
          helperText: s.helperText || undefined,
          placeholder: s.placeholder || undefined,
          size: s.size,
          type: s.type,
          startIcon: iconJsx(s.startIcon) ? raw(iconJsx(s.startIcon)!) : undefined,
          required: s.required,
          disabled: s.disabled,
          hideLabel: s.hideLabel,
          errorMessage: s.errorMessage || undefined,
          validate: s.validateEmail ? raw(emailRule) : undefined,
          maxLength: s.maxLength,
          onChange: raw('setEmail'),
        },
        { defaults: { size: 'medium', type: 'text' } },
      ),
    }),
  gallery: [
    {
      title: 'States',
      render: () => (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Default" helperText="Helper text" />
          <TextField label="Filled" defaultValue="Toyo-ui" />
          <TextField label="Error" defaultValue="toyo@" errorMessage="Enter a valid email address." />
          <TextField label="Disabled" defaultValue="Read only value" disabled />
        </Box>
      ),
    },
    {
      title: 'Sizes and adornments',
      render: () => (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Small" size="small" />
          <TextField
            label="Search components"
            hideLabel
            placeholder="Search components…"
            startIcon={iconNode('Search')}
          />
          <TextField label="Summary" maxLength={60} defaultValue="Accessible button with loading state" />
          <TextField label="Required field" required />
        </Box>
      ),
    },
  ],
});
