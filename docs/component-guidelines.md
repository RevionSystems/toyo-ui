# Component guidelines

How components in `@toyo-ui/react` are designed, and how to add one. The per-component reference
(props, usage, accessibility, test coverage) is generated: [components.md](components.md).

## API conventions

1. **Export the props interface.** Every component exports `NameProps` with JSDoc on each non-obvious prop.
   No `any`, no unchecked casts.
2. **Narrow MUI on purpose.** Extend with `Omit<MuiProps, OmittedProps>` and list what you omit in a named type
   (`OmittedMuiProps`) so the decision is visible. Rename only when the MUI name misleads.
3. **Domain values in, presentation out.** `StatusBadge` takes `tone`, `Alert` takes `severity`; the component
   owns the mapping to colors and roles.
4. **Callbacks receive values, not events**, when the event adds nothing: `TextField.onChange(value: string)`,
   `Dialog.onClose(reason)`.
5. **Accessible names are required by type** where the component can't work without one: `TextField.label`,
   `StatusBadge.label`, `DataTable.caption`, `Dialog.title`.
6. **Support controlled and uncontrolled use** for inputs (`value`/`onChange` or `defaultValue`).
7. **Generic where data varies.** `DataTable<T>` type-checks column renderers at the call site.
8. **Async is first-class.** If an action can be async, accept `() => void | Promise<void>` and own the pending
   state (`Dialog.onConfirm`), rather than making every caller wire `loading`.
9. **Forward refs** for anything focusable (`Button`, `TextField`).
10. **No router, no app state.** Packages stay framework-neutral; apps inject a link component through the theme.

## Styling conventions

- Use semantic palette paths in `sx`: `text.secondary`, `primaryText`, `tonal.success`, `surfaceMuted`,
  `divider`. Never hex values or raw palette scales.
- Red text uses `primaryText`; `primary.main` is for fills only (contrast, see [accessibility.md](accessibility.md)).
- Spacing uses the 4px grid (`sx={{ p: 4 }}` = 16px). Control heights come from `dimensions.control`.
- Don't remove focus outlines; the global `:focus-visible` ring comes from the theme.
- New text/background color pairs must be added to `packages/theme/src/tokens.test.ts`.
- Loading states keep the component's colors — busy is not disabled-looking.

## States to consider

Default, hover, focus-visible, active, disabled, loading, error, success, empty, long content, narrow
viewport. Implement only the ones that make sense for the component, and show them in the lab gallery.

## Adding a component — checklist

1. `packages/react/src/Name.tsx` — component + exported `NameProps`; relative imports only (no path aliases in
   packages).
2. Export it from `packages/react/src/index.ts`; update the expected list in `index.test.ts`.
3. `packages/react/src/Name.test.tsx` — behavior through roles and `userEvent` (keyboard included), disabled
   and loading paths if relevant, and `axeViolations`.
4. `apps/playground/src/catalog/docs/name.ts` — `ComponentDoc` with `status: 'beta'` to start. Add the id to
   `COMPONENT_IDS` and the doc to `CATALOG`.
5. `apps/playground/src/features/component-lab/entries/name.tsx` — playground state, controls (every state key
   needs one), `render`, `code` via `example()`/`jsx()`, and a gallery. Register it in `registry.ts`.
6. `pnpm docs:components && pnpm check`. The registry suite will render it, run axe, check the generated example,
   and verify every documented prop exists on the real props interface.
7. Promote to `stable` once the API has been used in a product.

## Using MUI directly

Products may use MUI for layout (`Box`, `Stack`, `Paper`, `Grid`) and for controls Toyo-ui doesn't cover yet
(the consumer demo uses `ToggleButtonGroup` and `Switch`). When the same MUI pattern appears in several places
with product meaning, propose it as a Toyo-ui component. See
[ADR 0001](adr/0001-mui-foundation-focused-api.md).
