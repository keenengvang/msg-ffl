import type { ReactNode } from 'react'
import clsx from 'clsx'
import type { AchievementRarity } from '@/shared/types/achievement.types'
import styles from './PixelBadge.module.css'

type PixelBadgeIntent = 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive'
type PixelBadgeTone = 'solid' | 'outline'

const rarityIntentMap: Record<AchievementRarity, PixelBadgeIntent> = {
  common: 'muted',
  rare: 'secondary',
  epic: 'accent',
  legendary: 'primary',
}

type PixelBadgeProps = {
  children: ReactNode
  intent?: PixelBadgeIntent
  tone?: PixelBadgeTone
  icon?: ReactNode
  rarity?: AchievementRarity
  className?: string
}

export function PixelBadge({ children, intent, tone = 'solid', icon, rarity, className }: PixelBadgeProps) {
  const resolvedIntent = intent ?? (rarity ? rarityIntentMap[rarity] : 'primary')

  return (
    <span
      className={clsx(styles.badge, styles[resolvedIntent], styles[tone], className)}
      data-intent={resolvedIntent}
      data-tone={tone}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
    </span>
  )
}
