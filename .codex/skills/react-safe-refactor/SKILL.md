---
name: react-safe-refactor
description: Refactor React code without breaking feature boundaries or repository conventions.
---

When refactoring:
- preserve architecture boundaries
- do not introduce barrel files
- do not introduce non-colocated relative imports
- do not create cross-feature imports
- prefer small reversible edits
- keep route registration centralized in `src/core/router/`
- when touching a legacy flat feature folder, move it toward `pages/` and `components/` when the change naturally justifies it
- call out any architecture violations discovered during refactor
- remove or document magic numbers while refactoring; replace raw literals with named constants or shared helpers.
