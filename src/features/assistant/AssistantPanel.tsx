import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useEffectEvent, useRef, useState, type FormEvent } from 'react';
import { RelatedList, StatusChip } from '@/components';
import { getSystem } from '@/data/repository';
import { SUGGESTED_PROMPTS, type AssistantAnswer } from './engine';
import { configuredProvider, type AssistantProvider } from './provider';

export interface AssistantPanelProps {
  /** `compact` shows only the latest answer; `full` keeps the conversation. */
  variant?: 'compact' | 'full';
  initialQuery?: string;
  /** Runs `initialQuery` on mount. Remount (via `key`) to run a new deep-linked query. */
  autoRun?: boolean;
  /** Minimum time the loading state is shown, so fast local answers don't flash. Tests pass 0. */
  latencyMs?: number;
  /** Answer source; defaults to the build-time configured provider. */
  provider?: AssistantProvider;
}

interface Turn {
  id: number;
  answer: AssistantAnswer;
}

const defaultProvider = configuredProvider();
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AssistantPanel({
  variant = 'full',
  initialQuery = '',
  autoRun = false,
  latencyMs = 450,
  provider = defaultProvider,
}: AssistantPanelProps) {
  const [input, setInput] = useState(initialQuery);
  const [turns, setTurns] = useState<Turn[]>([]);
  // A deep-linked query starts in the loading state, so the effect below only does async work.
  const [pending, setPending] = useState(autoRun && !!initialQuery);
  const [error, setError] = useState<string>();
  const inflight = useRef<AbortController>(undefined);
  const nextId = useRef(0);

  const begin = () => {
    // A new question supersedes one still in flight.
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;
    return controller;
  };

  const execute = async (query: string, controller: AbortController) => {
    try {
      const [result] = await Promise.all([provider.ask(query, controller.signal), latencyMs > 0 ? wait(latencyMs) : null]);
      if (controller.signal.aborted) return;
      const turn = { id: nextId.current++, answer: result };
      setTurns((t) => (variant === 'compact' ? [turn] : [...t, turn]));
      if (variant === 'full') setInput('');
    } catch {
      if (!controller.signal.aborted) setError('The assistant could not answer. Try again or search the manuals directly.');
    } finally {
      if (!controller.signal.aborted) setPending(false);
    }
  };

  const ask = (q: string) => {
    const query = q.trim();
    if (!query) return;
    const controller = begin();
    setPending(true);
    setError(undefined);
    void execute(query, controller);
  };

  const runInitialQuery = useEffectEvent(() => {
    if (autoRun && initialQuery.trim()) void execute(initialQuery.trim(), begin());
  });

  useEffect(() => {
    runInitialQuery();
    return () => inflight.current?.abort();
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pending) ask(input);
  };

  const compact = variant === 'compact';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
      <Box component="form" onSubmit={onSubmit} role="search" aria-label="Ask the engineering assistant" sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!pending) ask(input);
            }
          }}
          multiline
          minRows={compact ? 2 : 2}
          maxRows={5}
          fullWidth
          size="small"
          placeholder="Ask about systems, parts, suppliers or torque specs…"
          slotProps={{ htmlInput: { 'aria-label': 'Question for the engineering assistant' } }}
        />
        <IconButton
          type="submit"
          aria-label="Ask"
          disabled={!input.trim() || pending}
          sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground' } }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {turns.length === 0 && !pending && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Try one of these:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: compact ? 'column' : 'row', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
            {SUGGESTED_PROMPTS.slice(0, compact ? 2 : 4).map((p) => (
              <Chip
                key={p}
                label={p}
                variant="outlined"
                onClick={() => {
                  setInput(p);
                  ask(p);
                }}
                sx={{ height: 'auto', py: 1, maxWidth: '100%', '& .MuiChip-label': { whiteSpace: 'normal', fontWeight: 500 } }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box aria-live="polite" aria-busy={pending} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {turns.map((t) => (
          <AnswerView key={t.id} answer={t.answer} compact={compact} onFollowUp={ask} showQuestion={!compact} />
        ))}
        {error && <Alert severity="error">{error}</Alert>}
        {pending && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Searching manuals, parts and suppliers…
            </Typography>
            <LinearProgress aria-label="Searching" />
          </Box>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mt: 'auto' }}>
        Results are retrieved from the synthetic engineering dataset. Verify against official, released sources before production use.
      </Typography>
    </Box>
  );
}

function AnswerView({
  answer: a,
  compact,
  showQuestion,
  onFollowUp,
}: {
  answer: AssistantAnswer;
  compact: boolean;
  showQuestion: boolean;
  onFollowUp: (q: string) => void;
}) {
  return (
    <Box component="article" aria-label={`Answer to: ${a.query}`} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {showQuestion && (
        <Paper variant="outlined" sx={{ alignSelf: 'flex-end', maxWidth: '85%', px: 3, py: 2, bgcolor: 'surfaceMuted' }}>
          <Typography variant="body2">{a.query}</Typography>
        </Paper>
      )}
      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
        <Box aria-hidden sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1, p: 1, display: 'flex', flexShrink: 0 }}>
          <AutoAwesomeIcon sx={{ fontSize: 16 }} />
        </Box>
        <Typography variant="body2" sx={{ fontSize: 14, pt: 0.5 }}>
          {a.summary}
        </Typography>
      </Box>

      {a.facts.length > 0 && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: '1fr auto auto', columnGap: 4, rowGap: 1.5, alignItems: 'baseline' }}>
            {a.facts.map((f) => (
              <Box key={`${f.sourceId}-${f.label}`} sx={{ display: 'contents' }}>
                <Box component="dt" sx={{ fontSize: 13 }}>{f.label}</Box>
                <Box component="dd" sx={{ m: 0, fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{f.value}</Box>
                <Box component="dd" sx={{ m: 0, fontSize: 12 }}>
                  <Chip size="small" label={f.sourceId} component="a" href={`/manuals/${f.sourceId}`} clickable aria-label={`Source: manual ${f.sourceId}`} />
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {(a.manuals.length > 0 || a.parts.length > 0) && (
        <Paper variant="outlined" sx={{ p: compact ? 2 : 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <RelatedList
            title="Manuals"
            headingLevel="h4"
            viewAllHref={a.system ? `/manuals?system=${a.system.id}` : '/manuals'}
            items={a.manuals.map((m) => ({
              id: m.id,
              code: m.id,
              primary: m.title,
              secondary: `Rev ${m.revision}`,
              trailing: <StatusChip status={m.status} />,
              href: `/manuals/${m.id}`,
            }))}
          />
          <RelatedList
            title="Parts"
            headingLevel="h4"
            icon={<SettingsOutlinedIcon fontSize="small" />}
            viewAllHref={a.system ? `/parts?system=${a.system.id}` : '/parts'}
            items={a.parts.map((p) => ({
              id: p.id,
              code: p.id,
              primary: p.name,
              secondary: compact ? undefined : getSystem(p.systemId)?.name,
              href: `/parts/${p.id}`,
            }))}
          />
          <RelatedList
            title="Suppliers"
            headingLevel="h4"
            icon={<LocalShippingOutlinedIcon fontSize="small" />}
            viewAllHref="/suppliers"
            items={a.suppliers.map((s) => ({
              id: s.id,
              code: s.id,
              primary: s.name,
              secondary: compact ? s.country : `${s.country} · ${s.capabilities.slice(0, 2).join(', ')}`,
              href: `/suppliers/${s.id}`,
            }))}
          />
        </Paper>
      )}

      {a.followUps.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }} role="group" aria-label="Suggested follow-up questions">
          {a.followUps.map((f) => (
            <Chip key={f} label={f} size="small" variant="outlined" onClick={() => onFollowUp(f)} />
          ))}
        </Box>
      )}
    </Box>
  );
}
