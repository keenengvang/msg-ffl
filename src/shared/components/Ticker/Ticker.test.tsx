import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Ticker } from './Ticker'

describe('Ticker', () => {
  it('renders nothing when items array is empty', () => {
    const { container } = render(<Ticker items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the LIVE label', () => {
    render(<Ticker items={['Breaking news']} />)
    expect(screen.getByText('📡 LIVE')).toBeInTheDocument()
  })

  it('renders ticker items', () => {
    render(<Ticker items={['First item', 'Second item']} />)
    // Items are duplicated for seamless loop, so each appears twice
    expect(screen.getAllByText('First item')).toHaveLength(2)
    expect(screen.getAllByText('Second item')).toHaveLength(2)
  })

  it('duplicates items for seamless loop animation', () => {
    const { container } = render(<Ticker items={['A', 'B', 'C']} />)
    const items = container.querySelectorAll('.item')
    // 3 items * 2 (duplicated) = 6
    expect(items).toHaveLength(6)
  })
})
