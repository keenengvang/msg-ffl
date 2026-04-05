import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useMatchups } from '@/shared/hooks/use-matchups'
import { useNflState } from '@/shared/hooks/use-nfl-state'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { pairMatchups } from '@/shared/utils/stats/stats-engine'
import { formatPoints } from '@/shared/utils/format/format'
import { TOTAL_WEEKS, PLAYOFF_START_WEEK } from '@/core/config/league'
import styles from './MatchupsPage.module.css'

export function MatchupsPage() {
  const { week } = useParams()
  const navigate = useNavigate()
  const { data: nflState } = useNflState()
  const parsed = parseInt(week ?? String(nflState?.display_week ?? 1), 10)
  const currentWeek = isNaN(parsed) ? 1 : Math.max(1, Math.min(TOTAL_WEEKS, parsed))
  const { data: matchupsData, isLoading, error, refetch } = useMatchups(currentWeek)
  const { profiles } = useManagerProfiles()
  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.rosterId, p])), [profiles])

  const pairs = useMemo(() => {
    if (!matchupsData) return []
    return pairMatchups(matchupsData).filter((r) => r.rosterId < r.opponentRosterId) // deduplicate
  }, [matchupsData])

  const isPlayoffWeek = currentWeek >= PLAYOFF_START_WEEK

  function goToWeek(w: number) {
    navigate(`/matchups/${w}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>⚔️ MATCHUPS</h1>
        <div className={styles.weekSelector}>
          <button
            className={styles.arrow}
            onClick={() => goToWeek(Math.max(1, currentWeek - 1))}
            disabled={currentWeek <= 1}
          >
            ◀
          </button>
          <span className={styles.weekLabel}>
            {isPlayoffWeek ? '🏆 PLAYOFFS' : ''} WEEK {currentWeek}
          </span>
          <button
            className={styles.arrow}
            onClick={() => goToWeek(Math.min(TOTAL_WEEKS, currentWeek + 1))}
            disabled={currentWeek >= TOTAL_WEEKS}
          >
            ▶
          </button>
        </div>
      </div>

      <div className={styles.weekDots}>
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
          <button
            key={i}
            className={[
              styles.dot,
              i + 1 === currentWeek ? styles.dotActive : '',
              i + 1 >= PLAYOFF_START_WEEK ? styles.dotPlayoff : '',
            ].join(' ')}
            onClick={() => goToWeek(i + 1)}
            title={`Week ${i + 1}`}
          />
        ))}
      </div>

      {isLoading ? (
        <LoadingScreen message={`LOADING WEEK ${currentWeek}...`} />
      ) : error ? (
        <ErrorState message={`Failed to load week ${currentWeek} matchups.`} onRetry={refetch} />
      ) : pairs.length === 0 ? (
        <PixelCard>
          <p className={styles.empty}>No matchup data for this week yet.</p>
        </PixelCard>
      ) : (
        <div className={styles.grid}>
          {pairs.map((pair) => {
            const home = profileMap[pair.rosterId]
            const away = profileMap[pair.opponentRosterId]
            if (!home || !away) return null
            const homeWon = pair.won === true
            const awayWon = pair.won === false
            return (
              <PixelCard
                key={`${pair.week}-${pair.matchupId}`}
                variant={homeWon ? 'win' : awayWon ? 'loss' : 'default'}
                className={styles.matchupCard}
              >
                <div className={styles.matchup}>
                  <div className={[styles.side, homeWon ? styles.winner : ''].join(' ')}>
                    <AvatarPixel src={home.avatarUrl} name={home.displayName} size="lg" />
                    <p className={styles.teamName}>{home.teamName}</p>
                    <p className={styles.managerName}>{home.displayName}</p>
                    <p className={styles.score}>{formatPoints(pair.pointsFor)}</p>
                    {homeWon && <span className={styles.winTag}>WIN</span>}
                  </div>

                  <div className={styles.vs}>
                    <span>VS</span>
                    {pair.won !== null && <span className={styles.margin}>Δ {pair.margin.toFixed(2)}</span>}
                  </div>

                  <div className={[styles.side, awayWon ? styles.winner : ''].join(' ')}>
                    <AvatarPixel src={away.avatarUrl} name={away.displayName} size="lg" />
                    <p className={styles.teamName}>{away.teamName}</p>
                    <p className={styles.managerName}>{away.displayName}</p>
                    <p className={styles.score}>{formatPoints(pair.pointsAgainst)}</p>
                    {awayWon && <span className={styles.winTag}>WIN</span>}
                  </div>
                </div>
              </PixelCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
