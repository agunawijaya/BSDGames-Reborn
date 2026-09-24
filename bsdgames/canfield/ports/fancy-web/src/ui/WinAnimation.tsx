import { useEffect, useRef } from 'react'
import type { Card, Pile } from '../game/types'
import { RANK_LABELS, SUIT_SYMBOLS, SUIT_COLORS } from '../game/types'

// Classic "bouncing cards" victory: cards leave the foundations one by one,
// arc sideways under gravity, bounce off the bottom edge and leave a trail.
// Plain DOM + requestAnimationFrame (no Canvas, per the port constraints).

const CARD_W = 80
const CARD_H = 112
const GRAVITY = 1700 // px/s^2
const BOUNCE = 0.78
const LAUNCH_EVERY_MS = 170
const MAX_TRAIL = 420

function cardHtml(card: Card): string {
  const color = SUIT_COLORS[card.suit] === 'red' ? 'red' : 'black'
  const label = `${RANK_LABELS[card.rank]}${SUIT_SYMBOLS[card.suit]}`
  const symbol = SUIT_SYMBOLS[card.suit]
  return (
    `<div class="card-face"><span class="card-rank ${color}">${label}</span>` +
    `<span class="card-center ${color}">${symbol}</span>` +
    `<span class="card-rank ${color}" style="transform:rotate(180deg)">${label}</span></div>`
  )
}

interface Flyer {
  el: HTMLDivElement
  x: number
  y: number
  vx: number
  vy: number
  lastStampX: number
  lastStampY: number
}

export function WinAnimation({ foundations }: { foundations: Pile[] }) {
  const layerRef = useRef<HTMLDivElement>(null)
  const foundationsRef = useRef(foundations)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    // Launch order: top card of each foundation in turn, then the next ones down.
    const piles = foundationsRef.current.map(p => [...p])
    const origins = piles.map((_, i) => {
      const el = document.querySelector<HTMLElement>(`[data-testid="foundation-${i}"]`)
      const r = el?.getBoundingClientRect()
      return { x: r ? r.left : window.innerWidth / 2 - CARD_W / 2, y: r ? r.top : 80 }
    })
    const queue: { card: Card; origin: { x: number; y: number } }[] = []
    while (piles.some(p => p.length > 0)) {
      piles.forEach((p, i) => {
        const card = p.pop()
        if (card) queue.push({ card, origin: origins[i] })
      })
    }

    const flyers: Flyer[] = []
    let raf = 0
    let last = performance.now()
    let sinceLaunch = LAUNCH_EVERY_MS
    let disposed = false

    const stamp = (f: Flyer) => {
      const ghost = f.el.cloneNode(true) as HTMLDivElement
      ghost.style.transform = `translate3d(${f.x}px, ${f.y}px, 0)`
      ghost.classList.add('win-trail')
      layer.insertBefore(ghost, layer.firstChild)
      const trails = layer.querySelectorAll('.win-trail')
      if (trails.length > MAX_TRAIL) trails[0].remove()
    }

    const step = (now: number) => {
      if (disposed) return
      const dt = Math.min(0.035, (now - last) / 1000)
      last = now
      sinceLaunch += dt * 1000

      if (queue.length > 0 && sinceLaunch >= LAUNCH_EVERY_MS) {
        sinceLaunch = 0
        const { card, origin } = queue.shift()!
        const el = document.createElement('div')
        el.className = 'card win-card'
        el.innerHTML = cardHtml(card)
        layer.appendChild(el)
        const dir = Math.random() < 0.5 ? -1 : 1
        flyers.push({
          el,
          x: origin.x,
          y: origin.y,
          vx: dir * (140 + Math.random() * 260),
          vy: -(100 + Math.random() * 300),
          lastStampX: origin.x,
          lastStampY: origin.y,
        })
      }

      const floor = window.innerHeight - CARD_H
      for (let i = flyers.length - 1; i >= 0; i--) {
        const f = flyers[i]
        f.vy += GRAVITY * dt
        f.x += f.vx * dt
        f.y += f.vy * dt
        if (f.y > floor) {
          f.y = floor
          f.vy = -Math.abs(f.vy) * BOUNCE
          if (Math.abs(f.vy) < 60) f.vy = -220 // keep it lively until it leaves the screen
        }
        f.el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0)`
        if (Math.hypot(f.x - f.lastStampX, f.y - f.lastStampY) > 34) {
          stamp(f)
          f.lastStampX = f.x
          f.lastStampY = f.y
        }
        if (f.x < -CARD_W || f.x > window.innerWidth) {
          f.el.remove()
          flyers.splice(i, 1)
        }
      }

      if (queue.length > 0 || flyers.length > 0) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      layer.replaceChildren()
    }
  }, [])

  return <div ref={layerRef} className="win-layer" aria-hidden="true" data-testid="win-animation" />
}
