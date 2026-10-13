import { describe, expect, it } from 'vitest';
import { manuals, parts, procedures, suppliers, systems } from './dataset';
import { getManual, manualsForPart, partsForSupplier, suppliersForManual } from './repository';

const ids = <T extends { id: string }>(xs: T[]) => new Set(xs.map((x) => x.id));

describe('dataset integrity', () => {
  it('has unique IDs per entity', () => {
    for (const xs of [manuals, parts, procedures, suppliers, systems]) {
      expect(ids(xs as { id: string }[]).size).toBe(xs.length);
    }
  });

  it('only references existing records', () => {
    const partIds = ids(parts);
    const supplierIds = ids(suppliers);
    const manualIds = ids(manuals);
    const procIds = ids(procedures);
    const systemIds = ids(systems);
    for (const m of manuals) {
      expect(systemIds.has(m.systemId), m.id).toBe(true);
      m.partIds.forEach((id) => expect(partIds.has(id), `${m.id} → ${id}`).toBe(true));
      m.procedureIds.forEach((id) => expect(procIds.has(id), `${m.id} → ${id}`).toBe(true));
    }
    for (const p of parts) {
      expect(p.supplierIds.length, p.id).toBeGreaterThan(0);
      p.supplierIds.forEach((id) => expect(supplierIds.has(id), `${p.id} → ${id}`).toBe(true));
    }
    for (const pr of procedures) pr.manualIds.forEach((id) => expect(manualIds.has(id), `${pr.id} → ${id}`).toBe(true));
  });

  it('keeps manual ↔ procedure links symmetric', () => {
    for (const pr of procedures) {
      for (const mid of pr.manualIds) expect(getManual(mid)!.procedureIds, `${mid} should list ${pr.id}`).toContain(pr.id);
    }
  });
});

describe('repository relationships', () => {
  it('resolves the brake workflow both directions', () => {
    const br = getManual('BR-0012')!;
    expect(suppliersForManual(br).map((s) => s.id)).toEqual(['SP-1007', 'SP-2210', 'SP-2041', 'SP-7002']);
    expect(manualsForPart('PT-3310-12A').map((m) => m.id)).toEqual(['BR-0012']);
    expect(partsForSupplier('SP-2041').map((p) => p.id)).toContain('PT-3310-12B');
  });
});
