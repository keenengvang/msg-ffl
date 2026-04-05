import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { useAllMatchups } from '@/shared/hooks/use-matchups'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { buildAllResults, buildH2HRecords, computeLuckIndex } from '@/shared/lib/stats/stats-engine'
import { formatPoints, formatRecord } from '@/shared/lib/format/format'
import { formatOrdinal } from '@/core/helpers/helpers'
import { REGULAR_SEASON_WEEKS } from '@/core/config/league'
import styles from './ManagerPage.module.css'

export function Component() {
  const { rosterId } = useParams()
  const navigate = useNavigate()
  const id = parseInt(rosterId ?? '0', 10)
  const { profiles, isLoading, error, refetch, sortedByRank } = useManagerProfiles()
  const allMatchupResults = useAllMatchups(REGULAR_SEASON_WEEKS)
  const allWeekData = allMatchupResults.map((r) => r.data)
  const allResults = useMemo(() => buildAllResults(allWeekData), [allWeekData])

  const profile = profiles.find((p) => p.rosterId === id)
  const rank = sortedByRank.findIndex((p) => p.rosterId === id) + 1

  const h2h = useMemo(() => buildH2HRecords(allResults), [allResults])
  const luckIndex = useMemo(() => computeLuckIndex(allWeekData), [allWeekData])

  const myResults = useMemo(() => allResults.filter((r) => r.rosterId === id), [allResults, id])
  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.rosterId, p])), [profiles])
  const myH2H = h2h[id] ?? {}
  const myLuck = luckIndex[id] ?? 0

  if (isLoading) return <LoadingScreen message="LOADING MANAGER..." />
  if (error) return <ErrorState message="Failed to load manager data." onRetry={refetch} />
  if (!profile || isNaN(id))
    return (
      <ErrorState
        title="MANAGER NOT FOUND"
        message={`No manager found for roster ID "${rosterId}".`}
        onRetry={() => navigate('/standings')}
      />
    )

  const weeklyScores = myResults.slice(0, REGULAR_SEASON_WEEKS).sort((a, b) => a.week - b.week)
  const avgScore = myResults.length > 0 ? myResults.reduce((s, r) => s + r.pointsFor, 0) / myResults.length : 0

  return (
    <div className={styles.page}>
      {/* Profile Header */}
      <PixelCard variant="highlight" className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <AvatarPixel src={profile.avatarUrl} name={profile.displayName} size="xl" />
          <div className={styles.profileInfo}>
            <h1 className={styles.teamName}>{profile.teamName}</h1>
            <p className={styles.managerName}>{profile.displayName}</p>
            <div className={styles.badges}>
              <span className={styles.recordBadge}>{formatRecord(profile.wins, profile.losses, profile.ties)}</span>
              <span className={styles.rankBadge}>{formatOrdinal(rank)} PLACE</span>
              {profile.streak && (
                <span className={profile.streak.type === 'W' ? styles.streakW : styles.streakL}>
                  {profile.streak.type}
                  {profile.streak.count} STREAK
                </span>
              )}
            </div>
          </div>
          <div className={styles.statCols}>
            <div className={styles.statCol}>
              <p className={styles.statVal}>{formatPoints(profile.pointsFor)}</p>
              <p className={styles.statKey}>PTS FOR</p>
            </div>
            <div className={styles.statCol}>
              <p className={styles.statVal}>{formatPoints(profile.pointsAgainst)}</p>
              <p className={styles.statKey}>PTS AGAINST</p>
            </div>
            <div className={styles.statCol}>
              <p className={styles.statVal}>{formatPoints(avgScore)}</p>
              <p className={styles.statKey}>AVG/WK</p>
            </div>
            <div className={styles.statCol}>
              <p className={[styles.statVal, myLuck >= 0 ? styles.luckPos : styles.luckNeg].join(' ')}>
                {myLuck >= 0 ? '+' : ''}
                {myLuck.toFixed(1)}
              </p>
              <p className={styles.statKey}>LUCK IDX</p>
            </div>
          </div>
        </div>
      </PixelCard>

      <div className={styles.grid}>
        {/* Season Timeline */}
        <PixelCard>
          <h2 className={styles.sectionTitle}>📅 SEASON TIMELINE</h2>
          <div className={styles.timeline}>
            {weeklyScores.map((r) => (
              <div
                key={r.week}
                className={[
                  styles.weekBlock,
                  r.won === true ? styles.win : r.won === false ? styles.loss : styles.tie,
                ].join(' ')}
                title={`Wk ${r.week}: ${r.pointsFor.toFixed(2)} vs ${r.pointsAgainst.toFixed(2)}`}
              >
                <span className={styles.weekNum}>{r.week}</span>
                <span className={styles.weekScore}>{Math.round(r.pointsFor)}</span>
              </div>
            ))}
          </div>
        </PixelCard>

        {/* H2H Records */}
        <PixelCard>
          <h2 className={styles.sectionTitle}>⚔️ HEAD-TO-HEAD</h2>
          <table className={styles.h2hTable}>
            <thead>
              <tr>
                <th>Opponent</th>
                <th>W</th>
                <th>L</th>
                <th>PF</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(myH2H)
                .sort((a, b) => b.wins - a.wins)
                .map((rec) => {
                  const opp = profileMap[rec.opponentRosterId]
                  return (
                    <tr key={rec.opponentRosterId}>
                      <td>
                        <div className={styles.h2hOpp}>
                          {opp && <AvatarPixel src={opp.avatarUrl} name={opp.displayName} size="sm" />}
                          <span>{opp?.teamName ?? `Team ${rec.opponentRosterId}`}</span>
                        </div>
                      </td>
                      <td className={styles.h2hW}>{rec.wins}</td>
                      <td className={styles.h2hL}>{rec.losses}</td>
                      <td className={styles.h2hPF}>{formatPoints(rec.pointsFor)}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </PixelCard>
      </div>
    </div>
  )
}
