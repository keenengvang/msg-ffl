import type { AchievementRarity } from '@/shared/types/achievement.types'

export type { AchievementRarity }
export type AchievementCategory = 'performance' | 'season' | 'scoring' | 'gm' | 'rivalry'

export interface AchievementEarner {
  rosterId: number
  week?: number
  detail?: string
}

export interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  category: AchievementCategory
}

export interface EarnedAchievement extends AchievementDef {
  earnedBy: AchievementEarner[]
}
