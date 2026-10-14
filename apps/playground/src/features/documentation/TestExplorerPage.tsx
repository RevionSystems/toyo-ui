import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { FilterChips } from '@/components/common/FilterChips';
import { SearchField } from '@/components/common/SearchField';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState, StatusBadge } from '@toyo-ui/react';
import { CATALOG, COMPONENT_IDS } from '@/catalog/catalog';
import { REPORT_COMMAND, testName, testReport, type TestStatus } from './testReport';
import { TestResultsList } from './TestResultsList';

/** Maps a test file to the component page it covers, if any. */
const componentForFile = (file: string) => COMPONENT_IDS.find((id) => file.endsWith(`/${CATALOG[id].name}.test.tsx`));

export default function TestExplorerPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TestStatus | null>(null);

  const files = useMemo(() => {
    if (!testReport) return [];
    const q = query.trim().toLowerCase();
    return testReport.files
      .map((f) => ({
        ...f,
        tests: f.tests.filter(
          (t) => (!status || t.status === status) && (!q || `${f.file} ${testName(t)}`.toLowerCase().includes(q)),
        ),
      }))
      .filter((f) => f.tests.length > 0);
  }, [query, status]);

  const header = (
    <PageHeader
      overline="Engineering"
      title="Test Explorer"
      description="Results of the latest Vitest run, grouped by file. Every component has a behavior suite plus registry checks (render, axe, generated code, documented props)."
    />
  );

  if (!testReport) {
    return (
      <>
        {header}
        <Card>
          <EmptyState
            kind="no-data"
            title="No test report yet"
            description={`Run "${REPORT_COMMAND}" to generate one. It also runs automatically on every production build.`}
          />
        </Card>
      </>
    );
  }

  const t = testReport.totals;
  const shown = files.reduce((n, f) => n + f.tests.length, 0);

  return (
    <>
      {header}
      <Box
        component="dl"
        sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' }, m: 0, mb: 4 }}
      >
        {[
          ['Tests', t.tests],
          ['Passed', t.passed],
          ['Failed', t.failed],
          ['Files', t.files],
          ['Duration', `${(testReport.durationMs / 1000).toFixed(1)} s`],
        ].map(([label, value]) => (
          <Card key={label} sx={{ p: 3 }}>
            <Typography component="dt" variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography component="dd" sx={{ m: 0, fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </Typography>
          </Card>
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Generated {new Date(testReport.generatedAt).toLocaleString()} · regenerate with <code>{REPORT_COMMAND}</code>
      </Typography>

      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ maxWidth: 420 }}>
            <SearchField
              value={query}
              onChange={setQuery}
              label="Filter tests"
              placeholder="Filter by file or test name…"
            />
          </Box>
          <FilterChips
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'passed', label: 'Passed', count: t.passed },
              { value: 'failed', label: 'Failed', count: t.failed },
              { value: 'skipped', label: 'Skipped', count: t.skipped },
            ]}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" role="status" sx={{ mb: 2 }}>
          {shown} of {t.tests} tests shown
        </Typography>
        {files.length === 0 ? (
          <EmptyState
            kind="no-results"
            size="compact"
            title="No tests match"
            description="Clear the filter to see all tests."
          />
        ) : (
          files.map((f) => {
            const component = componentForFile(f.file);
            return (
              <Box
                key={f.file}
                component="section"
                aria-label={f.file}
                sx={{ py: 3, borderTop: 1, borderColor: 'divider' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                  <Typography component="h2" sx={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>
                    {f.file}
                  </Typography>
                  <StatusBadge
                    tone={f.status === 'passed' ? 'success' : 'error'}
                    label={f.status === 'passed' ? 'Passing' : 'Failing'}
                  />
                  {component && (
                    <Link href={`/components/${component}`} sx={{ fontSize: 13, ml: 'auto' }}>
                      Open {CATALOG[component].name} in the lab
                    </Link>
                  )}
                </Box>
                <TestResultsList tests={f.tests} />
              </Box>
            );
          })
        )}
      </Card>
    </>
  );
}
