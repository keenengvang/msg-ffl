import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PixelBadge } from './PixelBadge'

describe('PixelBadge', () => {
  it('renders children text and icon', () => {
    render(<PixelBadge icon={<span data-testid="dot" />}>Primary</PixelBadge>)

    expect(screen.getByText('Primary')).toBeInTheDocument()
    expect(screen.getByTestId('dot')).toBeInTheDocument()
  })

  it('falls back to rarity mapping when no explicit intent provided', () => {
    const { container } = render(<PixelBadge rarity="legendary">Legendary</PixelBadge>)
    expect(container.firstChild).toHaveAttribute('data-intent', 'primary')
  })

  it('exposes intent/tone via data attributes', () => {
    const { container } = render(
      <PixelBadge intent="destructive" tone="outline">
        Alert
      </PixelBadge>,
    )

    expect(container.firstChild).toHaveAttribute('data-intent', 'destructive')
    expect(container.firstChild).toHaveAttribute('data-tone', 'outline')
  })

  it('applies custom className', () => {
    const { container } = render(<PixelBadge className="extra">badge</PixelBadge>)
    expect(container.firstChild).toHaveClass('extra')
  })
})
