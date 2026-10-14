/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Deliberately NOT using the workspace `@toyo-ui/source` condition: `@toyo-ui/*` resolve through
 * their `exports` to the built `dist/`, exactly as they would for an app outside this repository.
 * Run `pnpm build:packages` first.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
  },
  build: {
    rolldownOptions: {
      output: {
        // Cache-friendly vendor chunks; the Toyo-ui chunk also shows the library's own size.
        // Groups pull in their dependencies, so MUI must outrank Toyo-ui or the library chunk absorbs it.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 30 },
            { name: 'toyo-ui', test: /[\\/]packages[\\/](react|theme)[\\/]dist[\\/]/, priority: 10 },
            {
              name: 'mui',
              test: /node_modules[\\/](@mui|@emotion|@popperjs|react-transition-group)[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  test: {
    name: 'consumer-demo',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
