export type PlayerPosition = 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF' | 'DL' | 'LB' | 'DB' | 'OL'

export interface SleeperPlayer {
  player_id: string
  first_name: string
  last_name: string
  full_name?: string
  position: PlayerPosition
  fantasy_positions: string[]
  team: string | null
  number: number | null
  status: 'Active' | 'Inactive' | 'Injured Reserve' | null
  injury_status: 'Questionable' | 'Doubtful' | 'Out' | 'IR' | 'PUP' | null
  depth_chart_position: number | null
  depth_chart_order: number | null
  age: number | null
  years_exp: number
  college: string | null
  height: string | null
  weight: string | null
  sport: 'nfl'
  active: boolean
  search_rank: number | null
}

export interface SleeperTrendingPlayer {
  player_id: string
  count: number
}
