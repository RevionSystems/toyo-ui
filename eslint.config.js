import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist', '**/coverage', 'playwright-report', 'test-results', '.test-report', '**/src/generated'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, jsxA11y.flatConfigs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },
  {
    // Route tables and test helpers are not hot-reloaded component modules.
    files: [
      'apps/playground/src/app/routes.tsx',
      '**/src/test/**',
      '**/*.test.{ts,tsx}',
      'apps/playground/src/features/component-lab/entries/**',
    ],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    // The consumer demo proves the library works from its public exports alone.
    files: ['apps/consumer-demo/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@toyo-ui/*/*'],
              message: 'Import from the package entry point (e.g. @toyo-ui/react), not internals.',
            },
            {
              group: ['**/packages/**', '**/playground/**'],
              message: 'The consumer demo must not reach into workspace sources.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['e2e/**/*.ts', '**/*.config.ts', 'vite.shared.ts', '**/scripts/**'],
    languageOptions: { globals: globals.node },
  },
);
