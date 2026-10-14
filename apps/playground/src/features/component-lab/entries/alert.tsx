import Box from '@mui/material/Box';
import { Alert, Button, type AlertSeverity } from '@toyo-ui/react';
import { example, jsx, raw } from '../jsx';
import { defineEntry } from '../types';

interface AlertState {
  severity: AlertSeverity;
  title: string;
  message: string;
  dismissible: boolean;
  withAction: boolean;
  announce: boolean;
}

export const alertEntry = defineEntry<AlertState>({
  id: 'alert',
  defaults: {
    severity: 'warning',
    title: 'Revision pending review',
    message: 'Button v2.3 changes the default loading position. Review the migration notes before release.',
    dismissible: true,
    withAction: true,
    announce: true,
  },
  controls: [
    { kind: 'select', name: 'severity', options: ['info', 'success', 'warning', 'error'] },
    { kind: 'text', name: 'title' },
    { kind: 'text', name: 'message' },
    { kind: 'boolean', name: 'dismissible' },
    { kind: 'boolean', name: 'withAction', label: 'action' },
    { kind: 'boolean', name: 'announce' },
  ],
  render: (s) => (
    <Box sx={{ width: '100%', maxWidth: 640 }}>
      <Alert
        severity={s.severity}
        title={s.title || undefined}
        onClose={s.dismissible ? () => {} : undefined}
        action={
          s.withAction ? (
            <Button size="small" variant="outline">
              Review
            </Button>
          ) : undefined
        }
        announce={s.announce}
      >
        {s.message}
      </Alert>
    </Box>
  ),
  code: (s) =>
    example({
      components: s.withAction ? ['Alert', 'Button'] : ['Alert'],
      element: jsx(
        'Alert',
        {
          severity: s.severity,
          title: s.title || undefined,
          onClose: s.dismissible ? raw('() => setVisible(false)') : undefined,
          action: s.withAction ? raw('<Button size="small" variant="outline">Review</Button>') : undefined,
          announce: s.announce ? undefined : raw('false'),
        },
        { defaults: { severity: 'info' }, children: s.message },
      ),
    }),
  gallery: [
    {
      title: 'Severities',
      render: () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="info" announce={false}>
            Toyo-ui 2.4 is available.
          </Alert>
          <Alert severity="success" announce={false}>
            Component published to the registry.
          </Alert>
          <Alert severity="warning" announce={false}>
            Two components are missing accessibility notes.
          </Alert>
          <Alert severity="error" announce={false} title="Build failed">
            3 tests failed in DataTable.test.tsx.
          </Alert>
        </Box>
      ),
    },
  ],
});
