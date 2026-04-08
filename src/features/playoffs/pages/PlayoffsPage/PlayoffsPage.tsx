import { useWinnersBracket, useLosersBracket } from '@/shared/hooks/use-brackets'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { useAllMatchups } from '@/shared/hooks/use-matchups'
import { PLAYOFF_START_WEEK, TOTAL_WEEKS } from '@/core/config/league'
import { useMemo } from 'react'
import { BracketMatch } from '@/features/playoffs/components/BracketMatch'
import styles from './PlayoffsPage.module.css'

export function PlayoffsPage() {
  const { data: winners, isLoading: wLoading, error: wError, refetch: refetchW } = useWinnersBracket()
  const { data: losers, isLoading: lLoading, error: lError, refetch: refetchL } = useLosersBracket()
  const { profiles, isLoading: profilesLoading, error: profilesError, refetch: refetchProfiles } = useManagerProfiles()
  const {
    weeks: matchupWeeks,
    isLoading: matchupsLoading,
    error: matchupsError,
    refetch: refetchMatchups,
  } = useAllMatchups(TOTAL_WEEKS)

  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.rosterId, p])), [profiles])

  // Build points map from playoff matchup weeks
  const pointsMap = useMemo(() => {
    const map: Record<string, number> = {}
    matchupWeeks.slice(PLAYOFF_START_WEEK - 1).forEach((weekMatchups, i) => {
      const week = PLAYOFF_START_WEEK + i
      const round = week - PLAYOFF_START_WEEK + 1
      weekMatchups.forEach((m) => {
        map[`${round}-${m.roster_id}`] = m.points ?? 0
      })
    })
    return map
  }, [matchupWeeks])

  const combinedLoading = wLoading || lLoading || profilesLoading || matchupsLoading
  const combinedError = wError ?? lError ?? profilesError ?? matchupsError

  if (combinedLoading) return <LoadingScreen message="LOADING BRACKET..." />
  if (combinedError)
    return (
      <ErrorState
        message="Failed to load playoff bracket."
        onRetry={() => {
          refetchW()
          refetchL()
          refetchProfiles()
          refetchMatchups()
        }}
      />
    )

  const winnerRounds = [...new Set((winners ?? []).map((m) => m.r))].sort((a, b) => a - b)
  const loserRounds = [...new Set((losers ?? []).map((m) => m.r))].sort((a, b) => a - b)

  const champion = winners?.find((m) => m.p === 1)
  const champProfile = champion?.w ? profileMap[champion.w] : null

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>🏆 PLAYOFF BRACKET</h2>

      {champProfile && (
        <PixelCard variant="legendary" className={styles.champCard}>
          <div className={styles.champInner}>
            <span className={styles.champTrophy}>🏆</span>
            <AvatarPixel src={champProfile.avatarUrl} name={champProfile.displayName} size="xl" />
            <div>
              <p className={styles.champLabel}>CHAMPION</p>
              <p className={styles.champName}>{champProfile.teamName}</p>
            </div>
          </div>
        </PixelCard>
      )}

      {/* Winners bracket */}
      <h2 className={styles.bracketTitle}>🥇 CHAMPIONSHIP BRACKET</h2>
      <div className={styles.bracket}>
        {winnerRounds.map((round) => (
          <div key={round} className={styles.round}>
            <p className={styles.roundLabel}>ROUND {round}</p>
            {(winners ?? [])
              .filter((m) => m.r === round)
              .map((m) => (
                <BracketMatch key={`w-${m.r}-${m.m}`} matchup={m} profileMap={profileMap} pointsMap={pointsMap} />
              ))}
          </div>
        ))}
      </div>

      {/* Losers bracket */}
      {(losers ?? []).length > 0 && (
        <>
          <h2 className={[styles.bracketTitle, styles.toiletTitle].join(' ')}>🚽 TOILET BOWL</h2>
          <div className={styles.bracket}>
            {loserRounds.map((round) => (
              <div key={round} className={styles.round}>
                <p className={styles.roundLabel}>ROUND {round}</p>
                {(losers ?? [])
                  .filter((m) => m.r === round)
                  .map((m) => (
                    <BracketMatch key={`l-${m.r}-${m.m}`} matchup={m} profileMap={profileMap} pointsMap={pointsMap} />
                  ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
