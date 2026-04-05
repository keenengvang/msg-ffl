import { useState, useMemo } from 'react'
import { useAllTransactions } from '@/shared/hooks/use-transactions'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { usePlayers } from '@/shared/hooks/use-players'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { formatTimeAgo } from '@/shared/lib/date/date'
import type { SleeperTransaction } from '@/shared/types/transaction.types'
import styles from './TransactionsPage.module.css'

type Filter = 'all' | 'trade' | 'waiver' | 'free_agent'

function TransactionCard({
  tx,
  profileMap,
  players,
}: {
  tx: SleeperTransaction
  profileMap: Record<number, { teamName: string; avatarUrl: string; displayName: string }>
  players: Record<string, { full_name?: string; first_name: string; last_name: string; position: string }> | undefined
}) {
  const adds = Object.entries(tx.adds ?? {})
  const drops = Object.entries(tx.drops ?? {})
  const isTrade = tx.type === 'trade'

  const getPlayerName = (id: string) => {
    const p = players?.[id]
    return p ? (p.full_name ?? `${p.first_name} ${p.last_name}`) : id
  }

  return (
    <PixelCard className={styles.txCard} variant={isTrade ? 'highlight' : 'default'}>
      <div className={styles.txHeader}>
        <span className={styles.txType}>
          {isTrade ? '🤝 TRADE' : tx.type === 'waiver' ? '📋 WAIVER' : '🆓 FREE AGENT'}
        </span>
        <span className={styles.txTime}>{formatTimeAgo(tx.status_updated)}</span>
        {tx.settings?.waiver_bid != null && <span className={styles.txBid}>${tx.settings.waiver_bid} FAAB</span>}
      </div>

      <div className={styles.txTeams}>
        {tx.roster_ids.slice(0, 2).map((id) => {
          const p = profileMap[id]
          return p ? (
            <div key={id} className={styles.txTeam}>
              <AvatarPixel src={p.avatarUrl} name={p.displayName} size="sm" />
              <span>{p.teamName}</span>
            </div>
          ) : null
        })}
      </div>

      <div className={styles.txPlayers}>
        {adds.map(([pid, rosterId]) => (
          <div key={`add-${pid}`} className={styles.playerAdd}>
            <span className={styles.addTag}>+ ADD</span>
            <span className={styles.playerName}>{getPlayerName(pid)}</span>
            {isTrade && profileMap[rosterId] && (
              <span className={styles.toTeam}>→ {profileMap[rosterId].teamName}</span>
            )}
          </div>
        ))}
        {drops.map(([pid]) => (
          <div key={`drop-${pid}`} className={styles.playerDrop}>
            <span className={styles.dropTag}>- DROP</span>
            <span className={styles.playerName}>{getPlayerName(pid)}</span>
          </div>
        ))}
        {tx.draft_picks?.map((dp, i) => (
          <div key={i} className={styles.playerAdd}>
            <span className={styles.addTag}>🔄 PICK</span>
            <span className={styles.playerName}>
              {dp.season} Rd {dp.round}
            </span>
          </div>
        ))}
      </div>
    </PixelCard>
  )
}

export function Component() {
  const { allTransactions, isLoading, error, refetch } = useAllTransactions()
  const { profiles } = useManagerProfiles()
  const { data: players } = usePlayers()
  const [filter, setFilter] = useState<Filter>('all')

  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.rosterId, p])), [profiles])

  const filtered = useMemo(() => {
    return allTransactions
      .filter((t) => t.status === 'complete')
      .filter((t) => filter === 'all' || t.type === filter)
      .slice(0, 100)
  }, [allTransactions, filter])

  if (isLoading) return <LoadingScreen message="LOADING TRANSACTIONS..." />
  if (error) return <ErrorState message="Failed to load transactions." onRetry={refetch} />

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>💱 TRANSACTIONS</h1>

      <div className={styles.filters}>
        {(['all', 'trade', 'waiver', 'free_agent'] as Filter[]).map((f) => (
          <button
            key={f}
            className={[styles.filter, filter === f ? styles.filterActive : ''].join(' ')}
            onClick={() => setFilter(f)}
          >
            {f === 'free_agent' ? 'FREE AGENT' : f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.feed}>
        {filtered.length === 0 ? (
          <PixelCard>
            <p className={styles.empty}>No transactions yet.</p>
          </PixelCard>
        ) : (
          filtered.map((tx) => (
            <TransactionCard key={tx.transaction_id} tx={tx} profileMap={profileMap} players={players} />
          ))
        )}
      </div>
    </div>
  )
}
