# Toyo-ui

An automotive engineering knowledge platform and the React component library it is built from.

Engineers search manuals, follow a manual to the parts it references and from a part to the suppliers that
source it, and ask a grounded assistant questions such as *"What is the torque for the front caliper bolt?"*.
The same shared components are documented in a live **Component Lab**, and the visual language is driven
by **design tokens** that are contrast-tested in both color schemes.

> **Portfolio project.** All engineering data, part numbers, suppliers and figures are synthetic.
> The product is branded "Toyo-ui" and is not affiliated with any vehicle manufacturer.

## Features

| Area | What it does |
|---|---|
| **Portal** | Home with vehicle-architecture navigation, domain cards, featured manual and an interactive exploded view with keyboard-accessible callouts. |
| **Manuals** | Filter by keyword, system and status (state lives in the URL). Detail pages with overview, procedure, torque specifications, related parts and manufacturing processes. |
| **Parts & suppliers** | Relationship navigation in both directions: manual → parts → suppliers → parts → manuals. Primary and alternate sources, lead times, delivery performance. |
| **Systems & manufacturing** | Eight vehicle systems with their manuals, parts and processes; process list by plant and station. |
| **Global search** | Ranked search across manuals, parts and suppliers. Press <kbd>/</kbd> anywhere. Enter on free text asks the assistant. |
| **AI assistant** | Detects system and intent, retrieves manuals, expands to parts and suppliers, cites torque values. Offline and deterministic by default (see [AI configuration](#ai-configuration)). |
| **Component Lab** | 13 shared components with editable props, light/dark preview, generated usage code, API table and do/don't guidelines. |
| **Design tokens** | Palette, semantic roles, live WCAG contrast ratios, type scale, spacing, radius and elevation — rendered from `src/theme/tokens.ts`. |
| **Theming** | Light/dark/system color scheme via MUI CSS variables, persisted per browser. |

## Technology

React 19 · TypeScript 5.9 (strict) · Material UI 9 + Emotion · React Router 7 · Vite 8 ·
Vitest 5 + Testing Library + axe-core · Playwright + @axe-core/playwright · ESLint 9 (typescript-eslint, react-hooks, jsx-a11y)

## Getting started

Requires Node ≥ 20.19 and npm.

```bash
npm install
npm run dev          # http://localhost:5173
```

Browser tests use the locally installed Google Chrome (`channel: 'chrome'` in `playwright.config.ts`).
Without Chrome, run `npx playwright install chromium` and remove the `channel` lines.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server with HMR |
| `npm run build` | Type-check, then production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (TypeScript, hooks, jsx-a11y) |
| `npm test` | Unit, component and route integration tests (Vitest, jsdom) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright browser tests. Starts its own server on port 5288; with `CI=1` it tests the production build |
| `npm run check` | typecheck → lint → unit tests → build |

## Project structure

```
src/
  app/          Providers and the route table (platform pages are lazy-loaded)
  components/   The shared component library — public API in components/index.ts
  data/         Domain types, synthetic dataset, repository (the only data access layer)
  features/
    assistant/  Retrieval engine, provider interface (offline / HTTP proxy), panel UI
    lab/        Component Lab registry, demos, JSX snippet generator
    search/     Weighted search index, URL-state hook, list filtering
    home/       Exploded view
    manuals/    Manual tabs shared by home and detail pages
  layout/       App shell, side navigation, global search, color mode toggle
  pages/        One component per route
  theme/        Design tokens, MUI theme, WCAG contrast utilities
  test/         Test setup, render helpers, axe helper
e2e/            Playwright specs and the console-error fixture
docs/           Architecture, guidelines, accessibility, testing, demo script, ADRs
```

See [docs/architecture.md](docs/architecture.md) for how these fit together.

## Sample data

`src/data/dataset.ts` contains 8 systems, 14 manuals, 29 parts, 12 suppliers and 12 manufacturing processes.
Every relationship is by ID and is validated by `repository.test.ts` (no dangling references, symmetric
manual ↔ process links). Supplier names, part numbers, torque values and performance figures are invented.
Photography comes from the project's reference imagery and is used for illustration only.

## AI configuration

The assistant **does not call a live LLM by default.** It runs a deterministic retrieval pipeline in the browser:

1. **Understand** — detect the vehicle system (`caliper` → Braking) and intent (overview, manuals, parts, suppliers, torque).
2. **Retrieve** — rank manuals by weighted keyword match, preferring approved documents in that system.
3. **Expand** — follow relationships to parts and their suppliers; explicit IDs (`PT-3310-12A`) anchor the answer.
4. **Cite** — every record links to its page; torque facts name their source manual.

To use a model, point the app at a backend proxy:

```bash
cp .env.example .env.local
# VITE_ASSISTANT_ENDPOINT=https://your-backend/api/assistant
```

The proxy receives `POST { "query": string }` and returns record **IDs**, never records:

```ts
{ summary: string; intent?: string; systemId?: string;
  manualIds?: string[]; partIds?: string[]; supplierIds?: string[];
  facts?: { label: string; value: string; sourceId: string }[]; followUps?: string[] }
```

The client resolves IDs against the dataset and **drops anything that doesn't exist**, including facts citing
unknown manuals, so a model cannot invent part numbers. Network errors, non-2xx responses and malformed
payloads fall back to the offline engine. The browser never holds a model API key. **No proxy ships in this
repository** — `src/features/assistant/provider.ts` defines the contract and is covered by tests.

## Testing

| Layer | Count | Tool |
|---|---:|---|
| Unit, component, route integration (incl. axe in jsdom) | 107 | Vitest |
| Browser: workflows, theming, Lab, axe on 12 pages × 2 schemes, keyboard, mobile | 39 | Playwright |

Details in [docs/testing-strategy.md](docs/testing-strategy.md) and [docs/accessibility.md](docs/accessibility.md).

## Known limitations

- **No backend.** Data is bundled; nothing persists except the color-scheme preference.
- **No live LLM.** The assistant uses keyword retrieval, not semantic search; paraphrases without domain terms can miss.
- **Exploded view** is a photo with positioned callouts, not a 3D model. "PDF" and the user profile are placeholders.
- **No authentication, editing or approval workflows.** Statuses are read-only.
- **The Lab's dark preview does not reach portalled UI** (the open `ConfirmDialog` uses the page scheme).
- **Browser tests run on Chromium only.**
- **The search index is built at module load.** Fine for this dataset; a real catalogue needs a server-side index.

## Demo walkthrough

1. **Home** — point out the token-driven theme, then toggle **Dark** in the sidebar.
2. Press <kbd>/</kbd>, type `front brake`, choose **Front Brake Assembly (Disc)**.
3. **Specifications** tab → caliper bolt 110 N·m. **Related Parts** → **PT-3310-12A**.
4. On the part, open **Kaneda Brake Systems** → back to the parts it supplies.
5. **Engineering Manuals** → filter **Braking System**, type `abs`; reload to show the URL keeps the state.
6. **AI Engineering Assistant** → *What is the torque for the front caliper bolt?* → follow the source chip.
7. **Component Lab → DataTable** → toggle `sortable`, switch preview to Dark, copy the code.
8. **Design Tokens** → contrast section; mention the unit test that enforces it.

A timed script with talking points is in [docs/demo-script.md](docs/demo-script.md).
