import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getNflState } from '@/shared/api/league.api'
import { minutes } from '@/shared/utils/time/time'

const NFL_STATE_STALE_TIME_MS = minutes(30)

export function useNflState() {
  return useQuery({
    queryKey: queryKeys.nflState(),
    queryFn: () => getNflState(),
    staleTime: NFL_STATE_STALE_TIME_MS,
  })
}
