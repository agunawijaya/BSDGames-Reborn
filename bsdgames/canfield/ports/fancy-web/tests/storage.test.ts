import { describe, it, expect } from 'vitest'
import { buildCfscoresEntry } from '../src/game/scoring'
import type { GameState } from '../src/game/types'

describe('cfscores storage', () => {
  it('builds a session entry from state', () => {
    const state: GameState = {
      foundations: [[], [], [], []],
      tableaus: [[], [], [], []],
      stock: [],
      talon: [],
      hand: [],
      baseCard: null,
      phase: 'commit',
      bankroll: -47,
      seed: 12345,
      countedCards: Array(52).fill(false),
      totalInfoCost: 5,
      handRuns: 1,
      timesThru: 0,
      lastMoveTime: 0,
      moveHistory: [],
      status: 'playing',
    }
    const entry = buildCfscoresEntry(state)
    expect(entry.seed).toBe(12345)
    expect(entry.net).toBe(-47)
    expect(entry.wins).toBe(0)
    expect(entry.spend.information).toBe(5)
    expect(entry.spend.runs).toBe(5)
  })
})
