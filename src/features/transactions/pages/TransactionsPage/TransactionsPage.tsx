import { useState, useMemo } from 'react'
import { useAllTransactions } from '@/shared/hooks/use-transactions'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { usePlayers } from '@/shared/hooks/use-players'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { TransactionCard } from '@/features/transactions/components/TransactionCard'
import styles from './TransactionsPage.module.css'

type Filter = 'all' | 'trade' | 'waiver' | 'free_agent'

export function TransactionsPage() {
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
      <h2 className={styles.title}>💱 TRANSACTIONS</h2>

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
