# Two-Font (No Mono) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every Space Mono reference with Archivo/Space Grotesk helpers, rename the typography utilities, and align docs + lint so the codebase enforces the two-stack system.

**Architecture:** Keep only two font tokens (`--font-display`, `--font-body`), rebuild the global helper classes (including a new `.tagline`), then sweep every CSS module and TSX consumer so they compose the helpers instead of hard-coding fonts. Shared components update first so feature pages inherit consistent typography. Stylelint expands its disallow list to block literal font names, and docs describe the helper roster.

**Tech Stack:** React 18 + Vite, TypeScript, CSS Modules, pnpm, Stylelint, Vitest.

---

## File Structure & Responsibilities
- `src/styles/tokens.css` — single source of truth for the display/body stacks.
- `src/styles/globals.css` — semantic helper classes (`.display-heading`, `.section-heading`, `.body-copy`, `.stat-*`, `.eyebrow`, `.tagline`, `.focus-ring`).
- Core shell modules (`src/core/router/TopBar.module.css`, `src/core/router/Sidebar.module.css`, `src/core/components/ThemeSwitcher/ThemeSwitcher.module.css`) — compose helpers instead of hand-rolled mono text.
- Shared primitives (`src/shared/components/*`) — Button, PixelBadge, PixelCard, StatBar, Ticker, LoadingScreen, ErrorState, ErrorFallback adopt helpers so down-stream pages inherit typography automatically.
- Feature-level CSS (`src/features/**`) — every class previously relying on `.retro-*` or `var(--font-mono)` composes the correct helper (`.stat-label`, `.stat-value`, `.section-heading`, `.tagline`).
- Docs & lint (`docs/design-system.md`, `stylelint.config.cjs`) — describe and enforce the new system.

---

### Task 1: Lock Font Tokens To Archivo + Space Grotesk

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Replace font tokens**

Edit the "Fonts" block so only the display/body stacks remain:

```css
  /* Fonts */
  --font-display: 'Archivo Black', 'Archivo', 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Space Grotesk', system-ui, -apple-system, sans-serif;
```

- [ ] **Step 2: Delete the mono token if it still exists**

Remove any `--font-mono` definition plus related overrides. Confirm the removal:

```bash
rg --line-number "font-mono" src/styles/tokens.css
```

Expected: no matches.

- [ ] **Step 3: Stage the token change**

```bash
git add src/styles/tokens.css
```

### Task 2: Rebuild Global Typography Helpers

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Overwrite the helper block**

Replace the existing `.display-heading` … `.eyebrow` definitions with the retuned helpers and add `.tagline` while keeping `.focus-ring`:

```css
.display-heading {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  line-height: 1.1;
}

.section-heading {
  font-family: 'Archivo', var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: clamp(1.75rem, 2.8vw, 2.4rem);
  line-height: 1.2;
}

.body-copy {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.6;
}

.stat-label {
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-heading {
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.95rem;
  font-weight: 600;
}

.stat-value {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1.15rem;
  line-height: 1.2;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
}

.eyebrow {
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 0.75rem;
}

.tagline {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.focus-ring {
  outline: 3px solid var(--color-accent-strong);
  outline-offset: 4px;
}
```

- [ ] **Step 2: Verify helper coverage**

```bash
rg --no-heading "\.retro-" src/styles/globals.css
```
Expected: no matches.

- [ ] **Step 3: Stage globals**

```bash
git add src/styles/globals.css
```

### Task 3: Core Shell Components Adopt Helpers

**Files:**
- Modify: `src/core/router/TopBar.module.css`
- Modify: `src/core/router/Sidebar.module.css`
- Modify: `src/core/components/ThemeSwitcher/ThemeSwitcher.module.css`

- [ ] **Step 1: Update `TopBar.module.css` typography**

```css
.title {
  composes: section-heading from global;
  font-size: 1rem;
}

.week {
  composes: stat-label from global;
  font-size: 0.65rem;
}

.right {
  composes: section-heading from global;
  letter-spacing: 0.12em;
  margin-left: auto;
}

.season {
  composes: stat-label from global;
  font-size: 0.6rem;
}
```

Delete the previous `font-family` lines.

- [ ] **Step 2: Update `Sidebar.module.css` footer copy**

```css
.footer {
  composes: stat-label from global;
  margin-top: auto;
  position: relative;
  z-index: 1;
  border: var(--border-pixel);
  padding: var(--retro-space-3);
  background: var(--color-bg-card);
}
```

- [ ] **Step 3: Update `ThemeSwitcher.module.css`**

