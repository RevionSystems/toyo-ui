# Implementation status

Project overview, setup and commands: [README](README.md). Design details: [docs/](docs/architecture.md).
This file tracks only progress, results and open items.

**State (2026-10-14):** complete against the brief's Definition of Done. The first two GitHub Actions runs failed on
the same consumer test; the cause (a `Dialog` focus bug) is fixed locally and awaiting its first CI run.

## Completed work

| Slice | Outcome |
|---|---|
| A — Remove AI | Assistant page, route, nav item, "ask AI" search, env type and copy removed; regression tests guard it. No AI dependency was ever installed. |
| B — Workspace | pnpm workspace with `@toyo-ui/theme` and `@toyo-ui/react` (Vite library build + `tsc` declarations, peers external) and `apps/playground`. |
| C — Component Lab | Per-component status (6 stable, 2 beta), Preview + Usage / API / Accessibility / Tests, import lines, loading buttons keep their colors, `Dialog` `container` prop. |
| D — Consumer demo | `apps/consumer-demo` (Release Console) consumes `dist/` only — enforced by resolution, lint and `verify:consumer`. |
| E — CI and docs | GitHub Actions workflow, generated `docs/components.md`, README and `docs/`. |
| Follow-ups | CI failures traced to a real `Dialog` bug: initial focus (applied after the enter transition) stole focus from a field the user was typing in, so a valid form submitted truncated values. Fixed and covered by a test. Integration-test timeouts for full-route playground tests; actions bumped to current majors; side navigation simplified to text-only sections. |

Per-change detail is in the git history.

## Decisions that affect architecture

Each is explained where it lives; this list exists so they are visible in one place.

- **Vitest instead of Jest** — same API, reuses the Vite config. [testing-strategy.md](docs/testing-strategy.md#tools)
- **`@toyo-ui/source` export condition** — playground and tests use package source; the consumer uses `dist/`.
  [architecture.md](docs/architecture.md#the-source-condition)
- **Theme is a peer dependency of the components**; packages are router-agnostic (`linkComponent`).
  [architecture.md](docs/architecture.md#packages-and-dependency-direction)
- **Red split into `primary` (fills) and `primaryText` (text)** for contrast.
  [accessibility.md](docs/accessibility.md#built-into-the-theme)
- **MUI as the foundation with a focused API.** [ADR 0001](docs/adr/0001-mui-foundation-focused-api.md)

## Build and test results

Latest local run, after the follow-up fixes:

| Check | Result |
|---|---|
| `pnpm install --frozen-lockfile` (clean copy) | ✓ |
| `pnpm check` — typecheck, lint, format, unit tests, consumer resolution, package and app builds | ✓ 224 tests in 22 files |
| Stress: four full test suites at once, twice | ✓ 8 / 8 suites (consumer at default timeouts) |
| `pnpm test:e2e` | ✓ 49 / 49 |
| `docs/components.md` regenerated vs. committed | ✓ identical |
| GitHub Actions | ✗ runs `38616008949` and `38616973681` (Dialog focus bug, since fixed); fix not yet run on CI |

## Remaining work

1. Confirm the next GitHub Actions run passes.
2. Publishable declarations (`.js` extensions for `NodeNext`) and versioning with Changesets.
3. Manual accessibility passes (screen readers, 200% zoom, forced colors); Firefox and WebKit in Playwright.
4. Visual regression in CI; pagination and virtualization for `DataTable`.

## Known issues

- One Playwright web-server startup timeout was seen during back-to-back kill/restart runs and could not be
  reproduced.
- Product-level limitations (unpublished packages, Chromium-only browser tests, in-memory demo API) are listed in
  the [README](README.md#known-limitations).
