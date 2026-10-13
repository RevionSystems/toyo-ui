import {
  getManual,
  getPart,
  listManuals,
  listSystems,
  manualsForSystem,
  partsForManual,
  suppliersForPart,
} from '@/data/repository';
import type { Manual, Part, Supplier, SystemId, VehicleSystem } from '@/data/types';
import { search, tokenize } from '@/features/search/search';

/*
 * Engineering discovery assistant.
 *
 * Deterministic retrieval pipeline over the synthetic dataset — no LLM call. It
 * shows the shape of a grounded assistant (intent → retrieval → relationship
 * expansion → cited answer) and is fully unit-testable. A model-backed version
 * would replace `compose()` and keep the retrieval and citation contract.
 */

export type Intent = 'overview' | 'manuals' | 'parts' | 'suppliers' | 'torque';

export interface Fact {
  label: string;
  value: string;
  /** Manual the fact is cited from. */
  sourceId: string;
}

export interface AssistantAnswer {
  query: string;
  intent: Intent;
  system?: VehicleSystem;
  summary: string;
  facts: Fact[];
  manuals: Manual[];
  parts: Part[];
  suppliers: Supplier[];
  followUps: string[];
}

const SYSTEM_TERMS: Record<SystemId, string[]> = {
  braking: ['brake', 'braking', 'caliper', 'rotor', 'disc', 'pad', 'abs', 'hub', 'parking', 'epb', 'bleed'],
  powertrain: ['powertrain', 'engine', 'transaxle', 'motor', 'mount', 'insulator', 'gear', 'hybrid'],
  battery: ['battery', 'hv', 'high-voltage', 'voltage', 'bms', 'cell', 'pack', 'charging', 'inlet', 'ev'],
  thermal: ['thermal', 'coolant', 'cooling', 'chiller', 'pump', 'heat'],
  chassis: ['chassis', 'suspension', 'strut', 'damper', 'spring', 'arm', 'knuckle', 'alignment'],
  body: ['body', 'pillar', 'rail', 'crash', 'structure', 'weld', 'welding'],
  electrical: ['electrical', 'ecu', 'harness', 'wiring', 'programming', 'calibration'],
  interior: ['interior', 'steering', 'wheel', 'airbag', 'srs', 'cockpit'],
};

const INTENT_TERMS: [Intent, string[]][] = [
  ['torque', ['torque', 'tighten', 'nm', 'spec', 'specification', 'specifications']],
  ['suppliers', ['supplier', 'suppliers', 'supplies', 'supply', 'supplied', 'vendor', 'vendors', 'source', 'sourcing', 'who makes', 'lead time']],
  ['parts', ['part', 'parts', 'part number', 'component', 'components']],
  ['manuals', ['manual', 'manuals', 'procedure', 'document', 'documents', 'documentation', 'docs', 'guide', 'instructions']],
];

export const SUGGESTED_PROMPTS = [
  'Find the documentation for the braking system and show which parts and suppliers are associated with it.',
  'What is the torque for the front caliper bolt?',
  'Who supplies parts for the HV battery?',
  'Show front suspension parts and their manuals',
];

const stem = (t: string) => (t.length > 4 && t.endsWith('s') ? t.slice(0, -1) : t);

export function detectSystem(query: string): VehicleSystem | undefined {
  const q = query.toLowerCase();
  const terms = new Set(tokenize(query).map(stem));
  let best: { id: SystemId; hits: number } | undefined;
  for (const [id, words] of Object.entries(SYSTEM_TERMS) as [SystemId, string[]][]) {
    const hits = words.filter((w) => (w.includes(' ') || w.includes('-') ? q.includes(w) : terms.has(w))).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { id, hits };
  }
  return best && listSystems().find((s) => s.id === best.id);
}

export function detectIntent(query: string): Intent {
  const q = ` ${query.toLowerCase()} `;
  const matched = INTENT_TERMS.filter(([, words]) => words.some((w) => new RegExp(`\\b${w}\\b`).test(q)));
  if (matched.length === 0) return 'overview';
  const ids = matched.map(([i]) => i);
  if (ids.includes('torque')) return 'torque';
  // Asking for documents plus anything else ("docs, parts and suppliers") is an overview;
  // "who supplies parts for…" stays a supplier question.
  if (ids.length >= 3 || (ids.includes('manuals') && ids.length > 1)) return 'overview';
  return ids[0]!;
}

const unique = <T extends { id: string }>(items: T[]) => [...new Map(items.map((i) => [i.id, i])).values()];

function retrieveManuals(query: string, system?: VehicleSystem): Manual[] {
  const hits = search(query, { types: ['manual'], limit: 10 })
    .map((h) => getManual(h.doc.id))
    .filter((m): m is Manual => !!m);
  if (!system) return hits.slice(0, 4);
  const inSystem = hits.filter((m) => m.systemId === system.id);
  const ranked = unique([...inSystem, ...manualsForSystem(system.id)]);
  // Approved documents first; drafts are still shown but last.
  const order = { approved: 0, 'in-review': 1, draft: 2 } as const;
  return ranked.sort((a, b) => order[a.status] - order[b.status]).slice(0, 4);
}

