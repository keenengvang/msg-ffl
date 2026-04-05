import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getLeague } from '@/shared/api/league.api'

export function useLeague(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.league(leagueId),
    queryFn: () => getLeague(leagueId),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
