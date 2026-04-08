import { Fragment, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import clsx from 'clsx'
import { useDrafts, useDraftPicks } from '@/features/draft/hooks/use-draft'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { usePlayers } from '@/shared/hooks/use-players'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { POSITION_COLORS } from '@/shared/config/display'
import styles from './DraftPage.module.css'

function mixWithWhite(hex: string, weight = 0.75) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex
  const normalized = hex.length === 7 ? hex : `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)
  const mixChannel = (channel: number) => Math.round(channel + (255 - channel) * weight)
  return `rgb(${mixChannel(r)}, ${mixChannel(g)}, ${mixChannel(b)})`
}

function getPlayerHeadshotUrl(playerId?: string | null) {
  if (!playerId) return null
  const cleaned = playerId.replace(/[^0-9]/g, '')
  if (!cleaned) return null
  return `https://sleepercdn.com/content/nfl/players/${cleaned}.jpg`
}

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
  const allPicks = useMemo(() => picks ?? [], [picks])

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

  const slotMeta = useMemo(
    () =>
      Array.from({ length: totalTeams }, (_, i) => {
        const slot = i + 1
        const rosterId = rosterMap[slot]
        const profile = rosterId ? profileByRosterId[rosterId] : null
        const label = profile?.teamName ?? `Slot ${slot}`
        const owner = profile?.displayName ?? 'Pending Owner'
        const initials = label
          .split(/\s+/)
          .map((word) => word[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase()
        return {
          slot,
          profile,
          label,
          owner,
          initials: initials || `S${slot}`,
        }
      }),
    [profileByRosterId, rosterMap, totalTeams],
  )

  const boardSurfaceRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  })
  const [isDragging, setIsDragging] = useState(false)

  const isTouchLikeInput = (pointerType: PointerEvent<HTMLDivElement>['pointerType']) =>
    pointerType === 'touch' || pointerType === 'pen'

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (isTouchLikeInput(event.pointerType)) {
      dragState.current.isDragging = false
      return
    }
    if (event.button && event.button !== 0) return

    const container = boardSurfaceRef.current
    if (!container) return

    dragState.current = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
    }
    setIsDragging(true)
    container.setPointerCapture?.(event.pointerId)
  }

  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isTouchLikeInput(event.pointerType) || !dragState.current.isDragging) return
    event.preventDefault()
    const container = boardSurfaceRef.current
    if (!container) return

    const dx = event.clientX - dragState.current.startX
    const dy = event.clientY - dragState.current.startY
    container.scrollLeft = dragState.current.scrollLeft - dx
    container.scrollTop = dragState.current.scrollTop - dy
  }

  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (isTouchLikeInput(event.pointerType) || !dragState.current.isDragging) return
    dragState.current.isDragging = false
    setIsDragging(false)
    boardSurfaceRef.current?.releasePointerCapture?.(event.pointerId)
  }

  const boardColumnsStyle = useMemo(
    () => ({ gridTemplateColumns: `70px repeat(${totalTeams}, minmax(120px, 1fr))` }),
    [totalTeams],
  )

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
      <section className={styles.hero}>
        <div>
          <p className={styles.leagueLabel}>{latestDraft.metadata?.name ?? 'Draft Board'}</p>
          <h2 className={styles.title}>MSG Fantasy Football League · {latestDraft.season}</h2>
          <p className={styles.sub}>
            {latestDraft.settings.pick_timer ? `${latestDraft.settings.pick_timer}s clock` : 'Live clock'} ·{' '}
            {totalTeams} teams · {totalRounds} rounds · {latestDraft.type.toUpperCase()}
          </p>
        </div>
      </section>

      <PixelCard className={styles.boardCard}>
        <div
          ref={boardSurfaceRef}
          className={clsx(styles.boardSurface, isDragging && styles.boardSurfaceDragging)}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerLeave={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div className={styles.boardHeaderRow} style={boardColumnsStyle}>
            <div className={styles.roundHeader}>Round</div>
            {slotMeta.map((slot) => (
              <div key={slot.slot} className={styles.teamHeader}>
                {slot.profile?.avatarUrl ? (
                  <img
                    src={slot.profile.avatarUrl}
                    alt={`${slot.label} avatar`}
                    className={styles.headerAvatar}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.headerAvatarFallback}>{slot.initials}</div>
                )}
                <div className={styles.teamHeaderCopy}>
                  <span className={styles.teamHeaderTitle}>{slot.label}</span>
                  <span className={styles.teamHeaderSubtitle}>{slot.owner}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.grid} style={boardColumnsStyle}>
            {Array.from({ length: totalRounds }, (_, roundIdx) => {
              const round = roundIdx + 1
              const picks = picksByRound[round] ?? []

              return (
                <Fragment key={round}>
                  <div className={styles.roundCell}>R{round.toString().padStart(2, '0')}</div>
                  {slotMeta.map((slot) => {
                    const pick = picks.find((p) => p.draft_slot === slot.slot)
                    if (!pick)
                      return (
                        <div key={`${round}-${slot.slot}`} className={styles.emptyCell}>
                          <span>On the clock</span>
                        </div>
                      )
                    const player = players?.[pick.player_id]
                    const pos = pick.metadata.position || player?.position || '?'
                    const rawColor = POSITION_COLORS[pos] ?? '#5f6b7c'
                    const bg = mixWithWhite(rawColor)
                    const headshotUrl = getPlayerHeadshotUrl(player?.player_id ?? pick.player_id)
                    return (
                      <div
                        key={`${round}-${slot.slot}`}
                        className={styles.pickCell}
                        style={{ background: bg, borderColor: rawColor }}
                      >
                        {headshotUrl ? (
                          <img
                            src={headshotUrl}
                            alt={`${pick.metadata.first_name} ${pick.metadata.last_name}`}
                            className={styles.pickPhoto}
                            loading="lazy"
                          />
                        ) : null}
                        <div className={styles.pickMeta}>
                          <span className={styles.pickOverall}>#{pick.pick_no}</span>
                          <span className={styles.pos}>{pos}</span>
                        </div>
                        <p className={styles.playerName}>
                          {pick.metadata.first_name?.[0]}. {pick.metadata.last_name}
                        </p>
                        <div className={styles.pickFooter}>
                          <span className={styles.team}>{pick.metadata.team}</span>
                        </div>
                      </div>
                    )
                  })}
                </Fragment>
              )
            })}
          </div>
        </div>
      </PixelCard>
    </div>
  )
}
