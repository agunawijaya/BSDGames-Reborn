import type { Card, GameState, Pile, Command } from './types'
import {
  TABLEAU_COUNT,
  FOUNDATION_COUNT,
  INITIAL_STOCK_COUNT,
  INITIAL_TALON_COUNT,
  TALON_DEAL_COUNT,
  SUIT_COLORS,
} from './types'
import { createDeck, shuffle, cardIndex } from './deck'
import {
  chargeInitialDeal,
  chargeInspection,
  chargeGameCommit,
  chargeHandRun,
  chargeThinkingTime,
  creditFoundationCard,
  chargeInformation,
  appendMoveHistory,
} from './scoring'

export function createEmptyState(seed: number): GameState {
  return {
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableaus: Array.from({ length: TABLEAU_COUNT }, () => []),
    stock: [],
    talon: [],
    hand: [],
    baseCard: null,
    phase: 'buy',
    bankroll: 0,
    seed,
    countedCards: Array(52).fill(false),
    totalInfoCost: 0,
    handRuns: 0,
    lastMoveTime: Date.now(),
    moveHistory: [],
    status: 'playing',
  }
}

export function deal(seed = Date.now()): GameState {
  const state = createEmptyState(seed)
  const shuffled = shuffle(createDeck(), seed)

  // 1. Deal 1 card to each tableau (face up)
  for (let i = 0; i < TABLEAU_COUNT; i++) {
    const card = { ...shuffled[i * 1], faceUp: true }
    state.tableaus[i].push(card)
  }

  // 2. Deal 13 cards to stock (top face up)
  let idx = TABLEAU_COUNT
  for (let i = 0; i < INITIAL_STOCK_COUNT; i++) {
    const faceUp = i === INITIAL_STOCK_COUNT - 1
    state.stock.push({ ...shuffled[idx++], faceUp })
  }

  // 3. Base card -> first foundation (face up)
  const base = { ...shuffled[idx++], faceUp: true }
  state.baseCard = base
  state.foundations[0].push(base)

  // 4. Deal 3 cards to talon (top face up)
  for (let i = 0; i < INITIAL_TALON_COUNT; i++) {
    const faceUp = i === INITIAL_TALON_COUNT - 1
    state.talon.push({ ...shuffled[idx++], faceUp })
  }

  // 5. Remaining 31 cards to hand (face down)
  while (idx < shuffled.length) {
    state.hand.push({ ...shuffled[idx++], faceUp: false })
  }

  const afterDeal = chargeInitialDeal(state)
  return appendMoveHistory(
    revealTopCards(afterDeal),
    `deal seed=${seed}`
  )
}

function revealTopCards(state: GameState): GameState {
  // Ensure only top cards of stock/talon are face up.
  const newStock = state.stock.map((c, i) =>
    i === state.stock.length - 1 ? { ...c, faceUp: true } : { ...c, faceUp: false }
  )
  const newTalon = state.talon.map((c, i) =>
    i === state.talon.length - 1 ? { ...c, faceUp: true } : { ...c, faceUp: false }
  )
  return { ...state, stock: newStock, talon: newTalon }
}

export function baseRank(state: GameState): number | null {
  return state.baseCard?.rank ?? null
}

function isRed(card: Card): boolean {
  return SUIT_COLORS[card.suit] === 'red'
}

export function nextRank(rank: number): number {
  return rank === 13 ? 1 : rank + 1
}

function prevRank(rank: number): number {
  return rank === 1 ? 13 : rank - 1
}

export function foundationNextRank(state: GameState, foundationIndex: number): number | null {
  const pile = state.foundations[foundationIndex]
  const br = baseRank(state)
  if (br === null) return null
  if (pile.length === 0) return br
  return nextRank(pile[pile.length - 1].rank)
}

export function foundationSuit(state: GameState, foundationIndex: number): import('./types').Suit | null {
  const pile = state.foundations[foundationIndex]
  if (pile.length === 0) return null
  return pile[pile.length - 1].suit
}

function canPlaceOnFoundation(state: GameState, card: Card, foundationIndex: number): boolean {
  const pile = state.foundations[foundationIndex]
  const br = baseRank(state)
  if (br === null) return false
  if (pile.length === 0) {
    return card.rank === br
  }
  const top = pile[pile.length - 1]
  return card.suit === top.suit && card.rank === nextRank(top.rank)
}

