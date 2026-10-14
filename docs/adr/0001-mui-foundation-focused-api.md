# ADR 0001 — MUI as the foundation, with a focused component API

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

Toyo-ui provides components for internal product teams: actions, forms, feedback, dialogs and data tables,
accessible to WCAG 2.2 AA, themable in light and dark, and maintained by a small team. The options were:

1. **Build from scratch** on headless primitives (e.g. React Aria, Radix) with custom styling.
2. **Use MUI directly** in every product, customized only through the theme.
3. **MUI as the foundation, wrapped in a smaller, documented Toyo-ui API.**

## Decision

Option 3. MUI provides the primitives, the accessibility behavior (focus trapping, keyboard handling, ARIA
patterns) and the CSS-variables theming. `@toyo-ui/react` exposes eight components whose APIs describe
**what products need**, not every MUI capability.

Where the library intentionally narrows or renames MUI:

| Toyo-ui | Instead of | Why |
|---|---|---|
| `Button variant="primary" \| "secondary" \| "outline" \| "text"` | MUI `variant` × `color` | "Secondary" means one thing everywhere. Loading defaults to a visible label. |
| `TextField label` (required) + `errorMessage` + `validate` + `onChange(value)` | Optional `label`, `error` + `helperText`, event handlers | The most common input accessibility failure becomes a type error; an error can't be flagged without a message. |
| `Alert severity` → `role="alert"` or `"status"` | `role="alert"` for every severity | Routine confirmations don't interrupt screen-reader users. |
| `StatusBadge tone label` | `Chip color` | Not interactive, and color is never the only signal. |
| `Dialog onConfirm(): void \| Promise<void>`, `onClose(reason)` | Composing `Dialog*` parts by hand | Pending state, blocked dismissal and safe initial focus in one place. |
| `DataTable<T> columns rows` | Raw `Table*` components | Typed column renderers, `aria-sort`, loading and empty states by default. |

Everything else MUI offers stays available through `Omit<MuiProps, …>` where it adds no risk (e.g. `href`,
`type`, `aria-*` on Button), and products can still use MUI directly for layout (`Box`, `Stack`, `Paper`).
The rule: **if a pattern repeats with product meaning, it becomes a Toyo-ui component.**

## Consequences

**Benefits**

- Mature accessibility behavior and broad browser support without re-implementing dialogs, focus traps or
  tables.
- CSS-variables theming and color-scheme switching are built in; tokens map onto them in one factory.
- The focused API is small enough to document completely and test exhaustively: every prop is in
  `docs/components.md`, every component has behavior and axe tests, and the public exports are pinned by tests.
- Product teams make fewer decisions; status colors, heading semantics and dialog behavior are encoded once.

**Costs**

- **Bundle size.** MUI and Emotion are the largest dependency (about 80 kB gzip in the consumer demo). The
  Toyo-ui layer itself adds 5.5 kB gzip.
- **Upgrade coupling.** Major MUI versions remove APIs; v9 removed system props, `InputProps`, `PaperProps`
  and `primaryTypographyProps`. The wrapper absorbs much of this, but direct MUI usage in apps must also migrate.
- **Escape hatches.** `sx` remains available, so visual drift is possible. Mitigated by semantic tokens, review,
  and promoting repeated patterns into the library.
- **Runtime styling.** Emotion has a runtime cost a zero-runtime CSS approach would avoid. Not measurable at this
  scale; revisit if profiling shows otherwise.

## Rejected alternatives

- **From scratch on headless primitives:** full control and smaller CSS, but weeks of work to match MUI's
  coverage, with accessibility risk in every widget.
- **MUI directly everywhere:** fastest start, but each team re-decides status colors, validation behavior and
  dialog focus. The "library" would be a theme file with no enforceable API.
