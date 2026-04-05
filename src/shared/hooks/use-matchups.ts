import { useQuery, useQueries } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getMatchups } from '@/shared/api/matchups.api'
import { TOTAL_WEEKS } from '@/core/config/league'

export function useMatchups(week: number, leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.matchups(week, leagueId),
    queryFn: () => getMatchups(week, leagueId),
    staleTime: 1000 * 60 * 5,
    enabled: week > 0,
  })
}

export function useAllMatchups(totalWeeks = TOTAL_WEEKS, leagueId?: string) {
  return useQueries({
    queries: Array.from({ length: totalWeeks }, (_, i) => ({
      queryKey: queryKeys.matchups(i + 1, leagueId),
      queryFn: () => getMatchups(i + 1, leagueId),
      staleTime: 1000 * 60 * 5,
    })),
  })
}
