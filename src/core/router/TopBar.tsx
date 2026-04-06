import { useNflState } from '@/shared/hooks/use-nfl-state'
import styles from './TopBar.module.css'

interface Props {
  leagueName?: string
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

export function TopBar({ leagueName = 'MSG FFL', onMenuToggle, isMenuOpen = false }: Props) {
  const { data: state } = useNflState()
  const isLive = state?.season_type === 'regular' || state?.season_type === 'post'

  return (
    <header className={styles.topbar}>
      {onMenuToggle && (
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      )}
      <div className={styles.left}>
        <h1 className={styles.title}>{leagueName}</h1>
        {state && (
          <span className={styles.week}>
            {isLive ? (
              <>
                <span className={styles.liveDot} />
                WEEK {state.display_week}
              </>
            ) : (
              `OFFSEASON ${state.season}`
            )}
          </span>
        )}
      </div>
      <div className={styles.right}>
        <span className={styles.season}>{state?.season ?? '2024'} SEASON</span>
      </div>
    </header>
  )
}
