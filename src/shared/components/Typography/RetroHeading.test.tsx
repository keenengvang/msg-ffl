import { render, screen } from '@testing-library/react'
import { RetroHeading } from './RetroHeading'

describe('RetroHeading', () => {
  it('renders the provided tagline', () => {
    render(<RetroHeading tagline="League">Champions</RetroHeading>)

    expect(screen.getByText('Champions')).toBeInTheDocument()
    expect(screen.getByTestId('retro-heading-tagline')).toHaveTextContent('League')
  })

  it('respects the heading level via `as` prop', () => {
    render(
      <RetroHeading as="h3" variant="display">
        Draft Board
      </RetroHeading>,
    )

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Draft Board')
  })
})
