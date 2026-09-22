import type { GameState, MoveRecord } from './types'
import {
  COST_OF_HAND,
  COST_OF_INSPECTION,
  COST_OF_GAME,
  COST_OF_RUNTHROUGH_HAND,
  COST_OF_INFORMATION,
  MAX_INFORMATION_COST,
  SECONDS_PER_DOLLAR,
  MAX_TIME_CHARGE,
  VALUE_PER_CARD_UP,
} from './types'

export function chargeInitialDeal(state: GameState): GameState {
  return { ...state, bankroll: state.bankroll - COST_OF_HAND }
}

export function chargeInspection(state: GameState): GameState {
  return { ...state, bankroll: state.bankroll - COST_OF_INSPECTION }
}

export function chargeGameCommit(state: GameState): GameState {
  return { ...state, bankroll: state.bankroll - COST_OF_GAME }
}

export function chargeHandRun(state: GameState): GameState {
  return {
    ...state,
    bankroll: state.bankroll - COST_OF_RUNTHROUGH_HAND,
    handRuns: state.handRuns + 1,
  }
}

export function chargeThinkingTime(state: GameState, now: number): GameState {
  const elapsedSeconds = (now - state.lastMoveTime) / 1000
  const dollars = Math.min(
    Math.floor(elapsedSeconds / SECONDS_PER_DOLLAR),
    MAX_TIME_CHARGE
  )
  if (dollars <= 0) return state
  return { ...state, bankroll: state.bankroll - dollars }
}

export function creditFoundationCard(state: GameState): GameState {
  return { ...state, bankroll: state.bankroll + VALUE_PER_CARD_UP }
}

export function chargeInformation(state: GameState, newlySeenCount: number): GameState {
  if (newlySeenCount <= 0) return state
  const allowed = Math.max(0, MAX_INFORMATION_COST - state.totalInfoCost)
  const charge = Math.min(newlySeenCount, allowed) * COST_OF_INFORMATION
  return {
    ...state,
    bankroll: state.bankroll - charge,
    totalInfoCost: state.totalInfoCost + charge,
  }
}

export function appendMoveHistory(
  state: GameState,
  command: string
): GameState {
  const record: MoveRecord = {
    command,
    bankrollBefore: state.bankroll,
    timestamp: Date.now(),
  }
  return {
    ...state,
    moveHistory: [...state.moveHistory, record],
    lastMoveTime: Date.now(),
  }
}

export interface CfscoresEntry {
  date: string
  seed: number
  wins: number // cards on foundation
  spend: {
    hand: number
    inspection: number
    game: number
    runs: number
    information: number
    thinktime: number
  }
  net: number
}

export interface CfscoresRecord {
  version: 1
  user: string
  created: string
  games: CfscoresEntry[]
  totalNet: number
}

export function buildCfscoresEntry(state: GameState): CfscoresEntry {
  const wins = state.foundations.reduce((sum, pile) => sum + pile.length, 0)
  const spend = {
    hand: COST_OF_HAND,
    inspection: state.phase !== 'buy' ? COST_OF_INSPECTION : 0,
    game: state.phase === 'commit' || state.phase === 'finished' ? COST_OF_GAME : 0,
    runs: state.handRuns * COST_OF_RUNTHROUGH_HAND,
    information: state.totalInfoCost,
    thinktime: 0, // tracked separately in real time; simplified here
  }
  const net = state.bankroll
  return {
    date: new Date().toISOString(),
    seed: state.seed,
    wins,
    spend,
    net,
  }
}
