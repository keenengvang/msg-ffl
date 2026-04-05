import { useMemo } from 'react'
import { useDrafts, useDraftPicks } from '@/features/draft/hooks/use-draft'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { usePlayers } from '@/shared/hooks/use-players'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { POSITION_COLORS } from '@/shared/config/display'
import styles from './DraftPage.module.css'

export function DraftPage() {
  const { data: drafts, isLoading: draftsLoading, error: draftsError, refetch: refetchDrafts } = useDrafts()
  const { profiles } = useManagerProfiles()
  const { data: players } = usePlayers()

  const latestDraft = drafts?.[drafts.length - 1]
  const {
    data: picks,
    isLoading: picksLoading,
    error: picksError,
    refetch: refetchPicks,
  } = useDraftPicks(latestDraft?.draft_id)
  const allPicks = picks ?? []

  const rosterMap = useMemo(() => {
    if (!latestDraft) return {}
    if (latestDraft.slot_to_roster_id) return latestDraft.slot_to_roster_id
    // Sleeper sometimes omits slot_to_roster_id — derive it from draft_order (userId→slot) + profiles
    if (!latestDraft.draft_order) return {}
    const userIdToRosterId = Object.fromEntries(profiles.map((p) => [p.userId, p.rosterId]))
    return Object.fromEntries(
      Object.entries(latestDraft.draft_order).map(([userId, slot]) => [slot, userIdToRosterId[userId]]),
    )
  }, [latestDraft, profiles])

  const picksByRound = useMemo(() => {
    if (!latestDraft) return {}
    const rounds: Record<number, typeof allPicks> = {}
    allPicks.forEach((pick) => {
      if (!rounds[pick.round]) rounds[pick.round] = []
      rounds[pick.round].push(pick)
    })
    Object.values(rounds).forEach((r) => r.sort((a, b) => a.draft_slot - b.draft_slot))
    return rounds
  }, [allPicks, latestDraft])

  const totalRounds = latestDraft?.settings?.rounds ?? 0
  const totalTeams = latestDraft?.settings?.teams ?? profiles.length

  const profileByRosterId = useMemo(() => Object.fromEntries(profiles.map((p) => [p.rosterId, p])), [profiles])

  // Map draft slots to managers via slot_to_roster_id
  const slotHeaders = useMemo(() => {
    return Array.from({ length: totalTeams }, (_, i) => {
      const slot = i + 1
      const rosterId = rosterMap[slot]
      const profile = rosterId ? profileByRosterId[rosterId] : null
      return profile?.teamName ?? `Slot ${slot}`
    })
  }, [totalTeams, rosterMap, profileByRosterId])

  const combinedLoading = draftsLoading || picksLoading
  const combinedError = draftsError ?? picksError

  if (combinedLoading) return <LoadingScreen message="LOADING DRAFT..." />
  if (combinedError)
    return (
      <ErrorState
        message="Failed to load draft data."
        onRetry={() => {
          refetchDrafts()
          refetchPicks()
        }}
      />
    )
  if (!latestDraft)
    return (
      <PixelCard>
        <p className={styles.empty}>No draft data found.</p>
      </PixelCard>
    )

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>📋 DRAFT BOARD — {latestDraft.season}</h1>
      <p className={styles.sub}>
        {latestDraft.settings.rounds} rounds · {totalTeams} teams · {latestDraft.type.toUpperCase()}
      </p>

      <PixelCard className={styles.boardCard}>
        <div className={styles.tableWrap}>
          <table className={styles.board}>
            <thead>
              <tr>
                <th className={styles.roundHeader}>RND</th>
                {slotHeaders.map((name, i) => (
                  <th key={i} className={styles.teamHeader}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: totalRounds }, (_, roundIdx) => {
                const round = roundIdx + 1
                const picks = picksByRound[round] ?? []

                return (
                  <tr key={round}>
                    <td className={styles.roundCell}>{round}</td>
                    {Array.from({ length: totalTeams }, (_, slotIdx) => {
                      const pick = picks.find((p) => p.draft_slot === slotIdx + 1)
                      if (!pick)
                        return (
                          <td key={slotIdx} className={styles.emptyCell}>
                            —
                          </td>
                        )
                      const player = players?.[pick.player_id]
                      const pos = pick.metadata.position || player?.position || '?'
                      const posColor = POSITION_COLORS[pos] ?? 'var(--color-text-muted)'
                      return (
                        <td key={slotIdx} className={styles.pickCell}>
                          <div className={styles.pick}>
                            <span className={styles.pos} style={{ color: posColor }}>
                              {pos}
                            </span>
                            <span className={styles.playerName}>
                              {pick.metadata.first_name[0]}. {pick.metadata.last_name}
                            </span>
                            <span className={styles.team}>{pick.metadata.team}</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PixelCard>
    </div>
  )
}
