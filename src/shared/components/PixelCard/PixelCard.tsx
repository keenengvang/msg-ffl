import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './PixelCard.module.css'

export type PixelCardVariant = 'default' | 'elevated' | 'warning' | 'success' | 'danger'
type LegacyPixelCardVariant = 'highlight' | 'legendary' | 'win' | 'loss'
type CombinedVariant = PixelCardVariant | LegacyPixelCardVariant

type PixelCardProps = {
  children: ReactNode
  variant?: CombinedVariant
  header?: ReactNode
  footer?: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

const CLICK_KEYS = new Set(['Enter', ' ', 'Spacebar'])
const LEGACY_VARIANT_MAP: Record<LegacyPixelCardVariant, PixelCardVariant> = {
  highlight: 'elevated',
  legendary: 'elevated',
  win: 'success',
  loss: 'danger',
}

export function PixelCard({
  children,
  variant = 'default',
  header,
  footer,
  className,
  style,
  onClick,
}: PixelCardProps) {
  const isInteractive = typeof onClick === 'function'
  const resolvedVariant = (LEGACY_VARIANT_MAP[variant as LegacyPixelCardVariant] ?? variant) as PixelCardVariant

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return
    if (CLICK_KEYS.has(event.key)) {
      event.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={clsx(styles.card, styles[resolvedVariant], isInteractive && styles.clickable, className)}
      style={style}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      data-variant={resolvedVariant}
    >
      {header ? <div className={styles.header}>{header}</div> : null}
      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  )
}
