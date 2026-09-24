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
      setHistory(prev => [...prev, current])
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
    setHistory(prev => [...prev, stateRef.current])
    setState(prev => advancePhase(prev, 'inspect'))
  }, [])

  const commit = useCallback(() => {
    setHistory(prev => [...prev, stateRef.current])
    setState(prev => advancePhase(prev, 'commit'))
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
    quit,
  }
}
