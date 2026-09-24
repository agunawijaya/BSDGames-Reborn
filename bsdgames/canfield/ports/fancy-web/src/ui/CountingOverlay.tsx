import type { Card, GameState } from '../game/types'
import { RANK_LABELS, SUIT_SYMBOLS, SUIT_COLORS } from '../game/types'
import { cardIndex } from '../game/deck'
import { MAX_INFORMATION_COST } from '../game/types'

export interface CountingOverlayProps {
  state: GameState
}

// Mirrors canfield.c showstat(): pile counts, then the talon and the hand card
// by card, showing the identity of every card that has been seen and "?" for
// the rest. It is only rendered while counting is switched on.
function Chip({ card, seen }: { card: Card; seen: boolean }) {
  if (!seen) {
    return <span className="count-chip unknown">?</span>
  }
  const red = SUIT_COLORS[card.suit] === 'red'
  return (
    <span className={`count-chip ${red ? 'red' : 'black'}`}>
      {RANK_LABELS[card.rank]}{SUIT_SYMBOLS[card.suit]}
    </span>
  )
}

export function CountingOverlay({ state }: CountingOverlayProps) {
  const isSeen = (card: Card) => state.seenCards[cardIndex(card)]
  return (
    <div className="panel" data-testid="counting-panel">
      <h3>Card Counting</h3>
      <div className="command-hint" style={{ marginTop: 0 }}>
        Talon: {state.talon.length} · Hand: {state.hand.length} · Stock: {state.stock.length}
      </div>
      <div className="count-row-label">Talon (bottom → top)</div>
      <div className="count-row">
        {state.talon.length === 0 && <span className="command-hint">empty</span>}
        {state.talon.map((card, i) => <Chip key={`t${i}`} card={card} seen={isSeen(card)} />)}
      </div>
      <div className="count-row-label">Hand (next card first)</div>
      <div className="count-row">
        {state.hand.length === 0 && <span className="command-hint">empty</span>}
        {state.hand.map((card, i) => <Chip key={`h${i}`} card={card} seen={isSeen(card)} />)}
      </div>
      <div className="command-hint">Information cost: ${state.totalInfoCost} / ${MAX_INFORMATION_COST}</div>
    </div>
  )
}
