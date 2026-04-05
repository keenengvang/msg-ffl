import { describe, it, expect } from 'vitest'
import {
  pairMatchups,
  buildAllResults,
  buildH2HRecords,
  computeLuckIndex,
  computePowerRankings,
  computeFunStats,
} from './stats-engine'
import type { SleeperMatchup } from '@/shared/types/matchup.types'

// ---------------------------------------------------------------------------
// Helpers — builds minimal SleeperMatchup objects for testing
// ---------------------------------------------------------------------------
function matchup(opts: { matchupId: number; rosterId: number; points: number }): SleeperMatchup {
  return {
    matchup_id: opts.matchupId,
    roster_id: opts.rosterId,
    points: opts.points,
    players: [],
    starters: [],
    players_points: {},
    starters_points: [],
    custom_points: null,
  }
}

// A simple 2-team week with explicit roster IDs
function simplePair(r1: number, p1: number, r2: number, p2: number, mid = 1): SleeperMatchup[] {
  return [matchup({ matchupId: mid, rosterId: r1, points: p1 }), matchup({ matchupId: mid, rosterId: r2, points: p2 })]
}

// ---------------------------------------------------------------------------
// pairMatchups
// ---------------------------------------------------------------------------
describe('pairMatchups', () => {
  it('creates two results per matchup (one per team)', () => {
    const week = simplePair(1, 120, 2, 100)
    const results = pairMatchups(week)

    expect(results).toHaveLength(2)
  })

  it('correctly determines winner and loser', () => {
    const week = simplePair(1, 120, 2, 100)
    const results = pairMatchups(week)

    const team1 = results.find((r) => r.rosterId === 1)!
    const team2 = results.find((r) => r.rosterId === 2)!

    expect(team1.won).toBe(true)
    expect(team1.pointsFor).toBe(120)
    expect(team1.pointsAgainst).toBe(100)

    expect(team2.won).toBe(false)
    expect(team2.pointsFor).toBe(100)
    expect(team2.pointsAgainst).toBe(120)
  })

  it('calculates margin correctly', () => {
    const week = simplePair(1, 130.5, 2, 110.25)
    const results = pairMatchups(week)

    expect(results[0].margin).toBeCloseTo(20.25)
    expect(results[1].margin).toBeCloseTo(20.25)
  })

  it('handles multiple matchups in one week', () => {
    const week = [...simplePair(1, 120, 2, 100, 1), ...simplePair(3, 90, 4, 95, 2)]
    const results = pairMatchups(week)

    expect(results).toHaveLength(4)
    expect(results.find((r) => r.rosterId === 3)!.won).toBe(false)
    expect(results.find((r) => r.rosterId === 4)!.won).toBe(true)
  })

  it('skips unmatched rosters (odd number in a matchup_id group)', () => {
    const week = [matchup({ matchupId: 1, rosterId: 1, points: 100 })]
    const results = pairMatchups(week)

    expect(results).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// buildAllResults
// ---------------------------------------------------------------------------
describe('buildAllResults', () => {
  it('assigns correct week numbers', () => {
    const week1 = simplePair(1, 110, 2, 90)
    const week2 = simplePair(1, 105, 2, 115)

    const results = buildAllResults([week1, week2])

    const week1Results = results.filter((r) => r.week === 1)
    const week2Results = results.filter((r) => r.week === 2)
    expect(week1Results).toHaveLength(2)
    expect(week2Results).toHaveLength(2)
  })

  it('skips undefined weeks', () => {
    const week1 = simplePair(1, 110, 2, 90)
    const results = buildAllResults([week1, undefined, undefined])

    expect(results).toHaveLength(2)
    expect(results[0].week).toBe(1)
  })

  it('returns empty array for no data', () => {
    expect(buildAllResults([])).toEqual([])
    expect(buildAllResults([undefined])).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// buildH2HRecords
// ---------------------------------------------------------------------------
describe('buildH2HRecords', () => {
  it('tracks wins and losses between two teams', () => {
    const week1 = simplePair(1, 120, 2, 100)
    const week2 = simplePair(1, 90, 2, 110)
    const week3 = simplePair(1, 130, 2, 95)
    const results = buildAllResults([week1, week2, week3])

    const h2h = buildH2HRecords(results)

    expect(h2h[1][2].wins).toBe(2)
    expect(h2h[1][2].losses).toBe(1)
    expect(h2h[2][1].wins).toBe(1)
    expect(h2h[2][1].losses).toBe(2)
  })

  it('accumulates points for and against', () => {
    const week1 = simplePair(1, 100, 2, 80)
    const week2 = simplePair(1, 110, 2, 90)
    const results = buildAllResults([week1, week2])

    const h2h = buildH2HRecords(results)

    expect(h2h[1][2].pointsFor).toBeCloseTo(210)
    expect(h2h[1][2].pointsAgainst).toBeCloseTo(170)
  })
})

// ---------------------------------------------------------------------------
// computeLuckIndex
// ---------------------------------------------------------------------------
describe('computeLuckIndex', () => {
  it('returns an object keyed by roster ID', () => {
    const week = simplePair(1, 150, 2, 80)
    const luck = computeLuckIndex([week])

    expect(typeof luck[1]).toBe('number')
    expect(typeof luck[2]).toBe('number')
  })

  it('lucky team has positive index, unlucky has negative', () => {
    // Team 1 barely wins every week, team 2 loses despite decent scores
    const weeks = [simplePair(1, 101, 2, 100), simplePair(1, 101, 2, 100), simplePair(1, 101, 2, 100)]
    const luck = computeLuckIndex(weeks)

    // Team 1 wins all 3 actual games but expected wins should be ~1.5
    expect(luck[1]).toBeGreaterThan(0)
  })

  it('handles empty weeks', () => {
    const luck = computeLuckIndex([undefined, []])
    expect(Object.keys(luck)).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// computePowerRankings
// ---------------------------------------------------------------------------
describe('computePowerRankings', () => {
  it('returns rankings for all roster IDs', () => {
    const weeks = [simplePair(1, 130, 2, 80), simplePair(1, 125, 2, 85)]
    const results = buildAllResults(weeks)
    const rankings = computePowerRankings(results, [1, 2])

    expect(rankings).toHaveLength(2)
    expect(rankings[0].rank).toBe(1)
    expect(rankings[1].rank).toBe(2)
  })

  it('ranks higher-scoring winners first', () => {
    const weeks = [
      [...simplePair(1, 130, 2, 80, 1), ...simplePair(3, 70, 4, 60, 2)],
      [...simplePair(1, 125, 2, 85, 1), ...simplePair(3, 75, 4, 65, 2)],
    ]
    const results = buildAllResults(weeks)
    const rankings = computePowerRankings(results, [1, 2, 3, 4])

    expect(rankings[0].rosterId).toBe(1)
  })

  it('returns rounded scores', () => {
    const weeks = [simplePair(1, 100, 2, 90)]
    const results = buildAllResults(weeks)
    const rankings = computePowerRankings(results, [1, 2])

    rankings.forEach((r) => {
      // Score should have at most one decimal place
      expect(r.score).toBe(Math.round(r.score * 10) / 10)
    })
  })

  it('handles empty results', () => {
    const rankings = computePowerRankings([], [1, 2])
    expect(rankings).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// computeFunStats
// ---------------------------------------------------------------------------
describe('computeFunStats', () => {
  const weeks = [
    simplePair(1, 150, 2, 80), // big blowout: margin 70
    simplePair(1, 100, 2, 99.5), // close game: margin 0.5
    simplePair(1, 90, 2, 130), // team 2 high score
  ]
  const allWeekData = weeks as SleeperMatchup[][]
  const results = buildAllResults(allWeekData)
  const rosterMoves = { 1: 25, 2: 10 }

  it('identifies biggest blowout', () => {
    const stats = computeFunStats(results, allWeekData, rosterMoves)
    expect(stats.biggestBlowout).not.toBeNull()
    expect(stats.biggestBlowout!.margin).toBeCloseTo(70)
  })

  it('identifies closest game', () => {
    const stats = computeFunStats(results, allWeekData, rosterMoves)
    expect(stats.closestGame).not.toBeNull()
    expect(stats.closestGame!.margin).toBeCloseTo(0.5)
  })

  it('identifies highest week score', () => {
    const stats = computeFunStats(results, allWeekData, rosterMoves)
    expect(stats.highestWeekScore).not.toBeNull()
    expect(stats.highestWeekScore!.points).toBe(150)
  })

  it('identifies lowest week score', () => {
    const stats = computeFunStats(results, allWeekData, rosterMoves)
    expect(stats.lowestWeekScore).not.toBeNull()
    expect(stats.lowestWeekScore!.points).toBe(80)
  })

  it('identifies most active GM', () => {
    const stats = computeFunStats(results, allWeekData, rosterMoves)
    expect(stats.mostActivGM).not.toBeNull()
    expect(stats.mostActivGM!.rosterId).toBe(1)
    expect(stats.mostActivGM!.moves).toBe(25)
  })

  it('returns null fields for empty data', () => {
    const stats = computeFunStats([], [], {})
    expect(stats.biggestBlowout).toBeNull()
    expect(stats.closestGame).toBeNull()
    expect(stats.highestWeekScore).toBeNull()
    expect(stats.mostActivGM).toBeNull()
  })
})
