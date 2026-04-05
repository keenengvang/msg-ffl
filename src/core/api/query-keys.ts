import { LEAGUE_ID } from '@/core/config/league'

export const queryKeys = {
  league: (id = LEAGUE_ID) => ['league', id] as const,
  leagueChain: (id = LEAGUE_ID) => ['league_chain', id] as const,
  leagueStandings: (ids: string[]) => ['league_standings', ...ids] as const,
  users: (id = LEAGUE_ID) => ['users', id] as const,
  rosters: (id = LEAGUE_ID) => ['rosters', id] as const,
  matchups: (week: number, id = LEAGUE_ID) => ['matchups', id, week] as const,
  matchupsSeason: (startWeek: number, length: number, id = LEAGUE_ID) =>
    ['matchups_season', id, startWeek, length] as const,
  winnersBracket: (id = LEAGUE_ID) => ['winners_bracket', id] as const,
  losersBracket: (id = LEAGUE_ID) => ['losers_bracket', id] as const,
  transactions: (round: number, id = LEAGUE_ID) => ['transactions', id, round] as const,
  transactionsSeason: (length: number, id = LEAGUE_ID) => ['transactions_season', id, length] as const,
  drafts: (id = LEAGUE_ID) => ['drafts', id] as const,
  draftPicks: (draftId: string) => ['draft_picks', draftId] as const,
  players: () => ['players'] as const,
  trendingAdds: () => ['trending_adds'] as const,
  nflState: () => ['nfl_state'] as const,
}
