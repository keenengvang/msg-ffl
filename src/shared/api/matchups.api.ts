import { fetchJson } from '@/core/api/fetch-client'
import { API_BASE, LEAGUE_ID } from '@/core/config/league'
import type { SleeperMatchup } from '@/shared/types/matchup.types'

export const getMatchups = (week: number, leagueId = LEAGUE_ID) =>
  fetchJson<SleeperMatchup[]>(`${API_BASE}/league/${leagueId}/matchups/${week}`)
