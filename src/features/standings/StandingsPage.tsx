import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { useAllMatchups } from '@/shared/hooks/use-matchups'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { computeLuckIndex } from '@/shared/lib/stats/stats-engine'
import { formatPoints, formatRecord } from '@/shared/lib/format/format'
import { formatOrdinal } from '@/core/helpers/helpers'
import styles from './StandingsPage.module.css'

type SortKey = 'rank' | 'wins' | 'pf' | 'pa' | 'luck'

export function Component() {
  const { profiles, isLoading, error, refetch } = useManagerProfiles()
  const allMatchupResults = useAllMatchups()
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [showLuck, setShowLuck] = useState(false)

  const allWeekData = allMatchupResults.map((r) => r.data)
  const luckIndex = useMemo(() => computeLuckIndex(allWeekData), [allWeekData])

  const sorted = useMemo(() => {
    const base = [...profiles].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.pointsFor - a.pointsFor
    })
    const withRank = base.map((p, i) => ({ ...p, defaultRank: i + 1 }))

    switch (sortKey) {
      case 'wins':
        return withRank.sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor)
      case 'pf':
        return withRank.sort((a, b) => b.pointsFor - a.pointsFor)
      case 'pa':
        return withRank.sort((a, b) => a.pointsAgainst - b.pointsAgainst)
      case 'luck':
        return withRank.sort((a, b) => (luckIndex[b.rosterId] ?? 0) - (luckIndex[a.rosterId] ?? 0))
      default:
        return withRank
    }
  }, [profiles, sortKey, luckIndex])

  if (isLoading) return <LoadingScreen message="LOADING STANDINGS..." />
  if (error) return <ErrorState message="Failed to load standings." onRetry={refetch} />

  function col(key: SortKey, label: string) {
    return (
      <th className={[styles.th, sortKey === key ? styles.active : ''].join(' ')} onClick={() => setSortKey(key)}>
        {label}
      </th>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>📊 STANDINGS</h1>
        <button className={styles.toggle} onClick={() => setShowLuck(!showLuck)}>
          {showLuck ? '🍀 HIDE LUCK' : '🍀 SHOW LUCK INDEX'}
        </button>
      </div>

      <PixelCard>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>TEAM</th>
                {col('wins', 'W-L')}
                {col('pf', 'PF')}
                {col('pa', 'PA')}
                <th className={styles.th}>STREAK</th>
                <th className={styles.th}>STATUS</th>
                {showLuck && col('luck', 'LUCK')}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const isPlayoff = p.defaultRank <= 6
                const luck = luckIndex[p.rosterId] ?? 0
                return (
                  <tr key={p.rosterId} className={isPlayoff ? styles.playoff : styles.bubble}>
                    <td className={styles.rankCell}>{i === 0 && sortKey === 'rank' ? '👑' : formatOrdinal(i + 1)}</td>
                    <td>
                      <Link to={`/manager/${p.rosterId}`} className={styles.team}>
                        <AvatarPixel src={p.avatarUrl} name={p.displayName} size="sm" />
                        <div>
                          <p className={styles.teamName}>{p.teamName}</p>
                          <p className={styles.managerName}>{p.displayName}</p>
                        </div>
                      </Link>
                    </td>
                    <td className={styles.record}>{formatRecord(p.wins, p.losses, p.ties)}</td>
                    <td className={styles.pf}>{formatPoints(p.pointsFor)}</td>
                    <td className={styles.pa}>{formatPoints(p.pointsAgainst)}</td>
                    <td>
                      {p.streak && (
                        <span className={p.streak.type === 'W' ? styles.streakW : styles.streakL}>
                          {p.streak.type}
                          {p.streak.count}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={isPlayoff ? styles.inPlayoffs : styles.outPlayoffs}>
                        {isPlayoff ? '🎯 IN' : '❌ OUT'}
                      </span>
                    </td>
                    {showLuck && (
                      <td className={luck >= 0 ? styles.luckPos : styles.luckNeg}>
                        {luck >= 0 ? '+' : ''}
                        {luck.toFixed(1)}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.cutlineNote}>🎯 Top 6 teams make the playoffs · Click column headers to sort</div>
      </PixelCard>
    </div>
  )
}
