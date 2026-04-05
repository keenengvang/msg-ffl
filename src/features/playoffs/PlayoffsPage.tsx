import { useWinnersBracket, useLosersBracket } from '@/shared/hooks/use-brackets'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { formatPoints } from '@/shared/lib/format/format'
import { useAllMatchups } from '@/shared/hooks/use-matchups'
import { PLAYOFF_START_WEEK, TOTAL_WEEKS } from '@/core/config/league'
import { useMemo } from 'react'
import type { SleeperBracketMatchup } from '@/shared/types/bracket.types'
import styles from './PlayoffsPage.module.css'

function BracketMatch({
  matchup,
  profileMap,
  pointsMap,
}: {
  matchup: SleeperBracketMatchup
  profileMap: Record<number, { teamName: string; avatarUrl: string; displayName: string }>
  pointsMap: Record<string, number>
}) {
  const t1 = profileMap[matchup.t1]
  const t2 = profileMap[matchup.t2]
  const t1pts = pointsMap[`${matchup.r}-${matchup.t1}`]
  const t2pts = pointsMap[`${matchup.r}-${matchup.t2}`]

  return (
    <div className={[styles.match, matchup.w ? styles.matchComplete : ''].join(' ')}>
      {[
        { team: t1, id: matchup.t1, pts: t1pts },
        { team: t2, id: matchup.t2, pts: t2pts },
      ].map(({ team, id, pts }) => (
        <div
          key={id}
          className={[styles.side, matchup.w === id ? styles.winner : matchup.l === id ? styles.loser : ''].join(' ')}
        >
          {team ? (
            <AvatarPixel src={team.avatarUrl} name={team.displayName} size="sm" />
          ) : (
            <div className={styles.tbdAvatar}>?</div>
          )}
          <span className={styles.matchTeam}>{team?.teamName ?? 'TBD'}</span>
          {pts != null && <span className={styles.matchPts}>{formatPoints(pts)}</span>}
          {matchup.w === id && <span className={styles.crown}>👑</span>}
        </div>
      ))}
    </div>
  )
}

export function Component() {
  const { data: winners, isLoading: wLoading, error: wError, refetch: refetchW } = useWinnersBracket()
  const { data: losers, isLoading: lLoading, error: lError, refetch: refetchL } = useLosersBracket()
  const { profiles } = useManagerProfiles()
  const matchupResults = useAllMatchups(TOTAL_WEEKS)

  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.rosterId, p])), [profiles])

  // Build points map from playoff matchup weeks
  const pointsMap = useMemo(() => {
    const map: Record<string, number> = {}
    matchupResults.slice(PLAYOFF_START_WEEK - 1).forEach((res, i) => {
      const week = PLAYOFF_START_WEEK + i
      const round = week - PLAYOFF_START_WEEK + 1
      res.data?.forEach((m) => {
        map[`${round}-${m.roster_id}`] = m.points ?? 0
      })
    })
    return map
  }, [matchupResults])

  if (wLoading || lLoading) return <LoadingScreen message="LOADING BRACKET..." />
  if (wError || lError)
    return (
      <ErrorState
        message="Failed to load playoff bracket."
        onRetry={() => {
          refetchW()
          refetchL()
        }}
      />
    )

  const winnerRounds = [...new Set((winners ?? []).map((m) => m.r))].sort((a, b) => a - b)
  const loserRounds = [...new Set((losers ?? []).map((m) => m.r))].sort((a, b) => a - b)

  const champion = winners?.find((m) => m.p === 1)
  const champProfile = champion?.w ? profileMap[champion.w] : null

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🏆 PLAYOFF BRACKET</h1>

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
