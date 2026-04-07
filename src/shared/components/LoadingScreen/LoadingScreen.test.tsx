import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingScreen } from './LoadingScreen'

describe('LoadingScreen', () => {
  it('renders with default message', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<LoadingScreen message="LOADING STANDINGS..." />)
    expect(screen.getByText('LOADING STANDINGS...')).toBeInTheDocument()
  })

  it('shows the default subtext tagline', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('Syncing stats & vibes')).toBeInTheDocument()
  })

  it('applies fullScreen class when prop is true', () => {
    const { container } = render(<LoadingScreen fullScreen />)
    expect(container.firstChild).toHaveClass('fullScreen')
  })

  it('does not apply fullScreen class by default', () => {
    const { container } = render(<LoadingScreen />)
    expect(container.firstChild).not.toHaveClass('fullScreen')
  })

  it('renders the retro spinner element', () => {
    const { container } = render(<LoadingScreen />)
    const spinner = container.querySelector('[data-role="retro-spinner"]')
    expect(spinner).not.toBeNull()
  })
})
