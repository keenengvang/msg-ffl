# AGENTS.md

## Mission
Build and refactor this React app using explicit, maintainable, feature-owned architecture.
Favor boring clarity over clever abstractions.

## Architecture
- This repo uses feature-owned architecture.
- All business logic lives under `src/features` unless it is genuinely shared across features.
- All app wiring lives under `src/core`.
- All shared cross-feature primitives live under `src/shared`.
- Test infrastructure belongs in `src/test`.
- Do not create top-level business folders under `src` such as `pages`, `components`, `hooks`, or `utils` outside the approved structure.

## Target repo shape
Use this structure for new work and for refactors that already touch the area. Do not churn untouched files just to satisfy the diagram.

```text
src/
  core/
    app/
    router/
    providers/
    config/
    utils/
    styles/
  features/
    <feature>/
      pages/
        <PageName>/
          <PageName>.tsx
          <PageName>.module.css
      components/
      api/
      hooks/
      store/
      types/
      utils/
  shared/
    components/
    hooks/
    utils/
    types/
    constants/
```

## Core folder rules
- `src/core` holds app bootstrap, routers, providers, app-level config, global styles, and framework-level utilities.
- `src/core` must not become a dumping ground for business logic.
- Keep `src/core` focused on application wiring and framework concerns.
- Keep env-driven values in Vite envs or `src/core/config`, not scattered through feature code.
- Keep route registration centralized in `src/core/router/`. Feature folders own page implementations, not router setup.

## Feature boundaries
- Each feature owns its own implementation surface:
  - `pages`
  - `components`
  - `api`
  - `hooks`
  - `store`
  - `types`
  - `utils`
- Route-facing page code belongs in `src/features/<feature>/pages/<PageName>/`.
- Feature-specific UI that is not a route belongs in `src/features/<feature>/components/`.
- No cross-feature imports.
- A feature may import only from:
  - itself
  - `src/shared`
  - `src/core` only for stable app-level contracts when absolutely necessary
- If something is reused across features, promote it to `src/shared`.
- Keep feature-private code private. Do not promote things to `src/shared` just because it feels neat.

## Page rules
- Each page gets its own folder under `pages/<PageName>/`.
- Each page folder should contain:
  - `<PageName>.tsx`
  - `<PageName>.module.css`
- Route definitions stay centralized under `src/core/router/`.
- Page folders should not contain route registration files.
- The page component should be thin and composition-focused.
- Parent and page components own layout, placement, spacing, grid, stack, width, and section structure.
- Child components must not own outer margin, page spacing, or page placement.
- Child components own only internal presentation.

## Component rules
- Feature components live under `src/features/<feature>/components/`.
- Shared cross-feature components live under `src/shared/components/`.
- Never define a component inside another component.
- Keep components top-level and stable.

## Import rules
- Always use the `@` alias rooted at `/src` for non-colocated app imports.
- Relative imports are allowed only for colocated siblings such as CSS modules, local tests, and same-folder feature-private files.
- Never use non-`@` absolute imports.
- Never use barrel files.
- Always import from descriptive concrete file paths.

## Data and API rules
- Keep raw HTTP access in feature or shared API files.
- Prefer one file per endpoint or operation, for example `get-standings.ts` or `post-login.ts`.
- Reuse `fetchJson` from `src/core/api/fetch-client.ts` instead of open-coding `fetch`.
- Keep TanStack Query wiring in hooks, not in page components.
- Prefer TanStack Query, derived state, event handlers, controlled props, and explicit state transitions before considering `useEffect`.
- When changing API contracts or data plumbing, update MSW fixtures and handlers in `src/test/mocks/` in the same change.

## React rules
- Do not use `useEffect` unless it is a last resort.
- Valid `useEffect` cases are limited to:
  - subscriptions
  - event listeners
  - timers with cleanup
  - external imperative browser or library integrations
  - unavoidable synchronization with systems outside React
- Do not introduce new abstractions unless they remove clear duplication or clarify ownership.

## Styling rules
- Use `*.module.css` only for component and page styles.
- Global CSS belongs only in `src/styles` today. If `src/core/styles` is introduced later, move the rule with the codebase rather than lying in this file.
- Reuse existing tokens, globals, and animation primitives before adding new styling patterns.
- Prefer semantic class names tied to structure and responsibility.

## Naming rules
- Components: `PascalCase.tsx`
- Hooks: `use-thing.ts`
- API files: `verb-resource.ts`
- Store files: `thing.store.ts`
- Types: `thing.types.ts`
- Page component files: `PageName.tsx`
- Styles: `SameName.module.css`
- Never create `index.ts`

## Magic number rules
- No unexplained numeric literals in production code or tests. Use named constants, env config, or helpers (e.g., the time utilities under `src/shared/utils/time/`) so future readers know what each value represents.
- When a number represents a business rule or UX threshold, document it alongside the constant.

## Refactor rules
- When refactoring an existing codebase, preserve behavior unless explicitly told otherwise.
- Prefer small, reversible refactors.
- When touching a legacy flat feature folder, move it toward the target `pages/` and `components/` structure if the change naturally justifies it.
- First fix architecture boundaries and imports.
- Then move files into correct ownership.
- Then simplify component structure.
- Do not rewrite an entire feature tree unless the task actually requires it.

## Bulletproof React guidance
- Follow Bulletproof React principles pragmatically, not dogmatically.
- Favor explicit boundaries, consistency, and maintainability.
- Do not copy patterns blindly if they conflict with this repo’s rules.

## Verification
- Run `pnpm lint` before finalizing.
- Run `pnpm test` when Node 22 is active. The current Vitest stack fails on older Node in this repo.
- Prefer integration tests for route-level behavior and focused unit tests for pure utilities and presentational components.

## Review checklist
Before finalizing:
- no barrel files
- no non-colocated relative imports
- no cross-feature imports
- no nested component definitions
- no unnecessary `useEffect`
- no child-owned outer spacing
- no business logic in `src/core`
- no shared code that should remain feature-local
- mocks updated when data contracts change
- touched feature folders moved closer to `pages/` and `components/` when reasonable
