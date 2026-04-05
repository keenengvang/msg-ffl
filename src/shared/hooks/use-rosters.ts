import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getRosters } from '@/shared/api/managers.api'

export function useRosters(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.rosters(leagueId),
    queryFn: () => getRosters(leagueId),
    staleTime: 1000 * 60 * 5, // 5 min
  })
}