export function foundationIndexForCard(state: GameState, card: Card): number | null {
  for (let i = 0; i < FOUNDATION_COUNT; i++) {
    if (canPlaceOnFoundation(state, card, i)) return i
  }
  return null
}

function canPlaceOnTableau(card: Card, targetPile: Pile): boolean {
  if (targetPile.length === 0) return true
  const top = targetPile[targetPile.length - 1]
  return card.rank === prevRank(top.rank) && isRed(card) !== isRed(top)
}

function moveWholePile(source: Pile, target: Pile): { source: Pile; target: Pile } {
  return {
    source: [],
    target: [...target, ...source],
  }
}

function autoMoveBaseRankCards(state: GameState): GameState {
  const br = baseRank(state)
  if (br === null) return state

  let changed = true
  let current = state
  while (changed) {
    changed = false
    // Check stock top
    if (current.stock.length > 0) {
      const card = current.stock[current.stock.length - 1]
      const idx = foundationIndexForCard(current, card)
      if (idx !== null) {
        current = applyStockToFoundation(current, idx)
        changed = true
        continue
      }
    }
    // Check talon top
    if (current.talon.length > 0) {
      const card = current.talon[current.talon.length - 1]
      const idx = foundationIndexForCard(current, card)
      if (idx !== null) {
        current = applyTalonToFoundation(current, idx)
        changed = true
        continue
      }
    }
    // Check tableau tops
    for (let t = 0; t < TABLEAU_COUNT; t++) {
      if (current.tableaus[t].length > 0) {
        const card = current.tableaus[t][current.tableaus[t].length - 1]
        const idx = foundationIndexForCard(current, card)
        if (idx !== null) {
          current = applyTableauToFoundation(current, t, idx)
          changed = true
          break
        }
      }
    }
  }
  return current
}

export function applyStockToTableau(state: GameState, to: number): GameState {
  if (state.stock.length === 0) return state
  const card = state.stock[state.stock.length - 1]
  if (!canPlaceOnTableau(card, state.tableaus[to])) return state

  const newStock = state.stock.slice(0, -1)
  const newTableaus = state.tableaus.map((pile, i) =>
    i === to ? [...pile, card] : pile
  )
  return revealTopCards({
    ...state,
    stock: newStock,
    tableaus: newTableaus,
  })
}

export function applyStockToFoundation(state: GameState, foundationIndex?: number): GameState {
  if (state.stock.length === 0) return state
  const card = state.stock[state.stock.length - 1]
  const idx = foundationIndex ?? foundationIndexForCard(state, card)
  if (idx === null || !canPlaceOnFoundation(state, card, idx)) return state

  const newStock = state.stock.slice(0, -1)
  const newFoundations = state.foundations.map((pile, i) =>
    i === idx ? [...pile, card] : pile
  )
  return creditFoundationCard(revealTopCards({
    ...state,
    stock: newStock,
    foundations: newFoundations,
  }))
}

export function applyTalonToTableau(state: GameState, to: number): GameState {
  if (state.talon.length === 0) return state
  const card = state.talon[state.talon.length - 1]
  if (!canPlaceOnTableau(card, state.tableaus[to])) return state

  const newTalon = state.talon.slice(0, -1)
  const newTableaus = state.tableaus.map((pile, i) =>
    i === to ? [...pile, card] : pile
  )
  return revealTopCards({
    ...state,
    talon: newTalon,
    tableaus: newTableaus,
  })
}

export function applyTalonToFoundation(state: GameState, foundationIndex?: number): GameState {
  if (state.talon.length === 0) return state
  const card = state.talon[state.talon.length - 1]
  const idx = foundationIndex ?? foundationIndexForCard(state, card)
  if (idx === null || !canPlaceOnFoundation(state, card, idx)) return state

  const newTalon = state.talon.slice(0, -1)
  const newFoundations = state.foundations.map((pile, i) =>
    i === idx ? [...pile, card] : pile
  )
  return creditFoundationCard(revealTopCards({
    ...state,
    talon: newTalon,
    foundations: newFoundations,
  }))
}

export function applyTableauToTableau(state: GameState, from: number, to: number): GameState {
  if (from === to) return state
  const source = state.tableaus[from]
  const target = state.tableaus[to]
  if (source.length === 0) return state
  const movingTop = source[0]
  if (!canPlaceOnTableau(movingTop, target)) return state

  const { source: newSource, target: newTarget } = moveWholePile(source, target)
  const newTableaus = state.tableaus.map((pile, i) => {
    if (i === from) return newSource
    if (i === to) return newTarget
    return pile
  })
  return { ...state, tableaus: newTableaus }
}

