# Toyo-ui

A typed, accessible React component library built on Material UI, with an interactive
**Component Engineering Lab** and an **independent consumer app** that proves the library works
from its public package exports alone.

```tsx
import { ToyoThemeProvider } from '@toyo-ui/theme';
import { Button, TextField } from '@toyo-ui/react';

export function App() {
  return (
    <ToyoThemeProvider>
      <TextField label="Component name" />
      <Button>Create component</Button>
    </ToyoThemeProvider>
  );
}
```

## What's in the repository

```
toyo-ui/
├── packages/
│   ├── theme/          @toyo-ui/theme  — design tokens, MUI theme factory, ToyoThemeProvider
│   └── react/          @toyo-ui/react  — 8 typed components on MUI
├── apps/
│   ├── playground/     Component Engineering Lab (previews, props, usage, API, a11y, tests)
│   └── consumer-demo/  "Release Console" — a product app using only the public exports
├── e2e/                Playwright browser tests for both apps
├── docs/               Architecture, guidelines, accessibility, testing, demo script, ADR,
│                       and the generated component reference
└── .github/workflows/  CI
```

Dependencies point one way: **apps → `@toyo-ui/react` → `@toyo-ui/theme`**. See
[docs/architecture.md](docs/architecture.md).

| Component | Status | Purpose |
|---|---|---|
| `Button` | stable | Four semantic variants, three sizes, loading with a visible label |
| `TextField` | stable | Required label, helper text, blur-time validation, error messaging, character count |
| `Alert` | stable | Severity-driven live-region role, title, action, dismiss |
| `StatusBadge` | stable | Tone + required text label, shared tones with Alert |
| `Dialog` | stable | Labelled modal, async confirm with pending state, safe initial focus, portal target |
| `DataTable` | stable | Generic typed columns, sorting with `aria-sort`, loading/empty states |
| `LoadingState` | beta | Spinner, bar or skeleton, always announced |
| `EmptyState` | beta | No data / no results / error, with a recovery action |

Full per-component reference (props, usage, accessibility, test coverage):
[docs/components.md](docs/components.md) — generated from the same metadata the lab renders.

## Technology

React 19 · TypeScript 5.9 (strict) · MUI 9 + Emotion · pnpm 11 workspaces · Vite 8 (apps and library builds)
· Vitest 5 + Testing Library + user-event + axe-core · Playwright + @axe-core/playwright · ESLint 9 · Prettier
· GitHub Actions. No AI services, APIs or credentials.

## Getting started

Requires Node ≥ 20.19 and pnpm 11 (`corepack enable` picks up the version from `package.json`).

```bash
pnpm install
pnpm dev            # Component Lab at http://localhost:5173
pnpm dev:consumer   # builds the packages, then the Release Console
```

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Component Lab with HMR. Uses package **source** through the `@toyo-ui/source` export condition. |
| `pnpm dev:consumer` | Builds the packages, then runs the consumer demo against their **`dist/`**. |
| `pnpm build:packages` | Builds `@toyo-ui/theme` and `@toyo-ui/react` (ESM + `.d.ts`). |
| `pnpm build` | Packages, test report, then both apps. |
| `pnpm typecheck` | Builds packages, then `tsc --noEmit` in every project. |
| `pnpm lint` / `pnpm format` / `pnpm format:check` | ESLint (incl. jsx-a11y) and Prettier. |
| `pnpm test` | Builds packages, then all Vitest projects (theme, react, playground, consumer-demo). |
| `pnpm test:e2e` | Playwright against both apps (installed Chrome locally; bundled Chromium in CI). |
| `pnpm verify:consumer` | Fails unless the consumer resolves `@toyo-ui/*` to `packages/*/dist` and internals are blocked. |
| `pnpm docs:components` | Regenerates `docs/components.md` from the catalog and lab registry. |
| `pnpm check` | Everything CI runs before browser tests: build packages, typecheck, lint, format, unit tests, consumer verification, app builds. |

Without Google Chrome installed: `pnpm exec playwright install chromium`, then `pnpm build && CI=1 pnpm test:e2e`
(CI mode uses Playwright's bundled Chromium and serves the production builds).

## Consuming the library from another workspace app

1. Add the packages and their peers:

   ```json
   {
     "dependencies": {
       "@toyo-ui/react": "workspace:*",
       "@toyo-ui/theme": "workspace:*",
       "@mui/material": "^9.5.0",
       "@mui/icons-material": "^9.5.0",
       "@mui/utils": "^9.5.0",
       "@emotion/react": "^11.14.0",
       "@emotion/styled": "^11.14.1",
       "react": "^19.3.0",
       "react-dom": "^19.3.0"
     }
   }
   ```

2. Wrap the app once in `ToyoThemeProvider`. Pass a router link if you want MUI links to route client-side:

   ```tsx
   const theme = createToyoTheme({ linkComponent: MyRouterLink });
   <ToyoThemeProvider theme={theme}>…</ToyoThemeProvider>
   ```

3. Import only from the entry points: `@toyo-ui/react`, `@toyo-ui/theme`. Deep imports are blocked by the
   packages' `exports` maps.
4. Run `pnpm build:packages` before starting the app — it consumes `dist/`, like an external project would.

`apps/consumer-demo` is the working example, including a lint rule that rejects internal imports.

## Adding a component

1. Create `packages/react/src/Name.tsx` with an exported `NameProps` interface, and export both from
   `packages/react/src/index.ts`. Update the public-API test in `index.test.ts`.
2. Write `packages/react/src/Name.test.tsx`: behavior via roles and `userEvent`, plus an axe check.
3. Document it in `apps/playground/src/catalog/docs/name.ts` and add its id to `COMPONENT_IDS`.
4. Add a lab entry in `apps/playground/src/features/component-lab/entries/name.tsx` and register it.
   The catalog and registry are typed by component id, so a missing doc or entry fails `typecheck`.
5. `pnpm docs:components && pnpm check`.

Details and API conventions: [docs/component-guidelines.md](docs/component-guidelines.md).

## Testing

223 Vitest tests in 22 files (theme 73, react 62, playground 80, consumer demo 8) and 49 Playwright tests,
including axe scans with real color contrast on 17 playground pages and the consumer app in light and dark.
See [docs/testing-strategy.md](docs/testing-strategy.md) and [docs/accessibility.md](docs/accessibility.md).

Tests use **Vitest** rather than Jest: it shares Jest's API, runs Testing Library and user-event unchanged, and
reuses the Vite config the packages already build with. Accessibility checks call axe-core directly — the
engine behind `jest-axe`.

## Known limitations

- Packages are not published to a registry; consumption is demonstrated within the workspace.
- Type declarations use extensionless relative imports. Bundler resolution (Vite, webpack, Next.js) works;
  strict `NodeNext` resolution would need `.js` extensions.
- `DataTable` has no pagination or virtualization — suitable up to a few hundred rows.
- Browser tests run in Chromium only. Screen-reader, zoom and forced-colors passes have not been done.
- The consumer demo's API is an in-memory fake.

## Further reading

[Architecture](docs/architecture.md) · [Component guidelines](docs/component-guidelines.md) ·
[Component reference](docs/components.md) · [Accessibility](docs/accessibility.md) ·
[Testing strategy](docs/testing-strategy.md) · [Demo script](docs/demo-script.md) ·
[ADR 0001: MUI foundation](docs/adr/0001-mui-foundation-focused-api.md) ·
[Implementation status](IMPLEMENTATION_STATUS.md)
