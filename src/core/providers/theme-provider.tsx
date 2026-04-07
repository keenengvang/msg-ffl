import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ThemeContext, type ThemeKey } from './theme-context'

const THEME_STORAGE_KEY = 'msg-ffl-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
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
