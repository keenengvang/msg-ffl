import { clamp } from '@/shared/lib/format/format'
import styles from './StatBar.module.css'

interface Props {
  value: number
  min: number
  max: number
  color?: string
  label?: string
  showValue?: boolean
}

export function StatBar({ value, min, max, color, label, showValue = true }: Props) {
  const pct = max > min ? clamp((value - min) / (max - min), 0, 1) * 100 : 0

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: color ?? 'var(--color-accent-cyan)' }} />
      </div>
      {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
    </div>
  )
}
