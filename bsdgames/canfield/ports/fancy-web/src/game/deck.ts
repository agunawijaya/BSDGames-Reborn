import type { Card, Rank } from './types'
import { SUITS } from './types'

export function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ suit, rank: rank as Rank, faceUp: false })
    }
  }
  return deck
}

// Mulberry32 PRNG: fast, deterministic, good enough for card shuffling.
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle(deck: Card[], seed: number): Card[] {
  const rand = mulberry32(seed)
  const copy = [...deck]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function cardKey(card: Card): string {
  return `${card.suit}-${card.rank}`
}

export function cardIndex(card: Card): number {
  const suitIndex = SUITS.indexOf(card.suit)
  return suitIndex * 13 + (card.rank - 1)
}
