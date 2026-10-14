# Testing strategy

Test each layer's contract at the cheapest level that can observe it. Pure data and logic in unit tests;
rendered behavior in jsdom component tests; real layout, CSS, contrast and package resolution in the browser
and in build-time checks.

## Layers

| Layer | Where | Count | Proves |
|---|---|---:|---|
| Tokens and theme | `packages/theme/src/*.test.ts(x)` | 73 | Contrast for every text and focus pair in both schemes; theme factory options; link injection; provider; exact public exports |
| Components | `packages/react/src/*.test.tsx` | 62 | Rendering and defaults, variants, controlled input, disabled and loading, validation messages, keyboard, dialog focus and dismissal, dismissible alerts, table sorting and empty state, `aria-*` attributes, axe; exact public exports |
| Playground | `apps/playground/src/**/*.test.ts(x)` | 80 | Property changes update preview **and** generated code; defaults omitted; real declarations in the API tab; every lab entry renders and passes axe; documented props exist on the real interfaces; catalog completeness; routes render one `h1` and pass axe; navigation, search, explorers; no AI routes or entries |
| Consumer demo | `apps/consumer-demo/src/App.test.tsx` | 7 | The library from `dist/` in a real product flow: loading, filter and empty state, rollback confirm, failure keeps the dialog open, outage and retry, form validation and create, axe |
| Browser | `e2e/*.spec.ts` | 49 | axe with real contrast on 17 lab pages × 2 schemes; theme toggle persistence; skip link; mobile drawer and overflow; consumer rollback, outage recovery, axe in both schemes, phone overflow |
| Build-time | `pnpm verify:consumer`, `pnpm docs:components` (CI diff) | — | Consumer resolves `packages/*/dist`; internals blocked; component reference matches the source |

Totals at the time of writing: **222 Vitest tests in 22 files** and **49 Playwright tests**.

## Tools

- **Vitest 5** with one root config (`vitest.config.ts`) running four projects. It uses Jest's API
  (`describe`/`it`/`expect`, `vi.fn`, `vi.mock`) and the same Vite config the packages build with.
  We use it instead of Jest because it was already in place and an ESM + TypeScript Jest setup would add a
  Babel/ts-jest toolchain without changing what is verified.
- **Testing Library + `@testing-library/user-event`** for interactions.
- **axe-core**, called directly through small `axeViolations` helpers (the engine `jest-axe` wraps).
- **Playwright** with `@axe-core/playwright`. Locally it uses the installed Chrome against dev servers; in CI,
  bundled Chromium against the production builds.

## Conventions

- Query by role and accessible name. If an element can't be found that way, that is usually an accessibility bug.
- Assert behavior, not implementation: no snapshots, no class-name checks except where the class *is* the
  contract (e.g. a variant mapping in the lab test).
- Async outcomes are awaited (`findBy…`, `waitFor`), never asserted synchronously after an action that starts a
  promise. A consumer test that did this was flaky under full parallel load.
- Every browser test fails on any console error or uncaught exception (`e2e/fixtures.ts`).
- Fake APIs take a latency option; tests pass `0`.

## Running

```bash
pnpm test                 # builds packages, runs all Vitest projects
pnpm exec vitest run --project react   # one project: theme | react | playground | consumer-demo
pnpm test:watch
pnpm test:e2e             # both apps; starts its own servers
pnpm test:report          # JSON report for the playground's Test Explorer
pnpm check                # what CI runs before browser tests
```

## Deliberately not tested

- **Pixel-level visual regression.** Screenshots were reviewed during development; no hosted service.
- **Firefox and WebKit.**
- **MUI internals.** Covered upstream; tests target Toyo-ui's API and composition.
- **Package publishing.** Packages are consumed through the workspace; `verify:consumer` checks the exported shape.
