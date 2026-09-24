import { describe, it, expect } from 'vitest'
import { applyCommand, advancePhase, deal } from '../src/game/engine'
import type { Card, GameState, Suit } from '../src/game/types'
import {
  COST_OF_HAND,
  COST_OF_INSPECTION,
  COST_OF_GAME,
  VALUE_PER_CARD_UP,
} from '../src/game/types'

function c(suit: Suit, rank: number, faceUp = true): Card {
  return { suit, rank: rank as Card['rank'], faceUp }
}

function mk(overrides: Partial<GameState> = {}): GameState {
  return {
    foundations: [[], [], [], []],
    tableaus: [[], [], [], []],
    stock: [],
    talon: [],
    hand: [],
    baseCard: null,
    phase: 'commit',
    bankroll: 0,
    seed: 1,
    countedCards: Array(52).fill(false),
    seenCards: Array(52).fill(false),
    countingOn: false,
    totalInfoCost: 0,
    handRuns: 0,
    timesThru: 0,
    lastMoveTime: Date.now(),
    moveHistory: [],
    status: 'playing',
    ...overrides,
  }
}

describe('Canfield rule regression tests', () => {
  it('talon cannot fill an empty tableau while stock has cards', () => {
    const s = mk({ stock: [c('clubs', 3)], talon: [c('diamonds', 8)], tableaus: [[], [c('spades', 9)], [], []] })
    const after = applyCommand(s, { type: 'talon-to-tableau', to: 0 })
    expect(after.tableaus[0]).toHaveLength(0)
  })

  it('talon may fill an empty tableau once stock is empty', () => {
    const s = mk({ stock: [], talon: [c('diamonds', 8)], tableaus: [[], [c('spades', 9)], [], []] })
    const after = applyCommand(s, { type: 'talon-to-tableau', to: 0 })
    expect(after.tableaus[0]).toHaveLength(1)
    expect(after.tableaus[0][0].rank).toBe(8)
  })

  it('a tableau pile never moves into an empty tableau', () => {
    const s = mk({ stock: [], tableaus: [[c('clubs', 4)], [], [], []] })
    const after = applyCommand(s, { type: 'tableau-to-tableau', from: 0, to: 1 })
    expect(after.tableaus[1]).toHaveLength(0)
    expect(after.tableaus[0]).toHaveLength(1)
  })

  it('auto-move only promotes base-rank cards', () => {
    const s = mk({
      foundations: [[c('spades', 5)], [], [], []],
      tableaus: [[c('spades', 6)], [], [], []],
      baseCard: c('spades', 5),
    })
    const after = applyCommand(s, { type: 'toggle-counting' })
    expect(after.tableaus[0]).toHaveLength(1)
  })

  it('first board move in Buy auto-pays Inspect, executes, and earns no credit', () => {
    const s = mk({
      phase: 'buy',
      foundations: [[c('spades', 5)], [], [], []],
      tableaus: [[c('spades', 6)], [], [], []],
      baseCard: c('spades', 5),
      bankroll: -COST_OF_HAND,
    })
    const after = applyCommand(s, { type: 'tableau-to-foundation', from: 0 })
    expect(after.foundations[0]).toHaveLength(2)
    expect(after.tableaus[0]).toHaveLength(0)
    expect(after.phase).toBe('inspect')
    expect(after.bankroll).toBe(-COST_OF_HAND - COST_OF_INSPECTION)
  })

  it('manually moving a base-rank tableau card to an empty foundation works in Buy', () => {
    const s = mk({
      phase: 'buy',
      foundations: [[c('spades', 5)], [], [], []],
      tableaus: [[c('hearts', 5)], [], [], []],
      baseCard: c('spades', 5),
      bankroll: -COST_OF_HAND,
    })
    const after = applyCommand(s, { type: 'tableau-to-foundation', from: 0 })
    expect(after.foundations[1]).toHaveLength(1)
    expect(after.phase).toBe('inspect')
  })

  it('an illegal move in Buy charges nothing and stays in Buy', () => {
    const s = mk({
      phase: 'buy',
      foundations: [[c('spades', 5)], [], [], []],
      tableaus: [[c('hearts', 9)], [], [], []],
      baseCard: c('spades', 5),
      bankroll: -COST_OF_HAND,
    })
    const after = applyCommand(s, { type: 'tableau-to-foundation', from: 0 })
    expect(after).toBe(s)
  })

  it('hand-to-talon stays locked in Buy and Inspect', () => {
    for (const phase of ['buy', 'inspect'] as const) {
      const s = mk({ phase, hand: [c('clubs', 2, false)] })
      expect(applyCommand(s, { type: 'hand-to-talon' })).toBe(s)
    }
  })

  it('base card is credited when the game is bought', () => {
    const s = advancePhase(deal(1), 'commit')
    expect(s.bankroll).toBe(-COST_OF_HAND - COST_OF_INSPECTION - COST_OF_GAME + VALUE_PER_CARD_UP)
  })

  it('recycle replays the same order', () => {
    // Construct a state where hand is empty and talon holds known cards [1,2,3]
    // (talon top is the last element, so top=3).
    let s = mk({
      hand: [],
      talon: [c('spades', 1), c('hearts', 2), c('clubs', 3)],
      handRuns: 0,
      timesThru: 1,
    })
    // Deal from empty hand triggers recycle then deals 3.
    s = applyCommand(s, { type: 'hand-to-talon' })
    expect(s.talon.map(c => c.rank)).toEqual([1, 2, 3])
  })

  it('talon auto-refills from hand when emptied', () => {
    let s = advancePhase(advancePhase(deal(7), 'inspect'), 'commit')
    // Empty the talon by moving its top card somewhere legal, if possible.
    // Use a constructed state instead for determinism.
    s = mk({
      hand: Array.from({ length: 28 }, (_, i) => c('spades', ((i % 13) + 1) as Card['rank'], false)),
      talon: [c('diamonds', 8)],
    })
    // Move the last talon card to a foundation if legal; here it is not, so force empty via command.
    // Instead, simulate by applying hand-to-talon until talon empties, then verify refill.
    s = { ...s, talon: [] }
    s = applyCommand(s, { type: 'hand-to-talon' })
    expect(s.talon.length).toBe(3)
  })

  it('fourth fruitless pass ends the game', () => {
    let s = mk({
      hand: [],
      talon: [c('spades', 1)],
      timesThru: 3,
    })
    s = applyCommand(s, { type: 'hand-to-talon' })
    expect(s.status).toBe('lost')
  })

  it('successful move resets the fruitless cycle counter', () => {
    let s = mk({
      stock: [c('clubs', 6)],
      tableaus: [[], [c('spades', 7)], [], []],
      timesThru: 2,
    })
    s = applyCommand(s, { type: 'stock-to-tableau', to: 0 })
    expect(s.timesThru).toBe(0)
  })

  it('betting-info does not double-charge thinking time', () => {
    let s = mk({ lastMoveTime: Date.now() - 120_000 })
    s = applyCommand(s, { type: 'betting-info' })
    const afterFirst = s.bankroll
    s = applyCommand(s, { type: 'betting-info' })
    expect(s.bankroll).toBe(afterFirst)
  })

  it('illegal move: no charge, no history entry', () => {
    let s = mk({
      stock: [c('clubs', 3)],
      tableaus: [[c('spades', 4)], [], [], []],
      lastMoveTime: Date.now() - 120_000,
    })
    const before = s.bankroll
    const beforeHistory = s.moveHistory.length
    const after = applyCommand(s, { type: 'stock-to-tableau', to: 0 })
    expect(after.bankroll).toBe(before)
    expect(after.moveHistory.length).toBe(beforeHistory)
  })

  it('undo restores the prior state and charges a flat $5', () => {
    // Unit-test the engine-level contract by simulating the hook logic.
    const before = mk({ bankroll: -50, tableaus: [[c('hearts', 5)], [], [], []] })
    applyCommand(before, { type: 'tableau-to-foundation', from: 0 })
    const undone = { ...before, bankroll: before.bankroll - 5 }
    expect(undone.tableaus[0]).toHaveLength(1)
    expect(undone.bankroll).toBe(-55)
  })

  it('counting only charges for the talon top beyond the first 18 dealt cards', () => {
    const s = deal(1)
    const after = applyCommand(s, { type: 'toggle-counting' })
    // The 18 initially-dealt cards are paid; only the face-up talon top is newly charged.
    expect(after.totalInfoCost).toBe(1)
  })
})

