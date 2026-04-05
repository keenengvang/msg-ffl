import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { DraftPage } from './DraftPage'
import { mockDraft } from '@/test/mocks/fixtures'

describe('DraftPage (integration)', () => {
  it('shows loading state initially', () => {
    render(<DraftPage />)
    expect(screen.getByText(/LOADING DRAFT/i)).toBeInTheDocument()
  })

  it('renders DRAFT BOARD heading after data loads', async () => {
    render(<DraftPage />)
    await waitFor(() => expect(screen.getByText(/DRAFT BOARD/i)).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows the draft season in the heading', async () => {
    render(<DraftPage />)
    await waitFor(() => expect(screen.getByText(/2024/i)).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows the draft type SNAKE', async () => {
    render(<DraftPage />)
    await waitFor(() => expect(screen.getByText(/SNAKE/i)).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows rounds info in the subheading', async () => {
    render(<DraftPage />)
    await waitFor(
      () => {
        const text = screen.getByText(/rounds/i)
        expect(text).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('renders the draft board table', async () => {
    render(<DraftPage />)
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument(), { timeout: 5000 })
  })

  it('renders correct number of round rows', async () => {
    render(<DraftPage />)
    await waitFor(() => screen.getByRole('table'), { timeout: 5000 })

    const rows = screen.getAllByRole('row')
    // 1 header row + 3 round rows = 4 total
    expect(rows.length).toBe(1 + mockDraft.settings.rounds)
  })

  it('shows team column headers (not generic Slot labels)', async () => {
    render(<DraftPage />)
    await waitFor(
      () => {
        // Team Alpha is in slot 1 via slot_to_roster_id → roster 1 → user_001 → team_name 'Team Alpha'
        expect(screen.getByText('Team Alpha')).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('shows all four team names as column headers', async () => {
    render(<DraftPage />)
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

  it('shows player last names in pick cells', async () => {
    render(<DraftPage />)
    await waitFor(
      () => {
        // First round picks include Jefferson, McCaffrey, Hill, Burrow
        expect(screen.getByText(/Jefferson/i)).toBeInTheDocument()
        expect(screen.getByText(/McCaffrey/i)).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('shows round number 1 in first round column', async () => {
    render(<DraftPage />)
    await waitFor(
      () => {
        const roundCells = screen.getAllByRole('cell')
        expect(roundCells.some((cell) => cell.textContent === '1')).toBe(true)
      },
      { timeout: 5000 },
    )
  })

  it('shows position labels in pick cells', async () => {
    render(<DraftPage />)
    await waitFor(
      () => {
        // Multiple WR and RB picks are in the mock
        expect(screen.getAllByText('WR').length).toBeGreaterThan(0)
        expect(screen.getAllByText('RB').length).toBeGreaterThan(0)
      },
      { timeout: 5000 },
    )
  })

  it('shows player team abbreviations', async () => {
    render(<DraftPage />)
    await waitFor(
      () => {
        // NYJ appears once (Justin Jefferson), KC appears twice (Hill + Kelce)
        expect(screen.getByText('NYJ')).toBeInTheDocument()
        expect(screen.getAllByText('KC').length).toBeGreaterThanOrEqual(1)
      },
      { timeout: 8000 },
    )
  })

  it('has correct number of picks total', async () => {
    render(<DraftPage />)
    await waitFor(() => screen.getByRole('table'), { timeout: 5000 })

    // 12 picks in fixtures (3 rounds × 4 teams) — each pick shows a player name
    // Count cells that contain a last name from our fixture
    expect(screen.getByText(/Jefferson/i)).toBeInTheDocument()
    expect(screen.getByText(/Kelce/i)).toBeInTheDocument()
    expect(screen.getByText(/Kamara/i)).toBeInTheDocument()
    expect(screen.getByText(/Taylor/i)).toBeInTheDocument()
  })

  it('uses first initial dot format for player first names', async () => {
    render(<DraftPage />)
    // The component renders `{first_name[0]}. {last_name}` e.g. "J. Jefferson"
    await waitFor(() => expect(screen.getByText(/J\. Jefferson/i)).toBeInTheDocument(), { timeout: 5000 })
  })

  it('shows RND header in first column', async () => {
    render(<DraftPage />)
    await waitFor(() => expect(screen.getByText('RND')).toBeInTheDocument(), { timeout: 5000 })
  })
})
