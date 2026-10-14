import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import type { ReactNode } from 'react';
import { TONE_COLORS } from './tone';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  severity?: AlertSeverity;
  /** Short summary in bold above the message. */
  title?: string;
  children: ReactNode;
  /** Shows a close button. Called when it is pressed. */
  onClose?: () => void;
  /** Extra action, e.g. a "Retry" button, placed at the end. */
  action?: ReactNode;
  /**
   * Whether assistive technology announces the alert when it appears. Errors and
   * warnings use `role="alert"` (interrupting); info and success use `role="status"`
   * (polite). Set `false` for messages already present on page load.
   */
  announce?: boolean;
}

const ROLE: Record<AlertSeverity, 'alert' | 'status'> = {
  error: 'alert',
  warning: 'alert',
  info: 'status',
  success: 'status',
};

/** Inline message. Colors come from the contrast-tested tonal tokens. */
export function Alert({ severity = 'info', title, children, onClose, action, announce = true }: AlertProps) {
  const c = TONE_COLORS[severity];
  return (
    <MuiAlert
      severity={severity}
      role={announce ? ROLE[severity] : 'none'}
      onClose={onClose}
      action={action}
      closeText="Dismiss"
      sx={{
        color: 'text.primary',
        bgcolor: c.bg,
        border: 1,
        borderColor: c.border,
        borderRadius: 1.5,
        alignItems: 'flex-start',
        '& .MuiAlert-icon': { color: c.fg },
        '& .MuiAlert-message': { fontSize: 14 },
      }}
    >
      {title && <AlertTitle sx={{ fontWeight: 600, fontSize: 14, mb: 0.5 }}>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
}
