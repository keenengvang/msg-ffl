import type { SleeperMatchup } from '@/shared/types/matchup.types'
import type { FunStats, H2HRecord, PowerRanking, WeeklyMatchupResult } from '@/shared/types/matchup.types'
import { stdDev } from '@/shared/lib/format/format'

/** Pair matchups for a single week into head-to-head results */
export function pairMatchups(weekMatchups: SleeperMatchup[]): WeeklyMatchupResult[] {
  const byMatchupId = new Map<number, SleeperMatchup[]>()
  for (const m of weekMatchups) {
    const group = byMatchupId.get(m.matchup_id) ?? []
    group.push(m)
    byMatchupId.set(m.matchup_id, group)
  }

  const results: WeeklyMatchupResult[] = []
  byMatchupId.forEach((pair, matchupId) => {
    if (pair.length !== 2) return
    const [a, b] = pair
    results.push({
      week: 0, // caller fills this in
      matchupId,
      rosterId: a.roster_id,
      opponentRosterId: b.roster_id,
      pointsFor: a.points ?? 0,
      pointsAgainst: b.points ?? 0,
      won: a.points !== null && b.points !== null ? a.points > b.points : null,
      margin: Math.abs((a.points ?? 0) - (b.points ?? 0)),
    })
    results.push({
      week: 0,
      matchupId,
      rosterId: b.roster_id,
      opponentRosterId: a.roster_id,
      pointsFor: b.points ?? 0,
      pointsAgainst: a.points ?? 0,
      won: a.points !== null && b.points !== null ? b.points > a.points : null,
      margin: Math.abs((a.points ?? 0) - (b.points ?? 0)),
    })
  })
  return results
}

/** Build all weekly results from all weeks of matchup data */
export function buildAllResults(allWeekMatchups: (SleeperMatchup[] | undefined)[]): WeeklyMatchupResult[] {
  return allWeekMatchups.flatMap((weekData, i) => {
    if (!weekData) return []
    return pairMatchups(weekData).map((r) => ({ ...r, week: i + 1 }))
  })
}

/** H2H records: for each roster, record vs every opponent */
export function buildH2HRecords(results: WeeklyMatchupResult[]): Record<number, Record<number, H2HRecord>> {
  const records: Record<number, Record<number, H2HRecord>> = {}

  for (const r of results) {
    if (r.won === null) continue
    if (!records[r.rosterId]) records[r.rosterId] = {}
    const rec = records[r.rosterId][r.opponentRosterId] ?? {
      opponentRosterId: r.opponentRosterId,
      wins: 0,
      losses: 0,
      ties: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    }
    if (r.won) rec.wins++
    else if (!r.won) rec.losses++
    else rec.ties++
    rec.pointsFor += r.pointsFor
    rec.pointsAgainst += r.pointsAgainst
    records[r.rosterId][r.opponentRosterId] = rec
  }

  return records
}

/** Luck index: actual wins minus expected wins based on scoring */
export function computeLuckIndex(allWeekMatchups: (SleeperMatchup[] | undefined)[]): Record<number, number> {
  const actualWins: Record<number, number> = {}
  const expectedWins: Record<number, number> = {}

  allWeekMatchups.forEach((weekData) => {
    if (!weekData || weekData.length === 0) return

    const scored = weekData.filter((m) => (m.points ?? 0) > 0)
    if (scored.length === 0) return

    const totalPts = scored.reduce((s, m) => s + (m.points ?? 0), 0)
    const n = scored.length

    scored.forEach((m) => {
      const expected = ((m.points ?? 0) / totalPts) * (n - 1)
      expectedWins[m.roster_id] = (expectedWins[m.roster_id] ?? 0) + expected
    })

    const paired = pairMatchups(scored)
    paired.forEach((r) => {
      if (r.won === true) {
        actualWins[r.rosterId] = (actualWins[r.rosterId] ?? 0) + 1
      }
    })
  })

  const index: Record<number, number> = {}
  const allIds = new Set([...Object.keys(actualWins), ...Object.keys(expectedWins)].map(Number))
  allIds.forEach((id) => {
    index[id] = (actualWins[id] ?? 0) - (expectedWins[id] ?? 0)
  })
  return index
}

