import { useMemo, useState } from 'react'
import { useLeagueChain } from '@/features/history/hooks/use-league-chain'
import { useQueries } from '@tanstack/react-query'
import { getRosters, getUsers } from '@/shared/api/managers.api'
import { queryKeys } from '@/core/api/query-keys'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { formatPoints, formatRecord } from '@/shared/lib/format/format'
import { formatOrdinal } from '@/core/helpers/helpers'
import styles from './HistoryPage.module.css'

export function Component() {
  const { leagues, isLoading, error, refetch } = useLeagueChain()
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)

  // For each season, fetch rosters + users
  const rosterQueries = useQueries({
    queries: leagues.map((l) => ({
      queryKey: queryKeys.rosters(l.league_id),
      queryFn: () => getRosters(l.league_id),
      staleTime: 1000 * 60 * 60 * 24,
    })),
  })

  const userQueries = useQueries({
    queries: leagues.map((l) => ({
      queryKey: queryKeys.users(l.league_id),
      queryFn: () => getUsers(l.league_id),
      staleTime: 1000 * 60 * 60 * 24,
    })),
  })

  const seasonData = useMemo(() => {
    return leagues.map((league, i) => {
      const rosters = rosterQueries[i]?.data ?? []
      const users = userQueries[i]?.data ?? []
      const userMap = Object.fromEntries(users.map((u) => [u.user_id, u]))

      const standings = rosters
        .map((r) => {
          const user = userMap[r.owner_id]
          const pf = (r.settings.fpts ?? 0) + (r.settings.fpts_decimal ?? 0) / 100
          const pa = (r.settings.fpts_against ?? 0) + (r.settings.fpts_against_decimal ?? 0) / 100
          return {
            rosterId: r.roster_id,
            displayName: user?.display_name ?? `Team ${r.roster_id}`,
            teamName: user?.metadata?.team_name ?? user?.display_name ?? `Team ${r.roster_id}`,
            wins: r.settings.wins ?? 0,
            losses: r.settings.losses ?? 0,
            pointsFor: pf,
            pointsAgainst: pa,
          }
        })
        .sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor)

      return { league, standings }
    })
  }, [leagues, rosterQueries, userQueries])

  const activeSeason = selectedSeason ?? leagues[0]?.season ?? null
  const activeData = seasonData.find((s) => s.league.season === activeSeason)

  if (isLoading) return <LoadingScreen message="LOADING HISTORY..." />
  if (error) return <ErrorState message="Failed to load league history." onRetry={refetch} />

  // All-time stats
  const allTimeMap: Record<
    string,
    { name: string; wins: number; losses: number; pf: number; seasons: number; appearances: number }
  > = {}
  seasonData.forEach(({ standings }) => {
    standings.forEach((s, i) => {
      const key = s.displayName
      if (!allTimeMap[key])
        allTimeMap[key] = { name: s.displayName, wins: 0, losses: 0, pf: 0, seasons: 0, appearances: 0 }
      allTimeMap[key].wins += s.wins
      allTimeMap[key].losses += s.losses
      allTimeMap[key].pf += s.pointsFor
      allTimeMap[key].seasons++
      if (i < 6) allTimeMap[key].appearances++
    })
  })
  const allTime = Object.values(allTimeMap).sort((a, b) => b.wins - a.wins || b.pf - a.pf)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>📅 LEAGUE HISTORY</h1>

      {/* Season tabs */}
      <div className={styles.tabs}>
        {leagues.map((l) => (
          <button
            key={l.league_id}
            className={[styles.tab, activeSeason === l.season ? styles.tabActive : ''].join(' ')}
            onClick={() => setSelectedSeason(l.season)}
          >
            {l.season}
          </button>
        ))}
      </div>

      {/* Season standings */}
      {activeData && (
        <PixelCard>
          <h2 className={styles.sectionTitle}>{activeData.league.season} FINAL STANDINGS</h2>
          <div className={styles.champion}>🏆 {activeData.standings[0]?.teamName ?? '—'}</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>RANK</th>
                <th>TEAM</th>
                <th>MANAGER</th>
                <th>W-L</th>
                <th>PF</th>
                <th>PA</th>
                <th>PLAYOFFS</th>
              </tr>
            </thead>
            <tbody>
              {activeData.standings.map((s, i) => (
                <tr key={s.rosterId} className={i < 6 ? styles.playoff : ''}>
                  <td className={styles.rank}>{formatOrdinal(i + 1)}</td>
                  <td className={styles.teamName}>{s.teamName}</td>
                  <td className={styles.manager}>{s.displayName}</td>
                  <td className={styles.record}>{formatRecord(s.wins, s.losses)}</td>
                  <td className={styles.pf}>{formatPoints(s.pointsFor)}</td>
                  <td className={styles.pa}>{formatPoints(s.pointsAgainst)}</td>
                  <td>
                    {i < 6 ? (
                      <span className={styles.inPlayoffs}>✓</span>
                    ) : (
                      <span className={styles.outPlayoffs}>✗</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PixelCard>
      )}

      {/* All-time leaderboard */}
      {allTime.length > 0 && (
        <PixelCard>
          <h2 className={styles.sectionTitle}>🏅 ALL-TIME LEADERBOARD</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>MANAGER</th>
                <th>SEASONS</th>
                <th>W-L</th>
                <th>TOTAL PF</th>
                <th>PLAYOFF APPS</th>
              </tr>
            </thead>
            <tbody>
              {allTime.map((s, i) => (
                <tr key={s.name}>
                  <td className={styles.rank}>{formatOrdinal(i + 1)}</td>
                  <td className={styles.teamName}>{s.name}</td>
                  <td>{s.seasons}</td>
                  <td className={styles.record}>{formatRecord(s.wins, s.losses)}</td>
                  <td className={styles.pf}>{formatPoints(s.pf)}</td>
                  <td>{s.appearances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PixelCard>
      )}
    </div>
  )
}
