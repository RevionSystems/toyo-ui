import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import { CodeBlock } from '@/components/common/CodeBlock';
import { CATALOG, importLine, type ComponentId } from '@/catalog/catalog';
import { AxeCheck } from './AxeCheck';
import { loadPublicTypes } from './source';
import { TestResultsList } from '@/features/documentation/TestResultsList';
import { REPORT_COMMAND, testReport, testsForComponent } from '@/features/documentation/testReport';

const DETAIL_TABS = ['Usage', 'API', 'Accessibility', 'Tests'] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

export interface DetailTabsProps {
  id: ComponentId;
  /** Generated from the same state as the preview. */
  code: string;
  previewRef: RefObject<HTMLElement | null>;
}

export function DetailTabs({ id, code, previewRef }: DetailTabsProps) {
  const [tab, setTab] = useState<DetailTab>('Usage');
  const doc = CATALOG[id];

  const panels: Record<DetailTab, ReactNode> = {
    Usage: (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Typography sx={{ maxWidth: 760 }}>{doc.purpose}</Typography>
        <Box>
          <Typography variant="h4" component="h3" sx={{ mb: 1.5 }}>
            Import
          </Typography>
          <CodeBlock code={importLine(id)} label={`${doc.name} import statement`} showLineNumbers={false} />
        </Box>
        <Box>
          <Typography variant="h4" component="h3" sx={{ mb: 0.5 }}>
            Example
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Generated from the current properties — it updates as you change them.
          </Typography>
          <CodeBlock code={code} label={`${doc.name} usage example (TypeScript)`} />
        </Box>
        <Box>
          <Typography variant="h4" component="h3" sx={{ mb: 1.5 }}>
            Variants and states
          </Typography>
          <Box component="ul" sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', listStyle: 'none', m: 0, p: 0 }}>
            {doc.states.map((s) => (
              <li key={s}>
                <Chip size="small" label={s} variant="outlined" />
              </li>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <GuidelineCard kind="do" items={doc.guidelines.do} />
          <GuidelineCard kind="dont" items={doc.guidelines.dont} />
        </Box>
      </Box>
    ),
    API: <ApiPanel id={id} />,
    Accessibility: (
      <Box sx={{ display: 'grid', gap: 5, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <Box>
          <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
            Requirements
          </Typography>
          <BulletList items={doc.accessibility} />
        </Box>
        <Box>
          <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
            Automated check
          </Typography>
          <AxeCheck target={previewRef} />
        </Box>
      </Box>
    ),
    Tests: <TestsPanel id={id} />,
  };

  return (
    <Card component="section" aria-label={`${doc.name} documentation`}>
      <Tabs
        value={tab}
        onChange={(_, v: DetailTab) => setTab(v)}
        variant="scrollable"
        scrollButtons={false}
        aria-label="Component details"
        sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {DETAIL_TABS.map((t) => (
          <Tab key={t} value={t} label={t} id={`detail-tab-${t}`} aria-controls={`detail-panel-${t}`} />
        ))}
      </Tabs>
      {DETAIL_TABS.map((t) => (
        <Box
          key={t}
          role="tabpanel"
          id={`detail-panel-${t}`}
          aria-labelledby={`detail-tab-${t}`}
          hidden={tab !== t}
          sx={{ p: { xs: 3, md: 4 } }}
        >
          {tab === t && panels[t]}
        </Box>
      ))}
    </Card>
  );
}

function TestsPanel({ id }: { id: ComponentId }) {
  const doc = CATALOG[id];
  const groups = testsForComponent(id, testReport);
  const all = groups.flatMap((g) => g.tests);
  const passed = all.filter((t) => t.status === 'passed').length;
  return (
    <Box sx={{ display: 'grid', gap: 5, gridTemplateColumns: { xs: '1fr', lg: '1fr 1.4fr' } }}>
      <Box>
        <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
          Testing expectations
        </Typography>
        <BulletList items={doc.testing} />
      </Box>
      <Box>
        <Typography variant="h4" component="h3" sx={{ mb: 1 }}>
          Latest results
        </Typography>
        {!testReport ? (
          <Typography variant="body2" color="text.secondary">
            No test report yet. Run <code>{REPORT_COMMAND}</code> (it also runs on every build).
          </Typography>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {passed} of {all.length} passing · generated {new Date(testReport.generatedAt).toLocaleString()}
            </Typography>
            {groups.map((g) => (
              <Box key={g.file} sx={{ mb: 3 }}>
                <Typography
                  component="h4"
                  sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary', mb: 0.5 }}
                >
                  {g.file}
                </Typography>
                <TestResultsList tests={g.tests} omitAncestors={1} />
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}

function ApiPanel({ id }: { id: ComponentId }) {
  const doc = CATALOG[id];
  const [types, setTypes] = useState<string | null>();

  useEffect(() => {
    let cancelled = false;
    loadPublicTypes(doc.name).then((t) => !cancelled && setTypes(t ?? null));
    return () => {
      cancelled = true;
    };
  }, [doc.name]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Box>
        <Typography variant="h4" component="h3" sx={{ mb: 1 }}>
          TypeScript declarations
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Extracted from <code>packages/react/src/{doc.name}.tsx</code> at build time.
        </Typography>
        {types === undefined ? (
          <Skeleton variant="rounded" height={160} aria-label="Loading declarations" />
        ) : types ? (
          <CodeBlock code={types} label={`${doc.name} type declarations`} />
        ) : (
          <Typography color="text.secondary">Source not available.</Typography>
        )}
      </Box>
      {doc.props && (
        <Box>
          <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
            Props
          </Typography>
          <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1.5 }}>
            <Table size="small" aria-label={`${doc.name} props`}>
              <TableHead>
                <TableRow>
                  <TableCell>Prop</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Default</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doc.props.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {p.name}
                      {p.required && (
                        <Box component="span" sx={{ color: 'primaryText' }}>
                          *
                          <Box component="span" sx={visuallyHidden}>
                            {' '}
                            (required)
                          </Box>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary', minWidth: 160 }}>
                      {p.type}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{p.default ?? '—'}</TableCell>
                    <TableCell sx={{ fontSize: 13, minWidth: 220 }}>{p.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}
      {doc.apiDecisions && (
        <Box>
          <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
            API decisions
          </Typography>
          <BulletList items={doc.apiDecisions} />
        </Box>
      )}
    </Box>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return <Typography color="text.secondary">Not documented yet.</Typography>;
  return (
    <Box component="ul" sx={{ m: 0, pl: 5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {items.map((i) => (
        <Typography key={i} component="li" variant="body2" sx={{ fontSize: 14 }}>
          {i}
        </Typography>
      ))}
    </Box>
  );
}

function GuidelineCard({ kind, items }: { kind: 'do' | 'dont'; items: string[] }) {
  const isDo = kind === 'do';
  return (
    <Box
      sx={{
        p: 4,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        borderTop: 3,
        borderTopColor: isDo ? 'success.main' : 'primary.main',
      }}
    >
      <Typography
        variant="h4"
        component="h3"
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, color: isDo ? 'success.main' : 'primaryText' }}
      >
        {isDo ? (
          <CheckCircleOutlineOutlinedIcon fontSize="small" aria-hidden />
        ) : (
          <DoNotDisturbAltIcon fontSize="small" aria-hidden />
        )}
        {isDo ? 'Do' : "Don't"}
      </Typography>
      <BulletList items={items} />
    </Box>
  );
}
