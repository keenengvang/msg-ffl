# Typography Consistency Refactor — Design (2026-04-06)

## Summary
The app currently mixes every font token directly inside feature CSS, so each page invents its own type hierarchy. This spec standardizes typography through the global RetroUI utilities so themes stay cohesive. We delete all feature-level `font-family` declarations, lean on shared helper classes, and confine display/body/mono/pixel stacks to their intended roles. The end result is a single source of truth for typography while keeping existing layout structure intact.

## Goals
- Remove every `font-family` definition outside `src/styles`.
- Expand `globals.css` helpers to cover headings, labels, table headers, and data cells so features stop handrolling typography.
- Update all feature markup/CSS to use the helpers instead of ad-hoc stacks.
- Optionally enforce the rule via lint to keep new code compliant.

## Non-Goals
- Changing copy hierarchy, layout spacing, or component structure beyond the className additions needed for utilities.
- Replacing or redesigning shared components (Button, PixelCard, etc.) beyond typography-specific tweaks they already support.
- Introducing new fonts or runtime theming changes.

## Current State & Problems
`rg "font-family"` hits nearly every feature module. Home/Standings tables force `var(--font-display)` for body text, some cards use `var(--font-pixel)` in headings, and CTA labels bounce between mono and display. Because these are hard-coded, theme overrides or future type tweaks require editing dozens of files. Pixel and retro fonts—meant as occasional flourishes—appear everywhere, so the UI loses cohesion and accessibility.

## Approach
1. **Utility Layer Adjustments**
   - Ensure `globals.css` exposes helpers for each semantic need: `.retro-display`, `.retro-head`, `.retro-body`, `.retro-label`, `.retro-mono`, `.retro-tagline`, plus two new ones:
     - `.retro-table-head`: uppercase mono label style for `<th>` elements (letter spacing, mono font, accent color).
     - `.retro-data`: monospace numeric formatting with tighter spacing for stats or standings values.
   - Document helpers inline (short comments) and in `docs/design-system.md` under Typography so feature teams know what to use.
   - Optional: add a stylelint custom rule or ESLint lint-staged check that warns when `font-family` appears outside `src/styles`.

2. **Feature Sweep Workflow**
   - Build a checklist by grouping `font-family` hits per feature (Home, Standings, Matchups, Managers, Draft, Achievements, History, Transactions, Playoffs, shared components, etc.).
   - For each CSS module:
     - Remove `font-family` declarations.
     - Where typography changes, attach the right helper via `className` composition (e.g., `className={clsx(styles.cardTitle, 'retro-head')}`).
     - Page/layout CSS keeps spacing, grids, borders – only typography moves.
     - If an element needs pixel/retro styling, apply `.pixel-text` or `.retro-text` intentionally instead of embedding `var(--font-pixel)`.
   - Update related TSX files to include the helper classes. Avoid new components unless we encounter repeated markup inside a feature that already violates boundaries.

3. **Shared Components Touch-Up**
   - Ensure shared primitives (Ticker, ErrorState, LoadingScreen, PixelBadge, PixelCard) rely on utilities rather than inline `font-family`. Most already align, but double-check while sweeping.

4. **Verification**
   - Run `pnpm lint` after the sweep to confirm CSS/TSX changes compile.
   - Update/adjust existing unit tests if they assert typography classes (swap to helper class names instead of font stacks).
   - Manual QA on Home, Standings, Matchups, Managers, Draft, Playoffs to confirm only display/body/mono fonts appear unless explicitly marked pixel/retro.

## Risks & Mitigations
- **Missed files**: Use the `rg "font-family"` baseline + lint rule to catch stragglers.
- **Visual regressions**: Because we’re standardizing on existing helpers, the look should improve, but we’ll stage manual QA screenshots for the affected pages to compare before/after.
- **Pixel flair loss**: If a feature truly needs pixel text for identity, wrap just that element in `.pixel-text`. Don’t blanket entire cards; note this in docs.

## Timeline / Phasing
1. Update globals helpers + docs.
2. Sweep features cluster by cluster (Home+Standings, Matchups+Managers, Draft+Transactions, Playoffs+History+Achievements, shared components).
3. Add lint safeguard.
4. QA + lint/test run.
