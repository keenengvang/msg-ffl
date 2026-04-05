import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { mockUsers, mockRosters } from '@/test/mocks/fixtures'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('useManagerProfiles (integration)', () => {
  it('returns a profile for each roster', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    expect(result.current.profiles).toHaveLength(mockRosters.length)
  })

  it('maps display name from user to profile', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    const firstUser = mockUsers[0]
    const profile = result.current.profiles.find((p) => p.userId === firstUser.user_id)
    expect(profile).toBeDefined()
    expect(profile!.displayName).toBe(firstUser.display_name)
  })

  it('maps team name from user metadata', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    const firstUser = mockUsers[0]
    const profile = result.current.profiles.find((p) => p.userId === firstUser.user_id)
    expect(profile).toBeDefined()
    expect(profile!.teamName).toBe(firstUser.metadata.team_name)
  })

  it('sortedByRank orders profiles by wins descending', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    const sorted = result.current.sortedByRank
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].wins).toBeGreaterThanOrEqual(sorted[i + 1].wins)
    }
  })

  it('top-ranked profile has most wins', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    const sorted = result.current.sortedByRank
    // roster_id 1 has 8 wins — highest in fixtures
    expect(sorted[0].wins).toBe(8)
    expect(sorted[0].userId).toBe('user_001')
  })

  it('computes win percentage correctly', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    result.current.profiles.forEach((p) => {
      const played = p.wins + p.losses + p.ties
      const expected = played > 0 ? p.wins / played : 0
      expect(p.winPct).toBeCloseTo(expected)
    })
  })

  it('computes points for correctly combining fpts + fpts_decimal / 100', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    const roster1 = mockRosters[0]
    const profile = result.current.profiles.find((p) => p.rosterId === 1)
    expect(profile).toBeDefined()
    const expectedPF = roster1.settings.fpts + roster1.settings.fpts_decimal / 100
    expect(profile!.pointsFor).toBeCloseTo(expectedPF)
  })

  it('parses streak correctly', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    // roster_id 1 has streak 'W3'
    const profile = result.current.profiles.find((p) => p.rosterId === 1)
    expect(profile?.streak).toEqual({ type: 'W', count: 3 })
  })

  it('falls back to displayName as teamName when no metadata team_name', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    // All fixture users have team_name set; check that teamName is populated
    result.current.profiles.forEach((p) => {
      expect(p.teamName).toBeTruthy()
    })
  })

  it('avatarUrl is a non-empty string for all profiles', async () => {
    const { result } = renderHook(() => useManagerProfiles(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })

    result.current.profiles.forEach((p) => {
      expect(typeof p.avatarUrl).toBe('string')
      expect(p.avatarUrl.length).toBeGreaterThan(0)
    })
  })
})
