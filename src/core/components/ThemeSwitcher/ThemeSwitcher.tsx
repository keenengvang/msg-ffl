import { useEffect, useRef, useState } from 'react'
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
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        Theme
      </button>
      {open ? (
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
      ) : null}
    </div>
  )
}
