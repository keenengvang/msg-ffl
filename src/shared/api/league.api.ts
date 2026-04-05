import { fetchJson } from '@/core/api/fetch-client'
import { API_BASE, LEAGUE_ID } from '@/core/config/league'
import type { SleeperLeague, SleeperNflState } from '@/shared/types/league.types'

export const getLeague = (leagueId = LEAGUE_ID) => fetchJson<SleeperLeague>(`${API_BASE}/league/${leagueId}`)

export const getNflState = () => fetchJson<SleeperNflState>(`${API_BASE}/state/nfl`)
