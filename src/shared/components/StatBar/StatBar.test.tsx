import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatBar } from './StatBar'

describe('StatBar', () => {
  it('renders with a label', () => {
    render(<StatBar value={50} min={0} max={100} label="PTS" />)
    expect(screen.getByText('PTS')).toBeInTheDocument()
  })

  it('shows value when showValue is true (default)', () => {
    render(<StatBar value={75.3} min={0} max={100} />)
    expect(screen.getByText('75.3')).toBeInTheDocument()
  })

  it('hides value when showValue is false', () => {
    render(<StatBar value={75.3} min={0} max={100} showValue={false} />)
    expect(screen.queryByText('75.3')).not.toBeInTheDocument()
  })

  it('calculates correct fill width percentage', () => {
    const { container } = render(<StatBar value={50} min={0} max={100} />)
    const fill = container.querySelector('.fill') as HTMLElement
    expect(fill.style.width).toBe('50%')
  })

  it('clamps fill to 0% when value is below min', () => {
    const { container } = render(<StatBar value={-10} min={0} max={100} />)
    const fill = container.querySelector('.fill') as HTMLElement
    expect(fill.style.width).toBe('0%')
  })

  it('clamps fill to 100% when value exceeds max', () => {
    const { container } = render(<StatBar value={200} min={0} max={100} />)
    const fill = container.querySelector('.fill') as HTMLElement
    expect(fill.style.width).toBe('100%')
  })

  it('handles equal min and max gracefully', () => {
    const { container } = render(<StatBar value={5} min={5} max={5} />)
    const fill = container.querySelector('.fill') as HTMLElement
    expect(fill.style.width).toBe('0%')
  })

  it('applies custom color', () => {
    const { container } = render(<StatBar value={50} min={0} max={100} color="red" />)
    const fill = container.querySelector('.fill') as HTMLElement
    expect(fill.style.background).toBe('red')
  })
})
