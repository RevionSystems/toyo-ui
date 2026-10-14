# Toyo-ui — Implementation Status

**AI-Powered Component Engineering Lab.** React + TypeScript + MUI component library with an interactive
lab, design-token reference, documentation, automated tests and a server-side AI assistant for component work.
Time budget: ~8 hours, delivered in slices. Each slice leaves the app runnable.

## Repository assessment (Slice 0)

The repo previously held an automotive engineering *portal* (manuals, parts, suppliers), committed through
`e34532a`. The new brief excludes that domain, so it is **reworked in place**: git history keeps the portal;
reusable infrastructure is kept and extended.

| Keep and extend | Remove |
|---|---|
| Vite 8 + React 19 + MUI 9 + strict TS, router, providers | Portal pages: manuals, parts, suppliers, systems, manufacturing, home |
| Token → CSS-variables theme pipeline, light/dark | Synthetic engineering dataset + repository |
| App shell (skip link, focus management, responsive drawer) | Portal search index, portal assistant engine |
| Lab registry pattern (`LabEntry<P>`, `jsx()` snippet generator) | Exploded view, manual tabs, domain components (`DomainCard`, `RelatedList`) |
| Contrast utilities + token tests, axe helpers | |
| ESLint, Vitest + Testing Library, Playwright + axe, console-error fixture | |

### Deviations from the brief (deliberate)

- **Vitest instead of Jest.** The brief allows a compatible alternative and asks to reuse existing tooling. Vitest
  uses Jest's API; Testing Library, `user-event` and axe checks are unchanged.
- **Red for text vs. fills.** `#EB0A1E` passes AA on white (4.57:1) but not on `#F4F5F6` (4.19:1). It is used for
  fills and accents; red *text* uses a darker shade. Enforced by `tokens.test.ts`.
- **"Navigation" library category omitted** until it has a component; the brief asks to avoid empty pages.

## Stack

| Concern | Choice |
|---|---|
| App | React 19, TypeScript 5.9 strict, Vite 8, MUI 9 + Emotion, React Router 7 |
| AI server | Node + Express + TypeScript (tsx), Zod contracts shared with the client, Anthropic Claude API |
| Tests | Vitest + Testing Library + user-event + axe-core; Playwright + @axe-core/playwright; supertest for the API |
| Quality | ESLint 9 (typescript-eslint, hooks, jsx-a11y), Prettier, GitHub Actions CI |

## Smallest complete workflow

Open **Buttons** → change `variant`, `size`, `loading`, `startIcon` → preview and TypeScript example update from
the same state → copy code → read API table and accessibility notes → run axe on the preview → ask the AI
assistant to compose a confirmation dialog → receive a structured, validated suggestion with code and copy it.

## Slices

| # | Slice | Budget | Status |
|---|---|---:|---|
| 0 | Inspect and plan | 20 min | Done |
| 1 | Foundation: remove portal, restructure, new tokens/palette, shell + nav, Prettier | 45 min | Done |
| 2 | Component Lab workspace: preview (viewport sizes), properties, code/API/a11y/tests tabs | 75 min | Done |
| 3 | Component library: Button, TextField, Alert, StatusBadge, Dialog, DataTable, EmptyState, LoadingState | 100 min | Done |
| 4 | Foundations, documentation, tests: token explorer, theme, API/Test explorers, component tests | 75 min | Done |
| 5 | AI integration: Express + Zod + Claude, demo mode, compose/tests/review workflows | 75 min | Pending |
| 6 | Quality: browser tests, CI, docs + ADR, final verification | 90 min | Pending |

## Acceptance criteria

- `dev`, `build`, `typecheck`, `lint`, `test` scripts succeed.
- Selecting a component changes the preview; changing a prop updates preview **and** code from one state object.
- Each component documents purpose, props/types/defaults, usage, variants/states, accessibility notes and testing expectations.
- Theme scheme switch changes real MUI rendering.
- AI: prompt → structured suggestion (summary, code, components used, explanation, a11y notes, suggested tests) →
  copy. Loading, empty-prompt, timeout, network, provider, invalid-output and retry states handled. Demo mode is
  clearly labelled and never presented as live output.
- No provider API key in the frontend.

## Progress log

- **Slice 0** — Assessed repo, chose rework-in-place, wrote this plan.
- **Slice 1** — Removed the portal domain (pages, dataset, search, portal assistant, domain components,
  imagery with third-party badges). New structure: `components/{layout,ui,common}`, `features/*`,
  `shared/catalog.ts` (framework-free component metadata for app + server). New tokens from the brief's
  palette plus dimensions, focus ring and elevation; `primaryText` separates red text from red fills; global
  `:focus-visible` ring and `prefers-reduced-motion` handling in the theme. Shell matches the mockup: wordmark,
  "Component Engineering Lab" header, ⌘K command search (free text → AI assistant), theme toggle, catalog-driven
  side nav (category items active for any component in the category). Routes for every nav item; secondary
  pages code-split. Prettier added and applied. Checks: typecheck, lint, format, 63 unit tests (token contrast
  incl. non-text 3:1 for focus ring), 19 browser tests all pass.
