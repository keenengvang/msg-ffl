import { ACHIEVEMENT_DEFS } from '@/features/achievements/types/achievement-defs'
import type { EarnedAchievement } from '@/features/achievements/types/achievement.types'
import type { WeeklyMatchupResult } from '@/shared/types/matchup.types'
import type { SleeperTransaction } from '@/shared/types/transaction.types'

export function computeAchievements(
  results: WeeklyMatchupResult[],
  transactions: SleeperTransaction[],
  rosterIds: number[],
  championRosterId: number | null,
  runnerUpRosterId: number | null,
  playoffRosterIds: number[],
  toiletBowlWinner: number | null,
  lastPlaceRosterId: number | null,
): EarnedAchievement[] {
  const earned: Map<string, EarnedAchievement> = new Map()

  function award(id: string, rosterId: number, week?: number, detail?: string) {
    const def = ACHIEVEMENT_DEFS.find((a) => a.id === id)
    if (!def) return
    const existing = earned.get(id) ?? { ...def, earnedBy: [] }
    existing.earnedBy.push({ rosterId, week, detail })
    earned.set(id, existing)
  }

  const nonZero = results.filter((r) => r.pointsFor > 0)

  // Highest single-week score
  const sorted = [...nonZero].sort((a, b) => b.pointsFor - a.pointsFor)
  if (sorted[0]) {
    award('goat_week', sorted[0].rosterId, sorted[0].week, `${sorted[0].pointsFor.toFixed(2)} pts`)
    award(
      'highest_scorer',
      sorted.reduce((max, _r) => {
        const acc: Record<number, number> = {}
        nonZero.forEach((x) => {
          acc[x.rosterId] = (acc[x.rosterId] ?? 0) + x.pointsFor
        })
        return Object.entries(acc).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0]
          ? Number(Object.entries(acc).sort((a, b) => Number(b[1]) - Number(a[1]))[0][0])
          : max
      }, sorted[0].rosterId),
    )
  }

  // Score milestones
  nonZero.forEach((r) => {
    if (r.pointsFor >= 200) award('double_century', r.rosterId, r.week, `${r.pointsFor.toFixed(2)} pts`)
    else if (r.pointsFor >= 150) award('century_club', r.rosterId, r.week, `${r.pointsFor.toFixed(2)} pts`)
  })

  // Blowout / close games
  const byMatchup = new Map<string, WeeklyMatchupResult[]>()
  nonZero.forEach((r) => {
    const key = `${r.week}-${r.matchupId}`
    byMatchup.set(key, [...(byMatchup.get(key) ?? []), r])
  })

  let biggestMargin = 0
  byMatchup.forEach((pair) => {
    if (pair.length !== 2) return
    const [w, l] = pair[0].won ? pair : [pair[1], pair[0]]
    const margin = w.margin
    if (margin >= 50) award('blowout_king', w.rosterId, w.week, `Won by ${margin.toFixed(2)}`)
    if (margin > biggestMargin) {
      biggestMargin = margin
    }
    if (margin < 5 && w.won) award('nail_biter', w.rosterId, w.week, `Won by ${margin.toFixed(2)}`)
    if (margin < 2 && !w.won) award('heartbreak', l.rosterId, l.week, `Lost by ${margin.toFixed(2)}`)
  })

  // Massacre (biggest blowout ever)
  let massacreResult: WeeklyMatchupResult | null = null
  byMatchup.forEach((pair) => {
    if (pair.length !== 2) return
    const winner = pair.find((r) => r.won)
    if (winner && (!massacreResult || winner.margin > massacreResult.margin)) {
      massacreResult = winner
    }
  })
  if (massacreResult) {
    award('massacre', (massacreResult as WeeklyMatchupResult).rosterId, (massacreResult as WeeklyMatchupResult).week)
  }

  // Hot start (won first 4)
  rosterIds.forEach((id) => {
    const first4 = results.filter((r) => r.rosterId === id && r.week <= 4)
    if (first4.length >= 4 && first4.every((r) => r.won)) {
      award('hot_start', id)
    }
  })

  // Redemption arc (made playoffs despite 0-3 or worse start)
  rosterIds.forEach((id) => {
    const early = results.filter((r) => r.rosterId === id && r.week <= 3)
    if (early.length >= 3 && early.every((r) => !r.won) && playoffRosterIds.includes(id)) {
      award('redemption_arc', id)
    }
  })

  // Lucky win / unlucky loss (scored below avg but won, or above avg but lost)
  const weeklyAvg: Record<number, number> = {}
  const weekCounts: Record<number, number> = {}
  nonZero.forEach((r) => {
    weeklyAvg[r.week] = (weeklyAvg[r.week] ?? 0) + r.pointsFor
    weekCounts[r.week] = (weekCounts[r.week] ?? 0) + 1
  })
  Object.keys(weeklyAvg).forEach((w) => {
    weeklyAvg[Number(w)] = weeklyAvg[Number(w)] / weekCounts[Number(w)]
  })

  nonZero.forEach((r) => {
    const avg = weeklyAvg[r.week] ?? 0
    if (r.won && r.pointsFor < avg) award('lucky_win', r.rosterId, r.week)
    if (!r.won && r.pointsFor > avg) award('unlucky_loss', r.rosterId, r.week)
  })

  // Season awards
  if (championRosterId) award('champion', championRosterId)
  if (runnerUpRosterId) award('runner_up', runnerUpRosterId)
  playoffRosterIds.forEach((id) => award('playoff_berth', id))
  if (toiletBowlWinner) award('toilet_bowl', toiletBowlWinner)
  if (lastPlaceRosterId) award('last_place', lastPlaceRosterId)

  // GM achievements
  const tradesByRoster: Record<number, number> = {}
  const claimsByRoster: Record<number, number> = {}
  transactions
    .filter((t) => t.status === 'complete')
    .forEach((t) => {
      if (t.type === 'trade') {
        t.roster_ids.forEach((id) => {
          tradesByRoster[id] = (tradesByRoster[id] ?? 0) + 1
        })
      }
      if (t.type === 'waiver' || t.type === 'free_agent') {
        t.roster_ids.forEach((id) => {
          claimsByRoster[id] = (claimsByRoster[id] ?? 0) + 1
        })
      }
    })

  const maxClaims = Math.max(...Object.values(claimsByRoster), 0)
  const minMoves = Math.min(...rosterIds.map((id) => (tradesByRoster[id] ?? 0) + (claimsByRoster[id] ?? 0)))

  Object.entries(claimsByRoster).forEach(([id, count]) => {
    if (count === maxClaims && maxClaims > 0) award('waiver_wolf', Number(id))
  })
  Object.entries(tradesByRoster).forEach(([id, count]) => {
    if (count >= 3) award('trade_machine', Number(id))
  })
  rosterIds.forEach((id) => {
    const moves = (tradesByRoster[id] ?? 0) + (claimsByRoster[id] ?? 0)
    if (moves === minMoves) award('hodler', id)
  })

  // Rivalry achievements
  const h2hWins: Record<string, number> = {}
  nonZero.forEach((r) => {
    if (r.won) {
      const key = `${r.rosterId}-${r.opponentRosterId}`
      h2hWins[key] = (h2hWins[key] ?? 0) + 1
    }
  })
  Object.entries(h2hWins).forEach(([key, wins]) => {
    const [winnerId, loserId] = key.split('-').map(Number)
    if (wins >= 3) award('bully', winnerId)
    if (wins >= 3) award('nemesis', loserId)
  })

  return Array.from(earned.values())
}
