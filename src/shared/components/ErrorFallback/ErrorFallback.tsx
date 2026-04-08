import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import styles from './ErrorFallback.module.css'

export function ErrorFallback() {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = 'SOMETHING WENT WRONG'
  let message = 'An unexpected error occurred.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = '404 — PAGE NOT FOUND'
      message = "This page doesn't exist. Check the URL or head back to the dashboard."
    } else {
      title = `${error.status} — ${error.statusText}`
      message = error.data?.message ?? 'The server returned an error.'
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <p className={styles.glitch}>⚠</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => navigate('/')}>
            🏠 BACK TO DASHBOARD
          </button>
          <button className={styles.btn} onClick={() => window.location.reload()}>
            🔄 RELOAD PAGE
          </button>
        </div>
        <p className={styles.sub}>GAME OVER — INSERT COIN TO CONTINUE</p>
      </div>
    </div>
  )
}
