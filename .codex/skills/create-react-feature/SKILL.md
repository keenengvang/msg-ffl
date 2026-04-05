---
name: create-react-feature
description: Create a new React feature using this repository's strict feature-owned architecture and boundary rules.
---

When creating a feature:

1. Create it under `src/features/<feature-name>/`.
2. Allowed subfolders:
   - `pages`
   - `components`
   - `api`
   - `hooks`
   - `store`
   - `types`
   - `utils`
3. Do not create barrel files.
4. Use `@` imports for non-colocated app imports.
5. Relative imports are allowed only for colocated siblings such as CSS modules and same-folder feature-private files.
6. Do not create cross-feature imports.
7. Keep page components thin.
8. Keep page and parent components responsible for layout and spacing.
9. Child components must not control outer spacing.
10. Do not introduce `useEffect` unless there is no simpler alternative.
11. Keep route registration centralized in `src/core/router/`; do not create route registration files inside feature folders.
12. Replace magic numbers with well-named constants or shared helpers (for durations use `src/shared/utils/time/`).

Expected output:
- feature folder tree
- router changes needed in `src/core/router/`
- page component
- child components
- hook and API files when needed
- notes on why code stayed feature-local vs moved to shared