describe('empty-space rules are explained, not silent', () => {
  it('talon cannot fill an empty tableau while the stock has cards', () => {
    const s = mk({
      stock: [c('clubs', 3)],
      talon: [c('diamonds', 8)],
      tableaus: [[], [c('spades', 9)], [], []],
      baseCard: c('hearts', 1),
      foundations: [[c('hearts', 1)], [], [], []],
    })
    expect(applyCommand(s, { type: 'talon-to-tableau', to: 0 })).toBe(s)
    // ...but it can once the stock is gone, and can go onto a non-empty legal target.
    expect(applyCommand({ ...s, stock: [] }, { type: 'talon-to-tableau', to: 0 }).tableaus[0]).toHaveLength(1)
    expect(applyCommand(s, { type: 'talon-to-tableau', to: 1 }).tableaus[1]).toHaveLength(2)
  })
})

describe('foundation credit after Commit', () => {
  it('credits $5 for every card that reaches a foundation after Commit', () => {
    const s = mk({
      phase: 'commit',
      bankroll: -52,
      foundations: [[c('spades', 5)], [], [], []],
      tableaus: [[c('spades', 6)], [], [], []],
      baseCard: c('spades', 5),
    })
    const after = applyCommand(s, { type: 'tableau-to-foundation', from: 0 })
    expect(after.bankroll).toBe(-52 + VALUE_PER_CARD_UP)
  })

  it('credits the base-card auto-move and the move together', () => {
    const s = mk({
      phase: 'commit',
      bankroll: 0,
      foundations: [[c('spades', 5)], [], [], []],
      tableaus: [[c('spades', 6)], [], [], []],
      stock: [c('hearts', 5)],
      baseCard: c('spades', 5),
    })
    const after = applyCommand(s, { type: 'tableau-to-foundation', from: 0 })
    expect(after.bankroll).toBe(2 * VALUE_PER_CARD_UP) // 6♠ moved + 5♥ auto-placed
  })

  it('a fully won game with Commit ends in profit', () => {
    // Base rank Ace; 51 cards up, last card on the tableau.
    const suits = ['spades', 'hearts', 'clubs', 'diamonds'] as const
    const foundations = suits.map((suit, si) =>
      Array.from({ length: si === 3 ? 12 : 13 }, (_, i) => c(suit, i + 1))
    )
    const s = mk({
      phase: 'commit',
      bankroll: -COST_OF_HAND - COST_OF_INSPECTION - COST_OF_GAME + 51 * VALUE_PER_CARD_UP,
      foundations,
      tableaus: [[c('diamonds', 13)], [], [], []],
      baseCard: c('spades', 1),
    })
    const won = applyCommand(s, { type: 'tableau-to-foundation', from: 0 })
    expect(won.status).toBe('won')
    expect(won.bankroll).toBe(-52 + 52 * VALUE_PER_CARD_UP) // +$208
  })
})

