---
name: css-modules-layout
description: Apply CSS Modules while keeping layout ownership in page and parent components.
---

Rules:
- use `*.module.css`
- keep global CSS in `src/styles`
- parent/page owns outer spacing, layout, placement, width, grid, and stack structure
- child components own only internal styling
- do not add arbitrary outer margins to reusable child components
- prefer semantic class names tied to structure and responsibility
- avoid hard-coded magic numbers; use existing tokens or add well-named CSS variables when new values are unavoidable
