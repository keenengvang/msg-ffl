# Two-Font Typography Policy — Design (2026-04-06)

## Summary
RetroUI’s pixel and VT323 flourishes are gone. The entire app must rely on exactly three stacks: Archivo Black for display headers, Space Grotesk for body copy, and Space Mono for numeric/label text. We drop the legacy `--font-pixel` and `--font-retro` tokens, remove their utilities, and sweep every feature + shared component so no `font-family` overrides remain outside the globals. Lint guardrails make sure pixel/retro fonts stay dead.

## Goals
- Eliminate `--font-pixel` and `--font-retro` tokens + helpers from `src/styles/tokens.css` and `globals.css`.
- Update typography docs to call out the new “two fonts + mono” policy.
- Sweep the repo to remove pixel/retro `font-family` overrides. Use existing `.retro-*` helpers (or raw display/body/mono) everywhere.
- Add stylelint enforcement so no one can reintroduce the retired fonts.

## Non-Goals
- Redesigning layouts, spacing, or component structure.
- Introducing new fonts or runtime theme options.
- Reworking shared components beyond typography-specific references.

## Approach
1. **Token Cleanup**
   - In `src/styles/tokens.css`, delete `--font-pixel`, `--font-retro`, and any aliases referencing them. Keep only:
     - `--font-display: 'Archivo Black', 'Space Grotesk', ...`
     - `--font-body: 'Space Grotesk', ...`
     - `--font-mono: 'Space Mono', monospace;
   - Remove legacy comments referencing pixel/retro. Ensure theme variants (bubblegum/cosmic) don’t mention them.

2. **Global Utilities**
   - Update `src/styles/globals.css` to drop `.pixel-text`, `.retro-text`, or any helper tied to the removed tokens.
   - Ensure remaining helpers use the surviving stacks:
     - `.retro-display`, `.retro-head` → `var(--font-display)`
     - `.retro-body` → `var(--font-body)`
     - `.retro-label`, `.retro-table-head`, `.retro-data`, `.retro-mono` → `var(--font-mono)`
   - Confirm hero/backdrop utilities no longer expect pixel text.

3. **Repo Sweep**
   - Run `rg -n "font-family" src` to catch any references to the old tokens. Targeted files include every feature page/component touched previously plus shared primitives.
   - For each hit:
     - Remove the `font-family` override if it’s just picking pixel/retro (or if it duplicates what a helper already does).
     - Wire the appropriate helper class (or rely on inheritance). Example: `<span className={clsx(styles.label, 'retro-label')}>`.
     - If a pixel font provided “flair,” swap to styling (color, uppercase, icons) rather than fonts.
   - Shared components (Ticker, PixelBadge, PixelCard, StatBar, ErrorState, etc.) must only use display/body/mono.

4. **Docs & Guardrails**
   - Update `docs/design-system.md` Typography section:
     - “Archivo Black: hero/display”, “Space Grotesk: body”, “Space Mono: labels/stats”.
     - Explicitly note that pixel/retro fonts have been retired.
   - Add a stylelint rule (or custom lint script) that disallows `font-family: var(--font-pixel)` and `font-family: var(--font-retro)` anywhere outside `src/styles`. Integrate with `pnpm lint`.

5. **Verification**
   - Run `pnpm lint` (ensuring the new stylelint rule runs) and `pnpm test` if snapshot updates were required.
   - Manual spot-check on key pages (Home, Standings, Matchups, Managers, Draft, Achievements, History, Playoffs) to confirm fonts render as expected and no weird fallbacks occur.

## Risks & Mitigations
- **Missed references**: rely on `rg` and the lint rule to catch stragglers.
- **Visual regression**: removing pixel fonts might dull some badges. Counter with layout/texture tweaks if needed, but no new fonts.
- **Future contributors**: stylelint rule plus docs should keep them from reintroducing pixel/retro stacks.

## Timeline
1. Tokens + globals cleanup.
2. Repo sweep (shared components + features).
3. Docs + lint rule.
4. Lint/test + visual QA.