```css
.trigger {
  composes: stat-heading from global;
  border: 2px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  padding: var(--retro-space-2) var(--retro-space-3);
}

.option {
  composes: stat-label from global;
  display: flex;
  align-items: center;
  gap: var(--retro-space-2);
  padding: var(--retro-space-2);
}
```

- [ ] **Step 4: Stage core module updates**

```bash
git add src/core/router/TopBar.module.css \
        src/core/router/Sidebar.module.css \
        src/core/components/ThemeSwitcher/ThemeSwitcher.module.css
```

### Task 4: Shared Components Consume Helpers

**Files:**
- Modify: `src/shared/components/Button/Button.module.css`
- Modify: `src/shared/components/PixelBadge/PixelBadge.module.css`
- Modify: `src/shared/components/PixelCard/PixelCard.module.css`
- Modify: `src/shared/components/StatBar/StatBar.module.css`
- Modify: `src/shared/components/Ticker/Ticker.module.css`
- Modify: `src/shared/components/LoadingScreen/LoadingScreen.module.css`
- Modify: `src/shared/components/ErrorState/ErrorState.module.css`
- Modify: `src/shared/components/ErrorFallback/ErrorFallback.module.css`

- [ ] **Step 1: Button root + link states**

```css
.root {
  composes: stat-heading from global;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
}

.link {
  composes: body-copy from global;
  text-transform: none;
  letter-spacing: normal;
}

.label {
  composes: stat-heading from global;
}
```

- [ ] **Step 2: PixelBadge + PixelCard**

```css
.badge,
.header,
.footer {
  composes: stat-label from global;
  letter-spacing: 0.08em;
}
```

- [ ] **Step 3: StatBar + Ticker**

```css
.label {
  composes: stat-label from global;
}

.value {
  composes: stat-value from global;
}

.inner {
  composes: display-heading from global;
}
```

- [ ] **Step 4: LoadingScreen + Error surfaces**

```css
.message {
  composes: section-heading from global;
}

.sub,
.tagline,
.details {
  composes: stat-label from global;
}

.btn,
.header {
  composes: stat-heading from global;
}
```

- [ ] **Step 5: Stage shared components**

```bash
git add src/shared/components/Button/Button.module.css \
        src/shared/components/PixelBadge/PixelBadge.module.css \
        src/shared/components/PixelCard/PixelCard.module.css \
        src/shared/components/StatBar/StatBar.module.css \
        src/shared/components/Ticker/Ticker.module.css \
        src/shared/components/LoadingScreen/LoadingScreen.module.css \
        src/shared/components/ErrorState/ErrorState.module.css \
        src/shared/components/ErrorFallback/ErrorFallback.module.css
```

### Task 5: Feature Components (non-page) Clean-Up

**Files:**
- Modify: `src/features/transactions/components/TransactionCard.module.css`
- Modify: `src/features/playoffs/components/BracketMatch.module.css`

- [ ] **Step 1: `TransactionCard` helper mapping**

```css
.type,
.bid,
.addTag,
.dropTag {
  composes: stat-label from global;
}

.playerName,
.team,
.toTeam {
  composes: body-copy from global;
}
```

- [ ] **Step 2: `BracketMatch` typography**

```css
.tbdAvatar,
.points {
  composes: stat-label from global;
}
```

- [ ] **Step 3: Stage component updates**

```bash
git add src/features/transactions/components/TransactionCard.module.css \
        src/features/playoffs/components/BracketMatch.module.css
```

### Task 6: Home + Standings Pages

**Files:**
- Modify: `src/features/home/pages/HomePage/HomePage.module.css`
- Modify: `src/features/standings/pages/StandingsPage/StandingsPage.module.css`

- [ ] **Step 1: HomePage tables & stats**

```css
.table th,
.cutline td,
.rank,
.powerRank,
.powerScore,
.statLabel,
.quickLink,
.viewAll {
  composes: stat-label from global;
}

.statValue {
  composes: stat-value from global;
}
```

- [ ] **Step 2: StandingsPage table**

```css
.toggle,
.th,
.rankCell,
.streakW,
.streakL,
.inPlayoffs,
.outPlayoffs,
.cutlineNote {
  composes: stat-label from global;
}
```

- [ ] **Step 3: Stage both files**

```bash
git add src/features/home/pages/HomePage/HomePage.module.css \
        src/features/standings/pages/StandingsPage/StandingsPage.module.css
```

### Task 7: Matchups + Managers Pages

