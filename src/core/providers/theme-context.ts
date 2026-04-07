import { createContext } from 'react'

export type ThemeKey = 'electric' | 'bubblegum' | 'cosmic'

export type ThemeContextValue = {
  theme: ThemeKey
  setTheme: (theme: ThemeKey) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
