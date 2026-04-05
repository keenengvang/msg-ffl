import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PixelCard } from './PixelCard'

describe('PixelCard', () => {
  it('renders children', () => {
    render(<PixelCard>Hello World</PixelCard>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies variant class', () => {
    const { container } = render(<PixelCard variant="highlight">Content</PixelCard>)
    expect(container.firstChild).toHaveClass('highlight')
  })

  it('defaults to "default" variant', () => {
    const { container } = render(<PixelCard>Content</PixelCard>)
    expect(container.firstChild).toHaveClass('default')
  })

  it('applies custom className', () => {
    const { container } = render(<PixelCard className="my-class">Content</PixelCard>)
    expect(container.firstChild).toHaveClass('my-class')
  })

  it('applies custom style', () => {
    const { container } = render(<PixelCard style={{ color: 'red' }}>Content</PixelCard>)
    expect(container.firstChild).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('adds button role and tabIndex when onClick is provided', () => {
    const handleClick = vi.fn()
    const { container } = render(<PixelCard onClick={handleClick}>Clickable</PixelCard>)
    const card = container.firstChild as HTMLElement

    expect(card).toHaveAttribute('role', 'button')
    expect(card).toHaveAttribute('tabindex', '0')
  })

  it('does not add button role without onClick', () => {
    const { container } = render(<PixelCard>Static</PixelCard>)
    const card = container.firstChild as HTMLElement

    expect(card).not.toHaveAttribute('role')
    expect(card).not.toHaveAttribute('tabindex')
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<PixelCard onClick={handleClick}>Clickable</PixelCard>)

    await user.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
