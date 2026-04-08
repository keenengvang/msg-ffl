import { useMemo } from 'react'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { useAllMatchups } from '@/shared/hooks/use-matchups'
import { useNflState } from '@/shared/hooks/use-nfl-state'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { Countdown } from '@/shared/components/Countdown/Countdown'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { Ticker } from '@/shared/components/Ticker/Ticker'
import { buildAllResults, computeFunStats } from '@/shared/utils/stats/stats-engine'
import { formatPoints, formatRecord } from '@/shared/utils/format/format'
import styles from './HomePage.module.css'

export function HomePage() {
  const {
    profiles,
    isLoading: profilesLoading,
    error: profilesError,
    refetch: refetchProfiles,
    sortedByRank,
  } = useManagerProfiles()
  useNflState() // prefetch for downstream pages
  const {
    weeks: matchupWeeks,
    isLoading: matchupsLoading,
    error: matchupsError,
    refetch: refetchMatchups,
  } = useAllMatchups()

  const allWeekData = matchupWeeks
  const allResults = useMemo(() => buildAllResults(allWeekData), [allWeekData])

  const rosterMoves = useMemo(() => {
    const m: Record<number, number> = {}
    profiles.forEach((p) => {
      m[p.rosterId] = p.totalMoves
    })
    return m
  }, [profiles])

  const funStats = useMemo(
    () => computeFunStats(allResults, allWeekData, rosterMoves),
    [allResults, allWeekData, rosterMoves],
  )

  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.rosterId, p])), [profiles])

  const tickerItems = useMemo(() => {
    const items: string[] = []
    if (sortedByRank[0])
      items.push(
        `🏅 STANDINGS LEADER: ${sortedByRank[0].teamName} (${formatRecord(sortedByRank[0].wins, sortedByRank[0].losses)})`,
      )
    if (funStats.highestWeekScore) {
      const m = profileMap[funStats.highestWeekScore.rosterId]
      if (m)
        items.push(
          `🐐 SEASON HIGH: ${m.teamName} — ${funStats.highestWeekScore.points.toFixed(2)} pts (Wk ${funStats.highestWeekScore.week})`,
        )
    }
    if (funStats.biggestBlowout) {
      const m = profileMap[funStats.biggestBlowout.rosterId]
      if (m) items.push(`💥 BIGGEST WIN: ${m.teamName} — Won by ${funStats.biggestBlowout.margin.toFixed(2)} pts`)
    }
    if (funStats.luckiestManager) {
      const m = profileMap[funStats.luckiestManager.rosterId]
      if (m) items.push(`🍀 LUCKIEST GM: ${m.teamName} — Luck Score +${funStats.luckiestManager.luckScore.toFixed(1)}`)
    }
    return items
  }, [sortedByRank, funStats, profileMap])

  const combinedLoading = profilesLoading || matchupsLoading
  const combinedError = profilesError ?? matchupsError

  if (combinedLoading) return <LoadingScreen message="LOADING LEAGUE DATA..." fullScreen />
  if (combinedError)
    return (
      <ErrorState
        message="Failed to load league data."
        onRetry={() => {
          refetchProfiles()
          refetchMatchups()
        }}
      />
    )

  return (
    <div className={styles.page}>
      <Ticker items={tickerItems} />

      <div className={styles.countdownHero}>
        <p className={styles.countdownLabel}>Next Season Kickoff</p>
        <Countdown />
      </div>

      <div className={styles.grid}>
        {/* Fun Stats */}
        <PixelCard>
          <h4 className={styles.cardTitle}>🎮 FUN STATS</h4>
          <div className={styles.funStats}>
            {funStats.highestWeekScore && profileMap[funStats.highestWeekScore.rosterId] && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>🐐</span>
                <div>
                  <p className={styles.statLabel}>Season High Score</p>
                  <p className={styles.statValue}>{funStats.highestWeekScore.points.toFixed(2)} pts</p>
                  <p className={styles.statSub}>
                    {profileMap[funStats.highestWeekScore.rosterId].teamName} · Wk {funStats.highestWeekScore.week}
                  </p>
                </div>
              </div>
            )}
            {funStats.biggestBlowout && profileMap[funStats.biggestBlowout.rosterId] && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>💥</span>
                <div>
                  <p className={styles.statLabel}>Biggest Blowout</p>
                  <p className={styles.statValue}>+{funStats.biggestBlowout.margin.toFixed(2)} pts</p>
                  <p className={styles.statSub}>
                    {profileMap[funStats.biggestBlowout.rosterId].teamName} · Wk {funStats.biggestBlowout.week}
                  </p>
                </div>
              </div>
            )}
            {funStats.closestGame && profileMap[funStats.closestGame.rosterId] && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>😬</span>
                <div>
                  <p className={styles.statLabel}>Closest Game</p>
                  <p className={styles.statValue}>{funStats.closestGame.margin.toFixed(2)} pts</p>
                  <p className={styles.statSub}>
                    {profileMap[funStats.closestGame.rosterId].teamName} · Wk {funStats.closestGame.week}
                  </p>
                </div>
              </div>
            )}
            {funStats.luckiestManager && profileMap[funStats.luckiestManager.rosterId] && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>🍀</span>
                <div>
                  <p className={styles.statLabel}>Luckiest Manager</p>
                  <p className={styles.statValue}>+{funStats.luckiestManager.luckScore.toFixed(1)}</p>
                  <p className={styles.statSub}>{profileMap[funStats.luckiestManager.rosterId].teamName}</p>
                </div>
              </div>
            )}
            {funStats.unluckiestManager && profileMap[funStats.unluckiestManager.rosterId] && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>😤</span>
                <div>
                  <p className={styles.statLabel}>Most Unlucky</p>
                  <p className={styles.statValue}>{funStats.unluckiestManager.luckScore.toFixed(1)}</p>
                  <p className={styles.statSub}>{profileMap[funStats.unluckiestManager.rosterId].teamName}</p>
                </div>
              </div>
            )}
            {funStats.mostActivGM && profileMap[funStats.mostActivGM.rosterId] && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>🐺</span>
                <div>
                  <p className={styles.statLabel}>Most Active GM</p>
                  <p className={styles.statValue}>{funStats.mostActivGM.moves} moves</p>
                  <p className={styles.statSub}>{profileMap[funStats.mostActivGM.rosterId].teamName}</p>
                </div>
              </div>
            )}
          </div>
        </PixelCard>
      </div>
    </div>
  )
}
