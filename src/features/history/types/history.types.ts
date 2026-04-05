export interface SeasonRecord {
  season: string
  leagueId: string
  leagueName: string
  managerId: string
  rosterId: number
  displayName: string
  teamName: string
  wins: number
  losses: number
  ties: number
  pointsFor: number
  pointsAgainst: number
  finalRank: number
  champion: boolean
  madePlayoffs: boolean
}

export interface AllTimeStat {
  managerId: string
  displayName: string
  seasons: number
  totalWins: number
  totalLosses: number
  totalPF: number
  totalPA: number
  championships: number
  playoffAppearances: number
  winPct: number
}
