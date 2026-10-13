import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

/** MUI props Toyo-ui replaces or deliberately does not expose. */
type OmittedMuiProps =
  'variant' | 'color' | 'size' | 'disableElevation' | 'disableRipple' | 'disableFocusRipple' | 'loadingIndicator';

export interface ButtonProps extends Omit<MuiButtonProps, OmittedMuiProps> {
  /** Visual emphasis. Use one `primary` action per view. */
  variant?: ButtonVariant;
  /** Control height: 32 / 40 / 48px (see `dimensions.control`). */
  size?: ButtonSize;
  /**
   * Shows a spinner and disables the button. The label stays in place so the
   * accessible name doesn't change while loading.
   */
  loading?: boolean;
  /**
   * Where the spinner appears while loading. Defaults to `start` so the label stays
   * visible; MUI's `center` hides the label visually.
   */
  loadingPosition?: 'start' | 'center' | 'end';
}

const VARIANT_MAP: Record<ButtonVariant, Pick<MuiButtonProps, 'variant' | 'color'>> = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'contained', color: 'inherit' },
  outline: { variant: 'outlined', color: 'inherit' },
  text: { variant: 'text', color: 'primary' },
};

/**
 * Action button. Wraps MUI `Button` with four semantic variants instead of
 * MUI's variant × color matrix, and a first-class loading state.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'medium', loading = false, loadingPosition, startIcon, sx, ...rest },
  ref,
) {
  const mapped = VARIANT_MAP[variant];
  return (
    <MuiButton
      ref={ref}
      {...mapped}
      size={size}
      loading={loading}
      loadingPosition={loadingPosition ?? 'start'}
      startIcon={startIcon}
      aria-busy={loading || undefined}
      sx={[
        variant === 'secondary' && {
          bgcolor: 'surfaceMuted',
          color: 'text.primary',
          border: 1,
          borderColor: 'divider',
          '&:hover': { bgcolor: 'action.hover' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
});
