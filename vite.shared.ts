import { defaultClientConditions, defaultServerConditions, type UserConfig } from 'vite';

/**
 * Custom export condition that maps `@toyo-ui/*` imports to package source instead of `dist/`.
 * Enabled for the playground (instant HMR) and for tests. The consumer demo deliberately does
 * NOT enable it, so it resolves the built output exactly like an external consumer.
 */
export const SOURCE_CONDITION = '@toyo-ui/source';

export const sourceResolve = {
  conditions: [SOURCE_CONDITION, ...defaultClientConditions],
} satisfies UserConfig['resolve'];

/** Vitest runs modules through the SSR pipeline, which uses server conditions. */
export const sourceSsrResolve = {
  resolve: { conditions: [SOURCE_CONDITION, ...defaultServerConditions] },
} satisfies UserConfig['ssr'];
