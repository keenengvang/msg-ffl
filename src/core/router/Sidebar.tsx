import { NavLink } from 'react-router-dom'
import logoImage from './assets/msgffl.png'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/standings', label: 'Standings', icon: '🏅' },
  { to: '/matchups', label: 'Matchups', icon: '⚔️' },
  { to: '/playoffs', label: 'Playoffs', icon: '🏆' },
  { to: '/achievements', label: 'Achievements', icon: '🎖️' },
  { to: '/history', label: 'History', icon: '📅' },
  { to: '/constitution', label: 'Constitution', icon: '⚖️' },
  { to: '/managers', label: 'Managers', icon: '🧑‍💼' },
  { to: '/draft', label: 'Draft', icon: '📋' },
  { to: '/transactions', label: 'Transactions', icon: '💱' },
]

type SidebarProps = {
  isMobileOpen?: boolean
  onNavigate?: () => void
}

export function Sidebar({ isMobileOpen = false, onNavigate }: SidebarProps) {
  const handleNavigate = () => {
    onNavigate?.()
  }

  return (
    <nav className={[styles.sidebar, isMobileOpen ? styles.sidebarOpen : ''].join(' ')}>
      <div className={styles.logo}>
        <img className={styles.logoImage} src={logoImage} alt="MSG Fantasy Football League" />
      </div>
      <button type="button" className={styles.closeButton} onClick={handleNavigate} aria-label="Close navigation">
        ✕
      </button>

      <ul className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => [styles.link, isActive ? styles.active : ''].join(' ')}
              onClick={handleNavigate}
            >
              <span className={styles.icon}>{icon}</span>
              <span className={styles.label}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <p className={styles.footerText}>SEASON 2024</p>
        <p className={styles.footerSub}>Powered by Sleeper</p>
      </div>
    </nav>
  )
}
