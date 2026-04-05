import { describe, it, expect } from 'vitest'
import { formatPoints, formatRecord, formatWinPct, formatFAAB, clamp, stdDev, formatOrdinal } from './format'

describe('formatPoints', () => {
  it('formats to two decimal places', () => {
    expect(formatPoints(123.456)).toBe('123.46')
  })

  it('pads with trailing zeros', () => {
    expect(formatPoints(100)).toBe('100.00')
  })

  it('handles zero', () => {
    expect(formatPoints(0)).toBe('0.00')
  })
})

describe('formatRecord', () => {
  it('formats wins-losses', () => {
    expect(formatRecord(10, 4)).toBe('10-4')
  })

  it('includes ties when non-zero', () => {
    expect(formatRecord(8, 5, 1)).toBe('8-5-1')
  })

  it('omits ties when zero', () => {
    expect(formatRecord(8, 5, 0)).toBe('8-5')
  })
})

describe('formatWinPct', () => {
  it('formats percentage with one decimal', () => {
    expect(formatWinPct(0.75)).toBe('75.0%')
  })

  it('handles perfect record', () => {
    expect(formatWinPct(1)).toBe('100.0%')
  })

  it('handles winless record', () => {
    expect(formatWinPct(0)).toBe('0.0%')
  })
})

describe('formatFAAB', () => {
  it('prepends dollar sign', () => {
    expect(formatFAAB(25)).toBe('$25')
  })

  it('handles zero', () => {
    expect(formatFAAB(0)).toBe('$0')
  })
})

describe('clamp', () => {
  it('returns value when within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps to min when below', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
  })

  it('clamps to max when above', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('handles value equal to bounds', () => {
    expect(clamp(0, 0, 10)).toBe(0)
    expect(clamp(10, 0, 10)).toBe(10)
  })
})

describe('stdDev', () => {
  it('returns 0 for single value', () => {
    expect(stdDev([5])).toBe(0)
  })

  it('returns 0 for empty array', () => {
    expect(stdDev([])).toBe(0)
  })

  it('returns 0 for identical values', () => {
    expect(stdDev([5, 5, 5, 5])).toBe(0)
  })

  it('calculates correctly for known values', () => {
    // Population std dev of [2, 4, 4, 4, 5, 5, 7, 9] = 2.0
    expect(stdDev([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.0, 1)
  })
})

describe('formatOrdinal', () => {
  it('handles first three positions', () => {
    expect(formatOrdinal(1)).toBe('1st')
    expect(formatOrdinal(2)).toBe('2nd')
    expect(formatOrdinal(3)).toBe('3rd')
  })

  it('handles teens and general cases', () => {
    expect(formatOrdinal(4)).toBe('4th')
    expect(formatOrdinal(11)).toBe('11th')
    expect(formatOrdinal(21)).toBe('21st')
    expect(formatOrdinal(42)).toBe('42nd')
  })
})
