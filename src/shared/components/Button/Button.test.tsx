import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Button } from './Button'

describe('Button', () => {
  it('applies the requested variant via data attribute', () => {
    render(<Button variant="secondary">View roster</Button>)

    const button = screen.getByRole('button', { name: /view roster/i })
    expect(button).toHaveAttribute('data-variant', 'secondary')
  })

  it('renders icons when not loading', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon" />} rightIcon={<span data-testid="right-icon" />}>
        Trade
      </Button>,
    )

    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('shows spinner and disables while loading', () => {
    render(<Button loading>Saving</Button>)

    const button = screen.getByRole('button', { name: /saving/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button.querySelector('[data-role="spinner"]')).toBeInTheDocument()
  })

  it('renders as a link when as="link" is provided', () => {
    render(
      <MemoryRouter>
        <Button as="link" to="/standings">
          Standings
        </Button>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /standings/i })
    expect(link).toHaveAttribute('href', '/standings')
    expect(link).toHaveAttribute('data-variant', 'primary')
  })
})
