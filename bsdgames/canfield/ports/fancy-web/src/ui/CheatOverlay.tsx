import { useEffect, useRef, useState } from 'react'
import type { MoveHint } from '../game/engine'

export interface CheatOverlayProps {
  hints: MoveHint[]
  tableRef: React.RefObject<HTMLElement>
  cheatMode: boolean
}

interface Arrow {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
}

function getElementCenter(testId: string, tableRef: React.RefObject<HTMLElement>): { x: number; y: number } | null {
  if (!tableRef.current) return null
  const el = document.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null
  if (!el) return null
  const tableRect = tableRef.current.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left + elRect.width / 2 - tableRect.left,
    y: elRect.top + elRect.height / 2 - tableRect.top,
  }
}

export function CheatOverlay({ hints, tableRef, cheatMode }: CheatOverlayProps) {
  const [arrows, setArrows] = useState<Arrow[]>([])
  const rafRef = useRef<number | null>(null)

  const recalc = () => {
    if (!cheatMode) {
      setArrows([])
      return
    }
    const next: Arrow[] = []
    for (const hint of hints) {
      if (!hint.sourceTestId || !hint.targetTestId) continue
      const start = getElementCenter(hint.sourceTestId, tableRef)
      const end = getElementCenter(hint.targetTestId, tableRef)
      if (!start || !end) continue
      next.push({
        key: `${hint.command.type}-${hint.sourceTestId}-${hint.targetTestId}`,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        color: hint.command.type.endsWith('-to-foundation') ? 'var(--gold)' : 'var(--chip-blue)',
      })
    }
    setArrows(next)
  }

  useEffect(() => {
    recalc()
    const table = tableRef.current
    if (!table) return
    const obs = new ResizeObserver(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(recalc)
    })
    obs.observe(table)
    window.addEventListener('scroll', recalc, true)
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', recalc, true)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [hints, cheatMode])

  if (!cheatMode || arrows.length === 0) return null

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        overflow: 'visible',
      }}
      width="100%"
      height="100%"
    >
      <defs>
        <marker id="cheat-arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="var(--gold)" />
        </marker>
        <marker id="cheat-arrowhead-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="var(--chip-blue)" />
        </marker>
      </defs>
      {arrows.map((a) => {
        const mx = (a.x1 + a.x2) / 2
        const my = (a.y1 + a.y2) / 2 - 40
        const isFoundation = a.color === 'var(--gold)'
        return (
          <path
            key={a.key}
            className="cheat-arrow"
            d={`M ${a.x1} ${a.y1} Q ${mx} ${my} ${a.x2} ${a.y2}`}
            fill="none"
            stroke={a.color}
            strokeWidth="3"
            markerEnd={`url(#${isFoundation ? 'cheat-arrowhead' : 'cheat-arrowhead-blue'})`}
          />
        )
      })}
    </svg>
  )
}
