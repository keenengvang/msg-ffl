import { renderHook, act } from '@testing-library/react'
import { beforeEach, afterAll, vi } from 'vitest'
import { ThemeProvider } from '@/core/providers/theme-provider'
import { useTheme } from './use-theme'

const setAttributeSpy = vi.spyOn(document.body, 'setAttribute')
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

beforeEach(() => {
  setAttributeSpy.mockClear()
  getItemSpy.mockClear()
  setItemSpy.mockClear()
  getItemSpy.mockReturnValue(null)
  window.localStorage.clear()
})

afterAll(() => {
  vi.restoreAllMocks()
})

describe('useTheme', () => {
  it('returns default electric theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    expect(result.current.theme).toBe('electric')
  })

  it('updates theme and persists changes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })

    act(() => {
      result.current.setTheme('bubblegum')
    })

    expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'bubblegum')
    expect(setItemSpy).toHaveBeenCalledWith('msg-ffl-theme', 'bubblegum')
    expect(result.current.theme).toBe('bubblegum')
  })
})
