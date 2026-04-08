import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { useAllMatchups } from '@/shared/hooks/use-matchups'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { computeLuckIndex } from '@/shared/utils/stats/stats-engine'
import { formatPoints, formatRecord } from '@/shared/utils/format/format'
import { formatOrdinal } from '@/shared/utils/format/format'
import styles from './StandingsPage.module.css'

type SortKey = 'rank' | 'team' | 'wins' | 'pf' | 'pa' | 'status' | 'luck'

const defaultSortDirection: Record<SortKey, 'asc' | 'desc'> = {
  rank: 'asc',
  team: 'asc',
  wins: 'desc',
  pf: 'desc',
  pa: 'asc',
  status: 'desc',
  luck: 'desc',
}

export function StandingsPage() {
  const { profiles, isLoading: profilesLoading, error: profilesError, refetch: refetchProfiles } = useManagerProfiles()
  const {
    weeks: matchupWeeks,
    isLoading: matchupsLoading,
    error: matchupsError,
    refetch: refetchMatchups,
  } = useAllMatchups()
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'rank',
    direction: defaultSortDirection.rank,
  })
  const [showLuck, setShowLuck] = useState(false)

  const allWeekData = matchupWeeks
  const luckIndex = useMemo(() => computeLuckIndex(allWeekData), [allWeekData])

  const sorted = useMemo(() => {
    const ranked = [...profiles]
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins
        return b.pointsFor - a.pointsFor
      })
      .map((p, i) => ({ ...p, defaultRank: i + 1 }))

    const multiplier = sortConfig.direction === 'asc' ? 1 : -1

    const comparator = (a, b) => {
      switch (sortConfig.key) {
        case 'rank':
          return (a.defaultRank - b.defaultRank) * multiplier
        case 'team': {
          const teamDiff = a.teamName.localeCompare(b.teamName, undefined, { sensitivity: 'base' })
          if (teamDiff !== 0) return teamDiff * multiplier
          return a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' }) * multiplier
        }
        case 'wins': {
          const diff = a.wins - b.wins
          if (diff !== 0) return diff * multiplier
          return (a.pointsFor - b.pointsFor) * multiplier
        }
        case 'pf':
          return (a.pointsFor - b.pointsFor) * multiplier
        case 'pa':
          return (a.pointsAgainst - b.pointsAgainst) * multiplier
        case 'status': {
          const playoffA = Number(a.defaultRank <= 6)
          const playoffB = Number(b.defaultRank <= 6)
          const diff = playoffA - playoffB
          if (diff !== 0) return diff * multiplier
          return (a.defaultRank - b.defaultRank) * multiplier
        }
        case 'luck': {
          const luckA = luckIndex[a.rosterId] ?? 0
          const luckB = luckIndex[b.rosterId] ?? 0
          return (luckA - luckB) * multiplier
        }
        default:
          return 0
      }
    }

    return [...ranked].sort(comparator)
  }, [profiles, sortConfig, luckIndex])

  const combinedLoading = profilesLoading || matchupsLoading
  const combinedError = profilesError ?? matchupsError

  if (combinedLoading) return <LoadingScreen message="LOADING STANDINGS..." />
  if (combinedError)
    return (
      <ErrorState
        message="Failed to load standings."
        onRetry={() => {
          refetchProfiles()
          refetchMatchups()
        }}
      />
    )

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: defaultSortDirection[key] }
    })
  }

  function col(key: SortKey, label: string, extraClass?: string) {
    const isActive = sortConfig.key === key
    const headerClasses = [styles.th, extraClass, isActive ? styles.active : ''].filter(Boolean).join(' ')
    return (
      <th className={headerClasses} onClick={() => handleSort(key)}>
        <span className={styles.headerLabel}>
          {label}
          {isActive && <span className={styles.sortIndicator}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
        </span>
      </th>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>📊 STANDINGS</h2>
          <div className={styles.cutlineNote}>🎯 Top 6 teams make the playoffs · Click column headers to sort</div>
        </div>
        <button className={styles.toggle} onClick={() => setShowLuck(!showLuck)}>
          {showLuck ? '🍀 HIDE LUCK' : '🍀 SHOW LUCK INDEX'}
        </button>
      </div>

      <PixelCard>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {col('rank', '#', styles.rankHeader)}
                {col('team', 'TEAM')}
                {col('wins', 'W-L')}
                {col('pf', 'PF')}
                {col('pa', 'PA')}
                {col('status', 'PLAYOFF STATUS', styles.statusHeader)}
                {showLuck && col('luck', 'LUCK')}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const isPlayoff = p.defaultRank <= 6
                const luck = luckIndex[p.rosterId] ?? 0
                return (
                  <tr key={p.rosterId}>
                    <td className={styles.rankCell}>
                      {i === 0 && sortConfig.key === 'rank' ? '👑' : formatOrdinal(i + 1)}
                    </td>
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
                    <td className={styles.statusCell}>
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
      </PixelCard>
    </div>
  )
}
