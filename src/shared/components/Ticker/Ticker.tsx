import clsx from 'clsx'
import styles from './Ticker.module.css'

type TickerSpeed = 'slow' | 'base' | 'fast'

type Props = {
  items: string[]
  speed?: TickerSpeed
  paused?: boolean
  label?: string
}

const SPEED_CLASS: Record<TickerSpeed, string> = {
  slow: styles.speedSlow,
  base: styles.speedBase,
  fast: styles.speedFast,
}

export function Ticker({ items, speed = 'base', paused = false, label = '📡 LIVE' }: Props) {
  if (items.length === 0) return null
  const repeated = [...items, ...items]

  return (
    <div className={styles.wrapper} data-paused={paused}>
      <span className={styles.label} aria-live="polite">
        {label}
      </span>
      <div className={styles.track}>
        <div className={clsx(styles.inner, SPEED_CLASS[speed], paused && styles.isPaused)} aria-live="off">
          {repeated.map((item, index) => (
            <span key={`${item}-${index}`} className={styles.item} data-role="ticker-item">
              {item}
              <span className={styles.sep} aria-hidden="true">
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
