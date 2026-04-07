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

  it('renders ticker items twice for seamless loop', () => {
    render(<Ticker items={['First item', 'Second item']} />)
    expect(screen.getAllByText('First item')).toHaveLength(2)
    expect(screen.getAllByText('Second item')).toHaveLength(2)
  })

  it('exposes paused state via data attribute', () => {
    const { container } = render(<Ticker items={['A']} paused />)
    expect(container.firstChild).toHaveAttribute('data-paused', 'true')
  })

  it('duplicates items using data-role markers', () => {
    const { container } = render(<Ticker items={['A', 'B', 'C']} />)
    const items = container.querySelectorAll('[data-role="ticker-item"]')
    expect(items).toHaveLength(6)
  })
})
