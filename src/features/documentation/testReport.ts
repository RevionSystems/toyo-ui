import { CATALOG, type ComponentId } from '@shared/catalog';

export type TestStatus = 'passed' | 'failed' | 'skipped';

export interface TestCase {
  ancestors: string[];
  title: string;
  status: TestStatus;
  durationMs: number;
  failure?: string;
}

export interface TestFile {
  /** Repo-relative path. */
  file: string;
  status: 'passed' | 'failed';
  durationMs: number;
  tests: TestCase[];
}

export interface TestReport {
  generatedAt: string;
  durationMs: number;
  totals: { files: number; tests: number; passed: number; failed: number; skipped: number };
  files: TestFile[];
}

/*
 * Written by `npm run test:report` (and every `npm run build`). The glob resolves to an
 * empty object when the file has not been generated yet, so the UI can explain how to create it.
 */
const modules = import.meta.glob<TestReport>('/src/generated/test-results.json', { eager: true, import: 'default' });
export const testReport: TestReport | undefined = Object.values(modules)[0];

export const REPORT_COMMAND = 'npm run test:report';

export interface ComponentTests {
  file: string;
  tests: TestCase[];
}

/**
 * Tests that exercise one component: its own `<Name>.test.tsx` plus the lab registry suite
 * for that component (render + axe, generated code, documented props).
 */
export function testsForComponent(id: ComponentId, report: TestReport | undefined): ComponentTests[] {
  if (!report) return [];
  const name = CATALOG[id].name;
  const own = report.files
    .filter((f) => f.file.endsWith(`/${name}.test.tsx`))
    .map((f) => ({ file: f.file, tests: f.tests }));
  const registry = report.files
    .filter((f) => f.file.endsWith('component-lab/registry.test.tsx'))
    .map((f) => ({ file: f.file, tests: f.tests.filter((t) => t.ancestors[0] === `${id} lab entry`) }))
    .filter((f) => f.tests.length > 0);
  return [...own, ...registry];
}

export const testName = (t: TestCase) => [...t.ancestors, t.title].join(' › ');
