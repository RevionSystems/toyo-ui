# Demo script (about 15 minutes)

For a technical interview. Before starting: `pnpm install && pnpm build:packages && pnpm test:report` (the lab's
Tests tab reads that report), then run `pnpm dev` and
`pnpm --filter @toyo-ui/consumer-demo dev` in two terminals. Have the editor open on `packages/react/src/index.ts`.

## 0:00 — Framing (1 min)

> "Toyo-ui is a component library — two packages, a theme and the components — plus two apps: a lab for building
> and inspecting components, and a separate product app that consumes the library the way another team would.
> The point is the boundary between them."

Show the folder tree and the dependency direction: apps → `@toyo-ui/react` → `@toyo-ui/theme`.

## 1:00 — Component Lab (4 min)

1. Open **Button**. Change `variant`, `startIcon`, toggle `loading`.
   > "Preview and the TypeScript example come from the same state object, so they can't disagree. Defaults are
   > left out of the generated code."
2. Switch the preview to **Dark** and **Mobile**.
   > "The scheme is a CSS-variable scope on the preview frame — the page stays light."
3. Open **Dialog**, open it in dark mode, confirm.
   > "Dialog has a `container` prop, so it portals into the preview and follows its scheme. `onConfirm` can return
   > a promise; the dialog owns the pending state and won't close mid-request. The button keeps its danger color
   > while busy — busy isn't disabled."
4. **API** tab.
   > "These declarations are read from the package source at build time, not hand-copied."
5. **Accessibility** tab → *Run axe on preview*.
6. **Tests** tab.
   > "Real results from the last test run, per component."

## 5:00 — Typed API decisions (3 min)

Open `packages/react/src/TextField.tsx` and `Dialog.tsx`.

> "`label` is required by type. `errorMessage` replaces MUI's `error` plus `helperText`, so you can't flag an
> error without saying what's wrong. `onChange` gives you the string. Validation runs on blur, not every
> keystroke."

> "Alert picks `role="alert"` or `role="status"` from severity, so a success toast doesn't interrupt a screen
> reader. MUI uses `alert` for everything."

Mention ADR 0001: MUI for accessibility behavior and theming; a narrower API on top.

## 8:00 — Design tokens and theme (2 min)

1. **Colors & Tokens**: token → theme → CSS variable → component.
   > "#EB0A1E fails AA on the gray background, so red is two roles: fills and text. A unit test enforces every
   > pair in both schemes."
2. **Theme**: change the accent to *Amber*.
   > "Same factory, scoped theme, real components. It tells you the button label fails contrast."

## 10:00 — Consumer demo (3 min)

Switch to the Release Console.

1. Filter by "payments", switch to *Canary* → empty state → *Clear filters*.
2. Roll back `checkout-api` → focus starts on Cancel → confirm → success alert.
3. *Simulate outage* → *Refresh* → error alert → turn it off → *Retry*.
4. Toggle dark mode.

> "This app doesn't use the source condition, so it imports `@toyo-ui/*` from `dist/` like any outside app.
> Lint blocks deep imports, and `pnpm verify:consumer` fails if resolution ever points somewhere else. In the
> production bundle, the library is 5.5 kB gzipped; the rest is React and MUI."

## 13:00 — Quality and CI (2 min)

Show `.github/workflows/ci.yml` and run `pnpm check` if time allows.

> "224 unit tests, 49 browser tests including axe with real contrast in both schemes. CI also regenerates the
> component reference and fails if it drifted."

Mention bugs the checks caught: status-text contrast at 4.39:1; `Alert announce={false}` still announcing; a
StrictMode double effect stealing focus from the skip link; a CI-only test failure that exposed `Dialog`
stealing focus from a field mid-typing.

## 15:00 — Trade-offs and next steps

- Vitest instead of Jest; Vite library mode instead of another bundler.
- Next: publish to a private registry with Changesets, add NodeNext-compatible declarations, Storybook or visual
  regression in CI, screen-reader passes, pagination for DataTable.

## Likely questions

| Question | Short answer |
|---|---|
| Why wrap MUI at all? | Encode decisions once (status tones, validation timing, dialog focus) and keep a small, documented surface. ADR 0001. |
| How do you stop drift between docs and code? | Docs come from one catalog; the API tab reads real source; tests check documented props exist; CI diffs the generated reference. |
| How would you publish? | Changesets for versioning, `pnpm publish` to a private registry; `exports`, peers and `files` are already shaped for it. |
| Why is the theme a peer dependency? | Components rely on its palette roles; a peer avoids two copies and makes the requirement explicit. |
| What would break for a NodeNext consumer? | Extensionless imports in `.d.ts`; fix by emitting `.js` extensions or bundling declarations. |
