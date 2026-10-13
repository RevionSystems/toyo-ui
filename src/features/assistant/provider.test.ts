import { afterEach, describe, expect, it, vi } from 'vitest';
import { configuredProvider, groundRemoteAnswer, httpProvider, localProvider } from './provider';

afterEach(() => vi.unstubAllGlobals());

describe('groundRemoteAnswer', () => {
  it('keeps only records that exist and facts with a real source', () => {
    const a = groundRemoteAnswer('brakes', {
      summary: 'Brake docs',
      systemId: 'braking',
      manualIds: ['BR-0012', 'BR-9999'],
      partIds: ['PT-3310-12A', 'PT-FAKE'],
      supplierIds: ['SP-1007', 42],
      facts: [
        { label: 'Front caliper bolt', value: '110 N·m', sourceId: 'BR-0012' },
        { label: 'Invented bolt', value: '1 N·m', sourceId: 'XX-0000' },
      ],
    });
    expect(a.manuals.map((m) => m.id)).toEqual(['BR-0012']);
    expect(a.parts.map((p) => p.id)).toEqual(['PT-3310-12A']);
    expect(a.suppliers.map((s) => s.id)).toEqual(['SP-1007']);
    expect(a.facts).toHaveLength(1);
    expect(a.system?.id).toBe('braking');
  });

  it('rejects a payload without a summary', () => {
    expect(() => groundRemoteAnswer('q', { manualIds: [] })).toThrow(/malformed/i);
  });
});

describe('httpProvider', () => {
  it('posts the query and grounds the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ summary: 'ok', manualIds: ['BR-0035'] })));
    vi.stubGlobal('fetch', fetchMock);
    const a = await httpProvider('/api/assistant').ask('abs sensor');
    expect(fetchMock).toHaveBeenCalledWith('/api/assistant', expect.objectContaining({ method: 'POST', body: JSON.stringify({ query: 'abs sensor' }) }));
    expect(a.manuals.map((m) => m.id)).toEqual(['BR-0035']);
  });

  it.each([
    ['network error', () => Promise.reject(new TypeError('Failed to fetch'))],
    ['HTTP 500', () => Promise.resolve(new Response('nope', { status: 500 }))],
    ['malformed body', () => Promise.resolve(new Response(JSON.stringify({ nope: true })))],
  ])('falls back to the offline engine on %s', async (_, impl) => {
    vi.stubGlobal('fetch', vi.fn(impl));
    const a = await httpProvider('/api/assistant').ask('What is the torque for the front caliper bolt?');
    expect(a.facts[0]?.value).toBe('110 N·m');
  });
});

describe('configuredProvider', () => {
  it('uses the offline engine unless an endpoint is configured', () => {
    expect(configuredProvider({})).toBe(localProvider);
    expect(configuredProvider({ VITE_ASSISTANT_ENDPOINT: '  ' })).toBe(localProvider);
    expect(configuredProvider({ VITE_ASSISTANT_ENDPOINT: '/api/assistant' }).id).toBe('http');
  });
});
