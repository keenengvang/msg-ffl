import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getMatchups } from '@/shared/api/matchups.api'
import { TOTAL_WEEKS } from '@/core/config/league'
import { minutes } from '@/shared/utils/time/time'
import type { SleeperMatchup } from '@/shared/types/matchup.types'

const MATCHUP_STALE_TIME_MS = minutes(5)

export function useMatchups(week: number, leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.matchups(week, leagueId),
    queryFn: () => getMatchups(week, leagueId),
    staleTime: MATCHUP_STALE_TIME_MS,
    enabled: week > 0,
  })
}

type SeasonMatchupsHookResult = {
  weeks: SleeperMatchup[][]
  isLoading: boolean
  error: unknown
  refetch: () => void
}

export function useAllMatchups(totalWeeks = TOTAL_WEEKS, leagueId?: string, startWeek = 1): SeasonMatchupsHookResult {
  const weeksToFetch = Array.from({ length: totalWeeks }, (_, index) => startWeek + index).filter((week) => week > 0)

  const query = useQuery({
    queryKey: queryKeys.matchupsSeason(startWeek, weeksToFetch.length, leagueId),
    queryFn: () => fetchSeasonMatchups(weeksToFetch, leagueId),
    staleTime: MATCHUP_STALE_TIME_MS,
    enabled: weeksToFetch.length > 0,
  })

  return {
    weeks: query.data ?? [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}

async function fetchSeasonMatchups(weeks: number[], leagueId?: string): Promise<SleeperMatchup[][]> {
  if (weeks.length === 0) {
    return []
  }

  const matchupsByWeek = await Promise.all(weeks.map((week) => getMatchups(week, leagueId)))
  return matchupsByWeek
}
