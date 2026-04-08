import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLeagueChain } from '@/features/history/hooks/use-league-chain'
import { getRosters, getUsers } from '@/shared/api/managers.api'
import { queryKeys } from '@/core/api/query-keys'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { formatPoints, formatRecord } from '@/shared/utils/format/format'
import { formatOrdinal } from '@/shared/utils/format/format'
import { days } from '@/shared/utils/time/time'
import type { SleeperLeague } from '@/shared/types/league.types'
import styles from './HistoryPage.module.css'

export function HistoryPage() {
  const { leagues, isLoading, error, refetch } = useLeagueChain()
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)

  const leagueIds = useMemo(() => leagues.map((league) => league.league_id), [leagues])

  const seasonDataQuery = useQuery({
    queryKey: queryKeys.leagueStandings(leagueIds),
    queryFn: () => fetchSeasonData(leagues),
    staleTime: days(1),
    enabled: leagues.length > 0,
  })

  const seasonData = seasonDataQuery.data ?? []
  const combinedLoading = isLoading || seasonDataQuery.isPending
  const combinedError = error ?? seasonDataQuery.error

  const activeSeason = selectedSeason ?? seasonData[0]?.league.season ?? null
  const activeData = seasonData.find((s) => s.league.season === activeSeason)

  if (combinedLoading) return <LoadingScreen message="LOADING HISTORY..." />
  if (combinedError) {
    const handleRetry = () => {
      refetch()
      seasonDataQuery.refetch()
    }
    return <ErrorState message="Failed to load league history." onRetry={handleRetry} />
  }

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
      <h2 className={styles.title}>📅 LEAGUE HISTORY</h2>

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
          <h4 className={styles.sectionTitle}>{activeData.league.season} FINAL STANDINGS</h4>
          <div className={styles.champion}>🏆 {activeData.standings[0]?.teamName ?? '—'}</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className="stat-heading">RANK</th>
                  <th className="stat-heading">TEAM</th>
                  <th className="stat-heading">MANAGER</th>
                  <th className="stat-heading">W-L</th>
                  <th className="stat-heading">PF</th>
                  <th className="stat-heading">PA</th>
                  <th className="stat-heading">PLAYOFFS</th>
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
          </div>
        </PixelCard>
      )}

      {/* All-time leaderboard */}
      {allTime.length > 0 && (
        <PixelCard>
          <h4 className={styles.sectionTitle}>🏅 ALL-TIME LEADERBOARD</h4>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className="stat-heading">#</th>
                  <th className="stat-heading">MANAGER</th>
                  <th className="stat-heading">SEASONS</th>
                  <th className="stat-heading">W-L</th>
                  <th className="stat-heading">TOTAL PF</th>
                  <th className="stat-heading">PLAYOFF APPS</th>
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
          </div>
        </PixelCard>
      )}
    </div>
  )
}

type SeasonStandings = {
  league: SleeperLeague
  standings: {
    rosterId: number
    displayName: string
    teamName: string
    wins: number
    losses: number
    pointsFor: number
    pointsAgainst: number
  }[]
}

async function fetchSeasonData(leagues: SleeperLeague[]): Promise<SeasonStandings[]> {
  const seasonEntries = await Promise.all(
    leagues.map(async (league) => {
      const [rosters, users] = await Promise.all([getRosters(league.league_id), getUsers(league.league_id)])
      const userMap = Object.fromEntries(users.map((user) => [user.user_id, user]))

      const standings = rosters
        .map((roster) => {
          const owner = userMap[roster.owner_id]
          const pointsFor = (roster.settings.fpts ?? 0) + (roster.settings.fpts_decimal ?? 0) / 100
          const pointsAgainst = (roster.settings.fpts_against ?? 0) + (roster.settings.fpts_against_decimal ?? 0) / 100

          return {
            rosterId: roster.roster_id,
            displayName: owner?.display_name ?? `Team ${roster.roster_id}`,
            teamName: owner?.metadata?.team_name ?? owner?.display_name ?? `Team ${roster.roster_id}`,
            wins: roster.settings.wins ?? 0,
            losses: roster.settings.losses ?? 0,
            pointsFor,
            pointsAgainst,
          }
        })
        .sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor)

      return { league, standings }
    }),
  )

  return seasonEntries
}
