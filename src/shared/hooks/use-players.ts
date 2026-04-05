import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getPlayers, getTrendingAdds } from '@/shared/api/players.api'

export function usePlayers() {
  return useQuery({
    queryKey: queryKeys.players(),
    queryFn: () => getPlayers(),
    staleTime: 1000 * 60 * 60 * 24, // 24h — persisted to localStorage
    gcTime: 1000 * 60 * 60 * 24,
  })
}

export function useTrendingAdds() {
  return useQuery({
    queryKey: queryKeys.trendingAdds(),
    queryFn: () => getTrendingAdds(),
    staleTime: 1000 * 60 * 15,
  })
}