function retrieveParts(query: string, manuals: Manual[], system?: VehicleSystem): Part[] {
  const direct = search(query, { types: ['part'], limit: 6 })
    .map((h) => getPart(h.doc.id))
    .filter((p): p is Part => !!p)
    .filter((p) => !system || p.systemId === system.id);
  const viaManuals = manuals
    .slice(0, 2)
    .flatMap(partsForManual)
    .filter((p) => !system || p.systemId === system.id);
  return unique([...direct, ...viaManuals]).slice(0, 6);
}

function findTorqueFacts(query: string, manuals: Manual[]): Fact[] {
  const terms = tokenize(query)
    .map(stem)
    .filter((t) => !['torque', 'spec', 'specification', 'nm', 'tighten', 'value'].includes(t));
  const candidates = (manuals.length ? manuals : listManuals()).flatMap((m) =>
    m.torqueSpecs.map((t) => ({ manual: m, spec: t })),
  );
  const scored = candidates
    .map((c) => {
      const item = c.spec.item.toLowerCase();
      return { ...c, score: terms.filter((t) => item.includes(t)).length };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);
  const top = scored.length ? scored.filter((c) => c.score === scored[0]!.score) : [];
  return top.slice(0, 4).map(({ manual, spec }) => ({
    label: spec.item,
    value: `${spec.newtonMeters} N·m`,
    sourceId: manual.id,
  }));
}

function compose(a: Omit<AssistantAnswer, 'summary' | 'followUps'>): Pick<AssistantAnswer, 'summary' | 'followUps'> {
  const scope = a.system ? `the ${a.system.name.toLowerCase()}` : 'your query';
  const followUps: string[] = [];

  if (a.manuals.length === 0 && a.parts.length === 0) {
    return {
      summary:
        'I could not find matching records in the engineering dataset. Try a system name (e.g. "braking", "battery"), a part number, or a supplier.',
      followUps: SUGGESTED_PROMPTS.slice(0, 3),
    };
  }

  let summary: string;
  switch (a.intent) {
    case 'torque':
      summary = a.facts.length
        ? `Torque specification${a.facts.length > 1 ? 's' : ''} for ${scope}, cited from the approved manual${a.facts.length > 1 ? 's' : ''}:`
        : `I found no torque value matching that fastener. These manuals for ${scope} list torque specifications:`;
      break;
    case 'suppliers':
      summary = `${a.suppliers.length} supplier${a.suppliers.length === 1 ? '' : 's'} source parts for ${scope}. Primary sources are listed with their supporting documents.`;
      break;
    case 'parts':
      summary = `Here are the parts for ${scope} and the manuals that reference them.`;
      break;
    case 'manuals':
      summary = `Here are the engineering manuals for ${scope}, with associated parts and suppliers.`;
      break;
    default:
      summary = `Here are the key documents, parts and suppliers for ${scope} based on the engineering database.`;
  }

  const lead = a.manuals[0];
  if (lead && lead.torqueSpecs.length && a.intent !== 'torque') followUps.push(`What are the torque specs in ${lead.id}?`);
  if (a.intent !== 'suppliers' && a.system) followUps.push(`Who supplies parts for the ${a.system.name.toLowerCase()}?`);
  const part = a.parts[0];
  if (part) followUps.push(`Which manuals reference ${part.id}?`);
  return { summary, followUps: followUps.slice(0, 3) };
}

/** Answers an engineering question with records retrieved from the dataset. */
export function answer(query: string): AssistantAnswer {
  const trimmed = query.trim();
  const system = detectSystem(trimmed);
  const intent = detectIntent(trimmed);

  // Direct ID lookups ("Which manuals reference PT-3310-12A?") anchor on that record.
  const idMatch = trimmed.match(/\b([A-Z]{2}-\d{3,4}(?:-[0-9A-Z]{2,3})?)\b/i)?.[1]?.toUpperCase();
  const anchoredPart = idMatch ? getPart(idMatch) : undefined;
  const anchoredManual = idMatch ? getManual(idMatch) : undefined;

  let manuals: Manual[];
  let parts: Part[];
  if (anchoredPart) {
    parts = [anchoredPart];
    manuals = listManuals().filter((m) => m.partIds.includes(anchoredPart.id));
  } else if (anchoredManual) {
    manuals = [anchoredManual];
    parts = partsForManual(anchoredManual).slice(0, 6);
  } else {
    manuals = retrieveManuals(trimmed, system);
    parts = retrieveParts(trimmed, manuals, system);
  }

  const suppliers = unique(parts.flatMap(suppliersForPart)).slice(0, 6);
  const facts = intent === 'torque' ? findTorqueFacts(trimmed, manuals) : [];
  const base = { query: trimmed, intent, system, facts, manuals, parts, suppliers };
  return { ...base, ...compose(base) };
}
