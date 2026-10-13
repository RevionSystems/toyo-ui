# Toyo-ui — Implementation Status

Automotive engineering knowledge platform + reusable React/MUI component library.
Portfolio project. Time budget: 8 hours, delivered in verifiable slices.

## Repository assessment (Slice 0)

- `toyo-ui/` was an empty git repo (no commits, `.gitignore` only).
- Sibling projects in this workspace use **npm + Vite + React + TypeScript + Vitest**; Toyo-ui follows the same conventions.
- Node 22, npm 10.

## Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Build | Vite 8 | Matches sibling projects, fast HMR |
| UI | React 19 + MUI 9 + Emotion | Required by brief; theme-driven component library |
| Language | TypeScript 5.9 (strict) | TS 7 native compiler is too new for tooling confidence |
| Routing | React Router 7 (`createBrowserRouter`) | Standard, supports nested layout routes |
| Tests | Vitest + Testing Library + jsdom + vitest-axe | Unit, interaction and automated a11y checks |
| Data | Typed in-memory relational dataset | No backend needed; relationships via IDs |
| AI assistant | Deterministic local retrieval over the dataset | Runs offline, testable, no API keys; clearly labeled as demo |

### Branding

The product is branded **Toyo-ui** with an original wordmark. No real manufacturer logo,
name or trademark is used in the UI chrome. Imagery comes from the supplied reference collage.

## Smallest useful end-to-end workflow

Search "brake" → open manual **BR-0012 Front Brake Assembly** → see related parts →
open part **PT-3310-12A** → see its supplier → ask the AI assistant the same question and get
the same manuals/parts/suppliers back with links.

## Slices

| # | Slice | Budget | Status |
|---|---|---:|---|
| 0 | Inspect and plan | 20 min | Done |
| 1 | Foundation: Vite app, MUI theme + tokens, routing, app shell | 45 min | Done |
| 2 | Automotive portal: home hero, domain cards, featured manual | 70 min | Done |
| 3 | Engineering workflows: manuals, parts, suppliers, detail pages, search | 90 min | Done |
| 4 | Component Lab: typed shared components, playground, code examples, tokens page | 90 min | Done |
| 5 | AI Assistant: query → ranked manuals/parts/suppliers | 50 min | Done |
| 6 | Tests and documentation | 45 min | Pending |
| 7 | Stabilization: bug fixing, responsive pass, polish | 70 min | Pending |

## Acceptance criteria

- `npm run dev`, `npm run build`, `npm run typecheck`, `npm test` all succeed.
- Light/dark mode toggle driven by the central theme.
- Global search finds manuals, parts and suppliers.
- Manual ↔ part ↔ supplier relationships navigable in both directions.
- Component Lab: every shared component has a live preview with editable props and a code snippet.
- AI assistant answers the brake-system workflow with linked results and a provenance disclaimer.
- Automated axe checks pass for shared components and key pages.

## Out of scope

Authentication, real backend/PLM integration, editing/workflow approval, real 3D viewer, i18n beyond an EN label.

## Progress log

- **Slice 0** — Repository inspected, plan written.
- **Slice 1** — Vite + React 19 + MUI 9 + TS strict scaffold. Design tokens (`src/theme/tokens.ts`) feed a
  CSS-variables MUI theme with light/dark schemes. Router with layout route, code-split platform pages.
  App shell: responsive drawer, skip link, focus management on route change, global search (`/` shortcut).
  Relational dataset + repository layer. Typecheck passes.
- **Slice 2** — Home portal: hero with vehicle-architecture nav, six domain cards, featured manual
  (BR-0012) with tabs, exploded view with keyboard-accessible hotspots + parts list, compact AI
  assistant. Assistant engine built early (home embeds it) with 9 unit tests.
- **Slice 3** — Manuals, parts, suppliers, systems and manufacturing list pages with search and
  filters synced to the URL (`?q=`, `?system=`, `?status=`, `?region=`); sortable typed `DataTable`.
  Detail pages for manuals, parts, suppliers and systems link every relationship both ways
  (manual → parts → suppliers → parts → manuals). Dataset integrity + relationship tests (13 total, passing).
- **Slice 4** — Component Lab (`/lab/:id`): typed registry of 13 components, each with editable
  controls, per-preview light/dark scheme (scoped via the theme's `data-color-scheme` attribute
  selector), generated usage code with copy, API table and do/don't guidelines. New `ConfirmDialog`.
  Design Tokens page renders palette, semantic roles, live WCAG contrast, type scale, spacing,
  radius and elevation from `tokens.ts`. Tests: token contrast (AA in both schemes), snippet
  generator, and every Lab entry rendered + axe-checked (61 tests passing). axe caught `<a>`
  elements directly inside `<ul>` in RelatedList, SideNav and the Lab nav; fixed with `ListItem`.
- **Slice 5** — Full assistant page (`/assistant?q=` deep links auto-run; global search Enter routes
  here). `AssistantProvider` interface: default offline deterministic engine; optional
  `httpProvider` enabled by `VITE_ASSISTANT_ENDPOINT` posts to a backend proxy, grounds the reply
  (drops unknown manual/part/supplier IDs and uncited facts) and falls back to the offline engine on
  network, HTTP or contract errors. Panel supports cancellation, error state and follow-ups.
  Tests: grounding, fallback (3 failure modes), config selection, panel interaction + axe (72 passing).
  **No live LLM is used by default**; no backend proxy is included in this repo.

## Known issues

- Dark mode not yet visually verified (headless Chrome ignores the forced color-scheme flag). Check in slice 7.
- Main JS chunk is 237 kB gzip (MUI + React); Vite warns at 500 kB minified. Split a vendor chunk in slice 7.
- ConfirmDialog renders in a portal, so the Lab's preview dark toggle does not apply to the open dialog.
- Home domain cards switch to 6 columns only at ≥1800px; 3 columns below that, since 6 columns were cramped.
