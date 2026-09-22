import { useEffect, useCallback } from 'react'
import type { GameState } from '../game/types'
import { buildCfscoresEntry, type CfscoresRecord } from '../game/scoring'

const GAME_KEY = 'canfield-fancy-web:game'
const SCORES_KEY = 'canfield-fancy-web:scores'

export function useStorage(state?: GameState) {
  // Auto-save game state whenever it changes.
  useEffect(() => {
    if (state && state.status === 'playing') {
      localStorage.setItem(GAME_KEY, JSON.stringify(state))
    }
  }, [state])

  const loadGame = useCallback((): GameState | undefined => {
    const raw = localStorage.getItem(GAME_KEY)
    if (!raw) return undefined
    try {
      return JSON.parse(raw) as GameState
    } catch {
      return undefined
    }
  }, [])

  const recordSession = useCallback((state: GameState) => {
    const entry = buildCfscoresEntry(state)
    const existing: CfscoresRecord = JSON.parse(localStorage.getItem(SCORES_KEY) ?? JSON.stringify({
      version: 1,
      user: 'anonymous',
      created: new Date().toISOString(),
      games: [],
      totalNet: 0,
    }))
    const games = [...existing.games, entry]
    const totalNet = games.reduce((sum, g) => sum + g.net, 0)
    localStorage.setItem(SCORES_KEY, JSON.stringify({ ...existing, games, totalNet }))
  }, [])

  const getScores = useCallback((): CfscoresRecord => {
    const raw = localStorage.getItem(SCORES_KEY)
    if (!raw) {
      return {
        version: 1,
        user: 'anonymous',
        created: new Date().toISOString(),
        games: [],
        totalNet: 0,
      }
    }
    try {
      return JSON.parse(raw) as CfscoresRecord
    } catch {
      return {
        version: 1,
        user: 'anonymous',
        created: new Date().toISOString(),
        games: [],
        totalNet: 0,
      }
    }
  }, [])

  const clearSavedGame = useCallback(() => {
    localStorage.removeItem(GAME_KEY)
  }, [])

  return { loadGame, recordSession, getScores, clearSavedGame }
}
