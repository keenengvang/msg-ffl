import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getUsers } from '@/shared/api/managers.api'

export function useUsers(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.users(leagueId),
    queryFn: () => getUsers(leagueId),
    staleTime: 1000 * 60 * 60,
  })
}
