import { describe, expect, it } from 'vitest';
import { testName, testsForComponent, type TestReport } from './testReport';

const report: TestReport = {
  generatedAt: '2026-10-13T00:00:00.000Z',
  durationMs: 10,
  totals: { files: 3, tests: 4, passed: 3, failed: 1, skipped: 0 },
  files: [
    {
      file: 'packages/react/src/Button.test.tsx',
      status: 'passed',
      durationMs: 1,
      tests: [{ ancestors: ['Button'], title: 'clicks', status: 'passed', durationMs: 1 }],
    },
    {
      file: 'packages/react/src/Dialog.test.tsx',
      status: 'failed',
      durationMs: 1,
      tests: [{ ancestors: ['Dialog'], title: 'escape', status: 'failed', durationMs: 1, failure: 'boom' }],
    },
    {
      file: 'src/features/component-lab/registry.test.tsx',
      status: 'passed',
      durationMs: 1,
      tests: [
        { ancestors: ['button lab entry'], title: 'axe', status: 'passed', durationMs: 1 },
        { ancestors: ['dialog lab entry'], title: 'axe', status: 'passed', durationMs: 1 },
      ],
    },
  ],
};

describe('testsForComponent', () => {
  it('combines the component test file with its registry suite', () => {
    const result = testsForComponent('button', report);
    expect(result.map((r) => r.file)).toEqual([
      'packages/react/src/Button.test.tsx',
      'src/features/component-lab/registry.test.tsx',
    ]);
    expect(result[1]!.tests.map(testName)).toEqual(['button lab entry › axe']);
  });

  it('returns nothing without a report or matching files', () => {
    expect(testsForComponent('button', undefined)).toEqual([]);
    expect(testsForComponent('alert', report)).toEqual([]);
  });
});
