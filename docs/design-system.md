# Theme System & Design Language

## Tokens & Typography
- **Multi-theme colors** — `src/styles/tokens.css` now exposes three Cyan-inspired palettes:  
  - `electric` (default “Electric Candy”) — icy lavender backgrounds with royal blue + hot pink accents.  
  - `bubblegum` (“Bubblegum Terminal”) — lilac + cotton-candy gradients with teal/mint highlights.  
  - `cosmic` (“Cosmic Cabinet”) — deep violet backgrounds with aqua + neon pink highlights.  
  `ThemeProvider` applies the palette via `body[data-theme]`, so always reference semantic tokens such as `--color-bg-primary`, `--color-accent`, and `--color-text-primary` instead of hard-coded hex values.
- **Spacing** — spacing variables follow the `--retro-space-*` scale (4px → 64px). Components should reference the nearest semantic token (`var(--retro-space-4)`) instead of literal pixel values.
- **Shadows** — the `--shadow-retro-*` ladder (xs→2xl) controls offsets and blur. Hover/active physics rely on swapping `--shadow-retro-md` → `--shadow-retro-lg`/`--shadow-retro-sm`.
- **Typography** — only two stacks exist now:
  - **Archivo (`--font-display`)** — Archivo Black + SemiBold power “hero” treatments via `.display-heading` and `.section-heading`.
  - **Space Grotesk (`--font-body`)** — paragraphs + stats via `.body-copy`, `.stat-label`, `.stat-heading`, `.stat-value`, `.eyebrow`, and the new `.tagline` helper for italic microcopy.
  `.focus-ring` replaces the legacy `retro-focus` outline, and Space Mono is banned — lint blocks literal `Space Mono`, `Archivo`, or `Space Grotesk` usage outside the approved tokens.
- **Tables** — assign `.retro-table` to `<table>` nodes to get shared zebra striping, outline borders, and caption styling. Pair with `retro-label` headings and avoid bespoke table CSS unless layout requires it.
- **Hero halftone overlays** — apply the `.heroBackdrop` utility (imported via CSS Modules `composes: heroBackdrop from global;`) only on media-forward surfaces like hero cards or featured art. The global body background stays gradient-only to avoid washing out entire pages.

## Theme Switcher
- `ThemeProvider` + `useTheme` (under `src/core/providers/theme-provider.tsx` and `src/shared/hooks/use-theme.ts`) own the persisted theme key. It defaults to `electric`, syncs to `localStorage`, and writes `data-theme` on `<body>`.
- `ThemeSwitcher` (`src/core/components/ThemeSwitcher`) renders the palette dropdown that lives inside the top bar. Components must never read/write `localStorage` directly; instead they call `useTheme` if they need to display the current theme selection.

## Shared Primitives
All primitives live under `src/shared/components/` and already consume the Retro tokens + theme palettes.

### Button
`src/shared/components/Button/Button.tsx`
```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  chromed?: boolean
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  as?: 'button' | 'link'
} & (ButtonHTMLAttributes<HTMLButtonElement> | LinkProps)
```
- Hover lifts (`translate(-4px, -4px)`) while active snaps to neutral with reduced shadow.
- `loading` swaps label content for the pixel spinner and disables interaction.
- Use `as="link"` to render a `<Link>` that still inherits hover physics/focus outlines.

### PixelCard & PixelBadge
- **PixelCard** supports `variant="default" | "elevated" | "warning" | "success" | "danger"` plus optional `header`, `footer`, and legacy variant mapping (`highlight`, `win`, `loss`). Clickable cards get keyboard handling + focus ring out of the box.
- **PixelBadge** replaces bespoke pills. Pick from `intent="primary" | "secondary" | "muted" | "accent" | "destructive"` and `tone="solid" | "outline"`, optionally passing `icon`.

### Status/Feedback
- **Ticker** (`src/shared/components/Ticker`) accepts `items`, `speed`, `paused`, `label`. The marquee pauses automatically on hover or `prefers-reduced-motion`.
- **LoadingScreen** provides the halftone spinner with optional `subtext` and `fullScreen`. Background bursts are derived from the current theme’s `--color-accent` values, so it auto-harmonizes across palettes.
- **ErrorState** renders a double-outline PixelCard with customizable `title`, `description/message`, `details[]`, and `actions[]`. Fallbacks generate a “Try Again” button when `onRetry` is supplied. Buttons automatically inherit the current palette.

### Utilities
- The Avatar frame, StatBar, and other shared surfaces now respect the Retro outline/shadow tokens. Reuse them instead of redefining borders/shadows inside features.

## Feature Adoption Checklist
Whenever building or refreshing UI:
1. **Use shared Buttons** for all CTAs, filters, pagination, and nav chips. No custom `<button>` styling.
2. **Leverage `PixelCard` variants** and the `.retro-table` helper to avoid per-page border logic. Keep layout spacing in the page CSS, not the child components.
3. **Prefer typography utilities** (`.body-copy`, `.stat-label`, etc.) over per-file font declarations.
4. **Badge/status chips** should be `PixelBadge` instances rather than ad-hoc spans.
5. **Focus management** — rely on `retro-focus` or the built-in component outlines; do not remove outlines for aesthetic reasons.
6. **Background discipline** — scanlines/halftones only appear via `.heroBackdrop` or shared primitives (LoadingScreen/ErrorState). Do not reintroduce body-wide overlays.

Following these rules keeps every feature aligned with the RetroUI system and dramatically reduces bespoke CSS drift.
