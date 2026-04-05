import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { useAllMatchups } from '@/shared/hooks/use-matchups'
import { useNflState } from '@/shared/hooks/use-nfl-state'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { Ticker } from '@/shared/components/Ticker/Ticker'
import { buildAllResults, computeFunStats, computePowerRankings } from '@/shared/utils/stats/stats-engine'
import { formatPoints, formatRecord } from '@/shared/utils/format/format'
import { formatOrdinal } from '@/shared/utils/format/format'
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

  const powerRankings = useMemo(
    () =>
      computePowerRankings(
        allResults,
        profiles.map((p) => p.rosterId),
      ),
    [allResults, profiles],
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

  const top6 = sortedByRank.slice(0, 6)
  const bottom = sortedByRank.slice(6)

  return (
    <div className={styles.page}>
      <Ticker items={tickerItems} />

      <div className={styles.grid}>
        {/* Standings */}
        <PixelCard className={styles.standingsCard}>
          <h2 className={styles.cardTitle}>📊 STANDINGS</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>W-L</th>
                <th>PF</th>
              </tr>
            </thead>
            <tbody>
              {top6.map((p, i) => (
                <tr key={p.rosterId} className={styles.playoffRow}>
                  <td className={styles.rank}>{i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}</td>
                  <td>
                    <Link to={`/manager/${p.rosterId}`} className={styles.teamLink}>
                      <AvatarPixel src={p.avatarUrl} name={p.displayName} size="sm" />
                      <span>{p.teamName}</span>
                    </Link>
                  </td>
                  <td className={styles.record}>{formatRecord(p.wins, p.losses)}</td>
                  <td className={styles.pts}>{formatPoints(p.pointsFor)}</td>
                </tr>
              ))}
              <tr className={styles.cutline}>
                <td colSpan={4}>── PLAYOFF CUTLINE ──</td>
              </tr>
              {bottom.map((p, i) => (
                <tr key={p.rosterId}>
                  <td className={styles.rank}>{top6.length + i + 1}</td>
                  <td>
                    <Link to={`/manager/${p.rosterId}`} className={styles.teamLink}>
                      <AvatarPixel src={p.avatarUrl} name={p.displayName} size="sm" />
                      <span>{p.teamName}</span>
                    </Link>
                  </td>
                  <td className={styles.record}>{formatRecord(p.wins, p.losses)}</td>
                  <td className={styles.pts}>{formatPoints(p.pointsFor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/standings" className={styles.viewAll}>
            VIEW FULL STANDINGS →
          </Link>
        </PixelCard>

        {/* Power Rankings */}
        <PixelCard className={styles.powerCard}>
          <h2 className={styles.cardTitle}>⚡ POWER RANKINGS</h2>
          <div className={styles.powerList}>
            {powerRankings.slice(0, 6).map((pr, i) => {
              const p = profileMap[pr.rosterId]
              if (!p) return null
              return (
                <Link to={`/manager/${pr.rosterId}`} key={pr.rosterId} className={styles.powerRow}>
                  <span className={styles.powerRank}>{formatOrdinal(i + 1)}</span>
                  <AvatarPixel src={p.avatarUrl} name={p.displayName} size="sm" />
                  <span className={styles.powerName}>{p.teamName}</span>
                  <span className={styles.powerScore}>{pr.score}</span>
                </Link>
              )
            })}
          </div>
        </PixelCard>

        {/* Fun Stats */}
        <PixelCard className={styles.statsCard}>
          <h2 className={styles.cardTitle}>🎮 FUN STATS</h2>
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

        {/* Quick links */}
        <PixelCard className={styles.linksCard}>
          <h2 className={styles.cardTitle}>🕹️ QUICK LINKS</h2>
          <div className={styles.links}>
            <Link to="/matchups" className={styles.quickLink}>
              ⚔️ This Week's Matchups
            </Link>
            <Link to="/playoffs" className={styles.quickLink}>
              🏆 Playoff Bracket
            </Link>
            <Link to="/achievements" className={styles.quickLink}>
              🎖️ Achievement Board
            </Link>
            <Link to="/draft" className={styles.quickLink}>
              📋 Draft Board
            </Link>
            <Link to="/transactions" className={styles.quickLink}>
              💱 Recent Transactions
            </Link>
            <Link to="/history" className={styles.quickLink}>
              📅 League History
            </Link>
          </div>
        </PixelCard>
      </div>
    </div>
  )
}
