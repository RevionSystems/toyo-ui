# Accessibility

Target: **WCAG 2.2 AA**. Automated checks pass; that is necessary, not sufficient — see
[Not yet verified](#not-yet-verified).

## Built into the components

| Component | What it guarantees |
|---|---|
| Button | Native `<button>`/`<a>`; loading keeps the label and sets `aria-busy`; spinner is a labelled progressbar; 32px minimum height. |
| TextField | Required label (visually hideable); helper and error linked by `aria-describedby`; `aria-invalid` follows the error; validation waits for blur; live character counter. |
| Alert | Errors and warnings use `role="alert"`, info and success `role="status"`; `announce={false}` for static content; labelled "Dismiss" button. |
| StatusBadge | Text label always rendered; decorative dot is `aria-hidden`; not a live region. |
| Dialog | Labelled by title and described by description; focus trapped and restored; Escape closes unless a confirm is pending; destructive dialogs start on Cancel. |
| DataTable | Real `<table>` with `<caption>`; sortable headers are buttons with `aria-sort`; loading sets `aria-busy` and hides skeleton rows. |
| LoadingState | `role="status"` with a label; determinate progress exposes `aria-valuenow`. |
| EmptyState | `role="status"` so a filter that empties a list is announced; decorative icon hidden. |

## Built into the theme

- **Contrast.** Every text/background pair the components use meets 4.5:1 in light and dark, including status
  text on tonal backgrounds. The focus ring and primary fills meet 3:1 (non-text contrast).
  `packages/theme/src/tokens.test.ts` enforces all of it.
- **Red for text vs. fills.** The brand accent #EB0A1E passes on white (4.57:1) but not on the secondary
  background #F4F5F6 (4.19:1). It is used for fills; red text and links use `primaryText`.
- **Focus.** One global `:focus-visible` ring (2px, 2px offset) from `CssBaseline`.
- **Motion.** Animations and transitions drop to near zero under `prefers-reduced-motion: reduce`.
- **Links in text are always underlined**, so they are distinguishable without color.

## How it is verified

| Check | Where | Catches |
|---|---|---|
| Token contrast, both schemes | `packages/theme/src/tokens.test.ts` | Any token change that breaks a text or focus pair |
| Component behavior | `packages/react/src/*.test.tsx` | Names, roles, keyboard, focus, `aria-*` state |
| axe per component (jsdom) | each component test file | Structural ARIA and labelling errors |
| axe on every lab entry and route (jsdom) | `apps/playground` tests | Page structure, heading order, single `h1` |
| axe in Chrome, 17 lab pages × light/dark | `e2e/a11y.spec.ts` | **Real rendered color contrast** (jsdom can't compute it) |
| axe in Chrome on the consumer, light and dark | `e2e/consumer.spec.ts` | The library in a real product layout |
| Keyboard and small screens | `e2e/a11y.spec.ts`, `e2e/responsive.spec.ts` | Skip link, drawer navigation, horizontal overflow at 412px |
| Console errors fail browser tests | `e2e/fixtures.ts` | Invalid DOM nesting and other React warnings |
| Live preview check | Component Lab → Accessibility tab | axe on the current props, scheme and width |
| Lint | `eslint-plugin-jsx-a11y` | Authoring mistakes |

jsdom axe runs disable `color-contrast` (no computed styles) and `region` (components render outside
landmarks). Both are covered in the browser.

## Issues these checks found during development

- Status text at 4.39:1 on its tinted background → moved to contrast-tested tonal tokens.
- `<a>` placed directly inside `<ul>` in navigation lists → wrapped in `<li>`.
- React StrictMode's double effect moved focus to `<main>` on first load, bypassing the skip link.
- Heading levels skipped (h1 → h3) on two pages.
- Inline links distinguishable only by color → always underlined.
- `Alert announce={false}` still announced, because MUI falls back to `role="alert"`.
- `Dialog` moved focus to its confirm button after the enter transition even when the user had already started
  typing in a field, sending the rest of their input to the button. Found through a CI-only test failure.

## Not yet verified

- Screen-reader passes (VoiceOver + Safari, NVDA + Firefox) on the lab and the consumer demo.
- 200% zoom and WCAG text-spacing overrides.
- Windows High Contrast / `forced-colors` mode.
- Announcement timing of `Alert` and `Dialog` across screen readers.
- Browsers other than Chromium.
