import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { TestCase, TestStatus } from './testReport';

const ICON: Record<TestStatus, { node: ReactNode; color: string; label: string }> = {
  passed: { node: <CheckCircleOutlineOutlinedIcon fontSize="small" />, color: 'success.main', label: 'Passed' },
  failed: { node: <CancelOutlinedIcon fontSize="small" />, color: 'error.main', label: 'Failed' },
  skipped: { node: <RemoveCircleOutlineIcon fontSize="small" />, color: 'text.secondary', label: 'Skipped' },
};

export interface TestResultsListProps {
  tests: TestCase[];
  /** Drop leading describe titles already shown in a parent heading. */
  omitAncestors?: number;
}

/** Test cases with a status icon, accessible status text and failure summary. */
export function TestResultsList({ tests, omitAncestors = 0 }: TestResultsListProps) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {tests.map((t, i) => {
        const s = ICON[t.status];
        const name = [...t.ancestors.slice(omitAncestors), t.title].join(' › ');
        return (
          <Box
            component="li"
            key={`${name}-${i}`}
            sx={{
              display: 'flex',
              gap: 2,
              py: 1.25,
              borderTop: i ? 1 : 0,
              borderColor: 'divider',
              alignItems: 'flex-start',
            }}
          >
            <Box aria-hidden sx={{ color: s.color, display: 'flex', pt: 0.25 }}>
              {s.node}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontSize: 13.5 }}>
                <Box component="span" sx={visuallyHidden}>
                  {s.label}:{' '}
                </Box>
                {name}
              </Typography>
              {t.failure && (
                <Typography
                  variant="caption"
                  sx={{ color: 'error.main', fontFamily: 'monospace', display: 'block', mt: 0.5 }}
                >
                  {t.failure}
                </Typography>
              )}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}
            >
              {t.durationMs} ms
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
