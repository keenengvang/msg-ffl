const POINT_DECIMALS = 2
const PERCENT_SCALE = 100
const PERCENT_DECIMALS = 1
const MINIMUM_STD_DEV_SAMPLE_SIZE = 2
const ORDINAL_SUFFIXES = ['th', 'st', 'nd', 'rd'] as const
const ORDINAL_DIGIT_BASE = 10
const ORDINAL_ROUNDING_WINDOW = 100

export function formatPoints(pts: number): string {
  return pts.toFixed(POINT_DECIMALS)
}

export function formatRecord(wins: number, losses: number, ties = 0): string {
  return ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`
}

export function formatWinPct(percentage: number): string {
  return (percentage * PERCENT_SCALE).toFixed(PERCENT_DECIMALS) + '%'
}

export function formatFAAB(amount: number): string {
  return `$${amount}`
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export function stdDev(values: number[]): number {
  if (values.length < MINIMUM_STD_DEV_SAMPLE_SIZE) return 0
  const mean = values.reduce((sum, current) => sum + current, 0) / values.length
  const variance = values.reduce((sum, current) => sum + (current - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

export function formatOrdinal(position: number): string {
  const remainderHundred = Math.abs(position) % ORDINAL_ROUNDING_WINDOW
  const remainderTen = remainderHundred % ORDINAL_DIGIT_BASE

  const suffix =
    remainderHundred >= 11 && remainderHundred <= 13
      ? ORDINAL_SUFFIXES[0]
      : remainderTen >= 1 && remainderTen <= 3
        ? ORDINAL_SUFFIXES[remainderTen]
        : ORDINAL_SUFFIXES[0]

  return `${position}${suffix}`
}
