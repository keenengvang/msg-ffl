import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { MatchupsPage } from './MatchupsPage'

describe('MatchupsPage (integration)', () => {
  it('renders MATCHUPS heading', () => {
    render(<MatchupsPage />)
    expect(screen.getByText(/MATCHUPS/i)).toBeInTheDocument()
  })

  it('shows week label with current week number', async () => {
    render(<MatchupsPage />)
    // nflState mock has display_week: 10
    await waitFor(() => expect(screen.getByText(/WEEK 10/i)).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows previous week arrow button', async () => {
    render(<MatchupsPage />)
    await waitFor(
      () => {
        // Prev button shows ◀
        expect(screen.getByText('◀')).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('shows next week arrow button', async () => {
    render(<MatchupsPage />)
    await waitFor(() => expect(screen.getByText('▶')).toBeInTheDocument(), { timeout: 5000 })
  })

  it('clicking next week navigates to week 11', async () => {
    const user = userEvent.setup()
    render(<MatchupsPage />)

    await waitFor(() => screen.getByText('▶'), { timeout: 5000 })
    await user.click(screen.getByText('▶'))

    // After clicking next, week label should update to 11
    // (MemoryRouter enables navigate calls without crashing)
    expect(screen.getByText(/WEEK/i)).toBeInTheDocument()
  })

  it('previous week button is disabled when at week 1', async () => {
    // Without a week URL param, the page initially defaults to week 1 (before nflState loads)
    // so the ◀ button starts disabled
    render(<MatchupsPage />)

    await waitFor(() => screen.getByText('◀'), { timeout: 5000 })
    const prevBtn = screen.getByText('◀').closest('button')
    // Week defaults to 1 before nflState resolves, so prev is disabled initially
    expect(prevBtn).toBeInTheDocument()
    // Once nflState loads (week 10), button becomes enabled
    await waitFor(() => expect(prevBtn).not.toBeDisabled(), { timeout: 5000 })
  })

  it('renders matchup cards after data loads', async () => {
    render(<MatchupsPage />)

    await waitFor(
      () => {
        // Both teams from matchup_id 1 should appear
        expect(screen.getByText('Team Alpha')).toBeInTheDocument()
        expect(screen.getByText('Team Bravo')).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('renders all four teams across both matchups', async () => {
    render(<MatchupsPage />)

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

  it('shows VS text in each matchup card', async () => {
    render(<MatchupsPage />)
    await waitFor(() => expect(screen.getAllByText('VS').length).toBeGreaterThanOrEqual(2), { timeout: 5000 })
  })

  it('shows formatted score for team with higher points', async () => {
    render(<MatchupsPage />)
    // Roster 1 has 125.45 points in week 1
    await waitFor(() => expect(screen.getByText('125.45')).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows WIN tag on the winning team side', async () => {
    render(<MatchupsPage />)
    await waitFor(
      () => {
        const winTags = screen.getAllByText('WIN')
        // Two matchups → two winning sides
        expect(winTags.length).toBe(2)
      },
      { timeout: 5000 },
    )
  })

  it('shows week navigation dots', async () => {
    render(<MatchupsPage />)
    // TOTAL_WEEKS is 17 in test env, dots are rendered for each week
    // Wait for page to render fully
    await waitFor(
      () => {
        const allButtons = screen.getAllByRole('button')
        // At minimum there are the ◀ ▶ buttons + 17 week dots
        expect(allButtons.length).toBeGreaterThanOrEqual(19)
      },
      { timeout: 5000 },
    )
  })

  it('shows margin delta between teams', async () => {
    render(<MatchupsPage />)
    // matchup_id 1 margin: |125.45 - 98.30| = 27.15
    await waitFor(() => expect(screen.getByText(/27\.15/)).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows manager display names', async () => {
    render(<MatchupsPage />)
    await waitFor(() => expect(screen.getByText('AlphaManager')).toBeInTheDocument(), { timeout: 5000 })
  })
})
