import type { StatusTone } from '@toyo-ui/react';

export type Environment = 'production' | 'staging' | 'canary';
export type ReleaseStatus = 'deployed' | 'deploying' | 'scheduled' | 'failed' | 'rolled-back';

export interface Release {
  id: string;
  service: string;
  version: string;
  environment: Environment;
  status: ReleaseStatus;
  owner: string;
  updatedAt: string;
}

/** Product statuses mapped onto the library's semantic tones. */
export const STATUS_DISPLAY: Record<ReleaseStatus, { tone: StatusTone; label: string }> = {
  deployed: { tone: 'success', label: 'Deployed' },
  deploying: { tone: 'info', label: 'Deploying' },
  scheduled: { tone: 'neutral', label: 'Scheduled' },
  failed: { tone: 'error', label: 'Failed' },
  'rolled-back': { tone: 'warning', label: 'Rolled back' },
};

const SEED: Release[] = [
  {
    id: 'r-101',
    service: 'checkout-api',
    version: '4.12.0',
    environment: 'production',
    status: 'deployed',
    owner: 'Payments',
    updatedAt: '2026-10-13T09:24:00Z',
  },
  {
    id: 'r-102',
    service: 'inventory-sync',
    version: '2.3.1',
    environment: 'production',
    status: 'failed',
    owner: 'Supply',
    updatedAt: '2026-10-13T08:02:00Z',
  },
  {
    id: 'r-103',
    service: 'search-indexer',
    version: '1.8.0',
    environment: 'staging',
    status: 'deploying',
    owner: 'Discovery',
    updatedAt: '2026-10-13T10:41:00Z',
  },
  {
    id: 'r-104',
    service: 'notifications',
    version: '3.0.0',
    environment: 'canary',
    status: 'deployed',
    owner: 'Platform',
    updatedAt: '2026-10-12T17:15:00Z',
  },
  {
    id: 'r-105',
    service: 'pricing-engine',
    version: '5.1.2',
    environment: 'production',
    status: 'scheduled',
    owner: 'Payments',
    updatedAt: '2026-10-14T06:00:00Z',
  },
  {
    id: 'r-106',
    service: 'auth-gateway',
    version: '7.4.0',
    environment: 'production',
    status: 'deployed',
    owner: 'Identity',
    updatedAt: '2026-10-11T13:37:00Z',
  },
];

export interface ReleaseApiOptions {
  /** Simulated network latency. Tests use 0. */
  latencyMs?: number;
  /** When true, every call rejects, to demonstrate error handling. */
  failing?: () => boolean;
}

/**
 * In-memory stand-in for a release service. Async on purpose so the UI exercises real
 * loading, error and retry paths.
 */
export function createReleaseApi({ latencyMs = 600, failing = () => false }: ReleaseApiOptions = {}) {
  let releases = SEED.map((r) => ({ ...r }));
  const respond = <T>(value: () => T) =>
    new Promise<T>((resolve, reject) =>
      setTimeout(
        () => (failing() ? reject(new Error('Release service is unavailable (503).')) : resolve(value())),
        latencyMs,
      ),
    );

  return {
    list: () => respond(() => releases.map((r) => ({ ...r }))),
    rollBack: (id: string) =>
      respond(() => {
        releases = releases.map((r) =>
          r.id === id ? { ...r, status: 'rolled-back' as const, updatedAt: new Date().toISOString() } : r,
        );
        return releases.find((r) => r.id === id)!;
      }),
    create: (input: Pick<Release, 'service' | 'version' | 'environment' | 'owner'>) =>
      respond(() => {
        const release: Release = {
          ...input,
          id: `r-${Date.now()}`,
          status: 'scheduled',
          updatedAt: new Date().toISOString(),
        };
        releases = [release, ...releases];
        return release;
      }),
  };
}

export type ReleaseApi = ReturnType<typeof createReleaseApi>;

/** Semantic-version check used by the new-release form. */
export const isSemver = (v: string) => /^\d+\.\d+\.\d+$/.test(v.trim());
