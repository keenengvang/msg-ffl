export interface SleeperDraftPickTrade {
  season: string
  round: number
  roster_id: number
  previous_owner_id: number
  owner_id: number
}

export interface SleeperDraft {
  draft_id: string
  league_id: string
  season: string
  status: 'pre_draft' | 'drafting' | 'complete'
  type: 'snake' | 'auction' | 'linear'
  sport: 'nfl'
  settings: {
    rounds: number
    teams: number
    pick_timer: number
    scoring_type: string
    slots_qb?: number
    slots_rb?: number
    slots_wr?: number
    slots_te?: number
    slots_flex?: number
    slots_k?: number
    slots_def?: number
    slots_bn?: number
  }
  draft_order: Record<string, number> | null
  slot_to_roster_id: Record<string, number>
  metadata: { scoring_type: string; name: string; description?: string }
  created: number
  start_time: number
  last_picked: number
}

export interface SleeperDraftPick {
  pick_id: string
  draft_id: string
  picked_by: string
  roster_id: number
  round: number
  draft_slot: number
  pick_no: number
  player_id: string
  metadata: {
    amount?: string
    position: string
    number?: string
    slot?: string
    status?: string
    sport?: string
    team: string
    first_name: string
    last_name: string
    years_exp?: string
    injury_status?: string
  }
  is_keeper: boolean | null
  created: number
}
