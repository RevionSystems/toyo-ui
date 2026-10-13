import { manuals, parts, procedures, suppliers, systems } from './dataset';
import type { Manual, Part, Procedure, Supplier, SystemId, VehicleSystem } from './types';

/*
 * Read-only query layer over the dataset. Pages and features import from here,
 * never from `dataset.ts` directly, so a real API could replace it behind the same
 * function signatures.
 */

const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((i) => [i.id, i]));

const manualIndex = byId(manuals);
const partIndex = byId(parts);
const supplierIndex = byId(suppliers);
const procedureIndex = byId(procedures);
const systemIndex = new Map(systems.map((s) => [s.id, s]));

const resolve = <T>(ids: string[], index: Map<string, T>): T[] =>
  ids.flatMap((id) => {
    const item = index.get(id);
    return item ? [item] : [];
  });

export const listSystems = (): VehicleSystem[] => systems;
export const listManuals = (): Manual[] => manuals;
export const listParts = (): Part[] => parts;
export const listSuppliers = (): Supplier[] => suppliers;
export const listProcedures = (): Procedure[] => procedures;

export const getSystem = (id: SystemId | string) => systemIndex.get(id as SystemId);
export const getManual = (id: string) => manualIndex.get(id);
export const getPart = (id: string) => partIndex.get(id);
export const getSupplier = (id: string) => supplierIndex.get(id);
export const getProcedure = (id: string) => procedureIndex.get(id);

export const partsForManual = (manual: Manual): Part[] => resolve(manual.partIds, partIndex);
export const proceduresForManual = (manual: Manual): Procedure[] =>
  resolve(manual.procedureIds, procedureIndex);

export const suppliersForPart = (part: Part): Supplier[] => resolve(part.supplierIds, supplierIndex);
export const manualsForPart = (partId: string): Manual[] =>
  manuals.filter((m) => m.partIds.includes(partId));

export const partsForSupplier = (supplierId: string): Part[] =>
  parts.filter((p) => p.supplierIds.includes(supplierId));

/** Suppliers that source any part referenced by the manual, primary sources first. */
export const suppliersForManual = (manual: Manual): Supplier[] => {
  const ids = new Set<string>();
  for (const part of partsForManual(manual)) part.supplierIds.forEach((id) => ids.add(id));
  return resolve([...ids], supplierIndex);
};

export const manualsForSystem = (systemId: SystemId) => manuals.filter((m) => m.systemId === systemId);
export const partsForSystem = (systemId: SystemId) => parts.filter((p) => p.systemId === systemId);
export const proceduresForSystem = (systemId: SystemId) =>
  procedures.filter((p) => p.systemId === systemId);

export const assembliesFor = (items: Part[]) => new Set(items.map((p) => p.assembly));

export interface PlatformStats {
  systems: number;
  manuals: number;
  parts: number;
  assemblies: number;
  suppliers: number;
  procedures: number;
  plants: number;
  openReviews: number;
}

export function platformStats(): PlatformStats {
  return {
    systems: systems.length,
    manuals: manuals.length,
    parts: parts.length,
    assemblies: assembliesFor(parts).size,
    suppliers: suppliers.length,
    procedures: procedures.length,
    plants: new Set(procedures.map((p) => p.plant)).size,
    openReviews:
      manuals.filter((m) => m.status !== 'approved').length +
      parts.filter((p) => p.status === 'in-review').length,
  };
}
