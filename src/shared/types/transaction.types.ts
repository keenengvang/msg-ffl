export interface SleeperDraftPickTrade {
  season: string
  round: number
  roster_id: number
  previous_owner_id: number
  owner_id: number
}

export interface SleeperTransaction {
  transaction_id: string
  type: 'waiver' | 'free_agent' | 'trade' | 'commissioner'
  status: 'complete' | 'failed' | 'pending'
  roster_ids?: number[]
  creator: string
  created: number
  status_updated: number
  leg: number
  adds: Record<string, number> | null
  drops: Record<string, number> | null
  draft_picks: SleeperDraftPickTrade[]
  settings: { seq?: number; waiver_bid?: number; priority?: number } | null
  waiver_budget: { sender: number; receiver: number; amount: number }[]
  metadata: Record<string, string> | null
  consenter_ids: number[]
}
