import styles from './Ticker.module.css'

interface Props {
  items: string[]
}

export function Ticker({ items }: Props) {
  if (items.length === 0) return null
  const repeated = [...items, ...items] // double for seamless loop

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>📡 LIVE</span>
      <div className={styles.track}>
        <div className={styles.inner}>
          {repeated.map((item, i) => (
            <span key={i} className={styles.item}>
              {item}
              <span className={styles.sep}> ◆ </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
