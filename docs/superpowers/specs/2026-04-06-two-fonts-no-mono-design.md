# Two-Font (Archivo + Space Grotesk) Typography — Design (2026-04-06)

## Summary
Space Mono dies today. The whole app moves to two curated stacks: Archivo (Black + SemiBold) for display/section headings and Space Grotesk (weights 400/500/600) for everything else. We replace the retro-named helpers with semantic counterparts (`.display-heading`, `.stat-label`, `.stat-value`, etc.), retune sizes/line-heights for Grotesk, and sweep the repo so every component consumes the new helpers. The `--font-mono` token is deleted, and lint rules make it impossible to sneak mono back in—or to hard-code Archivo/Grotesk outside the tokens.

## Goals
- Delete the `--font-mono` token/usage and rely solely on `--font-display` (Archivo Black + SemiBold fallback) and `--font-body` (Space Grotesk stack).
- Rebuild global typography helpers with semantic names and Grotesk-friendly sizing/spacing, including a new `.tagline` helper alongside `.eyebrow`.
- Sweep every CSS/TSX consumer so no `.retro-*` class or `var(--font-mono)` survives—shared primitives first, then feature pages.
- Update `docs/design-system.md` to clarify the two-stack system, helper responsibilities, and usage notes.
- Strengthen stylelint so `font-family` can only reference the approved tokens (block `--font-mono`, literal `Space Mono`, and raw Archivo/Grotesk strings).

## Non-Goals
- Changing layout structures, spacing, or component architecture.
- Introducing additional fonts or runtime theme switches.
- Reworking button/pixel-card styling beyond typography.

## Approach
1. **Tokens & Imports**
   - `src/styles/tokens.css` keeps only `--font-display` and `--font-body`. `--font-display` uses Archivo Black with Archivo SemiBold as the lighter fallback; `--font-body` uses Space Grotesk 400/500/600. Delete `--font-mono` and confirm no theme variant redefines it.

2. **Global Helpers**
   - Replace the `.retro-*` cluster in `src/styles/globals.css` with semantic helpers sized for Grotesk:
     - `.display-heading`: Archivo Black, 48px/1.1, uppercase, 0.12em tracking.
     - `.section-heading`: Archivo SemiBold 600, 28px/1.2, uppercase, 0.08em tracking.
     - `.body-copy`: Space Grotesk 400, 16px/1.6 base paragraphs.
     - `.stat-label`: Space Grotesk 500, 12px/1.3, uppercase with 0.18em tracking for labels.
     - `.stat-heading`: Space Grotesk 600, 14px/1.3, uppercase with 0.12em tracking for table headers.
     - `.stat-value`: Space Grotesk 600, 18px/1.2, `font-variant-numeric: tabular-nums` for numeric emphasis.
     - `.eyebrow`: Space Grotesk 500, 10px/1.4, uppercase, 0.24em tracking.
     - `.tagline`: Space Grotesk 400 italic, 14px/1.5 with subtle tracking for microcopy/taglines.
     - `.focus-ring`: same visual treatment as `.retro-focus` but exposed under the new name.

3. **Repo Sweep & Helper Adoption**
   - Mapping is canonical: `.retro-display → .display-heading`, `.retro-head → .section-heading`, `.retro-body → .body-copy`, `.retro-label → .stat-label`, `.retro-table-head → .stat-heading`, `.retro-data/.retro-mono → .stat-value`, `.retro-tagline → .eyebrow` (use `.tagline` when italic microcopy is correct), `.retro-focus → .focus-ring`.
   - Update shared primitives (Button, PixelCard, PixelBadge, StatBar, Ticker, Error surfaces, etc.) before touching feature pages so child surfaces inherit the right helpers by composition.
   - Remove every `font-family: var(--font-mono)` declaration—compose the new helper classes instead. Feature-specific tweaks happen via local modifiers layered on top of helpers, never by reintroducing custom font declarations.

4. **Docs & Lint**
   - `docs/design-system.md` typography section documents the Archivo/Space Grotesk stacks, the helper roster, and usage guidance for stat labels/values.
   - `stylelint.config.cjs` extends `declaration-property-value-disallowed-list` for `font-family` with `/Space Mono/`, `/var\(--font-mono\)/`, `/Archivo( Black)?/`, and `/Space Grotesk/` so only tokens can reference the fonts.

5. **Verification**
   - Run `pnpm lint` and `pnpm test` (Vitest snapshots) to catch CSS/class regressions.
   - Manual QA across the entire app, not just the usual typography-heavy routes, ensuring Grotesk spacing/weight keeps stats and tables readable.

## Risks & Mitigations
- **Missed `.retro-*`/`font-mono` references** — run scripted `rg` sweeps + leverage the stricter lint rule to block bad diffs.
- **Grotesk readability regressions** — retuned font sizes/line heights + tabular numeral settings keep stats easy to scan; manual QA across every route is mandatory per product requirement.
- **Scope blast radius** — Touches almost every feature. Mitigate by updating shared primitives first, then sweeping page folders so the change stays mechanical.

## Timeline
1. Tokens + helper definitions.
2. Shared components + feature sweep for new helpers / mono removal.
3. Docs + lint updates.
4. Full verification (lint, tests, entire-app visual pass).
