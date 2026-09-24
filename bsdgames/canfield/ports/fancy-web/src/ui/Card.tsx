import type { Card as CardType } from '../game/types'
import { RANK_LABELS, SUIT_SYMBOLS, SUIT_COLORS } from '../game/types'

export interface CardProps {
  card: CardType
  faceUp?: boolean
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
  onDoubleClick?: () => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
}

export function Card({ card, faceUp, style, className = '', onClick, onDoubleClick, draggable, onDragStart, onDragEnd }: CardProps) {
  const isFaceUp = faceUp ?? card.faceUp
  const isRed = SUIT_COLORS[card.suit] === 'red'

  const dragProps = { draggable, onDragStart, onDragEnd }

  if (!isFaceUp) {
    return (
      <div
        className={`card back ${className}`}
        style={style}
        onClick={onClick}
      onDoubleClick={onDoubleClick}
        role="button"
        aria-label="Face-down card"
        {...dragProps}
      />
    )
  }

  return (
    <div
      className={`card ${className}`}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      role="button"
      aria-label={`${RANK_LABELS[card.rank]} of ${card.suit}`}
      {...dragProps}
    >
      <div className="card-face">
        <span className={`card-rank ${isRed ? 'red' : 'black'}`}>
          {RANK_LABELS[card.rank]}{SUIT_SYMBOLS[card.suit]}
        </span>
        <span className={`card-center ${isRed ? 'red' : 'black'}`}>
          {SUIT_SYMBOLS[card.suit]}
        </span>
        <span className={`card-rank ${isRed ? 'red' : 'black'}`} style={{ transform: 'rotate(180deg)' }}>
          {RANK_LABELS[card.rank]}{SUIT_SYMBOLS[card.suit]}
        </span>
      </div>
    </div>
  )
}
