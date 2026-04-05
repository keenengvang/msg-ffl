import { useQueries } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getTransactions } from '@/shared/api/transactions.api'
import { TOTAL_WEEKS } from '@/core/config/league'
import type { SleeperTransaction } from '@/shared/types/transaction.types'

export function useAllTransactions(totalWeeks = TOTAL_WEEKS, leagueId?: string) {
  const results = useQueries({
    queries: Array.from({ length: totalWeeks }, (_, i) => ({
      queryKey: queryKeys.transactions(i + 1, leagueId),
      queryFn: () => getTransactions(i + 1, leagueId),
      staleTime: 1000 * 60 * 30,
    })),
  })

  const allTransactions: SleeperTransaction[] = results
    .flatMap((r) => r.data ?? [])
    .sort((a, b) => b.status_updated - a.status_updated)

  const isLoading = results.some((r) => r.isPending)
  const error = results.find((r) => r.error)?.error ?? null
  const refetch = () => results.forEach((r) => r.refetch())

  return { allTransactions, isLoading, error, refetch, results }
}
