import { describe, it, expect } from 'vitest'
import { parseCommand } from '../src/game/moves'

describe('command grammar', () => {
  it('parses stock-to-tableau', () => {
    expect(parseCommand('s1').command).toEqual({ type: 'stock-to-tableau', to: 0 })
    expect(parseCommand('s4').command).toEqual({ type: 'stock-to-tableau', to: 3 })
  })

  it('parses talon-to-tableau', () => {
    expect(parseCommand('t2').command).toEqual({ type: 'talon-to-tableau', to: 1 })
  })

  it('parses tableau-to-tableau', () => {
    expect(parseCommand('12').command).toEqual({ type: 'tableau-to-tableau', from: 0, to: 1 })
    expect(parseCommand('41').command).toEqual({ type: 'tableau-to-tableau', from: 3, to: 0 })
  })

  it('rejects same-pile tableau moves', () => {
    const result = parseCommand('22')
    expect(result.error).toBeDefined()
  })

  it('parses tableau-to-foundation', () => {
    expect(parseCommand('1f').command).toEqual({ type: 'tableau-to-foundation', from: 0 })
    expect(parseCommand('4f').command).toEqual({ type: 'tableau-to-foundation', from: 3 })
  })

  it('parses special commands', () => {
    expect(parseCommand('ht').command).toEqual({ type: 'hand-to-talon' })
    expect(parseCommand('sf').command).toEqual({ type: 'stock-to-foundation' })
    expect(parseCommand('tf').command).toEqual({ type: 'talon-to-foundation' })
    expect(parseCommand('c').command).toEqual({ type: 'toggle-counting' })
    expect(parseCommand('b').command).toEqual({ type: 'betting-info' })
    expect(parseCommand('q').command).toEqual({ type: 'quit' })
    expect(parseCommand('u').command).toEqual({ type: 'undo' })
    expect(parseCommand('n').command).toEqual({ type: 'new-game' })
  })

  it('rejects unknown commands', () => {
    const result = parseCommand('xyz')
    expect(result.error).toContain('Unknown')
  })
})
