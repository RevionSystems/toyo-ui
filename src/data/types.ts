/**
 * Domain model for the engineering dataset. Entities reference each other by ID,
 * mirroring how a PLM system would expose them; `repository.ts` resolves the joins.
 */

export type SystemId =
  | 'powertrain'
  | 'battery'
  | 'thermal'
  | 'chassis'
  | 'braking'
  | 'body'
  | 'electrical'
  | 'interior';

export interface VehicleSystem {
  id: SystemId;
  name: string;
  description: string;
  image: string;
}

export type DocumentStatus = 'approved' | 'in-review' | 'draft';
export type PartStatus = 'released' | 'in-review' | 'obsolete';
export type SupplierStatus = 'approved' | 'conditional' | 'under-review';

export interface Supplier {
  id: string;
  name: string;
  country: string;
  region: 'Asia' | 'Europe' | 'North America';
  capabilities: string[];
  certifications: string[];
  leadTimeDays: number;
  /** On-time delivery over the trailing 12 months, 0–100. */
  onTimeRate: number;
  status: SupplierStatus;
}

export interface Part {
  id: string;
  name: string;
  systemId: SystemId;
  assembly: string;
  description: string;
  material: string;
  weightKg: number;
  revision: string;
  status: PartStatus;
  /** First entry is the primary source; the rest are approved alternates. */
  supplierIds: string[];
  image?: string;
}

export interface TorqueSpec {
  item: string;
  newtonMeters: number;
}

export interface ManualSection {
  heading: string;
  body: string;
}

export interface Manual {
  id: string;
  title: string;
  systemId: SystemId;
  revision: string;
  updated: string;
  status: DocumentStatus;
  summary: string;
  appliesTo: string;
  readMinutes: number;
  partIds: string[];
  procedureIds: string[];
  sections: ManualSection[];
  torqueSpecs: TorqueSpec[];
  tags: string[];
}

export interface Procedure {
  id: string;
  name: string;
  systemId: SystemId;
  plant: string;
  station: string;
  cycleTimeSec: number;
  manualIds: string[];
}
