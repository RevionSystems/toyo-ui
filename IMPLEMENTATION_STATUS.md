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
| D | `apps/consumer-demo`: independent app using only public exports | Done |
| E | CI workflow, docs (README, architecture, guidelines, accessibility, testing, demo script, ADR), final verification | Done |

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

- **Slice D — Consumer demo.** `apps/consumer-demo`: a *Release Console* for a platform team — release table with
  StatusBadges and sorting, search + environment filter, empty state with "Clear filters", destructive rollback
  Dialog with async confirm, new-release form (TextFields with validation inside a Dialog), success / error
  Alerts, outage simulation with Retry, light/dark toggle, responsive layout. Fake async API (`releases.ts`).
  **Independence is enforced three ways:** (1) Vite and TypeScript resolve `@toyo-ui/*` *without* the source
  condition, i.e. from `dist/` and its `.d.ts` (the theme's MUI augmentation, e.g. `Typography variant="code"`,
  type-checks from the built declarations); (2) ESLint `no-restricted-imports` rejects `@toyo-ui/*/*`,
  `packages/` and `playground/` paths (verified with a probe file — the first version missed relative
  `../../playground` paths and was fixed); (3) `pnpm verify:consumer` resolves the packages from the app folder
  and fails unless they land in `packages/*/dist` and internals are blocked. The production bundle contains no
  playground code. Bundle split: the Toyo-ui code in the app is **14.6 kB (5.5 kB gzip)**; React and MUI are the
  rest. Root `test`/`typecheck` now build packages first; `check` adds `verify:consumer` and builds both apps.
  Tests: 7 consumer behavior tests (load, filter/empty/clear, rollback, rollback failure keeps dialog open,
  outage → retry, form validation + create, axe) and 3 Playwright tests (rollback + axe light/dark, outage
  recovery, phone overflow).
  Fixed along the way: consumer initial fetch rewritten as an effect with cancellation (lint caught setState in
  an effect); a consumer form test was flaky under full parallel load — post-click assertions now await the
  async confirm instead of asserting synchronously (5/5 full runs green); jsdom canvas warnings from axe
  silenced in all test setups; Playwright stalled on a cold Vite cache because lazy routes triggered dependency
  re-optimization — fixed with `optimizeDeps.entries` (two cold runs green). One Playwright web-server startup
  timeout was seen once during back-to-back kill/restart runs and could not be reproduced.
  `pnpm check` ✓ (222 tests in 22 files, both packages, consumer resolution check, both apps); 49 browser tests ✓.

- **Slice E — CI, documentation, verification.** `.github/workflows/ci.yml`: frozen install → `pnpm check` →
  regenerate the component reference and fail on drift → Playwright (bundled Chromium, production builds) →
  upload the report on failure. Playwright uses the installed Chrome locally and bundled Chromium in CI; CI serves
  the builds `pnpm check` made. New `pnpm docs:components` generates `docs/components.md` from the catalog and lab
  registry (prose HTML-escaped outside code spans). Docs written against the implementation: README,
  `docs/architecture.md`, `component-guidelines.md`, `accessibility.md`, `testing-strategy.md`, `demo-script.md`,
  `adr/0001-mui-foundation-focused-api.md`. Fixed a stale Button `href` doc ("routes client-side" — true only when
  the app passes a `linkComponent`).

- **Post-release fixes.** First GitHub Actions run (`38616008949`) failed in *Quality checks*: the consumer form
  test timed out on the 2-core runner. The failure dump showed the release *had* been created — the test was
  slow, not wrong. Root cause: user-event's default per-keystroke timer hop (~40 keystrokes under CPU contention).
  Consumer tests now use `userEvent.setup({ delay: null })` and the flow is split into a validation test and a
  creation test (6.9 s on CI → ~0.2 s locally). Workflow actions bumped to current majors (checkout v7,
  setup-node v7, upload-artifact v7, pnpm/action-setup v6) after GitHub's Node 20 deprecation warning.
- **Sidebar cleanup.** Text-only navigation in labelled sections (Overview, Components, Foundations, Engineering)
  with a single alignment line; removed the repeated category icons, the single-item "Library" heading, boxed
  Beta chips (now muted text) and the decorative car card (and its image and the `Wordmark inverse` prop it
  needed). Active item: `aria-current`, neutral background, red text, 2px edge bar. The full menu fits without
  scrolling at 900px height.

## Final verification (2026-10-14)

Run in a fresh copy of the working tree (no `node_modules`, `dist` or generated files), replaying the CI workflow:

| Step | Result |
|---|---|
| `pnpm install --frozen-lockfile` | ✓ |
| `pnpm check` — build packages, typecheck 4 projects, lint, format, Vitest (now 223 tests in 22 files), consumer resolution check, test report, both app builds | ✓ exit 0 |
| `pnpm docs:components` output vs. committed `docs/components.md` | ✓ byte-identical |
| `CI=1 pnpm test:e2e` — bundled Chromium, production builds | ✓ 49 / 49 |
| AI audit of code, config, docs and lockfile | ✓ only "no AI" statements and the regression tests |

The first GitHub Actions run failed on a slow consumer test (fixed above); the fix has not yet run on GitHub.

## Definition of done

| Requirement | Status |
|---|---|
| All AI functionality and infrastructure removed | ✓ (slice A; regression tests) |
| Component Lab works without AI services or credentials | ✓ |
| `@toyo-ui/react` builds (ESM + `.d.ts`, externals, peers) | ✓ |
| `@toyo-ui/theme` exposes tokens and theme configuration | ✓ |
| Core components typed, accessible, documented and tested | ✓ 6 stable + 2 beta |
| Consumer demo uses only public exports | ✓ resolution, lint and runtime checks |
| Workspace scripts and dependencies configured | ✓ clean frozen install + `pnpm check` |
| Documentation matches the implementation | ✓ reference generated; hand-written docs checked against code |
| Build and test results reported accurately | ✓ table above |

## Recommended next improvements

1. **Publishable declarations and versioning** — emit `.js` extensions in `.d.ts` (or bundle declarations) for
   `NodeNext` consumers; add Changesets and publish to a private registry.
2. **Manual accessibility passes** — VoiceOver/NVDA on the lab and consumer, 200% zoom, forced-colors mode;
   add Firefox and WebKit to Playwright.
3. **Visual regression and DataTable scale** — screenshot diffs in CI for the lab gallery; pagination and
   virtualization for DataTable.

## Known issues

- Type declarations use extensionless relative imports (fine for bundler resolution, which the apps use; strict
  `NodeNext` consumers would need `.js` extensions).
- One Playwright web-server startup timeout was observed during back-to-back kill/restart runs in slice D and
  could not be reproduced afterwards.
- Accessibility has been verified with automated tools only (see `docs/accessibility.md` → Not yet verified).
