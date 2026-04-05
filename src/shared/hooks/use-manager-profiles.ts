import { useMemo } from 'react'
import { useUsers } from '@/shared/hooks/use-users'
import { useRosters } from '@/shared/hooks/use-rosters'
import { resolveAvatarUrl } from '@/shared/api/managers.api'
import type { ManagerProfile } from '@/shared/types/manager.types'

function parseStreak(str?: string): ManagerProfile['streak'] {
  if (!str) return null
  const type = str[0] as 'W' | 'L' | 'T'
  const count = parseInt(str.slice(1), 10)
  if (isNaN(count)) return null
  return { type, count }
}

export function useManagerProfiles(leagueId?: string) {
  const { data: users, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers(leagueId)
  const {
    data: rosters,
    isLoading: rostersLoading,
    error: rostersError,
    refetch: refetchRosters,
  } = useRosters(leagueId)

  const profiles = useMemo<ManagerProfile[]>(() => {
    if (!users || !rosters) return []

    const userMap = Object.fromEntries(users.map((u) => [u.user_id, u]))

    return rosters.map((roster) => {
      const user = userMap[roster.owner_id]
      const displayName = user?.display_name ?? `Team ${roster.roster_id}`
      const teamName = user?.metadata?.team_name || displayName
      const avatar = user?.metadata?.avatar ?? user?.avatar ?? null
      const avatarUrl = resolveAvatarUrl(avatar, displayName)

      const pf = (roster.settings.fpts ?? 0) + (roster.settings.fpts_decimal ?? 0) / 100
      const pa = (roster.settings.fpts_against ?? 0) + (roster.settings.fpts_against_decimal ?? 0) / 100
      const pp = (roster.settings.ppts ?? 0) + (roster.settings.ppts_decimal ?? 0) / 100
      const wins = roster.settings.wins ?? 0
      const losses = roster.settings.losses ?? 0
      const ties = roster.settings.ties ?? 0
      const played = wins + losses + ties
      const winPct = played > 0 ? wins / played : 0

      return {
        userId: roster.owner_id,
        rosterId: roster.roster_id,
        displayName,
        teamName,
        avatarUrl,
        wins,
        losses,
        ties,
        pointsFor: pf,
        pointsAgainst: pa,
        potentialPoints: pp,
        winPct,
        streak: parseStreak(roster.metadata?.streak),
        totalMoves: roster.settings.total_moves ?? 0,
        waiverBudgetUsed: roster.settings.waiver_budget_used ?? 0,
        players: roster.players ?? [],
        isOwner: user?.is_owner ?? false,
      } satisfies ManagerProfile
    })
  }, [users, rosters])

  const error = usersError || rostersError
  const refetch = () => {
    refetchUsers()
    refetchRosters()
  }

  return {
    profiles,
    isLoading: usersLoading || rostersLoading,
    error,
    refetch,
    sortedByRank: [...profiles].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.pointsFor - a.pointsFor
    }),
  }
}