- **Slice 2** — Component Lab workspace at `/components/:id`, built end to end with `Button` as the first
  component. Compact banner (breadcrumb, summary, quality badges, sibling switcher for multi-component
  categories). Preview with Light/Dark scheme scoped via `data-color-scheme` and Desktop/Tablet/Mobile widths
  (100% / 768 / 375px); playground plus a static gallery of variants, sizes, states, icons and long content;
  error boundary around the preview. Properties panel with labelled controls and reset. Tabs: **Code**
  (generated from the same state as the preview — complete example with imports), **API** (real
  `export type`/`interface` declarations extracted from the component source via `?raw`, props table, API
  decisions), **Accessibility** (requirements + on-demand axe run against the live preview), **Tests**
  (expectations; results wired in slice 4), **Guidelines**. `CodeBlock` with a safe tokenizer (text spans only)
  and a separate line-number gutter so copied code never includes numbers. Docs for Button live in
  `shared/catalog.ts`. `Button` defaults `loadingPosition` to `start` so the label stays visible.
  Tests: lab interactions (variant/icon/text/loading → preview + code), defaults omitted, reset, API tab
  shows real declarations, unknown component 404, axe on page; highlighter and extractor units (74 total).
- **Slice 3** — Seven more components on MUI primitives, each with an exported props interface:
  `TextField` (required `label`, `hideLabel`, `errorMessage`, blur-time `validate`, string `onChange`,
  `maxLength` counter), `Alert` (severity → `role` alert/status, `announce={false}` for static content, tonal
  tokens), `StatusBadge` (tone + required label, shared `StatusTone`), `LoadingState` (spinner/linear/skeleton,
  always labelled, clamped progress), `EmptyState` (`kind`: no-data/no-results/error), `Dialog` (typed close
  reasons, promise-aware `onConfirm` that blocks dismissal while pending, Cancel-first focus for destructive),
  `DataTable` (generic, `<caption>`, `aria-sort`, loading/density/empty, `onRowClick` instead of router coupling).
  Docs split into `shared/docs/*.ts`; `CATALOG` is now `Record<ComponentId, ComponentDoc>` and the lab
  `REGISTRY` is `Record<ComponentId, AnyLabEntry>`, so a missing doc or entry is a type error. Lab entries with
  controls, galleries and generated examples for all eight. Tests: one behavior file per component (59), a
  registry suite (renders + axe, complete example, every state key has a control, every documented prop
  exists on the real props interface), catalog completeness — 182 unit tests; browser axe (with contrast)
  on all 8 component pages × light/dark — 29 browser tests.
  Bugs found: `Alert announce={false}` still announced (MUI falls back to role="alert" when `role` is
  undefined); Vitest's on-disk module cache served stale `import.meta.glob` results (disabled
  `fsModuleCache`); DataTable caption rendered below the table.
- **Slice 4** — Theme refactored into `createToyoTheme(options)` (app theme = default call with CSS
  variables; `cssVariables: false` builds plain, subtree-scoped themes). Pages:
  **Overview** (stats, components by category with live test status, quick start);
  **Colors & Tokens** (token → theme → CSS variable → component flow, roles with palette path and CSS variable
  name, live contrast, palette); **Typography**; **Spacing** (scale, control dimensions with real Buttons,
  radius, elevation, focus ring, motion); **Theme** (sandbox: accent, radius, density, scheme re-theme real
  components in an isolated ThemeProvider, with contrast verdicts and the equivalent factory call — verified
  not to touch the app theme); **Accessibility** (practices, checks, per-component requirements, known gaps);
  **API Explorer** (all 64 documented props, searchable/filterable, built on DataTable); **Test Explorer**
  (real Vitest results via `npm run test:report` → `scripts/normalize-test-report.mjs` → repo-relative JSON;
  build runs it first); **Documentation** (catalog-generated component reference + repo docs index).
  Lab **Tests** tab now shows each component's real results. 202 unit tests, 46 browser tests (axe with
  contrast on 19 pages × 2 schemes, mobile overflow on 9 pages). Built bundle checked: no absolute paths.
  Fixed: links in text only underlined on hover (now always underlined, theme-wide); Overview overflowed
  149px on mobile (grid column min-width); sidebar promo hidden below 940px viewport height;
  `testsForComponent(id, undefined)` silently used the default report (argument now required).

## Known issues

- Overview, Foundations and Engineering pages are placeholders until their slices.
- A loading confirm button in Dialog uses MUI's grey disabled style rather than the danger tone.
- Preview dark mode does not reach portalled UI (an open Dialog renders in the page scheme).
- Browser specs were repointed at new routes; they are rewritten in slice 6.
