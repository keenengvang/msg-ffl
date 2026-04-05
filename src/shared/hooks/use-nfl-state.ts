import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getNflState } from '@/shared/api/league.api'

export function useNflState() {
  return useQuery({
    queryKey: queryKeys.nflState(),
    queryFn: () => getNflState(),
    staleTime: 1000 * 60 * 30,
  })
}
