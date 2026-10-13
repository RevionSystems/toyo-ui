# ADR 0001 — MUI as the foundation, exposed through a smaller curated API

- **Status:** Accepted
- **Date:** 2026-10-13

## Context

Toyo-ui needs a component library for internal engineering tools: data-dense tables, filters, dialogs,
navigation and status display, accessible to WCAG 2.2 AA, themable in light and dark, and buildable by a
small team. The options considered:

1. **Build from scratch** on headless primitives (e.g. Radix, React Aria) plus our own styling.
2. **Use MUI directly** in every app, customised through the theme.
3. **MUI as the foundation, with a curated layer** of domain-shaped components on top.

## Decision

Option 3. MUI provides primitives, accessibility behavior and theming infrastructure. Toyo-ui exposes a
**smaller, documented set of components** (`src/components/index.ts`, 13 components in the Component Lab)
whose APIs describe *what the product needs*, not every MUI capability.

Examples of the narrowing:

| Toyo-ui API | Instead of | Why |
|---|---|---|
| `<StatusChip status="in-review" />` | `<Chip color=… sx=… label=… />` | Status → label/tone mapping lives in one place, and its contrast is tested. |
| `<PageHeader title=… breadcrumbs=… />` | Ad-hoc `Typography variant="h1"` + `Breadcrumbs` | Guarantees exactly one h1 and a consistent breadcrumb `aria-current`. |
| `<DataTable<T> columns rows getRowId />` | Raw `Table*` components | Typed column renderers, sort with `aria-sort`, empty state and mobile column hiding by default. |
| `<ConfirmDialog tone="destructive" />` | `Dialog` + `DialogTitle` + … | Labelled title/description, initial focus on the safe action, Escape maps to cancel. |
| `<SearchField onChange={(value) => …} />` | `TextField` + adornment | Required accessible label, Escape clears, Enter submits; `onChange` receives a string. |

MUI remains available to feature code for layout (`Box`, `Card`, `Tabs`). The rule: **if a pattern repeats
with domain meaning, it becomes a Toyo-ui component.**

## Consequences

**Positive**

- Accessibility behavior (focus trapping, keyboard support, ARIA patterns) comes from a mature, widely tested
  library, and the team doesn't re-implement it.
- CSS-variables theming and color-scheme switching come built in. Design tokens map onto it in one file
  (`theme.ts`).
- The curated APIs are small enough to document completely (Component Lab: every prop, default and guideline),
  test exhaustively (every Lab entry is rendered and axe-checked), and change behind a stable interface.
- Product engineers make fewer decisions: status tone, heading level and table behavior are encoded once.

**Negative / costs**

- **Bundle size:** MUI and Emotion are the largest dependency (~117 kB gzip chunk). Acceptable for an internal
  tool on corporate networks, and isolated as a long-cached vendor chunk.
- **Upgrade coupling:** major MUI versions remove APIs (v9 removed system props, `InputProps`, `PaperProps`,
  `primaryTypographyProps`). The curated layer absorbs most of this, but feature code that uses MUI directly
  also needs migrating.
- **Escape hatches leak:** `sx` remains available, so visual drift is possible. Mitigated by tokens, review,
  and moving repeated patterns into the library.
- **Runtime styling:** Emotion has a runtime cost a zero-runtime CSS approach would avoid. Not measurable at
  this scale. Revisit if profiling shows it.

## Alternatives rejected

- **From scratch on headless primitives** — full control and smaller CSS, but weeks of work to reach MUI's
  coverage of tables, autocomplete, dialogs and menus, with accessibility risk in each one.
- **MUI directly everywhere** — fastest start, but every team re-decides status colors, heading structure and
  table behavior, and the "library" becomes a theme file with no enforceable API.
