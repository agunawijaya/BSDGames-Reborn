import { useState, useCallback, useEffect, useRef } from 'react'
import type { GameState, Command } from '../game/types'
import { UNDO_PENALTY } from '../game/types'
import { deal, applyCommand, advancePhase } from '../game/engine'
import { parseCommand } from '../game/moves'

export interface UseGameReturn {
  state: GameState
  history: GameState[]
  dispatch: (command: Command) => void
  dispatchText: (text: string) => { error?: string }
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
    setHistory(prev => [...prev, stateRef.current])
    setState(prev => applyCommand(prev, command))
  }, [])

  const dispatchText = useCallback((text: string) => {
    const parsed = parseCommand(text)
    if (parsed.error) {
      return { error: parsed.error }
    }
    dispatch(parsed.command)
    return {}
  }, [dispatch])

  const canUndo = history.length > 0

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev
      const previous = prev[prev.length - 1]
      setState(s => ({ ...previous, bankroll: s.bankroll - UNDO_PENALTY }))
      return prev.slice(0, -1)
    })
  }, [])

  const inspect = useCallback(() => {
    setHistory(prev => [...prev, stateRef.current])
    setState(prev => advancePhase(prev))
  }, [])

  const commit = useCallback(() => {
    setHistory(prev => [...prev, stateRef.current])
    setState(prev => advancePhase(prev))
  }, [])

  const newGame = useCallback(() => {
    setHistory([])
    setState(deal())
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
