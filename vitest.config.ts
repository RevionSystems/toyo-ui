import { defineConfig } from 'vitest/config';

/**
 * One test run for the whole workspace. Each project keeps its own environment and setup;
 * the combined JSON report feeds the playground's Test Explorer.
 */
export default defineConfig({
  test: {
    projects: ['packages/*', 'apps/*'],
  },
});
