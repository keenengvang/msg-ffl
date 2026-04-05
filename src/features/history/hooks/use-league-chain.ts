import { useQuery } from '@tanstack/react-query'
import { getLeague } from '@/shared/api/league.api'
import { queryKeys } from '@/core/api/query-keys'
import { LEAGUE_ID } from '@/core/config/league'
import type { SleeperLeague } from '@/shared/types/league.types'
import { days } from '@/shared/utils/time/time'

const LEAGUE_CHAIN_STALE_TIME_MS = days(1)

/** Recursively follows previous_league_id to build full season history */
export function useLeagueChain(startId = LEAGUE_ID) {
  const query = useQuery({
    queryKey: queryKeys.leagueChain(startId),
    queryFn: () => fetchLeagueChain(startId),
    staleTime: LEAGUE_CHAIN_STALE_TIME_MS,
  })

  return {
    leagues: query.data ?? [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}

async function fetchLeagueChain(startId: string): Promise<SleeperLeague[]> {
  const seen = new Set<string>()
  const leagues: SleeperLeague[] = []
  let cursor: string | null = startId

  while (cursor && !seen.has(cursor)) {
    const league = await getLeague(cursor)
    leagues.push(league)
    seen.add(cursor)
    cursor = league.previous_league_id
  }

  return leagues.sort((a, b) => Number(b.season) - Number(a.season))
}
