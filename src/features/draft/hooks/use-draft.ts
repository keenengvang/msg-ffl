import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { getDrafts, getDraftPicks } from '@/features/draft/api/draft.api'
import { hours, days } from '@/shared/utils/time/time'

const DRAFT_LIST_STALE_TIME_MS = hours(1)
const DRAFT_PICKS_STALE_TIME_MS = days(1)

export function useDrafts(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.drafts(leagueId),
    queryFn: () => getDrafts(leagueId),
    staleTime: DRAFT_LIST_STALE_TIME_MS,
  })
}

export function useDraftPicks(draftId?: string) {
  const queryKey = draftId ? queryKeys.draftPicks(draftId) : (['draft_picks', 'pending'] as const)

  return useQuery({
    queryKey,
    queryFn: () => getDraftPicks(draftId!),
    staleTime: DRAFT_PICKS_STALE_TIME_MS,
    enabled: Boolean(draftId),
  })
}