**Files:**
- Modify: `src/features/matchups/pages/MatchupsPage/MatchupsPage.module.css`
- Modify: `src/features/managers/pages/ManagerPage/ManagerPage.module.css`

- [ ] **Step 1: MatchupsPage helper usage**

```css
.arrow,
.weekLabel,
.winTag,
.vs,
.margin {
  composes: stat-label from global;
}

.score {
  composes: stat-value from global;
}
```

- [ ] **Step 2: ManagerPage badges & tables**

```css
.recordBadge,
.rankBadge,
.streakW,
.streakL,
.statKey,
.weekNum,
.notFound {
  composes: stat-label from global;
}

.statVal,
.weekScore {
  composes: stat-value from global;
}

.h2hTable th {
  composes: stat-heading from global;
}
```

- [ ] **Step 3: Stage files**

```bash
git add src/features/matchups/pages/MatchupsPage/MatchupsPage.module.css \
        src/features/managers/pages/ManagerPage/ManagerPage.module.css
```

### Task 8: Playoffs + Draft Pages

**Files:**
- Modify: `src/features/playoffs/pages/PlayoffsPage/PlayoffsPage.module.css`
- Modify: `src/features/draft/pages/DraftPage/DraftPage.module.css`

- [ ] **Step 1: Playoffs labels**

```css
.champLabel,
.roundLabel {
  composes: stat-label from global;
}
```

- [ ] **Step 2: Draft board typography**

```css
.roundHeader,
.teamHeader,
.roundCell,
.pos,
.team {
  composes: stat-label from global;
}

.board {
  composes: body-copy from global;
}
```

- [ ] **Step 3: Stage files**

```bash
git add src/features/playoffs/pages/PlayoffsPage/PlayoffsPage.module.css \
        src/features/draft/pages/DraftPage/DraftPage.module.css
```

### Task 9: Transactions + Achievements + History Pages

**Files:**
- Modify: `src/features/transactions/pages/TransactionsPage/TransactionsPage.module.css`
- Modify: `src/features/achievements/pages/AchievementsPage/AchievementsPage.module.css`
- Modify: `src/features/history/pages/HistoryPage/HistoryPage.module.css`

- [ ] **Step 1: Transactions filters**

```css
.filter {
  composes: stat-label from global;
}
```

- [ ] **Step 2: Achievements labels**

```css
.champLabel,
.filter,
.earnerWeek,
.earnerDetail,
.locked {
  composes: stat-label from global;
}
```

- [ ] **Step 3: History tables**

```css
.table th,
.rank,
.inPlayoffs,
.outPlayoffs {
  composes: stat-label from global;
}
```

- [ ] **Step 4: Stage files**

```bash
git add src/features/transactions/pages/TransactionsPage/TransactionsPage.module.css \
        src/features/achievements/pages/AchievementsPage/AchievementsPage.module.css \
        src/features/history/pages/HistoryPage/HistoryPage.module.css
```

### Task 10: Stylelint + Docs + Safety Nets

**Files:**
- Modify: `stylelint.config.cjs`
- Modify: `docs/design-system.md`

- [ ] **Step 1: Expand `font-family` disallow list**

```js
      'font-family': [
        /var\(--font-pixel\)/,
        /var\(--font-retro\)/,
        /var\(--font-mono\)/,
        /Space Mono/i,
        /Archivo( Black)?/i,
        /Space Grotesk/i,
      ],
```

- [ ] **Step 2: Refresh docs**

Replace the typography bullet in `docs/design-system.md` with the two-stack explanation, listing each helper with “Use when …” notes.

- [ ] **Step 3: Stage lint + docs**

```bash
git add stylelint.config.cjs docs/design-system.md
```

### Task 11: Repository Verification

**Files/Commands:**
- Command scope: repo root

- [ ] **Step 1: Ensure no retro/mono remnants**

```bash
rg --line-number "retro-" src
rg --line-number "font-mono" src
```
Both should return no matches outside archived docs/specs.

- [ ] **Step 2: Install deps if needed**

```bash
pnpm install
```

- [ ] **Step 3: Run lint + tests**

```bash
pnpm lint
pnpm test
```

- [ ] **Step 4: Manual QA**

```bash
pnpm dev
```

Manually smoke Home, Standings, Matchups, Managers, Draft, Transactions, Achievements, History, Playoffs, confirming every label/value remains readable and upper-case helpers look intentional.

- [ ] **Step 5: Final git hygiene**

```bash
git status -sb
git add .
git commit -m "refactor: adopt two-font typography helpers"
```
