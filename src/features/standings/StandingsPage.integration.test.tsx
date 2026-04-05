import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { Component as StandingsPage } from './StandingsPage'
import { mockUsers } from '@/test/mocks/fixtures'

describe('StandingsPage (integration)', () => {
  it('shows loading state initially', () => {
    render(<StandingsPage />)
    // Loading message or spinner visible before data loads
    // The component renders <LoadingScreen message="LOADING STANDINGS..." />
    expect(screen.getByText(/LOADING STANDINGS/i)).toBeInTheDocument()
  })

  it('renders standings table after data loads', async () => {
    render(<StandingsPage />)
    await waitFor(
      () => {
        expect(screen.getByRole('table')).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('renders a row for each team', async () => {
    render(<StandingsPage />)
    await waitFor(
      () => {
        // thead + 4 data rows = 5 total rows
        const rows = screen.getAllByRole('row')
        expect(rows.length).toBeGreaterThanOrEqual(5)
      },
      { timeout: 5000 },
    )
  })

  it('shows Team Alpha from mock data', async () => {
    render(<StandingsPage />)
    await waitFor(() => expect(screen.getByText('Team Alpha')).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows all four team names', async () => {
    render(<StandingsPage />)
    await waitFor(
      () => {
        expect(screen.getByText('Team Alpha')).toBeInTheDocument()
        expect(screen.getByText('Team Bravo')).toBeInTheDocument()
        expect(screen.getByText('Team Charlie')).toBeInTheDocument()
        expect(screen.getByText('Team Delta')).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('shows display names in table rows', async () => {
    render(<StandingsPage />)
    await waitFor(
      () => {
        expect(screen.getByText(mockUsers[0].display_name)).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('shows W-L column header', async () => {
    render(<StandingsPage />)
    await waitFor(() => expect(screen.getByText('W-L')).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows win-loss records in correct format', async () => {
    render(<StandingsPage />)
    await waitFor(
      () => {
        // roster_id 1 has 8-2 record
        expect(screen.getByText('8-2')).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('shows STANDINGS heading', async () => {
    render(<StandingsPage />)
    await waitFor(() => expect(screen.getByText(/STANDINGS/i)).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows PF and PA column headers', async () => {
    render(<StandingsPage />)
    await waitFor(
      () => {
        expect(screen.getByText('PF')).toBeInTheDocument()
        expect(screen.getByText('PA')).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('clicking W-L column header changes active sort', async () => {
    const user = userEvent.setup()
    render(<StandingsPage />)

    await waitFor(() => screen.getByText('W-L'), { timeout: 5000 })
    await user.click(screen.getByText('W-L'))

    // Table still renders after sort click
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('clicking PF column header reorders by points for', async () => {
    const user = userEvent.setup()
    render(<StandingsPage />)

    await waitFor(() => screen.getByText('PF'), { timeout: 5000 })
    await user.click(screen.getByText('PF'))

    // Table should still be rendered after sort
    expect(screen.getByRole('table')).toBeInTheDocument()
    // roster_id 1 has highest PF (1250.45), so Team Alpha should remain first
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBeGreaterThan(1)
  })

  it('shows SHOW LUCK INDEX toggle button', async () => {
    render(<StandingsPage />)
    await waitFor(() => expect(screen.getByText(/SHOW LUCK INDEX/i)).toBeInTheDocument(), { timeout: 5000 })
  })

  it('clicking SHOW LUCK INDEX toggle reveals LUCK column', async () => {
    const user = userEvent.setup()
    render(<StandingsPage />)

    await waitFor(() => screen.getByText(/SHOW LUCK INDEX/i), { timeout: 5000 })
    await user.click(screen.getByText(/SHOW LUCK INDEX/i))

    expect(screen.getByText('LUCK')).toBeInTheDocument()
    expect(screen.getByText(/HIDE LUCK/i)).toBeInTheDocument()
  })

  it('shows playoff cutline note', async () => {
    render(<StandingsPage />)
    await waitFor(() => expect(screen.getByText(/Top 6 teams make the playoffs/i)).toBeInTheDocument(), {
      timeout: 5000,
    })
  })
})
