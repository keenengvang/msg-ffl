# RetroUI Theme Adoption — Design (2026-04-06)

## Summary
We are replacing the existing pastel/pixel tokens and handcrafted CTAs with RetroUI’s yellow/black palette, typography, halftone background, and motion language. The change flows through global CSS custom properties and refreshed shared components so every feature inherits the new aesthetic automatically. No legacy styling needs to be preserved.

## Goals
- Global token swap covering colors, typography, backgrounds, and animation timing so features only reference semantic vars.
- Canonical shared primitives (Button, PixelCard, PixelBadge, Ticker, LoadingScreen, ErrorState, AvatarPixel) consuming the new tokens and exposing predictable props.
- Feature sweep removing bespoke CTA styles/tables in favor of the shared primitives + typography helpers.
- Documentation of the new theme for future contributors.

## Non-Goals
- Introducing runtime theme switching or dark mode (structure tokens for future overrides but no toggle now).
- Redesigning feature layouts, content hierarchy, or navigation.
- Building new business functionality beyond the visual refresh.

## Global Tokens & Typography
- Overwrite `src/styles/tokens.css` to define RetroUI palette:
  - `--color-bg-primary|secondary|card` → `#ffffff` family, add hover tint `#fff7c7`.
  - Text tokens: `--color-text-primary: #000000`, `--color-text-secondary: #1a1a1a`, `--color-text-muted: #4f4f4f`.
  - Accent ladder: `--color-accent: #fae583`, `--color-accent-strong: #ffdb33`, `--color-accent-dark: #c59400`.
  - Borders all black (`--color-border: #000`), add `--color-border-muted: #1a1a1a33` for subtle dividers.
  - `--color-muted` / `--color-muted-strong` for zebra/table fills.
  - Retain spacing scale values but rename to `--retro-space-1` … `--retro-space-16` and update shared components to reference them.
  - Add Retro shadow ladder custom properties (`--shadow-retro-xs` through `--shadow-retro-2xl`) based on 1/2/3/4/6/10/16px offsets plus blur for the 2xl soft drop.
  - Animation timing vars `--retro-transition-fast` (90ms cubic-bezier(0.2, 0.8, 0.2, 1)) and `--retro-transition-base` (160ms) reused everywhere.
- Fonts: import Archivo Black 400, Space Grotesk 400/500/600, Space Mono 400 from Google Fonts. Define `--font-display`, `--font-body`, `--font-mono` tokens.
- `src/styles/globals.css` updates:
  - Body background: combine `retro-grid.svg` halftone asset, subtle noise gradient, and radial warm spots. `body::before` handles halftone, `body::after` handles noise.
  - Scrollbars, form controls inherit new palette; anchors get underline-on-hover with accent color.
  - Add typography utility classes `.retro-display`, `.retro-head`, `.retro-body`, `.retro-label`, `.retro-mono`, `.retro-tagline`, `.retro-focus` to reduce per-page CSS. Utilities enforce uppercase, letter spacing, clamp-based sizes.
  - Provide `.retro-surface` and `.retro-surface-clickable` helpers for simple outlined containers.
  - Respect `prefers-reduced-motion` globally by disabling translate animations but preserving shadow swaps.
- Assets: add `src/styles/patterns/retro-grid.svg` plus optional PNG noise texture under `public/assets/retro-noise.png`. Reference via CSS custom property to keep replacements easy.

## Shared Primitives
All components live under `src/shared/components/` with CSS modules, exporting prop-driven APIs. They import only shared tokens/utilities.

### Button
- File: `src/shared/components/Button/Button.tsx` + `Button.module.css`.
- Props:
  ```ts
  type ButtonProps = {
    variant?: primary | secondary | outline | ghost | link;
    size?: sm | md | lg | icon;
    chromed?: boolean; // toggles filled accent background even for outline variants
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
  } & ButtonHTMLAttributes<HTMLButtonElement>;
  ```
- Behavior: base style uses 2px solid black border, `box-shadow: var(--shadow-retro-md)`, Space Mono uppercase text. Hover lifts (`transform: translate(-2px, -2px)`, larger shadow). Active presses down (`translate(0,0)` with `var(--shadow-retro-sm)`). Loading swaps content with inline pixel spinner SVG while preserving width/height. Link variant removes border, uses accent underline + arrow icon, but keeps focus outline.

### PixelCard
- Props: `{variant?: default | elevated | warning | success | danger; clickable?: boolean; header?: ReactNode; footer?: ReactNode;}`.
- Style: double outline (outer solid, inner dashed pseudo-element). Background defaults to `--color-bg-card`; variants tint via accent/danger tokens. Optional halftone overlay for `elevated`. Clickable cards get Button-like hover physics and focus outline.

