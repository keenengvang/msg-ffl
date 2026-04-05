import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import styles from './ErrorState.module.css'

interface Props {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'FAILED TO LOAD',
  message = 'Something went wrong fetching data from the Sleeper API.',
  onRetry,
}: Props) {
  return (
    <PixelCard className={styles.card}>
      <div className={styles.inner}>
        <span className={styles.icon}>⚠</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        {onRetry && (
          <button className={styles.retry} onClick={onRetry}>
            🔄 RETRY
          </button>
        )}
      </div>
    </PixelCard>
  )
}
