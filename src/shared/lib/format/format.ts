export function formatPoints(pts: number): string {
  return pts.toFixed(2)
}

export function formatRecord(w: number, l: number, t = 0): string {
  return t > 0 ? `${w}-${l}-${t}` : `${w}-${l}`
}

export function formatWinPct(pct: number): string {
  return (pct * 100).toFixed(1) + '%'
}

export function formatFAAB(amount: number): string {
  return `$${amount}`
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}
