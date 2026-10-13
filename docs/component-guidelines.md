# Component guidelines

How to use and extend the Toyo-ui library in `src/components/`. Per-component props, defaults and
do/don't guidance are in the **Component Lab** (`/lab`), generated from `src/features/lab/registry.tsx`.

## Inventory

| Category | Components |
|---|---|
| Brand | `Wordmark` |
| Layout | `PageHeader`, `Eyebrow` |
| Navigation | `DomainCard`, `RelatedList` |
| Data display | `DataTable`, `StatusChip`, `MetaList`, `StatCard` |
| Inputs | `SearchField`, `FilterChips` |
| Feedback | `EmptyState`, `ConfirmDialog` |
| Infrastructure | `LinkBehavior` (wired into the theme; not used directly) |

Import from the barrel: `import { DataTable, StatusChip } from '@/components';`

## When to add a component

Add one when a pattern **repeats with domain meaning** in two or more places (a status, a relationship list,
a page header). Keep using MUI primitives directly for one-off layout (`Box`, `Card`, `Tabs`). See
[ADR 0001](adr/0001-mui-foundation-curated-api.md).

## API rules

1. **Explicit, exported prop types.** Every component exports `XxxProps` with a JSDoc comment on each
   non-obvious prop. No `any`, and no spreading unknown props onto MUI.
2. **Domain values in, presentation out.** `StatusChip` takes `status`, not `color`. The component owns the
   mapping.
3. **Callbacks receive values, not events.** `SearchField.onChange(value: string)`,
   `FilterChips.onChange(value | null)`.
4. **Generic where data varies.** `DataTable<T>` and `FilterChips<V>` keep renderers and values type-checked
   at the call site.
5. **Sensible defaults, documented.** Every default appears in the Lab's API table.
6. **Semantic structure is configurable where context decides it.** `RelatedList.headingLevel` and
   `DomainCard.headingLevel` keep the page outline correct, since the component can't know its depth.
7. **Accessible name is required, not optional.** `SearchField.label` and `DataTable.caption` are required
   props, even when the label is visually hidden.
8. **Controlled by default.** Inputs are controlled; list pages keep the value in the URL.

## Styling rules

- Use **semantic theme values** (`text.secondary`, `surfaceMuted`, `tonal.success`, `divider`), never raw
  palette hex values or `#hex` literals. Exceptions are commented (e.g. the code block in the Lab).
- Spacing uses the 4px grid: `sx={{ p: 4 }}` is 16px.
- New color pairings that carry text must be added to `tokens.test.ts`.
- Don't put block elements inside `Typography` paragraphs. Use `component="span"` for inline decoration.
  A browser test fails on the resulting React warning.

## Adding a component — checklist

1. Create `src/components/Name.tsx` with an exported `NameProps` interface and JSDoc.
2. Export both from `src/components/index.ts`.
3. Add a `defineEntry<NameProps>({...})` to `src/features/lab/registry.tsx`: defaults, controls, `render`,
   `code` (via `jsx()`), `props`, `guidelines`. Put stateful demos in `demos.tsx`.
4. Run `npm test`. The registry test renders it, runs axe on it, and checks the generated snippet.
5. Add behavior tests to `components.test.tsx` for any interaction (keyboard, ARIA state).
6. Use it in a page, then run `npm run test:e2e`.
