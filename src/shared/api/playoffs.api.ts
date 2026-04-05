import { fetchJson } from '@/core/api/fetch-client'
import { API_BASE, LEAGUE_ID } from '@/core/config/league'
import type { SleeperBracketMatchup } from '@/shared/types/bracket.types'

export const getWinnersBracket = (leagueId = LEAGUE_ID) =>
  fetchJson<SleeperBracketMatchup[]>(`${API_BASE}/league/${leagueId}/winners_bracket`)

export const getLosersBracket = (leagueId = LEAGUE_ID) =>
  fetchJson<SleeperBracketMatchup[]>(`${API_BASE}/league/${leagueId}/losers_bracket`)
