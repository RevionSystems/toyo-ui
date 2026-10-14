/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { sourceResolve, sourceSsrResolve } from '../../vite.shared.ts';

/** Library build: ESM only, one output file per module, every runtime dependency external. */
export default defineConfig({
  plugins: [react()],
  resolve: sourceResolve,
  ssr: sourceSsrResolve,
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'] },
    outDir: 'dist',
    sourcemap: true,
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@mui\//, /^@emotion\//],
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
  },
  test: {
    name: 'theme',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    fsModuleCache: false,
  },
});
