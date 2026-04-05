import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getPlayers, getTrendingAdds } from '@/shared/api/players.api'
import { days, minutes } from '@/shared/utils/time/time'

const PLAYER_CACHE_DURATION_MS = days(1)
const TRENDING_STALE_TIME_MS = minutes(15)

export function usePlayers() {
  return useQuery({
    queryKey: queryKeys.players(),
    queryFn: () => getPlayers(),
    staleTime: PLAYER_CACHE_DURATION_MS,
    gcTime: PLAYER_CACHE_DURATION_MS,
  })
}

export function useTrendingAdds() {
  return useQuery({
    queryKey: queryKeys.trendingAdds(),
    queryFn: () => getTrendingAdds(),
    staleTime: TRENDING_STALE_TIME_MS,
  })
}
