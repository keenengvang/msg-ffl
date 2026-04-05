import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getLeague } from '@/shared/api/league.api'
import { hours } from '@/shared/utils/time/time'

const LEAGUE_STALE_TIME_MS = hours(1)

export function useLeague(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.league(leagueId),
    queryFn: () => getLeague(leagueId),
    staleTime: LEAGUE_STALE_TIME_MS,
  })
}
