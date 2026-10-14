# Architecture

Toyo-ui is a pnpm workspace with two publishable-shaped packages and two applications. The packages are
never published; the consumer app demonstrates that they would work if they were.

## Packages and dependency direction

```
apps/playground ──┐
                  ├──▶ @toyo-ui/react ──▶ @toyo-ui/theme ──▶ @mui/material, @emotion/*
apps/consumer-demo┘          │                    ▲
                             └──── @mui/* ────────┘   (peer dependencies, never bundled)
```

| Package | Owns | Depends on |
|---|---|---|
| `@toyo-ui/theme` | Tokens (palette, semantic roles per scheme, typography, spacing, radius, borders, elevation, dimensions, focus, motion, breakpoints), contrast utilities, `createToyoTheme()`, the default `theme`, `ToyoThemeProvider`, MUI module augmentation | peers: React, MUI, Emotion |
| `@toyo-ui/react` | The components, their prop types and the shared `StatusTone` | peers: React, MUI (material, icons, utils), Emotion, **`@toyo-ui/theme`** |
| `apps/playground` | Component Lab, Foundations pages, API / Test Explorers, catalog of component docs | both packages, React Router |
| `apps/consumer-demo` | A product UI built only from public exports | both packages |

Rules:

- **One direction only.** `theme` never imports `react`; packages never import from apps.
- **The theme is a peer of the components.** Components rely on palette roles the theme defines
  (`primaryText`, `tonal.*`, `surfaceMuted`), so apps must install and provide it. Declaring it as a peer
  makes that explicit and avoids two copies.
- **Packages are router-agnostic.** `createToyoTheme({ linkComponent })` lets an app inject its router link
  into every MUI `Link` and `href` button. The playground passes a React Router adapter; the consumer passes
  nothing and gets plain anchors.
- **Docs metadata lives in the playground** (`apps/playground/src/catalog`). It describes the library but is not
  part of it, so it doesn't ship to consumers.

## Public exports

Each package has one entry point:

```json
"exports": {
  ".": {
    "@toyo-ui/source": "./src/index.ts",
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  },
  "./package.json": "./package.json"
}
```

- Anything not exported from `src/index.ts` is private. Deep imports (`@toyo-ui/react/Button`,
  `@toyo-ui/react/src/Button`) fail to resolve. This caught one deep import in the playground during the
  restructure.
- `index.test.ts` in each package asserts the exact list of runtime exports, so additions and removals are
  deliberate.

## The source condition

`@toyo-ui/source` is a custom export condition mapping to TypeScript source.

| Consumer | Condition enabled? | Resolves to | Why |
|---|---|---|---|
| Playground (Vite + `tsc`) | yes (`vite.shared.ts`, `customConditions`) | `src/index.ts` | Instant HMR while developing components; no build step |
| Vitest (all projects) | yes | `src/index.ts` | Tests run against source |
| Consumer demo (Vite + `tsc`) | **no** | `dist/index.js`, `dist/index.d.ts` | Proves the built output works |
| Any external app | no (unknown condition) | `dist/` | Normal package consumption |

## Build strategy

Each package builds with **Vite library mode** plus **`tsc --emitDeclarationOnly`** (`pnpm build:packages`):

- ESM only, `preserveModules` — one output file per source module, so bundlers tree-shake per component.
- React, React DOM, `@mui/*`, `@emotion/*` and `@toyo-ui/*` are external (regexes in each `vite.config.ts`).
- Declarations come from `tsc -p tsconfig.build.json`; test files and test helpers are excluded.
- `sideEffects: false` and `files: ["dist"]` in each `package.json`.

Measured in the consumer's production build: the Toyo-ui code is **14.6 kB (5.5 kB gzip)**; React and MUI make
up the rest.

Apps build with Vite as usual. Both split React and MUI into long-lived vendor chunks. The playground lazy-loads
its Foundations and Engineering pages and loads axe-core only when someone runs an accessibility check.

## How the consumer verifies independence

1. **Resolution** — no source condition in `apps/consumer-demo/vite.config.ts` or its `tsconfig.json`, so both
   the bundler and the type checker read `dist/`. The theme's MUI type augmentation reaches it through
   `dist/theme.d.ts` (e.g. `Typography variant="code"` type-checks).
2. **Lint** — `no-restricted-imports` in `eslint.config.js` rejects `@toyo-ui/*/*`, `**/packages/**` and
   `**/playground/**` imports inside the consumer.
3. **Runtime check** — `pnpm verify:consumer` resolves the packages from the consumer's folder with
   `import.meta.resolve`, fails unless they land in `packages/*/dist/index.js`, and confirms internal paths are
   blocked.
4. **Bundle** — the consumer's production bundle contains no playground code.

## Theme

`tokens.ts` is plain data. `createToyoTheme(options)` maps it into MUI:

- **Default (`cssVariables: true`)** — light and dark color schemes as CSS variables (`--toyo-*`), switched by the
  `data-color-scheme` attribute. Any element with that attribute gets that scheme's variables, which is how the
  lab previews a component in dark mode inside a light page.
- **`cssVariables: false`** — a plain theme for one mode, scoped to its `ThemeProvider` subtree. The playground's
  Theme sandbox uses this so experiments never touch the app theme.
- Options: `primary`, `primaryText`, `radius`, `spacingUnit`, `mode`, `linkComponent`, `toolbarHeight`.

Red is split into two roles: `primary` (#EB0A1E) for fills, and `primaryText` for red text and links, because
#EB0A1E reaches only 4.19:1 on the secondary background. `tokens.test.ts` enforces this.

## Playground internals

- **Catalog** (`src/catalog`) — framework-free metadata per component: status, purpose, props, API decisions,
  states, accessibility notes, testing expectations, guidelines. Typed as `Record<ComponentId, ComponentDoc>`.
- **Registry** (`src/features/component-lab/registry.ts`) — per component: default playground state, typed
  controls, `render(state)`, `code(state)` and a gallery. Preview and generated code read the same state object.
- **API tab** — reads `packages/react/src/*.tsx` with Vite `?raw` and extracts the exported types, so it shows the
  real declarations. This is for display only; the app itself consumes the package through its exports.
- **Test Explorer** — `pnpm test:report` writes Vitest's JSON report, normalizes it to repo-relative paths, and the
  playground bundles it. `pnpm build` regenerates it, so a failing test fails the build.
- **Component reference** — `pnpm docs:components` loads the catalog and registry through Vite and writes
  `docs/components.md`. CI fails if the committed file is stale.

## Decisions

- [ADR 0001 — MUI as the foundation, with a focused component API](adr/0001-mui-foundation-focused-api.md)
