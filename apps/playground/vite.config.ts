/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { sourceResolve, sourceSsrResolve } from '../../vite.shared.ts';

export default defineConfig({
  plugins: [react()],
  resolve: {
    ...sourceResolve,
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    // Context-bearing libraries must be single instances across app and workspace packages.
    dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
  },
  ssr: sourceSsrResolve,
  build: {
    // axe-core (~660 kB) is the only chunk above Vite's 500 kB default, and it is lazy-loaded
    // when a user runs an accessibility check. Initial bundles stay well under this limit.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks: app deploys don't invalidate cached framework code.
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              priority: 20,
            },
            {
              name: 'mui',
              test: /node_modules[\\/](@mui|@emotion|@popperjs|react-transition-group)[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
  test: {
    name: 'playground',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // The on-disk transform cache keys on a file's own content, so `import.meta.glob`
    // results (component-lab/source.ts) go stale when component files are added.
    fsModuleCache: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
