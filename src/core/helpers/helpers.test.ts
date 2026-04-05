import { describe, it, expect } from 'vitest'
import { formatOrdinal } from './helpers'

describe('formatOrdinal', () => {
  it('handles 1st, 2nd, 3rd', () => {
    expect(formatOrdinal(1)).toBe('1st')
    expect(formatOrdinal(2)).toBe('2nd')
    expect(formatOrdinal(3)).toBe('3rd')
  })

  it('handles 4th through 10th', () => {
    expect(formatOrdinal(4)).toBe('4th')
    expect(formatOrdinal(10)).toBe('10th')
  })

  it('handles teens (11th, 12th, 13th)', () => {
    expect(formatOrdinal(11)).toBe('11th')
    expect(formatOrdinal(12)).toBe('12th')
    expect(formatOrdinal(13)).toBe('13th')
  })

  it('handles 21st, 22nd, 23rd', () => {
    expect(formatOrdinal(21)).toBe('21st')
    expect(formatOrdinal(22)).toBe('22nd')
    expect(formatOrdinal(23)).toBe('23rd')
  })
})
