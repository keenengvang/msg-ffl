import { Button } from '@/shared/components/Button/Button'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import styles from './ErrorState.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'

type ErrorStateAction = {
  label: string
  onClick: () => void
  variant?: ButtonVariant
}

type ErrorStateProps = {
  title?: string
  message?: string
  description?: string
  details?: string[]
  actions?: ErrorStateAction[]
  onRetry?: () => void
}

export function ErrorState({
  title = 'System fault detected',
  message,
  description,
  details = [],
  actions,
  onRetry,
}: ErrorStateProps) {
  const copy = description ?? message ?? 'Something went sideways while talking to the Sleeper API.'
  const resolvedActions: ErrorStateAction[] = actions?.length
    ? actions
    : onRetry
      ? [{ label: 'Try again', onClick: onRetry }]
      : []

  return (
    <PixelCard className={styles.card} variant="danger">
      <div className={styles.header}>
        <span className={styles.tagline}>League Control</span>
        <span className={styles.status}>Status: Fault</span>
      </div>
      <div className={styles.body} role="alert">
        <div className={styles.icon} aria-hidden="true">
          ⚠
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{copy}</p>
        {details.length > 0 ? (
          <ul className={styles.details}>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}
        {resolvedActions.length > 0 ? (
          <div className={styles.actions}>
            {resolvedActions.map((action, index) => (
              <Button
                key={`${action.label}-${index}`}
                variant={action.variant ?? (index === 0 ? 'primary' : 'outline')}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </PixelCard>
  )
}
