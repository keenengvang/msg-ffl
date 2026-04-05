export interface SleeperUser {
  user_id: string
  username: string
  display_name: string
  avatar: string | null
  metadata: {
    team_name?: string
    avatar?: string
    [key: string]: string | undefined
  }
  is_owner: boolean
  league_id?: string
}

export interface SleeperRosterSettings {
  wins: number
  losses: number
  ties: number
  fpts: number
  fpts_decimal: number
  fpts_against: number
  fpts_against_decimal: number
  ppts: number
  ppts_decimal: number
  waiver_budget_used: number
  waiver_position: number
  total_moves: number
}

export interface SleeperRoster {
  roster_id: number
  owner_id: string
  co_owners: string[] | null
  league_id: string
  players: string[]
  starters: string[]
  reserve: string[] | null
  taxi: string[] | null
  settings: SleeperRosterSettings
  metadata: {
    streak?: string
    record?: string
    [key: string]: string | undefined
  }
}

export interface ManagerProfile {
  userId: string
  rosterId: number
  displayName: string
  teamName: string
  avatarUrl: string
  wins: number
  losses: number
  ties: number
  pointsFor: number
  pointsAgainst: number
  potentialPoints: number
  winPct: number
  streak: { type: 'W' | 'L' | 'T'; count: number } | null
  totalMoves: number
  waiverBudgetUsed: number
  players: string[]
  isOwner: boolean
}
