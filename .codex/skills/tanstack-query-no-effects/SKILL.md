---
name: tanstack-query-no-effects
description: Prefer TanStack Query and explicit state flows instead of effect-driven data fetching.
---

Rules:
- server state belongs in query hooks
- mutations belong in mutation hooks
- do not fetch on mount with useEffect
- do not sync derived state with useEffect
- use useEffect only for imperative bridges, subscriptions, and unavoidable external synchronization
- keep page components thin and move TanStack Query usage into hooks instead of page files
- update `src/test/mocks` when changed data flows alter API contracts
- avoid magic numbers in query options (timeouts, stale/gc times); use the shared time helpers or named constants in hooks
