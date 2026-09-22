import type { GameState } from '../game/types'
import { SUITS, RANK_LABELS, SUIT_SYMBOLS, SUIT_COLORS } from '../game/types'
import { cardIndex } from '../game/deck'

export interface CountingOverlayProps {
  state: GameState
}

export function CountingOverlay({ state }: CountingOverlayProps) {
  return (
    <div className="panel">
      <h3>Card Counting</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '2px', fontSize: '0.65rem' }}>
        {SUITS.map((suit) =>
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((rank) => {
            const idx = cardIndex({ suit, rank: rank as 1, faceUp: true })
            const known = state.countedCards[idx]
            const isRed = SUIT_COLORS[suit] === 'red'
            return (
              <div
                key={`${suit}-${rank}`}
                style={{
                  padding: '2px',
                  textAlign: 'center',
                  borderRadius: '2px',
                  background: known ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
                  color: known ? (isRed ? '#ff9999' : '#ffffff') : 'rgba(255,255,255,0.2)',
                }}
                title={`${RANK_LABELS[rank as 1]}${SUIT_SYMBOLS[suit]}`}
              >
                {RANK_LABELS[rank as 1]}
              </div>
            )
          })
        )}
      </div>
      <div className="command-hint">Counted cost: ${state.totalInfoCost} / $34</div>
    </div>
  )
}
