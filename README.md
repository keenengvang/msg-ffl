# 🏈 MSG Fantasy Football League

Welcome to the MSG Fantasy Football palace where our league drama lives! This repo powers the MSG FFL dashboard: standings, matchups, playoff brackets, achievements, history—the whole soap opera. Pull up a chair, mash the 🔄 button, and bask in the glory (or shame) of your roster.

---

## 🎯 Mission & Architecture

| Area | Ownership | Notes |
| --- | --- | --- |
| `src/core` | App wiring only | Router, providers, config. Absolutely **zero** business logic. |
| `src/features/<feature>/` | Feature-owned UI/logic | Subfolders: `pages`, `components`, `api`, `hooks`, `store`, `types`, `utils`. |
| `src/shared` | Cross-feature primitives | Components, hooks, types, utils, config, constants. |
| `src/test` | Test infra & MSW mocks | Keep fixtures updated whenever data contracts change. |

### 🚫 Hard Rules
- **No cross-feature imports.** Ever. Promote to `src/shared` if it truly serves multiple features.
- **No barrel files.** Import from concrete paths only (use the `@` alias for non-colocated files).
- **No magic numbers.** Use the helpers in `src/shared/utils/time/` or name constants that explain themselves.
- **Route definitions live in `src/core/router/router.tsx`.** Pages just render.
- **Parent/page components own layout & spacing.** Children only handle their internal styling.
- **`useEffect` is last resort** (subscriptions, timers, external bridges). Derived data belongs in `useMemo`/query selectors.

---

## 🧱 Folder Cheat Sheet

```
src/
  core/        # router, providers, config
  features/
    standings/
      pages/StandingsPage/...
      components/...
    playoffs/
      pages/PlayoffsPage/...
      components/BracketMatch/...
    ... other features ...
  shared/
    components/PixelCard, Ticker, etc.
    hooks/use-manager-profiles.ts, use-matchups.ts (season aggregators!)
    utils/format/, utils/time/, utils/stats/
  test/
    mocks/{fixtures,handlers,server}.ts
    utils/render.tsx
```

---

## ⚙️ Scripts

| Script | Command | What it does |
| --- | --- | --- |
| Start dev server | `pnpm dev` | Vite dev mode. |
| Type-check + build | `pnpm build` | Runs `tsc` then Vite build. |
| Unit tests | `pnpm test` | Vitest (jsdom) suite. Node 22 recommended. |
| Coverage | `pnpm test:coverage` | Vitest + v8 coverage. |
| Lint | `pnpm lint` | ESLint with zero-warning policy (use Node ≥20.5 for `util.styleText`). |
| Playwright e2e | `pnpm test:e2e` | Requires running dev server + MSW mocks. |

---

## 📡 Data Fetching Philosophy

- All server state lives in TanStack query hooks under `src/shared/hooks/`.
- Season-spanning hooks (`useAllMatchups`, `useAllTransactions`) aggregate data into a single query + derived helpers, so pages don’t juggle dozens of loading states.
- `fetchJson` in `src/core/api/fetch-client.ts` adds timeouts & consistent error handling—never hand-roll `fetch`.
- Whenever API data changes, sync the MSW handlers in `src/test/mocks/handlers.ts` and fixtures in `fixtures.ts`.

---

## 🧪 Testing Highlights

- `src/shared/utils/stats/stats-engine.test.ts` protects the stats brain.
- Integration tests for the heavy pages (`features/*/pages/*/*.integration.test.tsx`) render through the shared `render` utility.
- Playwright specs (`e2e/*.spec.ts`) keep nav flows honest.

---

## 🧑‍🎨 Styling

- CSS Modules everywhere (`*.module.css`).
- Parents own layout; children never push outer margins/padding.
- Use tokens in `src/styles/tokens.css` (or add new variables with names that explain themselves). No magic pixel values.

---

## 🧙‍♂️ Tips for League Members

- Want your avatar on the champ card? Win the bracket (duh) and your mug shows up via `AvatarPixel`.
- The 🎖️ Achievements page auto-computes using transactions + matchups. Make moves, talk trash, earn badges.
- History page pulls previous seasons by chasing `previous_league_id` down the Sleeper rabbit hole—feel free to reminisce.
- Playoffs page maps real-week points to bracket rounds, so yes, that toilet bowl loss is immortalized.

---

## 🛎️ Contributing

1. Branch from `master`.
2. Follow the feature-owned structure; create new pages under `src/features/<feature>/pages/<PageName>/`.
3. Name everything explicitly (`PascalCase.tsx`, `use-something.ts`, etc.).
4. Run `pnpm lint` + `pnpm test` + `pnpm test:e2e` (when relevant) before pushing.
5. Update docs when you introduce new rules. The AGENTS will haunt you otherwise.

---

## 💬 Final Word

This repo is our league’s living highlight reel. Keep it tidy, keep it fast, keep it pixel-perfect—and absolutely keep the memes coming. 🏆🤖🎮

Happy hacking players! ✌️
