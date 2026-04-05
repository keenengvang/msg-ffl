import { fetchJson } from '@/core/api/fetch-client'
import { API_BASE, LEAGUE_ID } from '@/core/config/league'
import type { SleeperDraft, SleeperDraftPick } from '@/features/draft/types/draft.types'

export const getDrafts = (leagueId = LEAGUE_ID) => fetchJson<SleeperDraft[]>(`${API_BASE}/league/${leagueId}/drafts`)

export const getDraftPicks = (draftId: string) => fetchJson<SleeperDraftPick[]>(`${API_BASE}/draft/${draftId}/picks`)
