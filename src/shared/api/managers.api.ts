import { fetchJson } from '@/core/api/fetch-client'
import { API_BASE, LEAGUE_ID, CDN_BASE, DICEBEAR_BASE } from '@/core/config/league'
import type { SleeperUser, SleeperRoster } from '@/shared/types/manager.types'

export const getUsers = (leagueId = LEAGUE_ID) => fetchJson<SleeperUser[]>(`${API_BASE}/league/${leagueId}/users`)

export const getRosters = (leagueId = LEAGUE_ID) => fetchJson<SleeperRoster[]>(`${API_BASE}/league/${leagueId}/rosters`)

export function resolveAvatarUrl(avatar: string | null | undefined, username: string): string {
  if (avatar && avatar.length > 10 && !avatar.toLowerCase().includes('none')) {
    if (avatar.startsWith('http')) return avatar
    return `${CDN_BASE}/avatars/${avatar}`
  }
  return `${DICEBEAR_BASE}?seed=${encodeURIComponent(username)}&backgroundColor=0a0a0f`
}
