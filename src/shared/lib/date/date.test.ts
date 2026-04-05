import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatDate, formatTimeAgo } from './date'

describe('formatDate', () => {
  it('formats a timestamp to a readable date', () => {
    const ts = new Date('2024-01-15T12:00:00Z').getTime()
    const result = formatDate(ts)
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })
})

describe('formatTimeAgo', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns seconds ago for very recent timestamps', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-09-01T12:00:30.000Z'))
    const ts = new Date('2024-09-01T12:00:00.000Z').getTime()
    expect(formatTimeAgo(ts)).toContain('30 seconds ago')
  })

  it('returns minutes ago', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-09-01T12:05:00.000Z'))
    const ts = new Date('2024-09-01T12:00:00.000Z').getTime()
    expect(formatTimeAgo(ts)).toContain('5 minutes ago')
  })

  it('returns hours ago', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-09-01T15:00:00.000Z'))
    const ts = new Date('2024-09-01T12:00:00.000Z').getTime()
    expect(formatTimeAgo(ts)).toContain('3 hours ago')
  })

  it('returns days ago', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-09-03T12:00:00.000Z'))
    const ts = new Date('2024-09-01T12:00:00.000Z').getTime()
    expect(formatTimeAgo(ts)).toContain('2 days ago')
  })
})
