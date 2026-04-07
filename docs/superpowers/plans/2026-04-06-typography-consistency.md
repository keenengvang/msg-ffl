# Typography Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all ad-hoc `font-family` usage with the shared RetroUI typography utilities so every page inherits a cohesive type hierarchy.

**Architecture:** Add the missing helper classes in `globals.css`, update docs, then sweep feature CSS/TSX files cluster-by-cluster to attach the helpers. Finish with a lint rule that blocks future `font-family` declarations outside `src/styles` and run lint/tests.

**Tech Stack:** React + TypeScript, CSS Modules, clsx, Stylelint/ESLint, pnpm.

---

### Task 1: Extend Global Typography Helpers & Docs

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `docs/design-system.md`

- [ ] **Step 1: Add helper classes**

```css
.retro-table-head {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.7rem;
  color: var(--color-text-primary);
}

.retro-data {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
}
```
Add these blocks near the existing `.retro-*` utilities plus short comments explaining intent. Ensure utilities remain globally available.

- [ ] **Step 2: Document helpers**

Append to the Typography section:

```markdown
### Typography Utilities
- `.retro-display` – headline hero text (Archivo Black)
- `.retro-head` – section headings
- `.retro-body` – default body copy
- `.retro-label` – uppercase micro labels
- `.retro-table-head` – table headers (mono + tracking)
- `.retro-data` – monospace numerics
- `.retro-mono` – inline monospace spans
- `.pixel-text` / `.retro-text` – limited-use pixel/retro flourishes
```
Mention that feature CSS must use these instead of redefining `font-family`.

- [ ] **Step 3: Sanity-run lint**

```bash
pnpm lint styles
```
Confirm no CSS errors before moving on.

### Task 2: Home & Standings Pages

**Files:**
- Modify: `src/features/home/pages/HomePage/HomePage.module.css`
- Modify: `src/features/home/pages/HomePage/HomePage.tsx`
- Modify: `src/features/standings/pages/StandingsPage/StandingsPage.module.css`
- Modify: `src/features/standings/pages/StandingsPage/StandingsPage.tsx`

- [ ] **Step 1: Strip fonts from HomePage CSS**

Update selectors to remove `font-family` and rely on helpers:

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

