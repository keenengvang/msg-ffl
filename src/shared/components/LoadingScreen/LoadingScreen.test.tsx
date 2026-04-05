import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingScreen } from './LoadingScreen'

describe('LoadingScreen', () => {
  it('renders with default message', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('LOADING...')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<LoadingScreen message="LOADING STANDINGS..." />)
    expect(screen.getByText('LOADING STANDINGS...')).toBeInTheDocument()
  })

  it('shows easter egg text', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('INSERT COIN TO CONTINUE')).toBeInTheDocument()
  })

  it('applies fullScreen class when prop is true', () => {
    const { container } = render(<LoadingScreen fullScreen />)
    expect(container.firstChild).toHaveClass('fullScreen')
  })

  it('does not apply fullScreen class by default', () => {
    const { container } = render(<LoadingScreen />)
    expect(container.firstChild).not.toHaveClass('fullScreen')
  })

  it('renders three spinner dots', () => {
    const { container } = render(<LoadingScreen />)
    const dots = container.querySelectorAll('.dot')
    expect(dots).toHaveLength(3)
  })
})
