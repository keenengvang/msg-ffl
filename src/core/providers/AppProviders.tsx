import type { ReactNode } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { days } from '@/shared/utils/time/time'

const QUERY_CACHE_TTL_MS = days(1)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: QUERY_CACHE_TTL_MS,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'msg-ffl-query-cache',
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: QUERY_CACHE_TTL_MS }}>
      {children}
    </PersistQueryClientProvider>
  )
}
