# RetroUI Theme Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply RetroUI’s palette, typography, and component system across the app so every feature inherits the new look through shared tokens and primitives.

**Architecture:** Centralize theme changes in `src/styles` (tokens, globals, assets) and shared components under `src/shared/components`. Each feature page simply consumes those shared primitives plus typography utilities—no per-feature color tokens. Tables and CTA surfaces reference the canonical Button/Card/Badge modules.

**Tech Stack:** React + Vite, TypeScript, CSS Modules, pnpm, Vitest, Playwright (existing project stack).

---

## File Structure Overview
- `src/styles/tokens.css` — Retro color/spacing/shadow tokens.
- `src/styles/globals.css` — Font imports, halftone/noise backgrounds, typography utilities.
- `src/styles/patterns/retro-grid.svg` & `public/assets/retro-noise.png` — background assets referenced by globals.
- `src/shared/components/Typography/RetroHeading.tsx` (+ module.css) — optional helper for repeated heading markup.
- `src/shared/components/Button/` — new canonical RetroUI Button.
- `src/shared/components/PixelCard/`, `PixelBadge/`, `Ticker/`, `LoadingScreen/`, `ErrorState/`, `AvatarPixel/` — reskinned primitives.
- Feature page CSS modules under `src/features/**/pages/**` — stripped of bespoke colors, referencing `.retro-*` utilities and shared components.
- `docs/design-system.md` — documentation of tokens + component APIs.

---

### Task 1: Replace global tokens, spacing, and shadows

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Overwrite color tokens**
  Replace the existing pastel palette with RetroUI values:
  ```css
  :root {
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #fff7c7;
    --color-bg-card: #fffef2;
    --color-text-primary: #000000;
    --color-text-secondary: #1a1a1a;
    --color-text-muted: #4f4f4f;
    --color-accent: #fae583;
    --color-accent-strong: #ffdb33;
    --color-accent-dark: #c59400;
    --color-border: #000000;
    --color-muted: #f4f1dd;
    --color-muted-strong: #e4dfc0;
  }
  ```
- [ ] **Step 2: Rename spacing ladder**
  Add `--retro-space-*` aliases and update shared code to reference them. Use `rg --files -g"*.{css,tsx}" -0 | xargs -0 sd --fixed-strings "var(--retro-space-" "var(--retro-space-"` to rename usages once the vars exist.
- [ ] **Step 3: Define Retro shadow ladder and transitions**
  Append:
  ```css
  --shadow-retro-xs: 1px 1px 0 #000;
  --shadow-retro-sm: 2px 2px 0 #000;
  --shadow-retro-md: 4px 4px 0 #000;
  --shadow-retro-lg: 6px 6px 0 #000;
  --shadow-retro-xl: 10px 10px 0 rgba(0, 0, 0, 0.9);
  --shadow-retro-2xl: 16px 16px 24px rgba(0, 0, 0, 0.35);
  --retro-transition-fast: 90ms cubic-bezier(0.2, 0.8, 0.2, 1);
  --retro-transition-base: 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
  ```

### Task 2: Update globals, fonts, and background assets

**Files:**
- Modify: `src/styles/globals.css`, `index.html`
- Create: `src/styles/patterns/retro-grid.svg`, `public/assets/retro-noise.png`

