import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '@/core/router/RootLayout'
import { ErrorFallback } from '@/shared/components/ErrorFallback/ErrorFallback'
import { Component as HomePage } from '@/features/home/HomePage'
import { Component as StandingsPage } from '@/features/standings/StandingsPage'
import { Component as MatchupsPage } from '@/features/matchups/MatchupsPage'
import { Component as ManagerPage } from '@/features/managers/ManagerPage'
import { Component as AchievementsPage } from '@/features/achievements/AchievementsPage'
import { Component as HistoryPage } from '@/features/history/HistoryPage'
import { Component as DraftPage } from '@/features/draft/DraftPage'
import { Component as TransactionsPage } from '@/features/transactions/TransactionsPage'
import { Component as PlayoffsPage } from '@/features/playoffs/PlayoffsPage'

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
