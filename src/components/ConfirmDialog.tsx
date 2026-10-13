import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useId, type ReactNode } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `destructive` styles the confirm action as a warning. */
  tone?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Two-action confirmation dialog. Wraps MUI `Dialog` with labelled title/description,
 * focus on the safe (cancel) action, and Escape/backdrop mapped to cancel.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id={titleId} sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText id={descId}>{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 6, pb: 5 }}>
        <Button onClick={onCancel} variant="outlined" autoFocus>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} variant="contained" color={tone === 'destructive' ? 'error' : 'primary'}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
