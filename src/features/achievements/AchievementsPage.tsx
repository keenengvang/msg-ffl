import { useMemo, useState } from 'react'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { useAllMatchups } from '@/shared/hooks/use-matchups'
import { useAllTransactions } from '@/shared/hooks/use-transactions'
import { useWinnersBracket, useLosersBracket } from '@/shared/hooks/use-brackets'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { PixelBadge } from '@/shared/components/PixelBadge/PixelBadge'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { buildAllResults } from '@/shared/lib/stats/stats-engine'
import { computeAchievements } from '@/features/achievements/utils/achievements-engine'
import { ACHIEVEMENT_DEFS } from '@/features/achievements/types/achievement-defs'
import type { AchievementCategory } from '@/features/achievements/types/achievement.types'
import styles from './AchievementsPage.module.css'

const CATEGORIES: { key: AchievementCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'performance', label: 'PERFORMANCE' },
  { key: 'season', label: 'SEASON' },
  { key: 'scoring', label: 'SCORING' },
  { key: 'gm', label: 'GM' },
  { key: 'rivalry', label: 'RIVALRY' },
]

export function Component() {
  const { profiles, isLoading, error, refetch } = useManagerProfiles()
  const allMatchupResults = useAllMatchups()
  const { allTransactions } = useAllTransactions()
  const { data: winnersBracket } = useWinnersBracket()
  const { data: losersBracket } = useLosersBracket()
  const [category, setCategory] = useState<AchievementCategory | 'all'>('all')

  const allWeekData = allMatchupResults.map((r) => r.data)
  const allResults = useMemo(() => buildAllResults(allWeekData), [allWeekData])
  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.rosterId, p])), [profiles])

  // Determine champion from bracket
  const champion = winnersBracket?.find((m) => m.p === 1)?.w ?? null
  const runnerUp = winnersBracket?.find((m) => m.p === 2)?.l ?? null
  const toiletBowlWinner = losersBracket?.find((m) => m.p === 1)?.w ?? null
  const sortedByRank = [...profiles].sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor)
  const lastPlace = sortedByRank[sortedByRank.length - 1]?.rosterId ?? null
  const playoffTeams = sortedByRank.slice(0, 6).map((p) => p.rosterId)

  const earned = useMemo(
    () =>
      computeAchievements(
        allResults,
        allTransactions,
        profiles.map((p) => p.rosterId),
        champion,
        runnerUp,
        playoffTeams,
        toiletBowlWinner,
        lastPlace,
      ),
    [allResults, allTransactions, profiles, champion, runnerUp, playoffTeams, toiletBowlWinner, lastPlace],
  )

  const earnedMap = useMemo(() => Object.fromEntries(earned.map((a) => [a.id, a])), [earned])
  const filtered = ACHIEVEMENT_DEFS.filter((a) => category === 'all' || a.category === category)

  if (isLoading) return <LoadingScreen message="COMPUTING BADGES..." />
  if (error) return <ErrorState message="Failed to load achievement data." onRetry={refetch} />

  const champProfile = champion ? profileMap[champion] : null

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🎖️ ACHIEVEMENTS</h1>

      {/* Trophy Case */}
      {champProfile && (
        <PixelCard variant="legendary" className={styles.trophyCase}>
          <div className={styles.trophyInner}>
            <span className={styles.trophyIcon}>🏆</span>
            <AvatarPixel src={champProfile.avatarUrl} name={champProfile.displayName} size="xl" />
            <div>
              <p className={styles.champLabel}>CHAMPION</p>
              <p className={styles.champName}>{champProfile.teamName}</p>
              <p className={styles.champManager}>{champProfile.displayName}</p>
            </div>
          </div>
        </PixelCard>
      )}

      {/* Category filter */}
      <div className={styles.filters}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={[styles.filter, category === c.key ? styles.filterActive : ''].join(' ')}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className={styles.grid}>
        {filtered.map((def) => {
          const earnedDef = earnedMap[def.id]
          const isEarned = !!earnedDef
          return (
            <PixelCard key={def.id} className={[styles.badge, isEarned ? styles.earned : styles.locked].join(' ')}>
              <div className={styles.badgeIcon}>{def.icon}</div>
              <div className={styles.badgeInfo}>
                <div className={styles.badgeTop}>
                  <span className={styles.badgeName}>{def.name}</span>
                  <PixelBadge rarity={def.rarity}>{def.rarity}</PixelBadge>
                </div>
                <p className={styles.badgeDesc}>{def.description}</p>
                {isEarned && earnedDef.earnedBy.length > 0 && (
                  <div className={styles.earners}>
                    {earnedDef.earnedBy.slice(0, 3).map((e, i) => {
                      const p = profileMap[e.rosterId]
                      return p ? (
                        <div key={i} className={styles.earner}>
                          <AvatarPixel src={p.avatarUrl} name={p.displayName} size="sm" />
                          <span>{p.teamName}</span>
                          {e.week && <span className={styles.earnerWeek}>Wk {e.week}</span>}
                          {e.detail && <span className={styles.earnerDetail}>{e.detail}</span>}
                        </div>
                      ) : null
                    })}
                  </div>
                )}
                {!isEarned && <p className={styles.locked}>🔒 NOT EARNED</p>}
              </div>
            </PixelCard>
          )
        })}
      </div>
    </div>
  )
}
