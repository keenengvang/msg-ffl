import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { formatTimeAgo } from '@/shared/utils/date/date'
import type { SleeperTransaction } from '@/shared/types/transaction.types'
import styles from './TransactionCard.module.css'

type TransactionProfile = {
  teamName: string
  avatarUrl: string
  displayName: string
}

type TransactionPlayer = {
  full_name?: string
  first_name: string
  last_name: string
  position: string
}

type TransactionCardProps = {
  tx: SleeperTransaction
  profileMap: Record<number, TransactionProfile>
  players: Record<string, TransactionPlayer> | undefined
}

export function TransactionCard({ tx, profileMap, players }: TransactionCardProps) {
  const adds = Object.entries(tx.adds ?? {})
  const drops = Object.entries(tx.drops ?? {})
  const isTrade = tx.type === 'trade'

  const getPlayerName = (id: string) => {
    const player = players?.[id]
    return player ? (player.full_name ?? `${player.first_name} ${player.last_name}`) : id
  }

  return (
    <PixelCard className={styles.card} variant={isTrade ? 'highlight' : 'default'}>
      <div className={styles.header}>
        <span className={styles.type}>
          {isTrade ? '🤝 TRADE' : tx.type === 'waiver' ? '📋 WAIVER' : '🆓 FREE AGENT'}
        </span>
        <span className={styles.time}>{formatTimeAgo(tx.status_updated)}</span>
        {tx.settings?.waiver_bid != null && <span className={styles.bid}>${tx.settings.waiver_bid} FAAB</span>}
      </div>

      <div className={styles.teams}>
        {tx.roster_ids.slice(0, 2).map((rosterId) => {
          const profile = profileMap[rosterId]
          return profile ? (
            <div key={rosterId} className={styles.team}>
              <AvatarPixel src={profile.avatarUrl} name={profile.displayName} size="sm" />
              <span>{profile.teamName}</span>
            </div>
          ) : null
        })}
      </div>

      <div className={styles.players}>
        {adds.map(([playerId, rosterId]) => (
          <div key={`add-${playerId}`} className={styles.playerAdd}>
            <span className={styles.addTag}>+ ADD</span>
            <span className={styles.playerName}>{getPlayerName(playerId)}</span>
            {isTrade && profileMap[rosterId] && (
              <span className={styles.toTeam}>→ {profileMap[rosterId].teamName}</span>
            )}
          </div>
        ))}
        {drops.map(([playerId]) => (
          <div key={`drop-${playerId}`} className={styles.playerDrop}>
            <span className={styles.dropTag}>- DROP</span>
            <span className={styles.playerName}>{getPlayerName(playerId)}</span>
          </div>
        ))}
        {tx.draft_picks?.map((draftPick, index) => (
          <div key={index} className={styles.playerAdd}>
            <span className={styles.addTag}>🔄 PICK</span>
            <span className={styles.playerName}>
              {draftPick.season} Rd {draftPick.round}
            </span>
          </div>
        ))}
      </div>
    </PixelCard>
  )
}