/** Power rankings: composite score */
export function computePowerRankings(results: WeeklyMatchupResult[], rosterIds: number[]): PowerRanking[] {
  const now = results.length > 0 ? Math.max(...results.map((r) => r.week)) : 0
  const recentWeeks = 3

  const scoresByRoster: Record<number, number[]> = {}
  results.forEach((r) => {
    if (!scoresByRoster[r.rosterId]) scoresByRoster[r.rosterId] = []
    scoresByRoster[r.rosterId].push(r.pointsFor)
  })

  const allScores = results.map((r) => r.pointsFor)
  const leagueAvg = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 1

  const winsByRoster: Record<number, number> = {}
  results.forEach((r) => {
    if (r.won) winsByRoster[r.rosterId] = (winsByRoster[r.rosterId] ?? 0) + 1
  })

  const opponentPF: Record<number, number[]> = {}
  results.forEach((r) => {
    if (!opponentPF[r.rosterId]) opponentPF[r.rosterId] = []
    opponentPF[r.rosterId].push(r.pointsAgainst)
  })

  const scored = rosterIds.map((id) => {
    const scores = scoresByRoster[id] ?? []
    const pf = scores.reduce((a, b) => a + b, 0)
    const recentScores = results.filter((r) => r.rosterId === id && r.week > now - recentWeeks).map((r) => r.pointsFor)
    const recentAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0
    const sos = opponentPF[id]?.reduce((a, b) => a + b, 0) / (opponentPF[id]?.length || 1) || 0
    const wins = winsByRoster[id] ?? 0

    const score = wins * 3 + (pf / leagueAvg) * 10 + (sos / leagueAvg) * 0.5 + (recentAvg / leagueAvg) * 5

    return { rosterId: id, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.map((s, i) => ({
    rosterId: s.rosterId,
    rank: i + 1,
    score: Math.round(s.score * 10) / 10,
    trend: 'same' as const,
  }))
}

/** Compute all fun stats from all weekly results */
export function computeFunStats(
  results: WeeklyMatchupResult[],
  allWeekMatchups: (SleeperMatchup[] | undefined)[],
  rosterMoves: Record<number, number>,
): FunStats {
  const nonZero = results.filter((r) => r.pointsFor > 0)

  let biggestBlowout = null
  let closestGame = null
  let highestWeekScore = null
  let lowestWeekScore = null

  for (const r of nonZero) {
    if (!biggestBlowout || r.margin > biggestBlowout.margin) {
      biggestBlowout = { rosterId: r.rosterId, opponentId: r.opponentRosterId, week: r.week, margin: r.margin }
    }
    if (!closestGame || r.margin < closestGame.margin) {
      closestGame = { rosterId: r.rosterId, opponentId: r.opponentRosterId, week: r.week, margin: r.margin }
    }
    if (!highestWeekScore || r.pointsFor > highestWeekScore.points) {
      highestWeekScore = { rosterId: r.rosterId, week: r.week, points: r.pointsFor }
    }
    if (!lowestWeekScore || r.pointsFor < lowestWeekScore.points) {
      lowestWeekScore = { rosterId: r.rosterId, week: r.week, points: r.pointsFor }
    }
  }

  // Consistency (std dev)
  const rosterIds = [...new Set(results.map((r) => r.rosterId))]
  const deviations = rosterIds.map((id) => ({
    rosterId: id,
    stdDev: stdDev(results.filter((r) => r.rosterId === id).map((r) => r.pointsFor)),
  }))
  deviations.sort((a, b) => a.stdDev - b.stdDev)
  const mostConsistentManager = deviations[0]
    ? { rosterId: deviations[0].rosterId, stdDev: deviations[0].stdDev }
    : null
  const boomBustManager = deviations[deviations.length - 1]
    ? { rosterId: deviations[deviations.length - 1].rosterId, stdDev: deviations[deviations.length - 1].stdDev }
    : null

  // Streaks
  const streaksByRoster: Record<number, { current: 'W' | 'L'; len: number }> = {}
  const maxWin: Record<number, number> = {}
  const maxLoss: Record<number, number> = {}

  const sorted = [...results].filter((r) => r.won !== null).sort((a, b) => a.week - b.week)
  for (const r of sorted) {
    const prev = streaksByRoster[r.rosterId]
    const type = r.won ? 'W' : 'L'
    if (prev && prev.current === type) {
      prev.len++
    } else {
      streaksByRoster[r.rosterId] = { current: type, len: 1 }
    }
    const len = streaksByRoster[r.rosterId].len
    if (type === 'W') maxWin[r.rosterId] = Math.max(maxWin[r.rosterId] ?? 0, len)
    else maxLoss[r.rosterId] = Math.max(maxLoss[r.rosterId] ?? 0, len)
  }

  const bestWin = Object.entries(maxWin).sort((a, b) => Number(b[1]) - Number(a[1]))[0]
  const bestLoss = Object.entries(maxLoss).sort((a, b) => Number(b[1]) - Number(a[1]))[0]

  // GM moves
  const moveEntries = Object.entries(rosterMoves).sort((a, b) => Number(b[1]) - Number(a[1]))
  const mostActivGM = moveEntries[0] ? { rosterId: Number(moveEntries[0][0]), moves: moveEntries[0][1] } : null

  const luckIndex = computeLuckIndex(allWeekMatchups)
  const luckEntries = Object.entries(luckIndex).sort((a, b) => Number(b[1]) - Number(a[1]))
  const luckiestManager = luckEntries[0] ? { rosterId: Number(luckEntries[0][0]), luckScore: luckEntries[0][1] } : null
  const unluckiestManager = luckEntries[luckEntries.length - 1]
    ? { rosterId: Number(luckEntries[luckEntries.length - 1][0]), luckScore: luckEntries[luckEntries.length - 1][1] }
    : null

  return {
    biggestBlowout,
    closestGame,
    highestWeekScore,
    lowestWeekScore,
    luckiestManager,
    unluckiestManager,
    mostConsistentManager,
    boomBustManager,
    longestWinStreak: bestWin ? { rosterId: Number(bestWin[0]), length: bestWin[1] } : null,
    longestLossStreak: bestLoss ? { rosterId: Number(bestLoss[0]), length: bestLoss[1] } : null,
    mostActivGM,
    luckIndex,
  }
}
