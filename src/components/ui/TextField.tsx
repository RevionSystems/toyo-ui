import MuiTextField, { type TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { visuallyHidden } from '@mui/utils';
import { forwardRef, useId, useState, type FocusEvent, type ReactNode } from 'react';

/** MUI props replaced by Toyo-ui equivalents or not supported. */
type OmittedMuiProps =
  | 'variant'
  | 'color'
  | 'size'
  | 'label'
  | 'error'
  | 'helperText'
  | 'select'
  | 'multiline'
  | 'rows'
  | 'minRows'
  | 'maxRows'
  | 'hiddenLabel'
  | 'onChange';

export interface TextFieldProps extends Omit<MuiTextFieldProps, OmittedMuiProps> {
  /** Required: every field needs an accessible name. */
  label: string;
  /** Hides the label visually; it remains the accessible name. */
  hideLabel?: boolean;
  /** Hint shown under the field when there is no error. */
  helperText?: string;
  /** Error to show. Its presence sets the error state; it overrides `validate`. */
  errorMessage?: string;
  /** Called on blur (and on change once an error is showing). Return a message to show an error. */
  validate?: (value: string) => string | undefined;
  /** Receives the new string value, not the event. */
  onChange?: (value: string) => void;
  size?: 'small' | 'medium';
  /** Enforced limit; shows a live "n / max" counter. */
  maxLength?: number;
  startIcon?: ReactNode;
}

/**
 * Labelled text input. Errors and hints are linked through `aria-describedby`;
 * `aria-invalid` follows the error state.
 */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
  {
    label,
    hideLabel = false,
    helperText,
    errorMessage,
    validate,
    onChange,
    onBlur,
    size = 'medium',
    maxLength,
    startIcon,
    value,
    defaultValue,
    slotProps,
    ...rest
  },
  ref,
) {
  const counterId = useId();
  const controlled = value !== undefined;
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const current = controlled ? String(value ?? '') : inner;
  const [validationError, setValidationError] = useState<string>();
  const error = errorMessage ?? validationError;

  const handleChange = (next: string) => {
    if (!controlled) setInner(next);
    // Re-validate as the user fixes an error, but don't nag before the first blur.
    if (validationError && validate) setValidationError(validate(next));
    onChange?.(next);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (validate) setValidationError(validate(e.target.value));
    onBlur?.(e);
  };

  const hint = error ?? helperText;
  const counter = maxLength !== undefined ? `${current.length} / ${maxLength}` : undefined;

  return (
    <MuiTextField
      ref={ref}
      {...rest}
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      label={label}
      size={size}
      error={!!error}
      helperText={
        hint || counter ? (
          <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <span>{hint}</span>
            {counter && (
              <Box
                component="span"
                id={counterId}
                aria-live="polite"
                sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
              >
                {counter}
                <Box component="span" sx={visuallyHidden}>
                  {' '}
                  characters used
                </Box>
              </Box>
            )}
          </Box>
        ) : undefined
      }
      slotProps={{
        ...slotProps,
        inputLabel: { ...(hideLabel ? { sx: visuallyHidden } : {}), ...(slotProps?.inputLabel ?? {}) },
        htmlInput: { maxLength, ...(slotProps?.htmlInput ?? {}) },
        input: {
          ...(startIcon ? { startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment> } : {}),
          ...(hideLabel ? { notched: false } : {}),
          ...(slotProps?.input ?? {}),
        },
      }}
    />
  );
});
