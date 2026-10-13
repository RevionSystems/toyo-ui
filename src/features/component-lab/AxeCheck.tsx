import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { AxeResults } from 'axe-core';
import { useState, type RefObject } from 'react';

type Status =
  { kind: 'idle' } | { kind: 'running' } | { kind: 'done'; results: AxeResults } | { kind: 'error'; message: string };

/**
 * Runs axe-core against the live preview in the browser, including color contrast for
 * the preview's current scheme. axe-core is loaded on demand (it is ~500 kB).
 */
export function AxeCheck({ target }: { target: RefObject<HTMLElement | null> }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const run = async () => {
    if (!target.current) return;
    setStatus({ kind: 'running' });
    try {
      const { default: axe } = await import('axe-core');
      const results = await axe.run(target.current, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
        // The preview is a fragment of a page; landmark rules don't apply to it.
        rules: { region: { enabled: false } },
      });
      setStatus({ kind: 'done', results });
    } catch (e) {
      setStatus({ kind: 'error', message: e instanceof Error ? e.message : 'axe failed to run' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: 3 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PlayArrowOutlinedIcon />}
          onClick={run}
          loading={status.kind === 'running'}
        >
          Run axe on preview
        </Button>
        <Typography variant="caption" color="text.secondary">
          WCAG 2.2 A/AA rules, in the preview&apos;s current color scheme and width.
        </Typography>
      </Box>
      <Box aria-live="polite">
        {status.kind === 'error' && <Alert severity="error">{status.message}</Alert>}
        {status.kind === 'done' &&
          (status.results.violations.length === 0 ? (
            <Alert severity="success">
              No violations. {status.results.passes.length} rules passed
              {status.results.incomplete.length > 0 && `, ${status.results.incomplete.length} need manual review`}.
            </Alert>
          ) : (
            <Alert severity="error">
              {status.results.violations.length} violation{status.results.violations.length > 1 ? 's' : ''} found:
              <Box component="ul" sx={{ m: 0, mt: 1, pl: 4 }}>
                {status.results.violations.map((v) => (
                  <li key={v.id}>
                    <strong>{v.id}</strong> ({v.impact}) — {v.help} · {v.nodes.length} element
                    {v.nodes.length > 1 ? 's' : ''}
                  </li>
                ))}
              </Box>
            </Alert>
          ))}
      </Box>
    </Box>
  );
}