- [ ] **Step 1: Import fonts once**
  Replace the existing `@import` block with a single Google Fonts request:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600&family=Space+Mono&display=swap');
  ```
- [ ] **Step 2: Define typography utility classes**
  Add `.retro-display`, `.retro-head`, `.retro-body`, `.retro-label`, `.retro-mono`, `.retro-tagline`, `.retro-focus`, `.retro-surface`, `.retro-surface-clickable`. Each sets font-family, clamp sizes, uppercase & letter-spacing consistent with RetroUI. Example:
  ```css
  .retro-display {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 4vw, 4rem);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  ```
- [ ] **Step 3: Layer halftone + noise backgrounds**
  - Create `src/styles/patterns/retro-grid.svg` using RetroUI’s grid vector (copy path data from the RetroUI repo).
  - Drop a subtle PNG noise texture into `public/assets/retro-noise.png` (export from RetroUI or create quickly in an editor).
  - Update `body`, `body::before`, `body::after` in `globals.css` to reference those via `background-image: url('/src/styles/patterns/retro-grid.svg')` and `url('/assets/retro-noise.png')` stacked with radial gradients.
- [ ] **Step 4: Update scrollbars and selection styles**
  Ensure scrollbars use black track + yellow thumb, and `::selection` uses `--color-accent`.
- [ ] **Step 5: Preload fonts/assets in `index.html`**
  Add `<link rel="preconnect" href="https://fonts.googleapis.com" />`, `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`, and `<link rel="preload" as="image" href="/assets/retro-noise.png" />` to minimize FOIT / background flashing.

### Task 3: Shared typography helper component

**Files:**
- Create: `src/shared/components/Typography/RetroHeading.tsx`, `src/shared/components/Typography/RetroHeading.module.css`, `src/shared/components/Typography/index.ts`

- [ ] **Step 1: Implement RetroHeading**
  ```tsx
  type RetroHeadingProps = {
    as?: 'h1' | 'h2' | 'h3';
    variant?: 'display' | 'head';
    tagline?: string;
    className?: string;
    children: React.ReactNode;
  };

  export function RetroHeading({ as: Tag = 'h2', variant = 'head', tagline, children, className }: RetroHeadingProps) {
    return (
      <header className={cx(styles.wrapper, className)}>
        {tagline ? <p className="retro-tagline">{tagline}</p> : null}
        <Tag className={variant === 'display' ? 'retro-display' : 'retro-head'}>{children}</Tag>
      </header>
    );
  }
  ```
- [ ] **Step 2: Update consuming pages**
  Replace duplicated heading markup in home/standings/matchups pages with `<RetroHeading>` to ensure typography is centralized.

### Task 4: Canonical Retro Button

**Files:**
- Create: `src/shared/components/Button/Button.tsx`, `Button.module.css`

- [ ] **Step 1: Implement variant class map**
  Use `clsx` or cva-style helper:
  ```tsx
  const variantClasses = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
    ghost: styles.ghost,
    link: styles.link,
  };
  ```
- [ ] **Step 2: Render spinner for `loading`**
  Inline SVG spinner referencing `--color-border`. Disable pointer events when loading.
- [ ] **Step 3: Styles**
  `Button.module.css` sets `border: 2px solid var(--color-border)`, `box-shadow: var(--shadow-retro-md)`, `transform` transitions, `text-transform: uppercase`, uses `var(--font-mono)` for label. Hover lifts by translating `-2px`.
- [ ] **Step 4: Export + story/test**
  Add a quick Vitest snapshot in `src/shared/components/Button/Button.test.tsx` covering `variant="secondary"` and `loading` states. Command: `pnpm test Button.test.tsx` (optional targeted run) to verify.

### Task 5: Reskin PixelCard & PixelBadge

**Files:**
- Modify: `src/shared/components/PixelCard/PixelCard.tsx`, `.module.css`
- Modify: `src/shared/components/PixelBadge/PixelBadge.tsx`, `.module.css`

- [ ] **Step 1: Extend card props**
  Ensure `variant` matches spec and add `clickable?: boolean`. Provide `data-variant` attr for CSS.
- [ ] **Step 2: CSS double-outline**
  Add `::before` dashed inset using `border: 2px dashed var(--color-border)` and `background: linear-gradient(var(--color-accent), var(--color-accent-strong))` for `warning/success/danger`.
- [ ] **Step 3: Update badge intents**
  Map intents to palette via CSS custom props, e.g.,
  ```css
  .badge[data-intent='accent'] {
    background: var(--color-accent);
    color: var(--color-border);
  }
  ```
- [ ] **Step 4: Unit tests**
  `PixelCard.test.tsx` asserts variant class names; `PixelBadge.test.tsx` asserts uppercase text & class mapping.

### Task 6: Refresh Ticker, LoadingScreen, ErrorState, AvatarPixel

**Files:**
- Modify: `src/shared/components/Ticker/Ticker.tsx`, `.module.css`
- Modify: `src/shared/components/LoadingScreen/LoadingScreen.tsx`, `.module.css`
- Modify: `src/shared/components/ErrorState/ErrorState.tsx`, `.module.css`
- Modify: `src/shared/components/AvatarPixel/AvatarPixel.tsx`, `.module.css`

- [ ] **Step 1: Ticker marquee**
  Replace existing animation with CSS `@keyframes marquee` plus gradient background and `prefers-reduced-motion` guard:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .tickerTrack { animation-play-state: paused; }
  }
  ```
