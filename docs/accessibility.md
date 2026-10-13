# Accessibility

Target: **WCAG 2.2 Level AA**. The in-app version of this page is `/accessibility`.

## What the app does

**Structure**
- One `h1` per page, rendered by `PageHeader`. A route test asserts exactly one.
- Heading levels never skip. Components whose depth depends on context take `headingLevel`.
- Landmarks: `header` (app bar), `nav aria-label="Primary"`, `main`. Sections are labelled with
  `aria-labelledby`.
- Lists are `ul/li`, record properties are `dl/dt/dd` (`MetaList`), and the procedure is an `ol`.

**Keyboard and focus**
- A skip link is the first tab stop.
- On route change, focus moves to `<main>` so screen readers announce the new page.
- <kbd>/</kbd> focuses global search; <kbd>Esc</kbd> clears `SearchField`.
- `ConfirmDialog` traps focus, starts on the safe action and maps <kbd>Esc</kbd> to cancel.
- Clickable table rows always also contain a real link, so row click is never the only path.
- Exploded-view callouts are real buttons with `aria-pressed` and a descriptive label.

**Names, roles and state**
- Icon-only buttons have labels ("Open navigation", "Ask").
- Filter chips expose `aria-pressed`; active nav items use `aria-current="page"`; sortable headers expose
  `aria-sort`.
- Result counts (`role="status"`), empty states and assistant answers (`aria-live="polite"`) are announced.
- Tabs follow the WAI-ARIA tabs pattern with `aria-controls` / `aria-labelledby`.

**Color**
- All text/background token pairs meet **4.5:1** in both schemes, including status chips on their tonal
  backgrounds.
- Status always has a text label; color is never the only signal.
- Links inside running text are always underlined.

**Responsive**
- Below 1200px the side nav becomes a modal drawer. Secondary table columns hide below 900px.
- No page scrolls horizontally on a 412px viewport (tested).

## How it is verified

| Check | Where | Catches |
|---|---|---|
| Token contrast (both schemes) | `src/theme/tokens.test.ts` | Any token change that drops a text pair below AA |
| axe on every Lab component | `src/features/lab/registry.test.tsx` | Missing names, invalid list/ARIA structure in components |
| axe + single h1 on every route | `src/app/routes.test.tsx` | Page-level structure, heading order |
| Component behavior | `src/components/components.test.tsx` | `aria-sort`, `aria-pressed`, dialog labelling and focus |
| axe in Chrome, 12 pages × light/dark, WCAG 2.2 AA tags | `e2e/a11y.spec.ts` | Real rendered **color contrast**, which jsdom cannot evaluate |
| Skip link, drawer, overflow | `e2e/a11y.spec.ts`, `e2e/responsive.spec.ts` | Keyboard and small-screen regressions |
| Console errors fail browser tests | `e2e/fixtures.ts` | Invalid DOM nesting and other React warnings |
| Lint | `eslint-plugin-jsx-a11y` | Static issues at authoring time |

jsdom axe runs disable `color-contrast` (no computed styles) and `region` (components render without
landmarks). Both are covered in the browser.

## Issues these checks found during development

- Status chip text at **4.39:1** on its tinted background (passed against white, failed against the page
  background). Fixed by using the contrast-tested `tonal` tokens.
- `<a>` elements directly inside `<ul>` in three lists (MUI `ListItemButton` with `href`). Wrapped in `ListItem`.
- React StrictMode's double effect moved focus to `<main>` on first load, bypassing the skip link.
- Heading skips (h1 → h3) on `/systems` and on the home page below the xl breakpoint.
- `<div>` inside `<p>` in `Eyebrow`.
- An inline link distinguishable only by color in dark mode.

## Not yet verified

Automated tools find a subset of issues. Outstanding manual work before release:

- Screen-reader passes (VoiceOver + Safari, NVDA + Firefox) on the core workflow and the assistant.
- 200% zoom and text-spacing overrides.
- Windows High Contrast / `forced-colors` mode.
- `prefers-reduced-motion` (motion is minimal, but not explicitly gated).
