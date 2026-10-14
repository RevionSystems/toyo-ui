/** Status tones shared by Alert, StatusBadge and other feedback components. */
export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

/** Theme palette paths for a tone: foreground text/icon and low-emphasis background. */
export const TONE_COLORS: Record<StatusTone, { fg: string; bg: string; border: string }> = {
  success: { fg: 'success.main', bg: 'tonal.success', border: 'success.main' },
  warning: { fg: 'warning.main', bg: 'tonal.warning', border: 'warning.main' },
  error: { fg: 'error.main', bg: 'tonal.error', border: 'error.main' },
  info: { fg: 'info.main', bg: 'tonal.info', border: 'info.main' },
  neutral: { fg: 'text.secondary', bg: 'surfaceMuted', border: 'divider' },
};
