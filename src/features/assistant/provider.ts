import { getManual, getPart, getSupplier, getSystem } from '@/data/repository';
import type { Manual, Part, Supplier } from '@/data/types';
import { answer as localAnswer, detectIntent, type AssistantAnswer, type Fact, type Intent } from './engine';

/**
 * Where answers come from. The UI depends only on this interface.
 *
 * - `localProvider` (default): deterministic retrieval over the bundled dataset.
 * - `httpProvider`: posts to a backend proxy that may call an LLM. The browser never
 *   holds a model API key. Enabled with `VITE_ASSISTANT_ENDPOINT`.
 */
export interface AssistantProvider {
  readonly id: 'local' | 'http';
  readonly label: string;
  ask(query: string, signal?: AbortSignal): Promise<AssistantAnswer>;
}

export const localProvider: AssistantProvider = {
  id: 'local',
  label: 'Deterministic retrieval (offline)',
  ask: async (query) => localAnswer(query),
};

/** Response contract for the backend proxy. Records are referenced by ID only. */
export interface RemoteAnswer {
  summary: string;
  intent?: Intent;
  systemId?: string;
  manualIds?: string[];
  partIds?: string[];
  supplierIds?: string[];
  facts?: Fact[];
  followUps?: string[];
}

const pick = <T>(ids: unknown, get: (id: string) => T | undefined): T[] =>
  Array.isArray(ids) ? ids.filter((i): i is string => typeof i === 'string').map(get).filter((x): x is T => !!x) : [];

/**
 * Turns a remote payload into an answer, keeping only records that exist in the dataset
 * and facts whose cited manual exists. Unknown IDs are dropped, so the model cannot cite
 * a part number or document that is not in the system of record.
 */
export function groundRemoteAnswer(query: string, payload: unknown): AssistantAnswer {
  if (!payload || typeof payload !== 'object' || typeof (payload as RemoteAnswer).summary !== 'string') {
    throw new Error('Malformed assistant response');
  }
  const r = payload as RemoteAnswer;
  const manuals = pick<Manual>(r.manualIds, getManual);
  const facts = Array.isArray(r.facts)
    ? r.facts.filter((f) => f && typeof f.label === 'string' && typeof f.value === 'string' && !!getManual(f.sourceId))
    : [];
  return {
    query,
    intent: r.intent ?? detectIntent(query),
    system: r.systemId ? getSystem(r.systemId) : undefined,
    summary: r.summary,
    facts,
    manuals,
    parts: pick<Part>(r.partIds, getPart),
    suppliers: pick<Supplier>(r.supplierIds, getSupplier),
    followUps: Array.isArray(r.followUps) ? r.followUps.filter((f): f is string => typeof f === 'string').slice(0, 3) : [],
  };
}

export function httpProvider(endpoint: string, fallback: AssistantProvider = localProvider): AssistantProvider {
  return {
    id: 'http',
    label: 'Backend proxy (with offline fallback)',
    async ask(query, signal) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal,
        });
        if (!res.ok) throw new Error(`Assistant endpoint returned ${res.status}`);
        return groundRemoteAnswer(query, await res.json());
      } catch (err) {
        if (signal?.aborted) throw err;
        // Any network, status or contract failure degrades to the offline engine.
        return fallback.ask(query, signal);
      }
    },
  };
}

/** Provider selected by build-time configuration. */
export function configuredProvider(env: { VITE_ASSISTANT_ENDPOINT?: string } = import.meta.env): AssistantProvider {
  const endpoint = env.VITE_ASSISTANT_ENDPOINT?.trim();
  return endpoint ? httpProvider(endpoint) : localProvider;
}
