export interface SleeperMatchup {
  matchup_id: number
  roster_id: number
  points: number
  players: string[]
  starters: string[]
  players_points: Record<string, number>
  starters_points: number[]
  custom_points: Record<string, number> | null
}

export interface WeeklyMatchupResult {
  week: number
  matchupId: number
  rosterId: number
  opponentRosterId: number
  pointsFor: number
  pointsAgainst: number
  won: boolean | null
  margin: number
}

export interface H2HRecord {
  opponentRosterId: number
  wins: number
  losses: number
  ties: number
  pointsFor: number
  pointsAgainst: number
}

export interface PowerRanking {
  rosterId: number
  rank: number
  score: number
  trend: 'up' | 'down' | 'same'
}

export interface FunStats {
  biggestBlowout: { rosterId: number; opponentId: number; week: number; margin: number } | null
  closestGame: { rosterId: number; opponentId: number; week: number; margin: number } | null
  highestWeekScore: { rosterId: number; week: number; points: number } | null
  lowestWeekScore: { rosterId: number; week: number; points: number } | null
  luckiestManager: { rosterId: number; luckScore: number } | null
  unluckiestManager: { rosterId: number; luckScore: number } | null
  mostConsistentManager: { rosterId: number; stdDev: number } | null
  boomBustManager: { rosterId: number; stdDev: number } | null
  longestWinStreak: { rosterId: number; length: number } | null
  longestLossStreak: { rosterId: number; length: number } | null
  mostActivGM: { rosterId: number; moves: number } | null
  luckIndex: Record<number, number>
}
