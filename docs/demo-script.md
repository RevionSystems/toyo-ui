# Demo script (≈ 8 minutes)

For a technical interview. Have `npm run dev` running and the editor open on `src/components/index.ts`.

## 0:00 — Framing (30 s)

> "Toyo-ui is two things: an engineering knowledge portal, and the component library it's built from. I built it
> in vertical slices over roughly a working day. Everything you'll see is synthetic data."

## 0:30 — Portal and theming (1 min)

- Home page: hero, architecture panel, domain cards.
- Toggle **Dark** in the sidebar. *"Every color is a semantic token exposed as a CSS variable, so switching
  schemes swaps variables without re-rendering."*

## 1:30 — Core workflow (2 min)

1. Press <kbd>/</kbd>, type `front brake`, pick **Front Brake Assembly (Disc)**.
2. **Specifications** → caliper bolt 110 N·m.
3. **Related Parts** → **PT-3310-12A** → **Kaneda Brake Systems** → back to the parts it supplies.

> "The data is relational by ID, like a PLM export. Pages only read through a repository layer, so swapping in an
> API wouldn't touch them. A test fails if any reference dangles."

4. **Engineering Manuals** → **Braking System** chip → type `abs` → **reload**.

> "Filters live in the URL, so views are shareable and survive refresh."

## 3:30 — AI assistant (1.5 min)

- Open the assistant and click *What is the torque for the front caliper bolt?* → click the **BR-0012** source chip.
- Ask *Who supplies parts for the HV battery?*

> "It's deliberately not calling a model. It's a deterministic retrieval pipeline: detect the system and intent,
> rank manuals, follow relationships, cite sources. There's a provider interface for a backend proxy. The key
> design point is that the model returns IDs, and the client drops any ID that isn't in the system of record, so
> it can't invent a part number. Failures fall back to the offline engine."

## 5:00 — Component Lab (1.5 min)

- **DataTable**: toggle `sortable`, sort a column, switch the preview to **Dark**, show the generated code.

> "Each component has a typed registry entry. Controls are keyed to the component's own prop names, so a
> renamed prop breaks the build. The dark preview works because the theme's color-scheme selector is an
> attribute, and any element can opt in."

- **StatusChip**: show all statuses.

> "Product code passes a domain status, never a color. The mapping and its contrast live in one place."

## 6:30 — Quality (1 min)

- Open **Design Tokens → Contrast**.

> "These ratios are computed live from tokens.ts, and a unit test enforces AA for every pair in both schemes.
> In the browser, Playwright runs axe on 12 pages in both schemes with real contrast. Those checks caught six
> real bugs, including status chip text at 4.39:1 and React StrictMode stealing focus from the skip link."

- Optionally run `npm run check` in a terminal.

## 7:30 — Trade-offs and next steps (30 s)

- MUI as the foundation with a curated API on top (ADR 0001): mature accessibility and theming in exchange for
  bundle size and upgrade coupling.
- Next: a real backend proxy with semantic retrieval, screen-reader passes, and visual regression in CI.

## Likely questions

| Question | Short answer |
|---|---|
| Why not Storybook? | Time budget. The Lab covers live props, code and docs in-app; the registry could generate stories later. |
| How would this scale to 100k parts? | Move search server-side (Postgres FTS or OpenSearch), paginate `DataTable`, virtualize rows; the repository interface stays. |
| Why keep the assistant offline? | Testable, free and honest for a demo. The provider seam shows where a model plugs in and how its output is constrained. |
| How do you stop design drift? | Semantic tokens, a curated API, contrast tests, and moving repeated `sx` patterns into components. |
