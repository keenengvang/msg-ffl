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

  return (
    <div className={`${styles.shell} scanlines`}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar leagueName={league?.name} />
        <div className={styles.content}>{isNavigating ? <LoadingScreen message="LOADING PAGE..." /> : <Outlet />}</div>
      </div>
    </div>
  )
}
