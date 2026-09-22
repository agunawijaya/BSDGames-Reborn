import { useEffect, useRef, useState } from 'react'
import type { Card as CardType } from '../game/types'
import { Card } from './Card'

export interface FlyingCardProps {
  card: CardType
  sourceTestId: string
  targetTestId: string
  onDone: () => void
  duration?: number
}

const CARD_WIDTH = 80
const CARD_HEIGHT = 112

export function FlyingCard({ card, sourceTestId, targetTestId, onDone, duration = 450 }: FlyingCardProps) {
  const ghostRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const source = document.querySelector(`[data-testid="${sourceTestId}"]`) as HTMLElement | null
    const target = document.querySelector(`[data-testid="${targetTestId}"]`) as HTMLElement | null
    const parent = ghostRef.current?.offsetParent as HTMLElement | null
    if (!source || !target || !parent || !ghostRef.current) {
      onDone()
      return
    }

    const parentRect = parent.getBoundingClientRect()
    const s = source.getBoundingClientRect()
    const t = target.getBoundingClientRect()

    const start = {
      left: s.left + s.width / 2 - parentRect.left - CARD_WIDTH / 2,
      top: s.top + s.height / 2 - parentRect.top - CARD_HEIGHT / 2,
    }
    const end = {
      left: t.left + t.width / 2 - parentRect.left - CARD_WIDTH / 2,
      top: t.top + t.height / 2 - parentRect.top - CARD_HEIGHT / 2,
    }

    setStyle({
      ...start,
      transition: 'none',
      opacity: 0.9,
      transform: 'scale(1.05)',
    })

    const raf = requestAnimationFrame(() => {
      setStyle({
        ...end,
        transition: `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
        opacity: 1,
        transform: 'scale(1)',
      })
    })

    const timer = setTimeout(onDone, duration)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [sourceTestId, targetTestId, duration, onDone])

  return (
    <div
      ref={ghostRef}
      style={{
        position: 'absolute',
        zIndex: 200,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <Card card={{ ...card, faceUp: true }} />
    </div>
  )
}
