import { fetchJson } from '@/core/api/fetch-client'
import { API_BASE } from '@/core/config/league'
import type { SleeperPlayer, SleeperTrendingPlayer } from '@/shared/types/player.types'

export const getPlayers = () => fetchJson<Record<string, SleeperPlayer>>(`${API_BASE}/players/nfl`)

export const getTrendingAdds = (limit = 25) =>
  fetchJson<SleeperTrendingPlayer[]>(`${API_BASE}/players/nfl/trending/add?lookback_hours=24&limit=${limit}`)
