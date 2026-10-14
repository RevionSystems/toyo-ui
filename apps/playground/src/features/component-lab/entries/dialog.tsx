import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Button, Dialog, TextField, type DialogProps } from '@toyo-ui/react';
import { example, jsx, raw } from '../jsx';
import { usePreviewContainer } from '../previewContainer';
import { defineEntry } from '../types';

interface DialogState {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  tone: 'default' | 'destructive';
  size: 'small' | 'medium' | 'large';
  asyncConfirm: boolean;
  withContent: boolean;
}

/** Owns open state and the last outcome so the playground stays interactive. */
function DialogDemo({ state, triggerLabel = 'Open dialog' }: { state: DialogState; triggerLabel?: string }) {
  const [open, setOpen] = useState(false);
  const [outcome, setOutcome] = useState<string>();
  // Portal into the preview frame so the dialog follows the preview's light/dark scheme.
  const container = usePreviewContainer();
  const onConfirm: DialogProps['onConfirm'] = state.asyncConfirm
    ? () =>
        new Promise<void>((resolve) =>
          setTimeout(() => {
            setOutcome('confirmed after 1.5s');
            setOpen(false);
            resolve();
          }, 1500),
        )
    : () => {
        setOutcome('confirmed');
        setOpen(false);
      };
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Button variant={state.tone === 'destructive' ? 'outline' : 'primary'} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Typography
        variant="caption"
        color="text.secondary"
        role="status"
        sx={{ display: 'block', mt: 1.5, minHeight: 18 }}
      >
        {outcome ? `Last result: ${outcome}` : ''}
      </Typography>
      <Dialog
        open={open}
        title={state.title}
        description={state.description || undefined}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        tone={state.tone}
        size={state.size}
        container={container}
        onConfirm={onConfirm}
        onClose={(reason) => {
          setOutcome(`closed (${reason})`);
          setOpen(false);
        }}
      >
        {state.withContent && <TextField label="Type the component name to confirm" size="small" fullWidth />}
      </Dialog>
    </Box>
  );
}

export const dialogEntry = defineEntry<DialogState>({
  id: 'dialog',
  defaults: {
    title: 'Delete component?',
    description: 'This action cannot be undone. This will permanently delete the component and all of its variants.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    tone: 'destructive',
    size: 'small',
    asyncConfirm: true,
    withContent: false,
  },
  controls: [
    { kind: 'text', name: 'title' },
    { kind: 'text', name: 'description' },
    { kind: 'text', name: 'confirmLabel', label: 'confirm label' },
    { kind: 'text', name: 'cancelLabel', label: 'cancel label' },
    { kind: 'select', name: 'tone', options: ['default', 'destructive'] },
    { kind: 'select', name: 'size', options: ['small', 'medium', 'large'] },
    { kind: 'boolean', name: 'asyncConfirm', label: 'async confirm (1.5s)' },
    { kind: 'boolean', name: 'withContent', label: 'with form content' },
  ],
  render: (s) => <DialogDemo state={s} />,
  code: (s) =>
    example({
      components: s.withContent ? ['Button', 'Dialog', 'TextField'] : ['Button', 'Dialog'],
      imports: ["import { useState } from 'react';"],
      setup: ['const [open, setOpen] = useState(false);'],
      element: `<>\n  <Button onClick={() => setOpen(true)}>Open dialog</Button>\n${jsx(
        'Dialog',
        {
          open: raw('open'),
          onClose: raw('() => setOpen(false)'),
          title: s.title,
          description: s.description || undefined,
          confirmLabel: s.confirmLabel,
          cancelLabel: s.cancelLabel,
          tone: s.tone,
          size: s.size,
          onConfirm: raw(
            s.asyncConfirm
              ? 'async () => { await deleteComponent(); setOpen(false); }'
              : '() => { deleteComponent(); setOpen(false); }',
          ),
        },
        {
          defaults: { confirmLabel: 'Confirm', cancelLabel: 'Cancel', tone: 'default', size: 'small' },
          children: s.withContent
            ? '<TextField label="Type the component name to confirm" size="small" fullWidth />'
            : undefined,
        },
      )
        .split('\n')
        .map((l) => `  ${l}`)
        .join('\n')}\n</>`,
    }),
});
