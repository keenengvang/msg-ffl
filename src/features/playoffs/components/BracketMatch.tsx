import { AvatarPixel } from '@/shared/components/AvatarPixel/AvatarPixel'
import { formatPoints } from '@/shared/utils/format/format'
import type { SleeperBracketMatchup } from '@/shared/types/bracket.types'
import styles from './BracketMatch.module.css'

type BracketProfile = {
  teamName: string
  avatarUrl: string
  displayName: string
}

type BracketMatchProps = {
  matchup: SleeperBracketMatchup
  profileMap: Record<number, BracketProfile>
  pointsMap: Record<string, number>
}

export function BracketMatch({ matchup, profileMap, pointsMap }: BracketMatchProps) {
  const team1 = profileMap[matchup.t1]
  const team2 = profileMap[matchup.t2]
  const team1Points = pointsMap[`${matchup.r}-${matchup.t1}`]
  const team2Points = pointsMap[`${matchup.r}-${matchup.t2}`]

  return (
    <div className={[styles.match, matchup.w ? styles.matchComplete : ''].join(' ')}>
      {[
        { team: team1, id: matchup.t1, points: team1Points },
        { team: team2, id: matchup.t2, points: team2Points },
      ].map(({ team, id, points }) => (
        <div
          key={id}
          className={[styles.side, matchup.w === id ? styles.winner : matchup.l === id ? styles.loser : ''].join(' ')}
        >
          {team ? (
            <AvatarPixel src={team.avatarUrl} name={team.displayName} size="sm" />
          ) : (
            <div className={styles.tbdAvatar}>?</div>
          )}
          <span className={styles.teamName}>{team?.teamName ?? 'TBD'}</span>
          {points != null && <span className={styles.points}>{formatPoints(points)}</span>}
          {matchup.w === id && <span className={styles.crown}>👑</span>}
        </div>
      ))}
    </div>
  )
}