export function applyTableauToFoundation(state: GameState, from: number, foundationIndex?: number): GameState {
  const source = state.tableaus[from]
  if (source.length === 0) return state
  const card = source[source.length - 1]
  const idx = foundationIndex ?? foundationIndexForCard(state, card)
  if (idx === null || !canPlaceOnFoundation(state, card, idx)) return state

  const newSource = source.slice(0, -1)
  const newFoundations = state.foundations.map((pile, i) =>
    i === idx ? [...pile, card] : pile
  )
  const newTableaus = state.tableaus.map((pile, i) =>
    i === from ? newSource : pile
  )
  return creditFoundationCard({
    ...state,
    tableaus: newTableaus,
    foundations: newFoundations,
  })
}

export function applyHandToTalon(state: GameState): GameState {
  let current = { ...state }

  // If hand is empty, recycle talon back to hand; each re-run costs $5.
  if (current.hand.length === 0) {
    if (current.talon.length === 0) return current
    current = {
      ...current,
      hand: current.talon.map(c => ({ ...c, faceUp: false })).reverse(),
      talon: [],
    }
    current = chargeHandRun(current)
  }

  const dealCount = Math.min(TALON_DEAL_COUNT, current.hand.length)
  const dealt = current.hand.slice(0, dealCount)
  const remainingHand = current.hand.slice(dealCount)
  const newTalon = [...current.talon, ...dealt]

  return revealTopCards({
    ...current,
    hand: remainingHand,
    talon: newTalon,
  })
}

function applyToggleCounting(state: GameState): GameState {
  // Counting reveals all face-up cards the player hasn't paid for yet.
  const allPiles = [
    ...state.foundations,
    ...state.tableaus,
    state.stock,
    state.talon,
  ]
  const newlySeen: Card[] = []
  for (const pile of allPiles) {
    for (const card of pile) {
      if (card.faceUp) {
        const i = cardIndex(card)
        if (!state.countedCards[i]) {
          newlySeen.push(card)
        }
      }
    }
  }

  const newCounted = [...state.countedCards]
  for (const card of newlySeen) {
    newCounted[cardIndex(card)] = true
  }

  return chargeInformation(
    { ...state, countedCards: newCounted },
    newlySeen.length
  )
}

function checkWin(state: GameState): GameState {
  const total = state.foundations.reduce((sum, pile) => sum + pile.length, 0)
  if (total === 52) {
    return { ...state, status: 'won', phase: 'finished' }
  }
  return state
}

export function applyCommand(state: GameState, command: Command): GameState {
  if (state.status === 'won' && command.type !== 'new-game' && command.type !== 'quit') {
    return state
  }

  const now = Date.now()
  let next = chargeThinkingTime(state, now)

  switch (command.type) {
    case 'stock-to-tableau': {
      if (next.phase === 'buy') return state
      next = applyStockToTableau(next, command.to)
      break
    }
    case 'stock-to-foundation': {
      next = applyStockToFoundation(next)
      break
    }
    case 'talon-to-tableau': {
      if (next.phase === 'buy') return state
      next = applyTalonToTableau(next, command.to)
      break
    }
    case 'talon-to-foundation': {
      next = applyTalonToFoundation(next)
      break
    }
    case 'tableau-to-tableau': {
      if (next.phase !== 'commit') return state
      next = applyTableauToTableau(next, command.from, command.to)
      break
    }
    case 'tableau-to-foundation': {
      next = applyTableauToFoundation(next, command.from)
      break
    }
    case 'hand-to-talon': {
      if (next.phase !== 'commit') return state
      next = applyHandToTalon(next)
      break
    }
    case 'toggle-counting': {
      next = applyToggleCounting(next)
      break
    }
    case 'betting-info':
      return next
    case 'quit':
      return { ...next, status: 'won', phase: 'finished' }
    case 'new-game':
      return deal(next.seed + 1)
    case 'undo':
      return state // handled by useGame hook history
    default:
      return state
  }

  next = autoMoveBaseRankCards(next)
  next = checkWin(next)
  return appendMoveHistory(next, command.type)
}

