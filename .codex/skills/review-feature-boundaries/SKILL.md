---
name: review-feature-boundaries
description: Review code for feature boundaries, import hygiene, React architecture, and layout ownership.
---

Check for:
- cross-feature imports
- barrel files
- non-colocated relative imports
- nested component declarations
- useEffect misuse
- child-owned spacing or placement
- business logic leaking into `src/core`
- route registration leaking into feature folders instead of staying in `src/core/router/`
- feature-local code that was moved to shared too early
- duplicated shared code that has earned promotion
- unexplained magic numbers that should be named constants, env config, or shared helpers
