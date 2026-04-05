import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getWinnersBracket, getLosersBracket } from '@/shared/api/playoffs.api'
import { minutes } from '@/shared/utils/time/time'

const BRACKET_STALE_TIME_MS = minutes(30)

export function useWinnersBracket(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.winnersBracket(leagueId),
    queryFn: () => getWinnersBracket(leagueId),
    staleTime: BRACKET_STALE_TIME_MS,
  })
}

export function useLosersBracket(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.losersBracket(leagueId),
    queryFn: () => getLosersBracket(leagueId),
    staleTime: BRACKET_STALE_TIME_MS,
  })
}
