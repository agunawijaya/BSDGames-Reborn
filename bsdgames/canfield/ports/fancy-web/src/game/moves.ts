import type { ParsedCommand } from './types'

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim().toLowerCase()
  if (!trimmed) return { command: { type: 'betting-info' }, error: 'Empty command' }

  // Hand to talon
  if (trimmed === 'ht') {
    return { command: { type: 'hand-to-talon' } }
  }

  // Stock to foundation
  if (trimmed === 'sf') {
    return { command: { type: 'stock-to-foundation' } }
  }

  // Talon to foundation
  if (trimmed === 'tf') {
    return { command: { type: 'talon-to-foundation' } }
  }

  // Toggle card counting
  if (trimmed === 'c') {
    return { command: { type: 'toggle-counting' } }
  }

  // Betting info
  if (trimmed === 'b') {
    return { command: { type: 'betting-info' } }
  }

  // Quit
  if (trimmed === 'q') {
    return { command: { type: 'quit' } }
  }

  // Undo
  if (trimmed === 'u' || trimmed === 'undo') {
    return { command: { type: 'undo' } }
  }

  // New game
  if (trimmed === 'n' || trimmed === 'new') {
    return { command: { type: 'new-game' } }
  }

  // Stock to tableau: s1..s4
  if (/^s[1-4]$/.test(trimmed)) {
    return { command: { type: 'stock-to-tableau', to: parseInt(trimmed[1], 10) - 1 } }
  }

  // Talon to tableau: t1..t4
  if (/^t[1-4]$/.test(trimmed)) {
    return { command: { type: 'talon-to-tableau', to: parseInt(trimmed[1], 10) - 1 } }
  }

  // Tableau to foundation: 1f..4f
  if (/^[1-4]f$/.test(trimmed)) {
    return { command: { type: 'tableau-to-foundation', from: parseInt(trimmed[0], 10) - 1 } }
  }

  // Tableau to tableau: 12, 13, 14, 21, 23, 24, 31, 32, 34, 41, 42, 43
  if (/^[1-4][1-4]$/.test(trimmed) && trimmed[0] !== trimmed[1]) {
    return {
      command: {
        type: 'tableau-to-tableau',
        from: parseInt(trimmed[0], 10) - 1,
        to: parseInt(trimmed[1], 10) - 1,
      },
    }
  }

  return { command: { type: 'betting-info' }, error: `Unknown command: ${input}` }
}
