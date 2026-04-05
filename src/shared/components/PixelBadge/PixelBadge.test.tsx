import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PixelBadge } from './PixelBadge'

describe('PixelBadge', () => {
  it('renders children text', () => {
    render(<PixelBadge>LEGENDARY</PixelBadge>)
    expect(screen.getByText('LEGENDARY')).toBeInTheDocument()
  })

  it('defaults to common rarity', () => {
    const { container } = render(<PixelBadge>common</PixelBadge>)
    expect(container.firstChild).toHaveClass('common')
  })

  it('applies rarity class', () => {
    const { container } = render(<PixelBadge rarity="legendary">legendary</PixelBadge>)
    expect(container.firstChild).toHaveClass('legendary')
  })

  it('applies custom className', () => {
    const { container } = render(<PixelBadge className="extra">badge</PixelBadge>)
    expect(container.firstChild).toHaveClass('extra')
  })

  it('renders as a span element', () => {
    const { container } = render(<PixelBadge>badge</PixelBadge>)
    expect(container.firstChild!.nodeName).toBe('SPAN')
  })
})
