import { useState, useCallback, useEffect, useRef } from 'react'
import type { GameState, Command } from '../game/types'
import { UNDO_PENALTY, COST_OF_HAND } from '../game/types'
import { deal, applyCommand, advancePhase, isCommandLegal } from '../game/engine'
import { parseCommand } from '../game/moves'

export interface UseGameReturn {
  state: GameState
  history: GameState[]
  dispatch: (command: Command) => GameState
  dispatchText: (text: string) => { error?: string; state?: GameState }
  canUndo: boolean
  undo: () => void
  inspect: () => void
  commit: () => void
  newGame: () => void
  resetBankroll: () => void
  quit: () => void
}

export function useGame(savedState?: GameState, initialSeed?: number): UseGameReturn {
  const [state, setState] = useState<GameState>(() => savedState ?? deal(initialSeed ?? Date.now()))
  const [history, setHistory] = useState<GameState[]>([])
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const dispatch = useCallback((command: Command) => {
    const current = stateRef.current
    if (!isCommandLegal(current, command)) {
      return current
    }
    const next = applyCommand(current, command)
    if (next !== current) {
      // A phase change is a purchase (e.g. the auto-inspect on the first move);
      // purchases cannot be taken back.
      setHistory(prev => (next.phase !== current.phase ? [] : [...prev, current]))
    }
    setState(next)
    stateRef.current = next
    return next
  }, [])

  const dispatchText = useCallback((text: string) => {
    const parsed = parseCommand(text)
    if (parsed.error) {
      return { error: parsed.error }
    }
    const next = dispatch(parsed.command)
    return { state: next }
  }, [dispatch])

  const canUndo = history.length > 0

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev
      const previous = prev[prev.length - 1]
      // Take-back costs a flat $5 from the state being restored.
      const next = { ...previous, bankroll: previous.bankroll - UNDO_PENALTY }
      setState(next)
      stateRef.current = next
      return prev.slice(0, -1)
    })
  }, [])

  const inspect = useCallback(() => {
    const next = advancePhase(stateRef.current, 'inspect')
    setHistory([])
    setState(next)
    stateRef.current = next
  }, [])

  const commit = useCallback(() => {
    const next = advancePhase(stateRef.current, 'commit')
    setHistory([])
    setState(next)
    stateRef.current = next
  }, [])

  const newGame = useCallback(() => {
    const current = stateRef.current
    const next = deal(current.seed + 1)
    // Carry the running bankroll into the next session and charge a new hand.
    const carried = { ...next, bankroll: current.bankroll - COST_OF_HAND }
    setHistory([])
    setState(carried)
    stateRef.current = carried
  }, [])

  // Start over with a fresh bankroll: a new deal whose only balance is the $13 hand.
  const resetBankroll = useCallback(() => {
    const next = deal(stateRef.current.seed + 1)
    setHistory([])
    setState(next)
    stateRef.current = next
  }, [])

  const quit = useCallback(() => {
    dispatch({ type: 'quit' })
  }, [dispatch])

  return {
    state,
    history,
    dispatch,
    dispatchText,
    canUndo,
    undo,
    inspect,
    commit,
    newGame,
    resetBankroll,
    quit,
  }
}
