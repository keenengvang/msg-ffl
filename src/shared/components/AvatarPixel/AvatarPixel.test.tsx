import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AvatarPixel } from './AvatarPixel'

describe('AvatarPixel', () => {
  it('renders an image with the given src', () => {
    render(<AvatarPixel src="https://example.com/avatar.png" name="TestUser" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png')
  })

  it('uses name as alt text', () => {
    render(<AvatarPixel src="https://example.com/avatar.png" name="TestUser" />)
    expect(screen.getByAltText('TestUser')).toBeInTheDocument()
  })

  it('applies size class', () => {
    const { container } = render(<AvatarPixel src="test.png" name="Test" size="lg" />)
    expect(container.firstChild).toHaveClass('lg')
  })

  it('defaults to md size', () => {
    const { container } = render(<AvatarPixel src="test.png" name="Test" />)
    expect(container.firstChild).toHaveClass('md')
  })

  it('falls back to DiceBear on image error', () => {
    render(<AvatarPixel src="https://broken.com/nope.png" name="FallbackUser" />)
    const img = screen.getByRole('img')

    fireEvent.error(img)

    expect(img.getAttribute('src')).toContain('dicebear')
    expect(img.getAttribute('src')).toContain('FallbackUser')
  })

  it('applies custom className', () => {
    const { container } = render(<AvatarPixel src="test.png" name="Test" className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('sets lazy loading on the image', () => {
    render(<AvatarPixel src="test.png" name="Test" />)
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy')
  })
})
