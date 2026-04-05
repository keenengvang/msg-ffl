import { http, HttpResponse } from 'msw'
import {
  mockLeague,
  mockUsers,
  mockRosters,
  mockMatchupsWeek1,
  mockDraft,
  mockDraftPicks,
  mockNflState,
  LEAGUE_ID,
} from './fixtures'

const API = 'https://api.sleeper.app/v1'

export const handlers = [
  http.get(`${API}/league/${LEAGUE_ID}`, () => HttpResponse.json(mockLeague)),
  http.get(`${API}/league/${LEAGUE_ID}/users`, () => HttpResponse.json(mockUsers)),
  http.get(`${API}/league/${LEAGUE_ID}/rosters`, () => HttpResponse.json(mockRosters)),
  http.get(`${API}/league/${LEAGUE_ID}/matchups/:week`, () => HttpResponse.json(mockMatchupsWeek1)),
  http.get(`${API}/league/${LEAGUE_ID}/drafts`, () => HttpResponse.json([mockDraft])),
  http.get(`${API}/draft/${mockDraft.draft_id}/picks`, () => HttpResponse.json(mockDraftPicks)),
  http.get(`${API}/state/nfl`, () => HttpResponse.json(mockNflState)),
  http.get(`${API}/league/${LEAGUE_ID}/winners_bracket`, () => HttpResponse.json([])),
  http.get(`${API}/league/${LEAGUE_ID}/losers_bracket`, () => HttpResponse.json([])),
  http.get(`${API}/league/${LEAGUE_ID}/transactions/:round`, () => HttpResponse.json([])),
  http.get(`${API}/players/nfl`, () => HttpResponse.json({})),
  http.get('https://api.dicebear.com/*', () => HttpResponse.json({})),
]