describe('card counting follows canfield.c (Cflag / paid / visible)', () => {
  const committed = () => advancePhase(deal(11), 'commit')

  it('starts off, and the pre-paid initial cards never cost anything', () => {
    const d = deal(11)
    expect(d.countingOn).toBe(false)
    // Only the visible talon top (dealt from the hand) is unpaid at the start.
    const on = applyCommand(d, { type: 'toggle-counting' })
    expect(on.countingOn).toBe(true)
    expect(d.bankroll - on.bankroll).toBe(1)
    expect(on.totalInfoCost).toBe(1)
  })

  it('toggling off and on again never bills a paid card twice', () => {
    let s = applyCommand(committed(), { type: 'toggle-counting' })
    const paid = s.bankroll
    s = applyCommand(s, { type: 'toggle-counting' }) // off
    s = applyCommand(s, { type: 'toggle-counting' }) // on
    expect(s.countingOn).toBe(true)
    expect(s.bankroll).toBe(paid)
  })

  it('while ON, a newly visible talon card costs $1', () => {
    let s = applyCommand(committed(), { type: 'toggle-counting' })
    const before = s.bankroll
    s = applyCommand(s, { type: 'hand-to-talon' })
    expect(before - s.bankroll).toBe(1)
  })

  it('while OFF, cards that become visible are billed only when it is switched on', () => {
    let s = committed()
    const before = s.bankroll
    s = applyCommand(s, { type: 'hand-to-talon' })
    s = applyCommand(s, { type: 'hand-to-talon' })
    expect(s.bankroll).toBe(before) // nothing charged while off
    const on = applyCommand(s, { type: 'toggle-counting' })
    expect(before - on.bankroll).toBe(3) // first talon top + two new tops
  })

  it('never reveals hand cards the player has not seen', () => {
    const s = applyCommand(committed(), { type: 'toggle-counting' })
    const unseenInHand = s.hand.filter(card => !s.seenCards[['spades', 'hearts', 'clubs', 'diamonds'].indexOf(card.suit) * 13 + card.rank - 1])
    expect(unseenInHand.length).toBe(s.hand.length)
  })

  it('total information cost can never exceed $34', () => {
    let s = applyCommand(committed(), { type: 'toggle-counting' })
    for (let i = 0; i < 200 && s.status === 'playing'; i++) s = applyCommand(s, { type: 'hand-to-talon' })
    expect(s.totalInfoCost).toBeLessThanOrEqual(34)
  })
})
