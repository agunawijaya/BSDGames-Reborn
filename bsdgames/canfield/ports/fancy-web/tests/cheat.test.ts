import { describe, it, expect } from 'vitest'
import { deal, advancePhase, legalMoveHints, recommendedPhaseAction } from '../src/game/engine'

function findSeed(predicate: (seed: number) => boolean, max = 2000): number {
  for (let seed = 1; seed <= max; seed++) {
    if (predicate(seed)) return seed
  }
  throw new Error('No matching seed found in range')
}

describe('cheat helpers', () => {
  it('recommends inspect in buy phase', () => {
    const state = deal(12345)
    expect(recommendedPhaseAction(state)).toBe('inspect')
  })

  it('recommends commit in inspect phase when a foundation move exists', () => {
    const seed = findSeed((s) => {
      const afterDeal = deal(s)
      const afterInspect = advancePhase(afterDeal)
      return legalMoveHints(afterInspect).some(h => h.command.type.endsWith('-to-foundation'))
    })
    const state = advancePhase(deal(seed))
    expect(recommendedPhaseAction(state)).toBe('commit')
  })

  it('does not recommend commit when no foundation move is visible', () => {
    const seed = findSeed((s) => {
      const afterDeal = deal(s)
      const afterInspect = advancePhase(afterDeal)
      return !legalMoveHints(afterInspect).some(h => h.command.type.endsWith('-to-foundation'))
    })
    const state = advancePhase(deal(seed))
    expect(recommendedPhaseAction(state)).toBeNull()
  })

  it('returns no hints in buy or finished phase', () => {
    const buy = deal(12345)
    expect(legalMoveHints(buy)).toHaveLength(0)

    const finished = { ...buy, phase: 'finished' as const, status: 'won' as const }
    expect(legalMoveHints(finished)).toHaveLength(0)
  })

  it('returns scored hints in commit phase', () => {
    const seed = findSeed((s) => legalMoveHints(advancePhase(advancePhase(deal(s)))).length > 0)
    const committed = advancePhase(advancePhase(deal(seed)))
    const hints = legalMoveHints(committed)

    expect(hints.length).toBeGreaterThan(0)
    // Foundation moves score higher than tableau moves.
    const foundationHints = hints.filter(h => h.command.type.endsWith('-to-foundation'))
    const tableauHints = hints.filter(h => h.command.type === 'tableau-to-tableau' || h.command.type.endsWith('-to-tableau'))
    if (foundationHints.length > 0 && tableauHints.length > 0) {
      expect(foundationHints[0].score).toBeGreaterThan(tableauHints[0].score)
    }
    // Every hint has source and target test ids when applicable.
    for (const hint of hints) {
      if (hint.command.type !== 'hand-to-talon') {
        expect(hint.sourceTestId).not.toBe('')
        expect(hint.targetTestId).not.toBe('')
      }
    }
  })

  it('includes hand-to-talon hint in commit phase when cards remain', () => {
    const committed = advancePhase(advancePhase(deal(12345)))
    const hints = legalMoveHints(committed)
    if (committed.hand.length > 0 || committed.talon.length > 0) {
      expect(hints.some(h => h.command.type === 'hand-to-talon')).toBe(true)
    }
  })
})
