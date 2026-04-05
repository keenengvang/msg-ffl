export interface SleeperLeague {
  league_id: string
  name: string
  season: string
  season_type: 'regular' | 'post' | 'pre'
  status: 'pre_draft' | 'drafting' | 'in_season' | 'complete'
  sport: 'nfl'
  total_rosters: number
  roster_positions: string[]
  scoring_settings: Record<string, number>
  settings: {
    playoff_week_start: number
    playoff_teams: number
    num_teams: number
    trade_deadline: number
    waiver_type: number
    max_keepers: number
    draft_rounds: number
    leg: number
  }
  avatar: string | null
  previous_league_id: string | null
}

export interface SleeperNflState {
  week: number
  leg: number
  season: string
  season_type: 'regular' | 'post' | 'pre' | 'off'
  league_season: string
  previous_season: string
  display_week: number
  season_start_date: string | null
  season_has_scores: boolean
  league_create_season: string
}
