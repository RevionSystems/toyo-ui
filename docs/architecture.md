# Architecture

Toyo-ui is a client-only single-page app. There is no server: the dataset is bundled and every
"query" is a function call into the repository layer. The structure is designed so a real API could
replace that layer without changing pages or components.

## Layers

```
pages/            route components — compose features and components, read URL params
  │
features/         domain behavior: search, assistant, lab, manual tabs, exploded view
  │
components/       shared, domain-light UI library (public API: components/index.ts)
  │
theme/            tokens.ts → theme.ts (MUI CSS-variables theme, light + dark)
data/             types.ts · dataset.ts · repository.ts
```

Dependencies point downward only. `components/` may import domain *types* (e.g. `StatusChip` takes a
`DocumentStatus`) but never data or features. Pages and features read data only through
`data/repository.ts`.

## Data

- **Model** (`data/types.ts`): `VehicleSystem`, `Manual`, `Part`, `Supplier`, `Procedure`. Entities
  reference each other by ID (`manual.partIds`, `part.supplierIds` with the primary source first,
  `procedure.manualIds`), the way a PLM export would.
- **Repository** (`data/repository.ts`): ID maps built once, plus relationship resolvers in both directions —
  `partsForManual`, `manualsForPart`, `suppliersForPart`, `partsForSupplier`, `suppliersForManual`, etc.
  Unknown IDs resolve to nothing rather than throwing.
- **Integrity** (`repository.test.ts`): unique IDs, no dangling references, and symmetric manual ↔ procedure
  links. A bad edit to the dataset fails the test suite, not the UI.

## Routing and URL state

`app/routes.tsx` defines one layout route (`AppShell`) with a child per page. The Component Lab, Design
Tokens and Accessibility pages are lazy-loaded, since most portal users never open them.

List filters (`?q=`, `?system=`, `?status=`, `?region=`) live in the URL via `useQueryParam`, which writes with
`replace` so typing doesn't flood history. Views are shareable and survive reloads.

MUI's `Link`, `Button` and `ListItemButton` are wired to React Router through `LinkBehavior`, set as a
theme default. Any `href` routes client-side; external URLs fall through to a plain anchor.

## Theme and tokens

`theme/tokens.ts` is plain data: raw palette scales, **semantic roles per scheme** (`textSecondary`,
`surfaceMuted`, `successBg`…), type scale, spacing, radius, elevation, motion and layout constants.

`theme/theme.ts` maps semantic roles into a MUI theme with `cssVariables` and two `colorSchemes`. The
scheme selector is the attribute `data-color-scheme`, which has two consequences:

- Switching schemes swaps CSS variables; components don't re-render to re-theme.
- **Any element** with `data-color-scheme="dark"` gets dark tokens. The Component Lab uses this to preview
  components in dark mode inside a light page.

Two custom palette keys are added through module augmentation: `surfaceMuted` and `tonal`
(`success | warning | info` backgrounds for status chips). Token contrast is enforced in
`tokens.test.ts` (see [accessibility.md](accessibility.md)).

## Search

`features/search/search.ts` builds a weighted document list at module load: ID and title weight 5,
tags/capabilities 4, system/assembly 3, descriptions 1. Queries are tokenized (stop words removed, light
plural stemming). A word-boundary match scores double, documents matching every term get a 1.5× boost,
and an exact ID lookup gets +100. It powers global search and the assistant's retrieval. List pages use a
simpler "every term appears" filter (`matches.ts`), because filtering a visible table should be predictable,
not ranked.

## AI assistant

```
AssistantPanel ──ask()──▶ AssistantProvider
                            ├─ localProvider  → engine.answer()   (default)
                            └─ httpProvider   → POST proxy → groundRemoteAnswer() → fallback to local on error
```

- `engine.ts` is a pure function `answer(query) → AssistantAnswer`: system detection → intent detection →
  manual retrieval (approved first) → part expansion → supplier expansion → torque facts → summary and
  follow-ups. It is deterministic and unit-tested.
- `provider.ts` defines the seam to a model-backed backend. Remote answers carry IDs only;
  `groundRemoteAnswer` resolves them against the repository and discards anything unknown.
- The panel aborts superseded requests with `AbortController`, shows errors, and keeps a minimum loading
  time so instant local answers don't flash.

## Component Lab

`features/lab/registry.tsx` holds one typed `LabEntry<P>` per component: `defaults`, `controls` (keys
constrained to `keyof P`), `render`, `code`, prop docs and guidelines. `defineEntry` erases `P` so entries
share one array. `jsx.ts` turns current values into a snippet, omitting defaults and falsy props. Stateful
demos (search, filters, dialog) live in `demos.tsx`, so the registry stays data.

## Accessibility hooks in the shell

`AppShell` provides a skip link, moves focus to `<main>` on route change (compared against the previous
path, so React StrictMode's double effects don't steal focus on load), and switches between a permanent
drawer (≥ 1200px) and a modal drawer.

## Build

Vite 8 (Rolldown) with vendor chunk groups for React and MUI/Emotion: app code is ~28 kB gzip, and
framework chunks stay cached across deploys. TypeScript runs in strict mode with `noUncheckedIndexedAccess`.

## Decisions

- [ADR 0001 — MUI as foundation, curated component API](adr/0001-mui-foundation-curated-api.md)
