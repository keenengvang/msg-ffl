import { useState } from 'react'
import { Outlet, useNavigation } from 'react-router-dom'
import { Sidebar } from '@/core/router/Sidebar'
import { TopBar } from '@/core/router/TopBar'
import { LoadingScreen } from '@/shared/components/LoadingScreen/LoadingScreen'
import { useLeague } from '@/shared/hooks/use-league'
import styles from './RootLayout.module.css'

export function RootLayout() {
  const navigation = useNavigation()
  const { data: league } = useLeague()
  const isNavigating = navigation.state === 'loading'
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const toggleMobileNav = () => setIsMobileNavOpen((open) => !open)
  const closeMobileNav = () => setIsMobileNavOpen(false)

  return (
    <div className={`${styles.shell} scanlines`}>
      <Sidebar isMobileOpen={isMobileNavOpen} onNavigate={closeMobileNav} />
      {isMobileNavOpen && (
        <button
          type="button"
          className={styles.mobileOverlay}
          onClick={closeMobileNav}
          aria-label="Close navigation overlay"
        />
      )}
      <div className={styles.main}>
        <TopBar leagueName={league?.name} onMenuToggle={toggleMobileNav} isMenuOpen={isMobileNavOpen} />
        <div className={styles.content}>{isNavigating ? <LoadingScreen message="LOADING PAGE..." /> : <Outlet />}</div>
      </div>
    </div>
  )
}
