import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getWinnersBracket, getLosersBracket } from '@/shared/api/playoffs.api'

export function useWinnersBracket(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.winnersBracket(leagueId),
    queryFn: () => getWinnersBracket(leagueId),
    staleTime: 1000 * 60 * 30,
  })
}

export function useLosersBracket(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.losersBracket(leagueId),
    queryFn: () => getLosersBracket(leagueId),
    staleTime: 1000 * 60 * 30,
  })
}
