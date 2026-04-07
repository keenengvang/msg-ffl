# Theme Switcher & Palette Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent 3-theme color system with a header switcher, Cyan-inspired palettes, and updated backgrounds.

**Architecture:** Use body `data-theme` attributes that swap shared CSS custom properties. A `ThemeProvider` + `useTheme` hook reads/writes localStorage, applies the attribute, and drives a `ThemeSwitcher` dropdown in the TopBar. Background assets move out of global body overlay and into targeted containers.

**Tech Stack:** React, TypeScript, CSS Modules, Vite, localStorage.

---

### Task 1: Define theme token overrides

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/globals.css`
- Create (optional helper if needed): `src/styles/themes.css`

- [ ] **Step 1: Add Electric Candy palette block**

```css
:root,
[data-theme='electric'] {
  --color-bg-primary: #fdfbff;
  --color-bg-secondary: #cbc9ff;
  --color-bg-card: #ffffff;
  --color-bg-card-hover: #ece9ff;
  --color-bg-sidebar: #201c58;
  --color-text-primary: #120b27;
  --color-text-secondary: #281b45;
  --color-text-muted: #6f5ca0;
  --color-accent: #3c5bff;
  --color-accent-strong: #ff4fbf;
  --color-accent-dark: #ffc857;
  --color-muted: #dfe0ff;
  --color-muted-strong: #b5b7ff;
  --color-border: #120b27;
  --color-border-bright: #6af2ff;
  --color-win: #64f5c4;
  --color-loss: #ff6b8a;
  --color-tie: #ffb347;
  --surface-noise: radial-gradient(circle at 10% 12%, rgba(255, 79, 191, 0.3), transparent 40%),
    radial-gradient(circle at 80% 5%, rgba(58, 92, 255, 0.4), transparent 50%);
}
```

- [ ] **Step 2: Add Bubblegum Terminal block**

```css
[data-theme='bubblegum'] {
  --color-bg-primary: #fffafc;
  --color-bg-secondary: #fcd9ff;
  --color-bg-card: #ffffff;
  --color-bg-card-hover: #ffeef8;
  --color-bg-sidebar: #f4b5ff;
  --color-text-primary: #1b1035;
  --color-text-secondary: #2d1b52;
  --color-text-muted: #675586;
  --color-accent: #ff6fb1;
  --color-accent-strong: #79c5ff;
  --color-accent-dark: #ffd285;
  --color-muted: #f2e3ff;
  --color-muted-strong: #e5d0ff;
  --color-border: #1b1035;
  --color-border-bright: #7ef0c9;
  --color-win: #7ef0c9;
  --color-loss: #ff7f9d;
  --color-tie: #ffcf70;
}
```

- [ ] **Step 3: Add Cosmic Cabinet block**

```css
[data-theme='cosmic'] {
  --color-bg-primary: #281f4f;
  --color-bg-secondary: #1f1d63;
  --color-bg-card: #342c68;
  --color-bg-card-hover: #3f3781;
  --color-bg-sidebar: #0d0826;
  --color-text-primary: #f7f5ff;
  --color-text-secondary: #d1c8ff;
  --color-text-muted: #a9a0d7;
  --color-accent: #9cf6f6;
  --color-accent-strong: #f45fa4;
  --color-accent-dark: #ffd66c;
  --color-muted: #31285b;
  --color-muted-strong: #3c3172;
  --color-border: #090414;
  --color-border-bright: #9cf6f6;
  --color-win: #76ffaa;
  --color-loss: #ff8ea2;
  --color-tie: #ff956c;
}
```

- [ ] **Step 4: Update background layers in `globals.css`**

Replace `body` gradients with a theme-neutral base:
```css
body {
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-sidebar));
  color: var(--color-text-primary);
}
```
Add `.heroBackdrop` utility that reuses the halftone grid/noise and remove `body::before` grid overlay so scanlines are only opt-in.

- [ ] **Step 5: Remove unused halftone overlay from body**

Delete `body::before` halftone definition. Add a new CSS class in `globals.css`:
```css
.heroBackdrop::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--retro-grid-pattern);
  opacity: 0.35;
  mix-blend-mode: screen;
}
```
Use `position: relative` on `.heroBackdrop` to contain the overlay.

- [ ] **Step 6: Update any other hard-coded colors in globals**

Ensure scrollbar, `::selection`, `.retro-surface`, and focus colors reference the new tokens.

### Task 2: Theme state management (provider + hook)

**Files:**
- Create: `src/core/providers/theme-provider.tsx`
- Create: `src/shared/hooks/use-theme.ts`
- Modify: `src/core/app/AppProviders.tsx` (or wherever providers mount)
- Add test: `src/shared/hooks/use-theme.test.tsx`

- [ ] **Step 1: Implement `ThemeProvider`**

```tsx
import { createContext, useEffect, useMemo, useState } from 'react'

