import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '@/core/router/RootLayout'
import { ErrorFallback } from '@/shared/components/ErrorFallback/ErrorFallback'
import { HomePage } from '@/features/home/pages/HomePage/HomePage'
import { StandingsPage } from '@/features/standings/pages/StandingsPage/StandingsPage'
import { MatchupsPage } from '@/features/matchups/pages/MatchupsPage/MatchupsPage'
import { ManagerPage } from '@/features/managers/pages/ManagerPage/ManagerPage'
import { AchievementsPage } from '@/features/achievements/pages/AchievementsPage/AchievementsPage'
import { HistoryPage } from '@/features/history/pages/HistoryPage/HistoryPage'
import { DraftPage } from '@/features/draft/pages/DraftPage/DraftPage'
import { TransactionsPage } from '@/features/transactions/pages/TransactionsPage/TransactionsPage'
import { PlayoffsPage } from '@/features/playoffs/pages/PlayoffsPage/PlayoffsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'standings', element: <StandingsPage /> },
      { path: 'matchups', element: <MatchupsPage /> },
      { path: 'matchups/:week', element: <MatchupsPage /> },
      { path: 'manager/:rosterId', element: <ManagerPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'draft', element: <DraftPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'playoffs', element: <PlayoffsPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
