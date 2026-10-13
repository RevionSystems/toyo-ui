import {
  getSystem,
  listManuals,
  listParts,
  listSuppliers,
} from '@/data/repository';

export type EntityType = 'manual' | 'part' | 'supplier';

export interface SearchDoc {
  type: EntityType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** Weighted fields; earlier fields score higher. */
  fields: { text: string; weight: number }[];
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ');

/** Splits a query into terms, dropping filler words that would match everything. */
export function tokenize(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'which', 'what', 'show', 'find', 'me', 'are', 'is', 'of', 'to', 'in',
  'on', 'a', 'an', 'all', 'associated', 'related', 'documentation', 'docs', 'that', 'this', 'it',
  'how', 'do', 'i', 'my', 'about', 'system', 'systems', 'please', 'can', 'you', 'give', 'list',
]);

function buildDocs(): SearchDoc[] {
  const manuals: SearchDoc[] = listManuals().map((m) => ({
    type: 'manual',
    id: m.id,
    title: m.title,
    subtitle: `${m.id} · Rev ${m.revision} · ${getSystem(m.systemId)?.name ?? ''}`,
    href: `/manuals/${m.id}`,
    fields: [
      { text: `${m.id} ${m.title}`, weight: 5 },
      { text: m.tags.join(' '), weight: 4 },
      { text: getSystem(m.systemId)?.name ?? '', weight: 3 },
      { text: m.summary, weight: 1 },
    ],
  }));
  const parts: SearchDoc[] = listParts().map((p) => ({
    type: 'part',
    id: p.id,
    title: p.name,
    subtitle: `${p.id} · ${p.assembly}`,
    href: `/parts/${p.id}`,
    fields: [
      { text: `${p.id} ${p.name}`, weight: 5 },
      { text: p.assembly, weight: 3 },
      { text: getSystem(p.systemId)?.name ?? '', weight: 3 },
      { text: `${p.description} ${p.material}`, weight: 1 },
    ],
  }));
  const suppliers: SearchDoc[] = listSuppliers().map((s) => ({
    type: 'supplier',
    id: s.id,
    title: s.name,
    subtitle: `${s.id} · ${s.country}`,
    href: `/suppliers/${s.id}`,
    fields: [
      { text: `${s.id} ${s.name}`, weight: 5 },
      { text: s.capabilities.join(' '), weight: 4 },
      { text: `${s.country} ${s.region} ${s.certifications.join(' ')}`, weight: 1 },
    ],
  }));
  return [...manuals, ...parts, ...suppliers];
}

const DOCS = buildDocs();

/** Light stemming so "brakes"/"brake" and "calipers"/"caliper" match. */
const stem = (t: string) => (t.length > 4 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t);

function scoreDoc(doc: SearchDoc, terms: string[], rawQuery: string): number {
  let score = 0;
  let matchedTerms = 0;
  for (const term of terms) {
    const t = stem(term);
    let best = 0;
    for (const f of doc.fields) {
      const text = normalize(f.text);
      if (new RegExp(`\\b${escape(t)}`).test(text)) best = Math.max(best, f.weight * 2);
      else if (text.includes(t)) best = Math.max(best, f.weight);
    }
    if (best > 0) matchedTerms++;
    score += best;
  }
  if (matchedTerms === 0) return 0;
  // Reward documents that match every term, and exact ID lookups.
  if (matchedTerms === terms.length) score *= 1.5;
  if (doc.id.toLowerCase() === rawQuery.trim().toLowerCase()) score += 100;
  return score;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface SearchOptions {
  types?: EntityType[];
  limit?: number;
}

/** Ranked keyword search across manuals, parts and suppliers. */
export function search(query: string, { types, limit = 20 }: SearchOptions = {}): SearchHit[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  return DOCS.filter((d) => !types || types.includes(d.type))
    .map((doc) => ({ doc, score: scoreDoc(doc, terms, query) }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.id.localeCompare(b.doc.id))
    .slice(0, limit);
}

export const ENTITY_LABEL: Record<EntityType, string> = {
  manual: 'Manuals',
  part: 'Parts',
  supplier: 'Suppliers',
};
