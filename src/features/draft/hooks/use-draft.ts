import { useQuery, useQueries } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getDrafts, getDraftPicks } from '@/features/draft/api/draft.api'

export function useDrafts(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.drafts(leagueId),
    queryFn: () => getDrafts(leagueId),
    staleTime: 1000 * 60 * 60,
  })
}

export function useDraftPicks(draftIds: string[]) {
  return useQueries({
    queries: draftIds.map((id) => ({
      queryKey: queryKeys.draftPicks(id),
      queryFn: () => getDraftPicks(id),
      staleTime: 1000 * 60 * 60 * 24,
      enabled: !!id,
    })),
  })
}
