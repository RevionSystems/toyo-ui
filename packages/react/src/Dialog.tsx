import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useId, useRef, useState, type ReactNode } from 'react';
import { Button } from './Button';

export type DialogCloseReason = 'escape' | 'backdrop' | 'cancel';

export interface DialogProps {
  open: boolean;
  /** Called on Escape, backdrop click or Cancel — never while a confirm is pending. */
  onClose: (reason: DialogCloseReason) => void;
  title: string;
  /** Linked to the dialog via aria-describedby. */
  description?: ReactNode;
  /** Extra content, e.g. a form. */
  children?: ReactNode;
  /** Shows a confirm button. A returned promise keeps the dialog in a loading state until it settles. */
  onConfirm?: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `destructive` adds a warning icon, uses a danger-toned confirm and focuses Cancel first. */
  tone?: 'default' | 'destructive';
  /** Controlled loading; combined with the promise-driven state. */
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  /**
   * Portal target. Defaults to `document.body`. Pass an element to render the dialog inside a
   * scoped theme or color scheme (e.g. a preview area) or a shadow root.
   */
  container?: HTMLElement | null;
}

const WIDTH = { small: 'xs', medium: 'sm', large: 'md' } as const;

/**
 * Modal dialog. MUI provides focus trapping and restoration; Toyo-ui adds labelled title
 * and description, async confirm handling and a safe initial focus for destructive actions.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  loading = false,
  size = 'small',
  container,
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const [pending, setPending] = useState(false);
  const busy = loading || pending;
  const destructive = tone === 'destructive';
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // WAI-ARIA dialog pattern: destructive dialogs start on the least destructive action;
  // others start on the primary action. Applied once the enter transition finishes, after
  // MUI's focus trap has focused the (non-tabbable) container — unless the user has already
  // moved focus to a control inside the dialog, e.g. started typing in a field. Moving focus
  // then would send their remaining keystrokes to a button.
  const focusInitial = (node: HTMLElement) => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && node.contains(active) && active.tabIndex >= 0) return;
    (destructive || !onConfirm ? cancelRef : confirmRef).current?.focus();
  };

  const confirm = async () => {
    if (!onConfirm) return;
    const result = onConfirm();
    if (result instanceof Promise) {
      setPending(true);
      try {
        await result;
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <MuiDialog
      open={open}
      onClose={(_, reason) => !busy && onClose(reason === 'escapeKeyDown' ? 'escape' : 'backdrop')}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      maxWidth={WIDTH[size]}
      fullWidth
      container={container}
      slotProps={{ transition: { onEntered: focusInitial } }}
    >
      <DialogTitle
        id={titleId}
        component="h2"
        sx={{ display: 'flex', alignItems: 'center', gap: 2.5, fontSize: 18, fontWeight: 650, pb: 1 }}
      >
        {destructive && (
          <Box
            aria-hidden
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'tonal.error',
              color: 'error.main',
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon fontSize="small" />
          </Box>
        )}
        {title}
      </DialogTitle>
      {(description || children) && (
        <DialogContent>
          {description && (
            <Typography id={descId} variant="body2" color="text.secondary" sx={{ fontSize: 14, mb: children ? 3 : 0 }}>
              {description}
            </Typography>
          )}
          {children}
        </DialogContent>
      )}
      <DialogActions sx={{ px: 6, pb: 5, pt: 2, gap: 1 }}>
        <Button variant="outline" onClick={() => onClose('cancel')} ref={cancelRef} disabled={busy}>
          {cancelLabel}
        </Button>
        {onConfirm && (
          <Button
            ref={confirmRef}
            onClick={confirm}
            loading={busy}
            sx={destructive ? { bgcolor: 'error.main', '&.Mui-disabled': { bgcolor: 'error.main' } } : undefined}
          >
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </MuiDialog>
  );
}
