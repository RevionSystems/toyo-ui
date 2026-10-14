# Toyo-ui — Implementation Status

**Pure component engineering lab.** A typed React component library on MUI, published as local workspace
packages (`@toyo-ui/theme`, `@toyo-ui/react`), explored in an interactive playground and consumed by an
independent demo app. No AI functionality.

## Starting point

History: an automotive portal (through `e34532a`), then a component lab with planned AI features
(`68190c7`–`a026320`). The AI assistant was only ever a placeholder page plus entry points (nav item,
"ask AI" search, Overview button, env type); no AI server, SDK or dependency was ever added.

Kept from the lab: 8 typed MUI-based components with tests, token → theme pipeline, catalog-driven docs,
Component Lab (preview, properties, generated code, real TypeScript declarations, axe on preview),
Foundations pages, API and Test Explorers, Playwright + axe browser tests.

## Decisions

| Decision | Why |
|---|---|
| **Vitest, not Jest** | The brief asks for Jest "where compatible with the existing setup". Vitest uses Jest's `describe`/`it`/`expect` API and already runs Testing Library, user-event and axe checks (axe-core directly, the engine behind `jest-axe`). Switching would add a Babel/ts-jest ESM toolchain without changing what is verified. |
| **pnpm workspaces** | Required by the brief; `workspace:*` links packages without publishing. |
| **Source condition for the lab, `dist/` for consumers** | Package `exports` add a custom `@toyo-ui/source` condition → `src/index.ts`. The playground and tests opt in (instant HMR, no build step); the consumer demo does not, so it resolves `dist/` exactly like an external consumer. Deep imports are blocked by the `exports` map. |
| **Vite library mode + `tsc` declarations** | Vite is already the build tool; library mode emits one ESM file per module (`preserveModules`) with React, MUI, Emotion and `@toyo-ui/*` external. `tsc --emitDeclarationOnly` writes `.d.ts`. No extra bundler. |
| **Theme package owns MUI augmentation** | `@toyo-ui/react` declares `@toyo-ui/theme` as a peer (one direction only): components use its palette roles (`primaryText`, `tonal.*`). The augmentation ships in `theme.d.ts`. |
| **Router-agnostic packages** | The theme accepts an optional link component; the playground injects React Router's. Packages never import a router. |

## Slices

| # | Slice | Status |
|---|---|---|
| A | Audit and remove all AI functionality | Done |
| B | pnpm workspace: `packages/theme`, `packages/react`, `apps/playground`; builds, exports, shared TS config | Done |
| C | Component Lab refinements: status indicators, Preview / Usage / API structure, import examples | Done |
| D | `apps/consumer-demo`: independent app using only public exports | Pending |
| E | CI workflow, docs (README, architecture, guidelines, accessibility, testing, demo script, ADR), final verification | Pending |

## Progress log

- **Slice A — AI removal.** Removed the assistant page and route, the "AI Assistant" nav item, the
  free-text "ask AI" behavior in the header search (now a plain component/page picker: Enter opens the
  highlighted match), the "With AI" tagline, the Overview "Ask the AI assistant" button and copy, the
  `VITE_ASSISTANT_ENDPOINT` env type, and assistant mentions in the Documentation, Accessibility and catalog
  copy. Deleted the stale portal-era `docs/` and replaced the README with an interim one (rewritten in
  slice E). Dependency audit: no AI packages in `package.json`; lockfile matches were false positives
  (`github.com/sponsors/ai`). Also fixed: the header rendered two search instances (desktop + mobile, one
  hidden by CSS), each registering ⌘K — now exactly one renders per breakpoint.
  Regression tests: `/engineering/assistant` is a 404; primary nav contains no AI entry; search opens a
  component with Enter. Results: typecheck ✓, lint ✓, 205 unit tests ✓, 46 browser tests ✓.

- **Slice B — pnpm workspace.** `pnpm-workspace.yaml` (`packages/*`, `apps/*`), `tsconfig.base.json`, root
  `vitest.config.ts` running all projects, shared `vite.shared.ts` (source condition). `npm` lockfile replaced
  by `pnpm-lock.yaml`.
  **`@toyo-ui/theme`**: tokens (+ breakpoints, border), contrast utilities, `createToyoTheme` (now router-agnostic
  via `linkComponent`), default `theme`, new `ToyoThemeProvider`; tests for tokens, theme factory, link
  injection, provider, public API.
  **`@toyo-ui/react`**: the 8 components and their tests, package-local test helpers (no router), relative imports
  only; public API test. Peer deps: React, MUI (material, icons, utils), Emotion, `@toyo-ui/theme`.
  **`apps/playground`**: the lab, importing only `@toyo-ui/react` / `@toyo-ui/theme`; injects React Router into the
  theme; catalog moved to `src/catalog`; API tab reads `packages/react/src` for display; test report covers all
  projects. Playground-only layout tokens moved to `src/app/layout.ts`.
  Verified build output: per-module ESM + `.d.ts`, all runtime deps external, theme augmentation present, no
  `@/` alias leaks. Clean checkout: `pnpm install --frozen-lockfile && pnpm check` ✓ (typecheck, lint, format,
  213 tests in 21 files, package builds, test report, playground build); 46 browser tests ✓.
  The exports map caught one deep import (`@toyo-ui/react/EmptyState`) in the playground.

- **Slice C — Lab refinements.** Component lifecycle `status` (`stable` | `beta`) in the catalog: the six core
  components from the brief are stable; LoadingState and EmptyState are beta. The sidebar now lists each
  component (with a Beta badge where relevant) instead of categories; status also shows in the banner, Overview
  cards and Documentation. Lab sections are **Preview** (top) plus tabs **Usage** (purpose, import line, generated
  example, variants and states, do/don't), **API**, **Accessibility**, **Tests**. Every component shows its
  `import { … } from '@toyo-ui/react'` line in the banner, Usage tab and Documentation page.
  Fixed both open issues: loading `Button`s keep their variant colors (busy ≠ unavailable; destructive Dialog
  confirm stays red); `Dialog` gained a documented `container` prop (portal target), which the lab uses via a
  preview-container context so an open dialog follows the preview's light/dark scheme — verified in Chrome.
  Search destinations de-duplicated; promo card now hides below 1100px viewport height (the longer nav).
  `pnpm check` ✓ (215 tests); 46 browser tests ✓.

## Known issues

- README and `docs/` are interim until slice E.
- Declarations use extensionless relative imports (fine for bundler resolution, which the apps use; strict
  `NodeNext` consumers would need `.js` extensions).
