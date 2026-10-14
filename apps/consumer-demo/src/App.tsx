import AddIcon from '@mui/icons-material/Add';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import { Alert, Button, DataTable, Dialog, EmptyState, StatusBadge, TextField, type Column } from '@toyo-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { NewReleaseDialog } from './NewReleaseDialog';
import { STATUS_DISPLAY, type Environment, type Release, type ReleaseApi, type ReleaseStatus } from './releases';

type LoadState = { kind: 'loading' } | { kind: 'ready' } | { kind: 'error'; message: string };

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' });

export interface AppProps {
  api: ReleaseApi;
  /** Lets the demo toggle the fake API into an outage. */
  outage: { get: () => boolean; set: (on: boolean) => void };
}

export function App({ api, outage }: AppProps) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [load, setLoad] = useState<LoadState>({ kind: 'loading' });
  const [query, setQuery] = useState('');
  const [environment, setEnvironment] = useState<Environment | 'all'>('all');
  const [notice, setNotice] = useState<string>();
  const [rollbackTarget, setRollbackTarget] = useState<Release>();
  const [rollbackError, setRollbackError] = useState<string>();
  const [creating, setCreating] = useState(false);
  const [outageOn, setOutageOn] = useState(outage.get());

  const [requestId, setRequestId] = useState(0);

  // Load (and reload when `requestId` changes). The flag drops responses from superseded requests,
  // including the first request of React StrictMode's double effect run.
  useEffect(() => {
    let current = true;
    api.list().then(
      (rows) => {
        if (!current) return;
        setReleases(rows);
        setLoad({ kind: 'ready' });
      },
      (e: unknown) => {
        if (current) setLoad({ kind: 'error', message: e instanceof Error ? e.message : 'Could not load releases.' });
      },
    );
    return () => {
      current = false;
    };
  }, [api, requestId]);

  const refresh = () => {
    setLoad({ kind: 'loading' });
    setRequestId((n) => n + 1);
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return releases.filter(
      (r) =>
        (environment === 'all' || r.environment === environment) &&
        (!q || `${r.service} ${r.version} ${r.owner}`.toLowerCase().includes(q)),
    );
  }, [releases, query, environment]);

  const counts = useMemo(() => {
    const c = new Map<ReleaseStatus, number>();
    for (const r of releases) c.set(r.status, (c.get(r.status) ?? 0) + 1);
    return c;
  }, [releases]);

  const clearFilters = () => {
    setQuery('');
    setEnvironment('all');
  };

  // Never rejects: errors are shown in the dialog so the user can retry or cancel.
  const confirmRollback = async () => {
    if (!rollbackTarget) return;
    setRollbackError(undefined);
    try {
      const updated = await api.rollBack(rollbackTarget.id);
      setReleases((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
      setNotice(`${updated.service} ${updated.version} was rolled back.`);
      setRollbackTarget(undefined);
    } catch (e) {
      setRollbackError(e instanceof Error ? e.message : 'Rollback failed.');
    }
  };

  const columns: Column<Release>[] = [
    {
      key: 'service',
      header: 'Service',
      sortValue: (r) => r.service,
      render: (r) => (
        <>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{r.service}</Typography>
          <Typography variant="code" color="text.secondary" sx={{ fontSize: 12 }}>
            v{r.version}
          </Typography>
        </>
      ),
    },
    {
      key: 'environment',
      header: 'Environment',
      sortValue: (r) => r.environment,
      render: (r) => r.environment[0]!.toUpperCase() + r.environment.slice(1),
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (r) => r.status,
      render: (r) => <StatusBadge tone={STATUS_DISPLAY[r.status].tone} label={STATUS_DISPLAY[r.status].label} />,
    },
    { key: 'owner', header: 'Owner', sortValue: (r) => r.owner, render: (r) => r.owner, hideOnMobile: true },
    {
      key: 'updated',
      header: 'Updated (UTC)',
      sortValue: (r) => r.updatedAt,
      render: (r) => dateFormat.format(new Date(r.updatedAt)),
      hideOnMobile: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) =>
        r.status === 'deployed' ? (
          <Button
            variant="text"
            size="small"
            onClick={() => setRollbackTarget(r)}
            aria-label={`Roll back ${r.service} ${r.version}`}
          >
            Roll back
          </Button>
        ) : null,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header" sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 3, md: 5 },
            py: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography component="p" sx={{ fontWeight: 700, fontSize: 18 }}>
              Release Console
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Platform Engineering · built with @toyo-ui/react
            </Typography>
          </Box>
          <ThemeToggle />
          <Button startIcon={<AddIcon />} onClick={() => setCreating(true)}>
            New release
          </Button>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 3, md: 5 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: 24, md: 28 } }}>
            Releases
          </Typography>
          <Typography color="text.secondary">
            Recent deployments across environments. Roll back a deployed release if it misbehaves.
          </Typography>
        </Box>

        {notice && (
          <Alert severity="success" onClose={() => setNotice(undefined)}>
            {notice}
          </Alert>
        )}

        <Box component="section" aria-label="Release summary" sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {(Object.keys(STATUS_DISPLAY) as ReleaseStatus[]).map((s) => (
            <StatusBadge
              key={s}
              tone={STATUS_DISPLAY[s].tone}
              label={`${STATUS_DISPLAY[s].label} · ${counts.get(s) ?? 0}`}
              size="medium"
            />
          ))}
        </Box>

        <Paper
          variant="outlined"
          sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 260px', maxWidth: 420 }}>
              <TextField
                label="Filter releases"
                hideLabel
                placeholder="Service, version or team…"
                size="small"
                startIcon={<SearchIcon fontSize="small" />}
                value={query}
                onChange={setQuery}
                fullWidth
              />
            </Box>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={environment}
              onChange={(_, v: Environment | 'all' | null) => v && setEnvironment(v)}
              aria-label="Environment"
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="production">Production</ToggleButton>
              <ToggleButton value="staging">Staging</ToggleButton>
              <ToggleButton value="canary">Canary</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={outageOn}
                    onChange={(e) => {
                      outage.set(e.target.checked);
                      setOutageOn(e.target.checked);
                    }}
                  />
                }
                label="Simulate outage"
              />
              <Button
                variant="outline"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={refresh}
                loading={load.kind === 'loading'}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {load.kind === 'error' ? (
            <>
              <Alert
                severity="error"
                title="Releases could not be loaded"
                action={
                  <Button variant="outline" size="small" onClick={refresh}>
                    Retry
                  </Button>
                }
              >
                {load.message}
              </Alert>
              <EmptyState
                kind="error"
                size="compact"
                title="No data to show"
                description="Retry when the release service is back."
              />
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" role="status">
                {load.kind === 'loading' ? 'Loading releases…' : `${visible.length} of ${releases.length} releases`}
              </Typography>
              <DataTable
                caption="Releases"
                columns={columns}
                rows={visible}
                getRowId={(r) => r.id}
                loading={load.kind === 'loading'}
                initialSort={{ key: 'updated', direction: 'desc' }}
                emptyState={
                  <EmptyState
                    kind="no-results"
                    size="compact"
                    title="No releases match"
                    description="Try another search or environment."
                    action={
                      <Button variant="outline" size="small" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    }
                  />
                }
              />
            </>
          )}
        </Paper>
      </Box>

      <Dialog
        open={!!rollbackTarget}
        tone="destructive"
        title={rollbackTarget ? `Roll back ${rollbackTarget.service} ${rollbackTarget.version}?` : ''}
        description="Traffic returns to the previous version. The release is marked as rolled back."
        confirmLabel="Roll back"
        onConfirm={confirmRollback}
        onClose={() => {
          setRollbackTarget(undefined);
          setRollbackError(undefined);
        }}
      >
        {rollbackError && (
          <Alert severity="error" title="Rollback failed">
            {rollbackError}
          </Alert>
        )}
      </Dialog>

      <NewReleaseDialog
        open={creating}
        api={api}
        onClose={() => setCreating(false)}
        onCreated={(r) => {
          setReleases((rs) => [r, ...rs]);
          setNotice(`${r.service} ${r.version} is scheduled for ${r.environment}.`);
        }}
      />
    </Box>
  );
}

function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const resolved = mode === 'system' ? systemMode : mode;
  if (!resolved) return null;
  const next = resolved === 'dark' ? 'light' : 'dark';
  return (
    <IconButton onClick={() => setMode(next)} aria-label={`Switch to ${next} theme`}>
      {resolved === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
    </IconButton>
  );
}