type ThemeKey = 'electric' | 'bubblegum' | 'cosmic'
const THEME_STORAGE_KEY = 'msg-ffl-theme'

const ThemeContext = createContext<{ theme: ThemeKey; setTheme: (theme: ThemeKey) => void } | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    if (typeof window === 'undefined') return 'electric'
    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeKey) || 'electric'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
```

- [ ] **Step 2: Hook for consumers**

```ts
import { useContext } from 'react'
import { ThemeContext } from '@/core/providers/theme-provider'

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

- [ ] **Step 3: Wire provider**

Wrap the app in `ThemeProvider` inside `AppProviders.tsx` (ensure ordering so theme attribute is set before other components render).

- [ ] **Step 4: Write hook tests**

Use Vitest + React Testing Library to assert default theme is electric and that `setTheme` updates the body data attribute + localStorage (mock both `document.body` and `localStorage`).

### Task 3: Build ThemeSwitcher UI

**Files:**
- Create: `src/core/components/ThemeSwitcher/ThemeSwitcher.tsx`
- Create: `src/core/components/ThemeSwitcher/ThemeSwitcher.module.css`
- Create test: `src/core/components/ThemeSwitcher/ThemeSwitcher.test.tsx`
- Modify: `src/core/router/TopBar.tsx` and `TopBar.module.css`

- [ ] **Step 1: Implement switcher component**

```tsx
import { useState, useRef } from 'react'
import { useTheme } from '@/shared/hooks/use-theme'
import styles from './ThemeSwitcher.module.css'

const THEMES = [
  { key: 'electric', label: 'Electric Candy', swatch: ['#3c5bff', '#ff4fbf', '#ffc857'] },
  { key: 'bubblegum', label: 'Bubblegum Terminal', swatch: ['#ff6fb1', '#79c5ff', '#ffd285'] },
  { key: 'cosmic', label: 'Cosmic Cabinet', swatch: ['#9cf6f6', '#f45fa4', '#ffd66c'] },
] as const

type ThemeKey = (typeof THEMES)[number]['key']

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // handle outside click + Esc to close

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Palette
      </button>
      {open && (
        <div className={styles.dropdown} role="listbox">
          {THEMES.map(({ key, label, swatch }) => (
            <button
              key={key}
              type="button"
              role="option"
              aria-selected={theme === key}
              className={styles.option}
              onClick={() => {
                setTheme(key as ThemeKey)
                setOpen(false)
              }}
            >
              <span className={styles.swatch}>
                {swatch.map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```
Include keyboard handling (`onKeyDown` for Escape, arrow navigation optional but recommended).

- [ ] **Step 2: Add CSS**

Style `trigger`, `dropdown`, and `option` to match TopBar aesthetics. Ensure dropdown has outline, uses `var(--color-bg-card)`, `var(--shadow-retro-md)`, and swatches show color bands.

- [ ] **Step 3: Insert switcher into TopBar**

Import ThemeSwitcher and place it near existing controls (e.g., right side). Update layout CSS to accommodate the new button.

- [ ] **Step 4: Tests**

Use RTL to ensure clicking trigger opens the list, selecting a theme invokes `setTheme`, and dropdown closes. Mock `useTheme` for isolation.

### Task 4: Limit scanline/halftone usage

**Files:**
- Modify: components that previously relied on body overlay for halftone (e.g., `src/features/home/pages/HomePage/HomePage.module.css`, hero sections). Replace with `.heroBackdrop` class.
- Remove/adjust background references in features that assume yellow palette.

- [ ] **Step 1: Identify sections needing halftone**

Apply `.heroBackdrop` to relevant wrappers (hero cards, quick links). Add `position: relative; overflow: hidden;` so pseudo-element is contained.

- [ ] **Step 2: Replace hard-coded colors**

Search for `#ff` etc. Replace with semantic tokens (`var(--color-accent)` etc.). Ensure tables/buttons rely solely on tokens.

### Task 5: Verification

- [ ] **Step 1: Run lint** — `pnpm lint`
- [ ] **Step 2: Run tests** — `pnpm test`
- [ ] **Step 3: Manual QA** — cycle themes via new switcher, reload to verify persistence, ensure contrast across pages and halftone limited to heroes.

---
