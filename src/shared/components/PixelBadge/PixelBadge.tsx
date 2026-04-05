import type { ReactNode } from 'react'
import type { AchievementRarity } from '@/shared/types/achievement.types'
import styles from './PixelBadge.module.css'

interface Props {
  children: ReactNode
  rarity?: AchievementRarity
  className?: string
}

export function PixelBadge({ children, rarity = 'common', className = '' }: Props) {
  return <span className={[styles.badge, styles[rarity], className].join(' ')}>{children}</span>
}
