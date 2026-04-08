import { useEffect, useMemo, useState } from 'react'
import styles from './Countdown.module.css'

export type CountdownProps = {
  targetDate?: Date | string | number
}

const DEFAULT_TARGET = new Date('2026-09-09T00:00:00')

type TimeParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeParts(target: Date): TimeParts {
  const now = new Date()
  const delta = Math.max(target.getTime() - now.getTime(), 0)
  const totalSeconds = Math.floor(delta / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

function pad(value: number, digits = 2) {
  return value.toString().padStart(digits, '0')
}

function useCountdown(targetInput?: Date | string | number) {
  const target = useMemo(() => {
    if (!targetInput) return DEFAULT_TARGET
    return targetInput instanceof Date ? targetInput : new Date(targetInput)
  }, [targetInput])

  const [parts, setParts] = useState(() => getTimeParts(target))

  useEffect(() => {
    const tick = () => setParts(getTimeParts(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return parts
}

export function Countdown({ targetDate }: CountdownProps) {
  const parts = useCountdown(targetDate)

  const units = [
    { label: 'Days', value: pad(parts.days, 3) },
    { label: 'Hours', value: pad(parts.hours) },
    { label: 'Mins', value: pad(parts.minutes) },
    { label: 'Secs', value: pad(parts.seconds) },
  ]

  return (
    <section className={styles.countdown} aria-label="Countdown timer">
      {units.map((unit) => (
        <CountdownUnit key={unit.label} label={unit.label} value={unit.value} />
      ))}
    </section>
  )
}

type UnitProps = {
  label: string
  value: string
}

function CountdownUnit({ label, value }: UnitProps) {
  return (
    <div className={styles.unit}>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
