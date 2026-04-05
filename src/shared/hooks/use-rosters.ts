import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getRosters } from '@/shared/api/managers.api'
import { minutes } from '@/shared/utils/time/time'

const ROSTER_STALE_TIME_MS = minutes(5)

export function useRosters(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.rosters(leagueId),
    queryFn: () => getRosters(leagueId),
    staleTime: ROSTER_STALE_TIME_MS,
  })
}
