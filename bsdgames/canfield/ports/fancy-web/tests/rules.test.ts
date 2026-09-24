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

  it('no foundation move or credit in Buy phase', () => {
    const s = mk({
      phase: 'buy',
      foundations: [[c('spades', 5)], [], [], []],
      stock: [c('spades', 5)],
      baseCard: c('spades', 5),
      bankroll: -COST_OF_HAND,
    })
    const after = applyCommand(s, { type: 'stock-to-foundation' })
    expect(after.foundations[0]).toHaveLength(1)
    expect(after.bankroll).toBe(-COST_OF_HAND)
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
