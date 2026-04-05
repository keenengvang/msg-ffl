import { useQueries } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { getLeague } from '@/shared/api/league.api'
import { queryKeys } from '@/core/api/query-keys'
import { LEAGUE_ID } from '@/core/config/league'
import type { SleeperLeague } from '@/shared/types/league.types'

/** Recursively follows previous_league_id to build full season history */
export function useLeagueChain(startId = LEAGUE_ID) {
  const [leagueIds, setLeagueIds] = useState<string[]>([startId])

  // Fetch all discovered leagues in parallel
  const leagueResults = useQueries({
    queries: leagueIds.map((id) => ({
      queryKey: queryKeys.league(id),
      queryFn: () => getLeague(id),
      staleTime: 1000 * 60 * 60 * 24,
    })),
  })

  // useEffect required: progressively discovers previous seasons by reading
  // resolved query data and expanding leagueIds, which drives useQueries above.
  // Cannot be derived — each new ID triggers a new fetch whose result may yield another ID.
  useEffect(() => {
    leagueResults.forEach((r) => {
      if (r.data?.previous_league_id) {
        const prev = r.data.previous_league_id
        setLeagueIds((ids) => (ids.includes(prev) ? ids : [...ids, prev]))
      }
    })
  }, [leagueResults])

  const leagues = leagueResults
    .map((r) => r.data)
    .filter((l): l is SleeperLeague => !!l)
    .sort((a, b) => Number(b.season) - Number(a.season)) // newest first

  const isLoading = leagueResults.some((r) => r.isPending)
  const error = leagueResults.find((r) => r.error)?.error ?? null
  const refetch = () => leagueResults.forEach((r) => r.refetch())

  return { leagues, leagueIds, isLoading, error, refetch }
}
