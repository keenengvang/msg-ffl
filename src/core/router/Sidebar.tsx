import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/standings', label: 'Standings', icon: '🏅' },
  { to: '/matchups', label: 'Matchups', icon: '⚔️' },
  { to: '/playoffs', label: 'Playoffs', icon: '🏆' },
  { to: '/achievements', label: 'Achievements', icon: '🎖️' },
  { to: '/history', label: 'History', icon: '📅' },
  { to: '/draft', label: 'Draft', icon: '📋' },
  { to: '/transactions', label: 'Transactions', icon: '💱' },
]

export function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>MSG</span>
        <span className={styles.logoSub}>FFL</span>
      </div>

      <ul className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => [styles.link, isActive ? styles.active : ''].join(' ')}
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
