import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getUsers } from '@/shared/api/managers.api'
import { hours } from '@/shared/utils/time/time'

const USERS_STALE_TIME_MS = hours(1)

export function useUsers(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.users(leagueId),
    queryFn: () => getUsers(leagueId),
    staleTime: USERS_STALE_TIME_MS,
  })
}
