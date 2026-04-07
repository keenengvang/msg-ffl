import clsx from 'clsx'
import styles from './LoadingScreen.module.css'

type LoadingScreenProps = {
  message?: string
  subtext?: string
  fullScreen?: boolean
}

export function LoadingScreen({
  message = 'Loading…',
  subtext = 'Syncing stats & vibes',
  fullScreen = false,
}: LoadingScreenProps) {
  return (
    <div data-testid="loading-screen" className={clsx(styles.wrapper, fullScreen && styles.fullScreen)}>
      <div className={styles.inner}>
        <div className={styles.spinner} aria-hidden="true" data-role="retro-spinner" />
        <p className={styles.message} aria-live="polite">
          {message}
        </p>
        <p className={styles.sub}>{subtext}</p>
      </div>
    </div>
  )
}
