import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/core/router/router'
import { AppProviders } from '@/core/providers/AppProviders'
import '@/styles/globals.css'
import '@/styles/tokens.css'
import '@/styles/animations.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
