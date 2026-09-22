import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pile } from '../src/ui/Pile'
import type { Pile as PileType } from '../src/game/types'

describe('Pile click-to-select', () => {
  it('calls onCardClick when top card is clicked', () => {
    const pile: PileType = [{ suit: 'hearts', rank: 5, faceUp: true }]
    let clicked = false
    render(<Pile pile={pile} onCardClick={() => { clicked = true }} label="T1" />)
    const card = screen.getByLabelText('5 of hearts')
    fireEvent.click(card)
    expect(clicked).toBe(true)
  })

  it('does not call onCardClick when a non-top card is clicked', () => {
    const pile: PileType = [
      { suit: 'hearts', rank: 5, faceUp: true },
      { suit: 'spades', rank: 6, faceUp: true },
    ]
    let clicked = false
    render(<Pile pile={pile} onCardClick={() => { clicked = true }} label="T1" />)
    const bottomCard = screen.getByLabelText('5 of hearts')
    fireEvent.click(bottomCard)
    expect(clicked).toBe(false)
  })
})
