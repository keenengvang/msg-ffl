import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('renders heading and description text', () => {
    render(<ErrorState title="No standings" message="Standings are offline." />)

    expect(screen.getByText('No standings')).toBeInTheDocument()
    expect(screen.getByText('Standings are offline.')).toBeInTheDocument()
  })

  it('invokes the retry callback when default action clicked', async () => {
    const user = userEvent.setup()
    const handleRetry = vi.fn()
    render(<ErrorState onRetry={handleRetry} />)

    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('renders detail list entries', () => {
    render(<ErrorState details={['Check Sleeper status', 'Reload once more']} />)

    expect(screen.getByText('Check Sleeper status')).toBeInTheDocument()
    expect(screen.getByText('Reload once more')).toBeInTheDocument()
  })
})
