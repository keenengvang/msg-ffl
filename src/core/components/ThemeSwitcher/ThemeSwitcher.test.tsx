import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import type { ThemeKey } from '@/core/providers/theme-context'
import { ThemeContext } from '@/core/providers/theme-context'
import { ThemeSwitcher } from './ThemeSwitcher'

const renderWithTheme = (theme: ThemeKey = 'electric', setTheme = vi.fn()) =>
  render(
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeSwitcher />
    </ThemeContext.Provider>,
  )

describe('ThemeSwitcher', () => {
  it('opens dropdown on click and selects theme', () => {
    const setTheme = vi.fn()
    renderWithTheme('electric', setTheme)

    fireEvent.click(screen.getByRole('button', { name: /palette/i }))
    const option = screen.getByRole('option', { name: /Bubblegum Terminal/i })
    fireEvent.click(option)

    expect(setTheme).toHaveBeenCalledWith('bubblegum')
  })
})
