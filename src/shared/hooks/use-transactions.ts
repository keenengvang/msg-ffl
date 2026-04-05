import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getTransactions } from '@/shared/api/transactions.api'
import { TOTAL_WEEKS } from '@/core/config/league'
import type { SleeperTransaction } from '@/shared/types/transaction.types'
import { minutes } from '@/shared/utils/time/time'

const TRANSACTION_STALE_TIME_MS = minutes(30)

type AllTransactionsResult = {
  allTransactions: SleeperTransaction[]
  isLoading: boolean
  error: unknown
  refetch: () => void
}

export function useAllTransactions(totalWeeks = TOTAL_WEEKS, leagueId?: string): AllTransactionsResult {
  const rounds = Array.from({ length: totalWeeks }, (_, index) => index + 1)
  const query = useQuery({
    queryKey: queryKeys.transactionsSeason(rounds.length, leagueId),
    queryFn: () => fetchSeasonTransactions(rounds, leagueId),
    staleTime: TRANSACTION_STALE_TIME_MS,
    enabled: rounds.length > 0,
  })

  return {
    allTransactions: query.data ?? [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}

async function fetchSeasonTransactions(rounds: number[], leagueId?: string): Promise<SleeperTransaction[]> {
  if (rounds.length === 0) {
    return []
  }

  const perRound = await Promise.all(rounds.map((round) => getTransactions(round, leagueId)))
  return perRound.flat().sort((a, b) => b.status_updated - a.status_updated)
}