.rank {
  text-align: center;
}
```
Delete the old `font-family` lines for `.table`, `.rank`, `.powerRank`, etc.

- [ ] **Step 2: Apply helpers in HomePage.tsx**

Import `clsx` if not already present:

```ts
import clsx from 'clsx';
```
Attach helpers:

```tsx
<th className={clsx('retro-table-head')}>Team</th>
<span className={clsx(styles.rank, 'retro-label')}>{team.rank}</span>
<p className={clsx(styles.cardTitle, 'retro-head')}>Top Power Moves</p>
```
Use `.retro-data` for numeric cells (records, stats) and `.retro-label` for small labels.

- [ ] **Step 3: Update Standings CSS**

Remove `font-family` usages in the standings table/styles. Example final snippet:

```css
.positionCell {
  text-align: center;
  color: var(--color-text-secondary);
}
```

- [ ] **Step 4: Apply helpers in Standings TSX**

Add `clsx` usage similar to HomePage:

```tsx
<th className="retro-table-head">Pts</th>
<td className={clsx(styles.positionCell, 'retro-data')}>{team.points}</td>
<h1 className={clsx(styles.title, 'retro-display')}>League Standings</h1>
```

- [ ] **Step 5: Quick page smoke**

```bash
pnpm run dev
```
Load `/` and `/standings` to confirm typography now comes from helper classes only.

### Task 3: Matchups & Managers Pages

**Files:**
- Modify: `src/features/matchups/pages/MatchupsPage/MatchupsPage.module.css`
- Modify: `src/features/matchups/pages/MatchupsPage/MatchupsPage.tsx`
- Modify: `src/features/managers/pages/ManagerPage/ManagerPage.module.css`
- Modify: `src/features/managers/pages/ManagerPage/ManagerPage.tsx`

- [ ] **Step 1: Clean Matchups CSS**

Delete all `font-family` entries (`.matchupTitle`, `.teamName`, `.score`, `.meta`). Ensure spacing/borders remain untouched.

- [ ] **Step 2: Apply helpers in Matchups TSX**

```tsx
<h2 className={clsx(styles.matchupTitle, 'retro-head')}>{matchup.title}</h2>
<div className={clsx(styles.teamName, 'retro-body')}>{team.name}</div>
<div className={clsx(styles.score, 'retro-data')}>{team.score}</div>
```
Use `.retro-label` for metadata rows (week/date) and `.retro-mono` for any code-like bits.

- [ ] **Step 3: Clean Manager CSS**

Remove `font-family` from `.managerTitle`, `.statValue`, `.badge`. Keep layout tokens.

- [ ] **Step 4: Apply helpers in Manager TSX**

```tsx
<h1 className={clsx(styles.managerTitle, 'retro-display')}>{manager.name}</h1>
<span className={clsx(styles.statLabel, 'retro-label')}>Win %</span>
<span className={clsx(styles.statValue, 'retro-data')}>{manager.winPct}</span>
```
If badges previously used `pixel` fonts, add `.pixel-text` only on the badge text span.

- [ ] **Step 5: Dev smoke**

Visit `/matchups` + `/managers` in dev server to confirm fonts update.

### Task 4: Draft & Transactions Surfaces

**Files:**
- Modify: `src/features/draft/pages/DraftPage/DraftPage.module.css`
- Modify: `src/features/draft/pages/DraftPage/DraftPage.tsx`
- Modify: `src/features/transactions/pages/TransactionsPage/TransactionsPage.module.css`
- Modify: `src/features/transactions/pages/TransactionsPage/TransactionsPage.tsx`
- Modify: `src/features/transactions/components/TransactionCard.module.css`
- Modify: `src/features/transactions/components/TransactionCard.tsx`

- [ ] **Step 1: Draft CSS cleanup**

Remove mono/pixel assignments from `.pickNumber`, `.playerName`, `.sectionTitle`.

- [ ] **Step 2: Draft TSX helpers**

```tsx
<h2 className={clsx(styles.sectionTitle, 'retro-head')}>Live Draft Board</h2>
<span className={clsx(styles.pickNumber, 'retro-data')}>#{pick.number}</span>
<p className={clsx(styles.playerName, 'retro-body')}>{pick.player}</p>
```
For any pixel callouts, wrap the text node with `<span className="pixel-text">`.

- [ ] **Step 3: Transactions CSS cleanup**

Delete `font-family` in table/list styles and TransactionCard module.

- [ ] **Step 4: Transactions TSX helpers**

```tsx
<th className="retro-table-head">Added</th>
<td className={clsx(styles.playerCell, 'retro-body')}>{txn.player}</td>
<TransactionCard ... classNameOverrides={{ title: 'retro-head', stat: 'retro-data' }} />
```
Inside `TransactionCard.tsx`, merge module classes with helper strings when rendering headings/stats.

- [ ] **Step 5: Smoke test**

Visit `/draft` and `/transactions` to ensure typography matches expectations.

### Task 5: Achievements, History, Playoffs, Shared Bracket

**Files:**
- Modify: `src/features/achievements/pages/AchievementsPage/AchievementsPage.module.css`
- Modify: `src/features/achievements/pages/AchievementsPage/AchievementsPage.tsx`
- Modify: `src/features/history/pages/HistoryPage/HistoryPage.module.css`
- Modify: `src/features/history/pages/HistoryPage/HistoryPage.tsx`
- Modify: `src/features/playoffs/pages/PlayoffsPage/PlayoffsPage.module.css`
- Modify: `src/features/playoffs/pages/PlayoffsPage/PlayoffsPage.tsx`
- Modify: `src/features/playoffs/components/BracketMatch.module.css`
- Modify: `src/features/playoffs/components/BracketMatch.tsx`

- [ ] **Step 1: Achievements clean + helpers**

Remove `font-family` from `.badgeTitle`, `.statValue`, `.cta`. In TSX:

```tsx
<h2 className={clsx(styles.sectionTitle, 'retro-head')}>Milestones</h2>
<p className={clsx(styles.statValue, 'retro-data')}>{achievement.total}</p>
<Button className="retro-label">View All</Button>
```
Use `.pixel-text` only where we intentionally keep old-school badges.

- [ ] **Step 2: History page updates**

Drop pixel font overrides; apply `.retro-body` to timeline copy and `.retro-label` to year markers via `className`.

- [ ] **Step 3: Playoffs page + BracketMatch**

Remove monospace declarations from CSS. In TSX, wire helpers:

```tsx
<div className={clsx(styles.matchTitle, 'retro-head')}>{match.round}</div>
<span className={clsx(styles.seed, 'retro-label')}>#{seed}</span>
<span className={clsx(styles.score, 'retro-data')}>{score}</span>
```
Ensure Pixel highlight text uses `.pixel-text` intentionally.

- [ ] **Step 4: Manual QA**

Navigate `/achievements`, `/history`, `/playoffs` verifying typography.

### Task 6: Shared Components Sweep

**Files:**
- Modify: `src/shared/components/Ticker/Ticker.module.css`
- Modify: `src/shared/components/Ticker/Ticker.tsx`
- Modify: `src/shared/components/StatBar/StatBar.module.css`
- Modify: `src/shared/components/StatBar/StatBar.tsx`
- Modify: `src/shared/components/ErrorState/ErrorState.module.css`
- Modify: `src/shared/components/ErrorState/ErrorState.tsx`
- Modify: `src/shared/components/PixelBadge/PixelBadge.module.css`
- Modify: `src/shared/components/PixelBadge/PixelBadge.tsx`
- Modify: `src/shared/components/PixelCard/PixelCard.module.css`
- Modify: `src/shared/components/PixelCard/PixelCard.tsx`

- [ ] **Step 1: Remove inline fonts**

Strip `font-family` from the CSS modules listed. Keep uppercase/letter spacing logic, but not the font declarations.

- [ ] **Step 2: Attach helpers in components**

Update render functions:

```tsx
<span className={clsx(styles.label, 'retro-label')}>{label}</span>
<div className={clsx(styles.value, 'retro-data')}>{value}</div>
```
Ticker text should use `'retro-label'` for uppercase track; ErrorState headings should use `'retro-head'` and body copy `'retro-body'`.

- [ ] **Step 3: Snapshots/tests**

If Vitest snapshots cover these components, update them:

```bash
pnpm test src/shared/components/ErrorState/ErrorState.test.tsx
```
Ensure they expect helper class names instead of inline fonts.

### Task 7: Lint Guardrail

**Files:**
- Modify: `package.json` (scripts) or `stylelint.config.cjs`
- Modify/Create: `.stylelintrc.cjs` rule or `eslint/rules/no-font-family-outside-styles.js`

- [ ] **Step 1: Add stylelint rule**

Example `stylelint.config.cjs` addition:

```js
module.exports = {
  rules: {
    'property-disallowed-list': [
      true,
      { 'font-family': ['/src/(?!styles)/'] }
    ]
  }
};
```
Alternatively, add a custom ESLint rule that inspects CSS module imports—choose whichever integrates cleanly.

- [ ] **Step 2: Wire script**

Add `"lint:fonts": "stylelint \"src/**/*.module.css\""` to `package.json` scripts and include it in the main `pnpm lint` chain.

- [ ] **Step 3: Run guardrail**

```bash
pnpm lint:fonts
```
Verify the rule passes with zero remaining `font-family` usage outside `src/styles`.

### Task 8: Final Verification & Commit

**Files/Commands:** Entire repo

- [ ] **Step 1: Full lint**

```bash
pnpm lint
```

- [ ] **Step 2: Run targeted tests**

```bash
pnpm test
```
Ensure shared component tests updated earlier pass.

- [ ] **Step 3: Visual regression check**

In dev server, click through `/`, `/standings`, `/matchups`, `/managers`, `/draft`, `/transactions`, `/achievements`, `/history`, `/playoffs` to confirm typography is consistent and pixel flourishes appear only where intended.

- [ ] **Step 4: Commit**

```bash
git add src/docs/styles/**/*.css src/features/**/**/*.css src/features/**/**/*.tsx docs/design-system.md stylelint.config.cjs package.json pnpm-lock.yaml
git commit -m "refactor: centralize typography utilities"
```
Include updated lockfile if lint dependencies changed.
