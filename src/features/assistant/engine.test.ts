import { describe, expect, it } from 'vitest';
import { answer, detectIntent, detectSystem } from './engine';

describe('assistant engine', () => {
  it('answers the braking discovery workflow with manuals, parts and suppliers', () => {
    const a = answer('Find the documentation for the braking system and show which parts and suppliers are associated with it.');
    expect(a.system?.id).toBe('braking');
    expect(a.intent).toBe('overview');
    expect(a.manuals.map((m) => m.id)).toContain('BR-0012');
    expect(a.manuals.every((m) => m.systemId === 'braking')).toBe(true);
    expect(a.parts.map((p) => p.id)).toEqual(expect.arrayContaining(['PT-3310-12A', 'PT-3310-12B', 'PT-3310-12C']));
    expect(a.suppliers.map((s) => s.id)).toEqual(expect.arrayContaining(['SP-1007', 'SP-2041']));
  });

  it('returns cited torque facts', () => {
    const a = answer('What is the torque for the front caliper bolt?');
    expect(a.intent).toBe('torque');
    expect(a.facts[0]).toEqual({ label: 'Front caliper bolt', value: '110 N·m', sourceId: 'BR-0012' });
  });

  it('anchors on an explicit part number', () => {
    const a = answer('Which manuals reference PT-3320-02A?');
    expect(a.parts.map((p) => p.id)).toEqual(['PT-3320-02A']);
    expect(a.manuals.map((m) => m.id).sort()).toEqual(['BR-0035', 'EE-0620']);
    expect(a.suppliers.map((s) => s.id)).toEqual(['SP-3105']);
  });

  it('detects supplier intent and the battery system', () => {
    const a = answer('Who supplies parts for the HV battery?');
    expect(a.intent).toBe('suppliers');
    expect(a.system?.id).toBe('battery');
    expect(a.suppliers.map((s) => s.id)).toContain('SP-3380');
  });

  it('falls back gracefully when nothing matches', () => {
    const a = answer('quantum flux capacitor');
    expect(a.manuals).toHaveLength(0);
    expect(a.parts).toHaveLength(0);
    expect(a.summary).toMatch(/could not find/i);
    expect(a.followUps.length).toBeGreaterThan(0);
  });

  it.each([
    ['show suspension manuals', 'chassis'],
    ['airbag removal', 'interior'],
    ['coolant pump', 'thermal'],
  ])('detectSystem(%s) → %s', (q, id) => {
    expect(detectSystem(q)?.id).toBe(id);
  });

  it('treats multi-entity questions as an overview', () => {
    expect(detectIntent('docs, parts and suppliers for brakes')).toBe('overview');
    expect(detectIntent('brake suppliers')).toBe('suppliers');
  });
});
