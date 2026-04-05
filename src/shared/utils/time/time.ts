const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24

export const SECOND_IN_MS = MILLISECONDS_PER_SECOND
export const MINUTE_IN_MS = SECOND_IN_MS * SECONDS_PER_MINUTE
export const HOUR_IN_MS = MINUTE_IN_MS * MINUTES_PER_HOUR
export const DAY_IN_MS = HOUR_IN_MS * HOURS_PER_DAY

export function seconds(count: number): number {
  return count * SECOND_IN_MS
}

export function minutes(count: number): number {
  return count * MINUTE_IN_MS
}

export function hours(count: number): number {
  return count * HOUR_IN_MS
}

export function days(count: number): number {
  return count * DAY_IN_MS
}