### PixelBadge
- Props: `{intent?: primary | secondary | muted | accent | destructive; tone?: solid | outline; icon?: ReactNode;}`.
- All uppercase with letter spacing 0.08em, padding from spacing tokens, 1px inset border. Outline tone uses transparent fill + dashed border, solid uses accent background.

### Ticker
- Accepts `items: string[]`, `speed?: slow | base | fast`, `paused?: boolean`. Renders marquee with gradient background and bold uppercase text. Respects `prefers-reduced-motion` by pausing animation automatically.

### LoadingScreen
- Full-screen flex column, halftone/noise background, central spinner (shared with Button) plus optional message + sublabel. Provide prop for `compact` variant when embedded within cards.

### ErrorState
- Composed of header bar (black background, accent text), body PixelCard using warning variant, CTA stack using Button. Props for `title`, `description`, `actions`, `details?: string[]`.

### AvatarPixel
- Keeps existing pixel art but wraps in square frame with outline, drop shadow, optional badge chip for statuses/intents.

## Feature Adoption & Sweeps
- Replace all bespoke CTA/button classes with the new shared Button. `rg` search for `.cta`, `.pixelButton`, `.buttonPrimary`, and any `<button>` referencing old color tokens.
- Update `PixelCard` usage in features to rely on the new variant prop; remove per-page card CSS (except layout spacing). Adjust page CSS modules to import typography utilities rather than raw font declarations.
- Tables (standings, matchups, draft) use shared helpers:
  - Base table styles moved to `src/shared/components/Table` utilities (border-2 black, header background accent strong, zebra rows using `--color-muted`).
  - Use `.retro-label` for headers, `.retro-mono` for numeric cells.
- Home dashboard ticker, managers page badges, matchups loading/error states migrate to the refreshed shared primitives. Remove duplicated loaders.
- Ensure anchor/link components use `.retro-focus` and accent hover states.

## Assets & Config
- Fonts imported in `globals.css` via consolidated Google Fonts URL. Evaluate if `vite.config.ts` needs preload hints; add `<link rel="preconnect">` and `<link rel="preload">` in `index.html` if necessary.
- Add `public/assets/retro-grid.svg` (or under `src/styles/patterns/`) and `public/assets/retro-noise.png`. Update build to copy if needed (Vite static import from `src/styles/patterns` via `url(./patterns/retro-grid.svg)`).
- Extend `.gitignore` to include the cloned RetroUI reference repo under `Downloads/RetroUI-main` if we keep it locally for assets.
- Document the theme under `docs/design-system.md` (create if missing) describing tokens, button API, component variants, typography utilities, and usage guidelines.

## Theme Switcher & Palette Refresh (2026-04-15)
- Introduce a multi-palette theme system using `[data-theme]` attributes on `<body>` with semantic CSS tokens overridden per theme.
- Themes:
  1. **Electric Candy** (default) – deep indigo-to-cobalt background, bright blue/magenta/yellow highlights, off-white cards, charcoal text.
  2. **Bubblegum Terminal** – lilac-to-sky gradient, bubblegum pink accents, mint success, softer card tones.
  3. **Cosmic Cabinet** – cosmic navy/purple background, aqua/pink highlights, darker cards with light text.
- Move the halftone grid overlay from the full-page background to dedicated hero/illustration containers so the core UI stays clean.
- Add `useTheme` hook + `ThemeProvider` to sync the selected theme to `localStorage` and set `data-theme` on `<body>`.
- Add a `ThemeSwitcher` control in the TopBar: button opens a dropdown listing the three themes with swatches. Selecting a theme applies it instantly and persists the choice.
- Ensure all shared components and feature CSS rely exclusively on the semantic tokens so color changes propagate automatically across palettes.

## Testing & QA
- Automated: update/add tests for Button (variant snapshots or RTL interactions) and PixelCard/Bade mapping. Prefer Vitest + Storybook or screenshot tests.
- Manual QA checklist: home dashboard, standings, matchups, managers pages on desktop/tablet/mobile verifying backgrounds, cards, buttons, tables, ticker, loading, and error states. Confirm focus outlines visible and accessible.
- Accessibility: ensure 3:1 contrast for accent backgrounds vs text; fallback to black text on yellow surfaces if necessary. Verify `prefers-reduced-motion` disables marquee and hover translations.

## Risks & Mitigations
- **Large blast radius**: work in dedicated branch/worktree, commit frequently. Run `pnpm lint` + `pnpm test` before PR.
- **Asset licensing**: confirm RetroUI assets permit reuse; host locally to avoid hotlinking.
- **Font performance**: consider preloading fonts; ensure FOIT minimized via `display=swap`.

## Timeline & Next Steps
1. Implement global token + typography overhaul.
2. Build shared primitives and update imports.
3. Sweep features replacing bespoke styles.
4. Update docs/tests, run lint/test suites.
5. Manual QA + polish pass.
