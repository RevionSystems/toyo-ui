# Testing strategy

Test the contract each layer promises, at the cheapest level that can observe it. Pure logic goes in
unit tests, rendered behavior in jsdom component tests, and anything that needs real layout, CSS or a real
browser goes in Playwright.

## Layers

| Layer | Tool | Files | What it proves |
|---|---|---|---|
| Data integrity | Vitest | `data/repository.test.ts` | IDs unique; every reference resolves; manual ↔ process links symmetric; relationship queries correct in both directions |
| Domain logic | Vitest | `features/assistant/engine.test.ts`, `features/lab/jsx.test.ts` | Assistant system/intent detection, retrieval, ID anchoring, cited torque, graceful no-match; snippet generation |
| Provider contract | Vitest | `features/assistant/provider.test.ts` | Remote answers are grounded (unknown IDs dropped), malformed payloads rejected, three failure modes fall back offline, env selects provider |
| Design tokens | Vitest | `theme/tokens.test.ts` | WCAG AA for every text/background pair in both schemes; contrast math against reference values |
| Components | Vitest + Testing Library | `components/components.test.tsx`, `features/lab/registry.test.tsx` | Sorting + `aria-sort`, pressed state, keyboard (Esc/Enter), dialog labelling and focus; **every Lab entry renders, passes axe and produces a valid snippet** |
| Feature integration | Vitest + Testing Library | `features/assistant/AssistantPanel.test.tsx` | Ask → linked answer, suggested prompts, deep-link auto-run, error state, axe |
| Routes | Vitest + Testing Library | `app/routes.test.tsx` | Every route (incl. 404s) renders one h1 and passes axe; active nav state; URL filters; manual → part → supplier navigation |
| Browser | Playwright (Chrome) | `e2e/*.spec.ts` | Core workflow, URL persistence across reload, theme persistence, Lab dark preview via computed colors, axe with real contrast on 12 pages × 2 schemes, skip link, mobile drawer, no horizontal overflow |

**Totals at time of writing:** 107 Vitest tests in 9 files, 39 Playwright tests.

## Conventions

- **Query by role and accessible name** (`getByRole('link', { name: /Kaneda/ })`). If a test can't find
  something that way, that usually means an accessibility bug, not a test problem.
- Render through `renderWithProviders` / `renderRoutes` (`src/test/render.tsx`): real theme, real router.
- No snapshot tests. Assertions name the behavior they protect.
- The assistant panel takes `latencyMs={0}` and an injectable `provider`, so tests need no fake timers or
  network mocks beyond `fetch` stubs in provider tests.
- `e2e/fixtures.ts` fails any browser test that logs a console error or throws.

## Running

```bash
npm test               # all Vitest suites (~3 s)
npm run test:watch
npm run test:e2e       # Playwright; starts its own dev server on :5288
CI=1 npm run test:e2e  # same, against the production build (vite preview)
npm run check          # typecheck → lint → unit → build
```

## What is deliberately not tested

- **Pixel-level visual regression.** No hosted service (out of scope); screenshots were reviewed manually during
  development.
- **Firefox/WebKit.** Chromium only.
- **MUI internals.** Covered upstream; tests target our composition and contracts.
- **A real LLM.** The HTTP provider is tested against stubbed responses; no proxy exists in this repo.

## Suggested CI pipeline

1. `npm ci`
2. `npm run check`
3. `npx playwright install --with-deps chromium` (and drop `channel: 'chrome'`), then `CI=1 npm run test:e2e`
4. Upload `playwright-report/` on failure.
