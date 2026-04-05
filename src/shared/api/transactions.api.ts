import { fetchJson } from '@/core/api/fetch-client'
import { API_BASE, LEAGUE_ID } from '@/core/config/league'
import type { SleeperTransaction } from '@/shared/types/transaction.types'

export const getTransactions = (round: number, leagueId = LEAGUE_ID) =>
  fetchJson<SleeperTransaction[]>(`${API_BASE}/league/${leagueId}/transactions/${round}`)
