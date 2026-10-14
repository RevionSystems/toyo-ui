// Proves the consumer resolves Toyo-ui through package `exports` to built output.
// Resolution runs from this app's folder, the same way Node and bundlers resolve an installed package.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const checks = [
  ['@toyo-ui/react', '/packages/react/dist/index.js'],
  ['@toyo-ui/theme', '/packages/theme/dist/index.js'],
];

let failed = false;
for (const [specifier, expected] of checks) {
  let resolved;
  try {
    resolved = fileURLToPath(import.meta.resolve(specifier));
  } catch (err) {
    console.error(`✗ ${specifier} did not resolve: ${err.message}`);
    failed = true;
    continue;
  }
  const ok = resolved.endsWith(expected) && existsSync(resolved);
  console.log(`${ok ? '✓' : '✗'} ${specifier} → ${resolved}`);
  if (!ok) failed = true;
}

for (const internal of ['@toyo-ui/react/src/Button', '@toyo-ui/react/Button', '@toyo-ui/theme/tokens']) {
  try {
    import.meta.resolve(internal);
    console.error(`✗ ${internal} resolved, but internals must not be importable`);
    failed = true;
  } catch {
    console.log(`✓ ${internal} is blocked by the exports map`);
  }
}

if (failed) {
  console.error('\nRun `pnpm build:packages` and check the packages\' "exports".');
  process.exit(1);
}
