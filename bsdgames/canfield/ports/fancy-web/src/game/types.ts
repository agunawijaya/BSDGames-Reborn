export const SUITS = ['spades', 'hearts', 'clubs', 'diamonds'] as const
export type Suit = typeof SUITS[number]

export const SUIT_COLORS: Record<Suit, 'red' | 'black'> = {
  spades: 'black',
  clubs: 'black',
  hearts: 'red',
  diamonds: 'red',
}

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  clubs: '♣',
  diamonds: '♦',
}

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

export const RANK_LABELS: Record<Rank, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
}

export interface Card {
  suit: Suit
  rank: Rank
  faceUp: boolean
}

export type Pile = Card[]

export type GamePhase = 'buy' | 'inspect' | 'commit' | 'finished'

export interface MoveRecord {
  command: string
  bankrollBefore: number
  timestamp: number
}

export interface GameState {
  foundations: Pile[]
  tableaus: Pile[]
  stock: Pile
  talon: Pile
  hand: Pile
  baseCard: Card | null
  phase: GamePhase
  bankroll: number
  seed: number
  countedCards: boolean[] // parallel to deck index; `paid` in canfield.c: this card's $1 has been charged
  seenCards: boolean[] // parallel to deck index; `visible` in canfield.c: the card has been face-up at some point
  countingOn: boolean // card-counting display toggled on (`Cflag` in canfield.c)
  totalInfoCost: number
  handRuns: number // how many times the hand has been recycled
  timesThru: number // consecutive fruitless hand cycles (loss at 4)
  lastMoveTime: number // ms timestamp when the last move finished
  moveHistory: MoveRecord[]
  status: 'playing' | 'won' | 'lost' | 'quit'
}

export type Command =
  | { type: 'stock-to-tableau'; to: number }
  | { type: 'stock-to-foundation' }
  | { type: 'talon-to-tableau'; to: number }
  | { type: 'talon-to-foundation' }
  | { type: 'tableau-to-tableau'; from: number; to: number }
  | { type: 'tableau-to-foundation'; from: number }
  | { type: 'hand-to-talon' }
  | { type: 'toggle-counting' }
  | { type: 'betting-info' }
  | { type: 'quit' }
  | { type: 'undo' }
  | { type: 'new-game' }

export interface ParsedCommand {
  command: Command
  error?: string
}

// Economic constants from canfield.c
export const COST_OF_HAND = 13
export const COST_OF_INSPECTION = 13
export const COST_OF_GAME = 26
export const COST_OF_RUNTHROUGH_HAND = 5
export const COST_OF_INFORMATION = 1
export const MAX_INFORMATION_COST = 34
export const SECONDS_PER_DOLLAR = 60
export const MAX_TIME_CHARGE = 3
export const VALUE_PER_CARD_UP = 5
export const UNDO_PENALTY = 5

// Layout constants
export const TABLEAU_COUNT = 4
export const FOUNDATION_COUNT = 4
export const INITIAL_STOCK_COUNT = 13
export const INITIAL_TALON_COUNT = 3
export const TALON_DEAL_COUNT = 3
