// Turns Vitest's JSON report into the small, path-safe shape the Test Explorer reads.
// Absolute paths are rewritten relative to the repo so no local filesystem details ship in the build.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

// Paths are resolved from the workspace root (this script lives in apps/playground/scripts).
const root = resolve(import.meta.dirname, '../../..');
const [input = '.test-report/raw.json', output = 'apps/playground/src/generated/test-results.json'] =
  process.argv.slice(2);
const raw = JSON.parse(readFileSync(resolve(root, input), 'utf8'));

const STATUS = { passed: 'passed', failed: 'failed', skipped: 'skipped', pending: 'skipped', todo: 'skipped' };

const files = raw.testResults
  .map((f) => ({
    file: relative(root, f.name),
    status: f.status === 'passed' ? 'passed' : 'failed',
    durationMs: Math.round((f.endTime ?? 0) - (f.startTime ?? 0)),
    tests: f.assertionResults.map((t) => ({
      ancestors: t.ancestorTitles,
      title: t.title,
      status: STATUS[t.status] ?? 'skipped',
      durationMs: Math.round(t.duration ?? 0),
      // First line only: enough to identify the failure without dumping stack traces.
      failure: t.failureMessages?.[0]?.split('\n')[0],
    })),
  }))
  .sort((a, b) => a.file.localeCompare(b.file));

const tests = files.flatMap((f) => f.tests);
const report = {
  generatedAt: new Date().toISOString(),
  durationMs: Math.round(Math.max(0, ...raw.testResults.map((f) => f.endTime ?? 0)) - raw.startTime),
  totals: {
    files: files.length,
    tests: tests.length,
    passed: tests.filter((t) => t.status === 'passed').length,
    failed: tests.filter((t) => t.status === 'failed').length,
    skipped: tests.filter((t) => t.status === 'skipped').length,
  },
  files,
};

mkdirSync(dirname(resolve(root, output)), { recursive: true });
writeFileSync(resolve(root, output), JSON.stringify(report, null, 2) + '\n');
console.log(`Test report: ${report.totals.passed}/${report.totals.tests} passed in ${files.length} files → ${output}`);
if (report.totals.failed > 0) process.exitCode = 1;
