import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PixelCard } from './PixelCard'

describe('PixelCard', () => {
  it('renders children plus header/footer', () => {
    render(
      <PixelCard header="Top" footer="Bottom">
        Hello World
      </PixelCard>,
    )

    expect(screen.getByText('Top')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('Bottom')).toBeInTheDocument()
  })

  it('exposes variant via data attribute', () => {
    const { container } = render(<PixelCard variant="warning">Content</PixelCard>)
    expect(container.firstChild).toHaveAttribute('data-variant', 'warning')
  })

  it('maps legacy variants to retro equivalents', () => {
    const { container } = render(<PixelCard variant="win">Content</PixelCard>)
    expect(container.firstChild).toHaveAttribute('data-variant', 'success')
  })

  it('applies custom className and style props', () => {
    const { container } = render(
      <PixelCard className="my-card" style={{ color: 'red' }}>
        Content
      </PixelCard>,
    )
    expect(container.firstChild).toHaveClass('my-card')
    expect(container.firstChild).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('adds interactive semantics when onClick is provided', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<PixelCard onClick={handleClick}>Clickable</PixelCard>)

    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('tabindex', '0')

    await user.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)

    card.focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('stays non-interactive without onClick', () => {
    const { container } = render(<PixelCard>Static</PixelCard>)
    expect(container.firstChild).not.toHaveAttribute('role')
  })
})
