import { Link } from 'react-router-dom'
import { useManagerProfiles } from '@/shared/hooks/use-manager-profiles'
import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { formatPoints, formatRecord } from '@/shared/utils/format/format'
import { formatOrdinal } from '@/shared/utils/format/format'
import styles from './ManagersPage.module.css'

export function ManagersPage() {
  const { sortedByRank, isLoading, error, refetch } = useManagerProfiles()

  if (isLoading) return <LoadingScreen message="LOADING MANAGERS..." />
  if (error) return <ErrorState message="Failed to load managers." onRetry={refetch} />

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>LEAGUE DIRECTORY</p>
          <h2 className={styles.title}>🧑‍💼 Managers</h2>
        </div>
        <p className={styles.subtitle}>Tap a card to jump into that manager's dossier.</p>
      </header>

      <div className={styles.grid}>
        {sortedByRank.map((profile, index) => (
          <Link key={profile.rosterId} to={`/manager/${profile.rosterId}`} className={styles.cardLink}>
            <PixelCard variant="elevated" className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.rank}>{formatOrdinal(index + 1)}</span>
                {profile.streak && (
                  <span className={profile.streak.type === 'W' ? styles.streakW : styles.streakL}>
                    {profile.streak.type}
                    {profile.streak.count}
                  </span>
                )}
                {profile.isOwner && <span className={styles.ownerBadge}>Commissioner</span>}
              </div>

              <div className={styles.managerRow}>
                <AvatarPixel src={profile.avatarUrl} name={profile.displayName} size="lg" />
                <div>
                  <p className={styles.teamName}>{profile.teamName}</p>
                  <p className={styles.managerName}>{profile.displayName}</p>
                </div>
              </div>

              <dl className={styles.stats}>
                <div>
                  <dt>Record</dt>
                  <dd>{formatRecord(profile.wins, profile.losses, profile.ties)}</dd>
                </div>
                <div>
                  <dt>PF</dt>
                  <dd>{formatPoints(profile.pointsFor)}</dd>
                </div>
                <div>
                  <dt>PA</dt>
                  <dd>{formatPoints(profile.pointsAgainst)}</dd>
                </div>
                <div>
                  <dt>Moves</dt>
                  <dd>{profile.totalMoves}</dd>
                </div>
              </dl>

              <p className={styles.cta}>View profile →</p>
            </PixelCard>
          </Link>
        ))}
      </div>
    </div>
  )
}
