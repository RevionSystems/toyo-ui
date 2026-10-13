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
| 2 | Component Lab workspace: preview (viewport sizes), properties, code/API/a11y/tests tabs | 75 min | Pending |
| 3 | Component library: Button, TextField, Alert, StatusBadge, Dialog, DataTable, EmptyState, LoadingState | 100 min | Pending |
| 4 | Foundations, documentation, tests: token explorer, theme, API/Test explorers, component tests | 75 min | Pending |
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

## Known issues

- Pages other than the shell are placeholders until their slices.
- Browser specs were repointed at new routes; they are rewritten in slice 6.
