import styles from './LoadingScreen.module.css'

interface Props {
  message?: string
  fullScreen?: boolean
}

export function LoadingScreen({ message = 'LOADING...', fullScreen = false }: Props) {
  return (
    <div data-testid="loading-screen" className={[styles.wrapper, fullScreen ? styles.fullScreen : ''].join(' ')}>
      <div className={styles.inner}>
        <div className={styles.spinner}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <p className={styles.message}>{message}</p>
        <p className={styles.sub}>INSERT COIN TO CONTINUE</p>
      </div>
    </div>
  )
}