export function advancePhase(state: GameState, target: 'inspect' | 'commit'): GameState {
  if (target === 'inspect' && state.phase === 'buy') {
    return appendMoveHistory(chargeInspection({ ...state, phase: 'inspect' }), 'inspect')
  }
  if (target === 'commit' && (state.phase === 'buy' || state.phase === 'inspect')) {
    let next = state
    if (next.phase === 'buy') {
      next = chargeInspection({ ...next, phase: 'inspect' })
    }
    next = chargeGameCommit({ ...next, phase: 'commit' })
    return appendMoveHistory(next, 'commit')
  }
  return state
}

export function legalCommands(state: GameState): Command[] {
  const commands: Command[] = []

  if (state.phase === 'buy') {
    commands.push({ type: 'betting-info' })
    commands.push({ type: 'toggle-counting' })
    commands.push({ type: 'quit' })
    return commands
  }

  // Foundation moves are always allowed (buy already advanced)
  if (state.stock.length > 0) {
    commands.push({ type: 'stock-to-foundation' })
  }
  if (state.talon.length > 0) {
    commands.push({ type: 'talon-to-foundation' })
  }
  for (let i = 0; i < TABLEAU_COUNT; i++) {
    if (state.tableaus[i].length > 0) {
      commands.push({ type: 'tableau-to-foundation', from: i })
    }
  }

  if (state.phase === 'commit') {
    // Tableau moves
    if (state.stock.length > 0) {
      for (let to = 0; to < TABLEAU_COUNT; to++) {
        commands.push({ type: 'stock-to-tableau', to })
      }
    }
    if (state.talon.length > 0) {
      for (let to = 0; to < TABLEAU_COUNT; to++) {
        commands.push({ type: 'talon-to-tableau', to })
      }
    }
    for (let from = 0; from < TABLEAU_COUNT; from++) {
      for (let to = 0; to < TABLEAU_COUNT; to++) {
        if (from !== to) {
          commands.push({ type: 'tableau-to-tableau', from, to })
        }
      }
    }
    // Hand to talon
    commands.push({ type: 'hand-to-talon' })
  }

  commands.push({ type: 'toggle-counting' })
  commands.push({ type: 'betting-info' })
  commands.push({ type: 'quit' })
  commands.push({ type: 'new-game' })

  return commands
}

export function isCommandLegal(state: GameState, command: Command): boolean {
  const legal = legalCommands(state)
  return legal.some(c => commandsEqual(c, command))
}

function commandsEqual(a: Command, b: Command): boolean {
  if (a.type !== b.type) return false
  if (a.type === 'stock-to-tableau' && b.type === 'stock-to-tableau') return a.to === b.to
  if (a.type === 'talon-to-tableau' && b.type === 'talon-to-tableau') return a.to === b.to
  if (a.type === 'tableau-to-tableau' && b.type === 'tableau-to-tableau') {
    return a.from === b.from && a.to === b.to
  }
  if (a.type === 'tableau-to-foundation' && b.type === 'tableau-to-foundation') {
    return a.from === b.from
  }
  return true
}

export interface MoveHint {
  command: Command
  source: { type: 'foundation' | 'tableau' | 'stock' | 'talon' | 'hand'; index?: number }
  target: { type: 'foundation' | 'tableau' | 'stock' | 'talon'; index?: number }
  sourceTestId: string
  targetTestId: string
  score: number
}

function testIdFor(loc: { type: MoveHint['source']['type']; index?: number }): string {
  if (loc.type === 'foundation') return `foundation-${loc.index ?? 0}`
  if (loc.type === 'tableau') return `tableau-${loc.index ?? 0}`
  if (loc.type === 'stock') return 'stock-pile'
  if (loc.type === 'talon') return 'talon-pile'
  return ''
}

function scoreForHint(command: Command, state: GameState): number {
  if (command.type.endsWith('-to-foundation')) return 100
  if (command.type === 'stock-to-tableau' || command.type === 'talon-to-tableau') {
    const source = command.type === 'stock-to-tableau' ? state.stock : state.talon
    return source.length > 1 ? 50 : 20
  }
  if (command.type === 'tableau-to-tableau') return 10
  if (command.type === 'hand-to-talon') return 1
  return 0
}

