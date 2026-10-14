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
| **Apps consume built packages** | Both apps import `@toyo-ui/*` through `package.json` `exports` pointing at `dist/`, so the consumer demo proves the published shape works. |
| **Theme package owns MUI augmentation** | `@toyo-ui/react` depends on `@toyo-ui/theme` (one direction only) for tokens and palette types. |
| **Router-agnostic packages** | The theme accepts an optional link component; the playground injects React Router's. Packages never import a router. |

## Slices

| # | Slice | Status |
|---|---|---|
| A | Audit and remove all AI functionality | Done |
| B | pnpm workspace: `packages/theme`, `packages/react`, `apps/playground`; builds, exports, shared TS config | Pending |
| C | Component Lab refinements: status indicators, Preview / Usage / API structure, import examples | Pending |
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

## Known issues

- Dialog's loading confirm button uses MUI's grey disabled style instead of the danger tone.
- Preview dark mode does not reach portalled UI (an open Dialog renders in the page scheme).
- README and `docs/` are interim until slice E.
