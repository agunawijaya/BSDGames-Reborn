import { useState } from 'react'
import type { Pile as PileType } from '../game/types'
import { Card } from './Card'

export interface PileProps {
  pile: PileType
  label?: string
  offset?: number
  direction?: 'vertical' | 'horizontal'
  onCardClick?: () => void
  emptyText?: string
  testId?: string
  cheatGlow?: 'source' | 'target'
  draggable?: boolean
  onCardDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
}

const CARD_WIDTH = 80
const CARD_HEIGHT = 112

export function Pile({
  pile,
  label,
  offset = 18,
  direction = 'vertical',
  onCardClick,
  emptyText,
  testId,
  cheatGlow,
  draggable,
  onCardDragStart,
  onDragOver,
  onDrop,
}: PileProps) {
  const [isDragging, setIsDragging] = useState(false)

  const slotWidth = direction === 'horizontal'
    ? CARD_WIDTH + Math.max(0, pile.length - 1) * offset
    : CARD_WIDTH
  const slotHeight = direction === 'vertical'
    ? CARD_HEIGHT + Math.max(0, pile.length - 1) * offset
    : CARD_HEIGHT

  const glowClass = cheatGlow ? ` cheat-glow-${cheatGlow}` : ''
  const draggingClass = isDragging ? ' dragging' : ''

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    onCardDragStart?.(e)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={`pile-slot${glowClass}${draggingClass}`}
      data-testid={testId}
      style={{ width: slotWidth, height: slotHeight, minWidth: slotWidth, minHeight: slotHeight }}
      onClick={pile.length === 0 ? onCardClick : undefined}
      onDragOver={onDragOver}
      onDrop={onDrop}
      aria-label={label}
    >
      {pile.length === 0 && emptyText && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
          {emptyText}
        </div>
      )}
      {pile.map((card, i) => {
        const left = direction === 'horizontal' ? i * offset : 0
        const top = direction === 'vertical' ? i * offset : 0
        const isTop = i === pile.length - 1
        return (
          <Card
            key={`${card.suit}-${card.rank}-${i}`}
            card={card}
            className={isDragging ? 'dragging' : ''}
            style={{
              left,
              top,
              zIndex: i,
            }}
            onClick={isTop ? onCardClick : undefined}
            draggable={isTop ? draggable : false}
            onDragStart={isTop ? handleDragStart : undefined}
            onDragEnd={isTop ? handleDragEnd : undefined}
          />
        )
      })}
      {label && <span className="pile-label">{label}</span>}
    </div>
  )
}