export function legalMoveHints(state: GameState): MoveHint[] {
  if (state.phase === 'buy' || state.phase === 'finished') return []

  const hints: MoveHint[] = []

  // Stock moves
  if (state.stock.length > 0) {
    const card = state.stock[state.stock.length - 1]
    const fIdx = foundationIndexForCard(state, card)
    if (fIdx !== null) {
      hints.push({
        command: { type: 'stock-to-foundation' },
        source: { type: 'stock' },
        target: { type: 'foundation', index: fIdx },
        sourceTestId: testIdFor({ type: 'stock' }),
        targetTestId: testIdFor({ type: 'foundation', index: fIdx }),
        score: scoreForHint({ type: 'stock-to-foundation' }, state),
      })
    }
    if (state.phase === 'commit') {
      for (let to = 0; to < TABLEAU_COUNT; to++) {
        if (applyStockToTableau(state, to) !== state) {
          hints.push({
            command: { type: 'stock-to-tableau', to },
            source: { type: 'stock' },
            target: { type: 'tableau', index: to },
            sourceTestId: testIdFor({ type: 'stock' }),
            targetTestId: testIdFor({ type: 'tableau', index: to }),
            score: scoreForHint({ type: 'stock-to-tableau', to }, state),
          })
        }
      }
    }
  }

  // Talon moves
  if (state.talon.length > 0) {
    const card = state.talon[state.talon.length - 1]
    const fIdx = foundationIndexForCard(state, card)
    if (fIdx !== null) {
      hints.push({
        command: { type: 'talon-to-foundation' },
        source: { type: 'talon' },
        target: { type: 'foundation', index: fIdx },
        sourceTestId: testIdFor({ type: 'talon' }),
        targetTestId: testIdFor({ type: 'foundation', index: fIdx }),
        score: scoreForHint({ type: 'talon-to-foundation' }, state),
      })
    }
    if (state.phase === 'commit') {
      for (let to = 0; to < TABLEAU_COUNT; to++) {
        if (applyTalonToTableau(state, to) !== state) {
          hints.push({
            command: { type: 'talon-to-tableau', to },
            source: { type: 'talon' },
            target: { type: 'tableau', index: to },
            sourceTestId: testIdFor({ type: 'talon' }),
            targetTestId: testIdFor({ type: 'tableau', index: to }),
            score: scoreForHint({ type: 'talon-to-tableau', to }, state),
          })
        }
      }
    }
  }

  // Tableau moves
  for (let from = 0; from < TABLEAU_COUNT; from++) {
    const pile = state.tableaus[from]
    if (pile.length === 0) continue
    const card = pile[pile.length - 1]
    const fIdx = foundationIndexForCard(state, card)
    if (fIdx !== null) {
      hints.push({
        command: { type: 'tableau-to-foundation', from },
        source: { type: 'tableau', index: from },
        target: { type: 'foundation', index: fIdx },
        sourceTestId: testIdFor({ type: 'tableau', index: from }),
        targetTestId: testIdFor({ type: 'foundation', index: fIdx }),
        score: scoreForHint({ type: 'tableau-to-foundation', from }, state),
      })
    }
    if (state.phase === 'commit') {
      for (let to = 0; to < TABLEAU_COUNT; to++) {
        if (from === to) continue
        if (applyTableauToTableau(state, from, to) !== state) {
          hints.push({
            command: { type: 'tableau-to-tableau', from, to },
            source: { type: 'tableau', index: from },
            target: { type: 'tableau', index: to },
            sourceTestId: testIdFor({ type: 'tableau', index: from }),
            targetTestId: testIdFor({ type: 'tableau', index: to }),
            score: scoreForHint({ type: 'tableau-to-tableau', from, to }, state),
          })
        }
      }
    }
  }

  // Hand to talon (only in commit and there are cards left to deal)
  if (state.phase === 'commit' && (state.hand.length > 0 || state.talon.length > 0)) {
    hints.push({
      command: { type: 'hand-to-talon' },
      source: { type: 'hand' },
      target: { type: 'talon' },
      sourceTestId: '',
      targetTestId: testIdFor({ type: 'talon' }),
      score: scoreForHint({ type: 'hand-to-talon' }, state),
    })
  }

  return hints.sort((a, b) => b.score - a.score)
}

export function recommendedPhaseAction(state: GameState): 'inspect' | 'commit' | null {
  if (state.phase === 'buy') return 'inspect'
  if (state.phase === 'inspect') {
    const hasFoundationMove = legalMoveHints(state).some(h =>
      h.command.type.endsWith('-to-foundation')
    )
    return hasFoundationMove ? 'commit' : null
  }
  return null
}