- [ ] **Step 2: Loading + Error surfaces**
  Make them reuse PixelCard/Buttons, drop direct colors. Loading spinner uses shared Button spinner component.
- [ ] **Step 3: Avatar frame**
  Wrap pixel canvas inside outlined square with `box-shadow: var(--shadow-retro-sm)` and accent border for status badges.

### Task 7: Feature sweeps (pages + tables)

**Files:**
- Modify: `src/features/home/pages/HomePage/HomePage.tsx/.module.css`
- Modify: `src/features/standings/pages/StandingsPage/StandingsPage.tsx/.module.css`
- Modify: `src/features/matchups/pages/MatchupsPage/MatchupsPage.tsx/.module.css`
- Modify: `src/features/achievements/pages/AchievementsPage/AchievementsPage.tsx/.module.css`
- Modify: `src/features/history/pages/HistoryPage/HistoryPage.tsx/.module.css`
- Modify: `src/features/transactions/components/TransactionCard.tsx/.module.css`
- Any additional CTA/table surfaces flagged by `rg "button" src/features -g"*.tsx"`

For each feature:
- [ ] Replace `<button>` usage with `<Button variant="...">` based on semantics.
- [ ] Strip bespoke color classes, rely on `.retro-*` utilities and PixelCard variants.
- [ ] Update tables to share a helper class set (`table`, `.thead`, `.tbody tr:nth-child(even)`) referencing `--color-muted` backgrounds and `border: 2px solid var(--color-border)`.
- [ ] Ensure spacing stays owned by page layout (margins/padding remain local).

### Task 8: Docs and `.gitignore`

**Files:**
- Modify/Create: `docs/design-system.md`, `.gitignore`

- [ ] Document tokens and component APIs in `docs/design-system.md` including sample Button usage and typography guidelines.
- [ ] Add `Downloads/RetroUI-main/` (or relative path) to `.gitignore` so the reference repo isn’t committed.

### Task 9: Test & QA pass

**Files/Commands:**
- Verify: `pnpm lint`
- Verify: `pnpm test`
- Manual QA as described.

- [ ] **Step 1: Lint**
  ```bash
  pnpm lint
  ```
- [ ] **Step 2: Unit tests**
  ```bash
  pnpm test
  ```
- [ ] **Step 3: Manual QA**
  Run `pnpm dev`, check home/standings/matchups/managers pages on desktop + responsive simulator. Confirm focus outlines, ticker reduced-motion behavior, button hover physics.
- [ ] **Step 4: Commit**
  ```bash
  git add src docs index.html public .gitignore
  git commit -m "feat: adopt RetroUI tokens and shared components"
  ```

---

## Plan Self-Review
- Coverage: every spec section (tokens, typography, shared components, feature sweeps, docs/testing) has a dedicated task.
- No placeholders: each task lists files, concrete code snippets/commands.
- Naming: component props/variants stay consistent across tasks.
