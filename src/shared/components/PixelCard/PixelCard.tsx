import type { CSSProperties, ReactNode } from 'react'
import styles from './PixelCard.module.css'

type Variant = 'default' | 'highlight' | 'danger' | 'legendary' | 'win' | 'loss'

interface Props {
  children: ReactNode
  variant?: Variant
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

export function PixelCard({ children, variant = 'default', className = '', style, onClick }: Props) {
  return (
    <div
      className={[styles.card, styles[variant], onClick ? styles.clickable : '', className].join(' ')}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
