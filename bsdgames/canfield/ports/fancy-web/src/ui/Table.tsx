import { useEffect, useMemo, useRef, useState } from 'react'
import type { GameState, Command, Card } from '../game/types'
import { baseRank, foundationNextRank, foundationSuit, legalMoveHints, MoveHint } from '../game/engine'
import { RANK_LABELS, SUIT_SYMBOLS } from '../game/types'
import { Pile } from './Pile'
import { CheatOverlay } from './CheatOverlay'
import { FlyingCard } from './FlyingCard'

export interface TableProps {
  state: GameState
  dispatch: (command: Command) => void
  selected: { type: 'stock' | 'talon' | 'tableau'; index?: number } | null
  onSelect: (source: { type: 'stock' | 'talon' | 'tableau'; index?: number } | null) => void
  cheatMode: boolean
}

interface FlyingItem {
  id: number
  card: Card
  sourceTestId: string
  targetTestId: string
}

function topCard(pile: Card[]): Card | null {
  return pile.length > 0 ? pile[pile.length - 1] : null
}

function findCardSource(state: GameState, card: Card): string | null {
  const top = topCard(state.stock)
  if (top && top.rank === card.rank && top.suit === card.suit) return 'stock-pile'
  const talonTop = topCard(state.talon)
  if (talonTop && talonTop.rank === card.rank && talonTop.suit === card.suit) return 'talon-pile'
  for (let i = 0; i < state.tableaus.length; i++) {
    const t = topCard(state.tableaus[i])
    if (t && t.rank === card.rank && t.suit === card.suit) return `tableau-${i}`
  }
  return null
}

function detectFoundationAnimations(prev: GameState, next: GameState): FlyingItem[] {
  const items: FlyingItem[] = []
  let idBase = Date.now()
  next.foundations.forEach((pile, fIdx) => {
    const prevLen = prev.foundations[fIdx].length
    if (pile.length <= prevLen) return
    for (let i = prevLen; i < pile.length; i++) {
      const card = pile[i]
      const sourceTestId = findCardSource(prev, card)
      if (sourceTestId) {
        items.push({
          id: idBase++,
          card,
          sourceTestId,
          targetTestId: `foundation-${fIdx}`,
        })
      }
    }
  })
  return items
}

export function Table({ state, dispatch, selected, onSelect, cheatMode }: TableProps) {
  const br = baseRank(state)
  const tableRef = useRef<HTMLDivElement>(null)
  const draggedSourceRef = useRef<{ type: MoveHint['source']['type']; index?: number } | null>(null)
  const suppressNextClickRef = useRef(false)
  const prevStateRef = useRef<GameState>(state)
  const [flying, setFlying] = useState<FlyingItem[]>([])
  const hints = useMemo(() => legalMoveHints(state), [state])

  useEffect(() => {
    const prev = prevStateRef.current
    prevStateRef.current = state
    if (prev === state) return
    const newItems = detectFoundationAnimations(prev, state)
    if (newItems.length === 0) return
    setFlying(current => [...current, ...newItems])
    newItems.forEach(item => {
      setTimeout(() => {
        setFlying(current => current.filter(f => f.id !== item.id))
      }, 500)
    })
  }, [state])

  const glowFor = (testId: string, pileEmpty = false): 'source' | 'target' | undefined => {
    const isSource = hints.some(h => h.sourceTestId === testId)
    const isTarget = hints.some(h => h.targetTestId === testId)
    if (isSource) return 'source'
    // Empty tableau piles are valid drop targets, but glowing every empty slot in cheat mode is noisy.
    if (isTarget && !pileEmpty) return 'target'
    return undefined
  }

  const locationEquals = (
    a: { type: MoveHint['source']['type']; index?: number },
    b: { type: MoveHint['source']['type']; index?: number }
  ) => a.type === b.type && a.index === b.index

  const handleCardDragStart = (
    source: { type: MoveHint['source']['type']; index?: number },
    e: React.DragEvent
  ) => {
    draggedSourceRef.current = source
    e.dataTransfer.setData('application/json', JSON.stringify(source))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handlePileDragOver = (
    target: { type: MoveHint['target']['type']; index?: number },
    e: React.DragEvent
  ) => {
    const source = draggedSourceRef.current
    if (!source) return
    const match = hints.find(h => locationEquals(h.source, source) && locationEquals(h.target, target))
    if (match) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }
  }

  const handlePileDrop = (
    target: { type: MoveHint['target']['type']; index?: number },
    e: React.DragEvent
  ) => {
    const source = draggedSourceRef.current
    draggedSourceRef.current = null
    if (!source) return
    const match = hints.find(h => locationEquals(h.source, source) && locationEquals(h.target, target))
    if (match) {
      e.preventDefault()
      suppressNextClickRef.current = true
      setTimeout(() => { suppressNextClickRef.current = false }, 100)
      dispatch(match.command)
      onSelect(null)
    }
  }

  const handleSourceClick = (type: 'stock' | 'talon' | 'tableau', index?: number) => {
    if (suppressNextClickRef.current) return
    if (selected && selected.type === type && selected.index === index) {
      onSelect(null)
      return
    }
    onSelect({ type, index })
  }

  const handleFoundationClick = () => {
    if (!selected) return
    if (selected.type === 'stock') dispatch({ type: 'stock-to-foundation' })
    if (selected.type === 'talon') dispatch({ type: 'talon-to-foundation' })
    if (selected.type === 'tableau' && selected.index !== undefined) {
      dispatch({ type: 'tableau-to-foundation', from: selected.index })
    }
    onSelect(null)
  }

  const handleTableauClick = (to: number) => {
    if (!selected) {
      if (suppressNextClickRef.current) return
      handleSourceClick('tableau', to)
      return
    }
    if (selected.type === 'stock') {
      dispatch({ type: 'stock-to-tableau', to })
    } else if (selected.type === 'talon') {
      dispatch({ type: 'talon-to-tableau', to })
    } else if (selected.type === 'tableau' && selected.index !== undefined) {
      dispatch({ type: 'tableau-to-tableau', from: selected.index, to })
    }
    onSelect(null)
  }

  const phaseBanner = {
    buy: 'BUY PHASE — Inspect ($13) for foundation-only trial, or Commit ($39) to unlock all moves now.',
    inspect: 'INSPECT PHASE — Foundation moves allowed. Click Commit ($26) to unlock Deal Hand and tableau moves.',
    commit: 'COMMIT PHASE — All moves unlocked. Deal Hand → Talon is now available.',
    finished: 'SESSION FINISHED.',
  }[state.phase]

  return (
    <div className="table-area" ref={tableRef} style={{ position: 'relative' }}>
      {flying.map(item => (
        <FlyingCard
          key={item.id}
          card={item.card}
          sourceTestId={item.sourceTestId}
          targetTestId={item.targetTestId}
          onDone={() => setFlying(current => current.filter(f => f.id !== item.id))}
        />
      ))}
      <CheatOverlay hints={hints} tableRef={tableRef} cheatMode={cheatMode} />
      <div style={{
        textAlign: 'center',
        padding: '0.5rem 1rem',
        marginBottom: '0.5rem',
        borderRadius: '6px',
        background: state.phase === 'buy' ? 'rgba(194, 59, 34, 0.2)' : state.phase === 'inspect' ? 'rgba(201, 162, 39, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        border: `1px solid ${state.phase === 'buy' ? 'var(--red)' : 'var(--gold)'}`,
        color: 'var(--cream)',
        fontSize: '0.9rem',
      }}>
        {phaseBanner}
      </div>

      <div className="foundation-row">
        {state.foundations.map((pile, i) => {
          const nextRank = foundationNextRank(state, i)
          const suit = foundationSuit(state, i)
          const label = suit && nextRank !== null
            ? `F${i + 1}: ${RANK_LABELS[pile[pile.length - 1].rank as 1]} → ${RANK_LABELS[nextRank as 1]}${SUIT_SYMBOLS[suit]}`
            : `F${i + 1} (starts ${br ? RANK_LABELS[br as 1] : '?'})`
          return (
            <Pile
              key={`foundation-${i}`}
              pile={pile}
              label={label}
              direction="horizontal"
              offset={2}
              onCardClick={handleFoundationClick}
              emptyText="F"
              testId={`foundation-${i}`}
              cheatGlow={glowFor(`foundation-${i}`)}
              onDragOver={(e) => handlePileDragOver({ type: 'foundation', index: i }, e)}
              onDrop={(e) => handlePileDrop({ type: 'foundation', index: i }, e)}
            />
          )
        })}
      </div>

      <div className="tableau-row">
        {state.tableaus.map((pile, i) => (
          <Pile
            key={`tableau-${i}`}
            pile={pile}
            label={`Tableau ${i + 1}`}
            direction="vertical"
            offset={22}
            onCardClick={() => handleTableauClick(i)}
            emptyText={`T${i + 1}`}
            testId={`tableau-${i}`}
            cheatGlow={glowFor(`tableau-${i}`, pile.length === 0)}
            draggable={hints.some(h => h.sourceTestId === `tableau-${i}`)}
            wholePileDragImage
            onCardDragStart={(e) => handleCardDragStart({ type: 'tableau', index: i }, e)}
            onDragOver={(e) => handlePileDragOver({ type: 'tableau', index: i }, e)}
            onDrop={(e) => handlePileDrop({ type: 'tableau', index: i }, e)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
        <Pile
          pile={state.stock}
          label={`Stock (${state.stock.length})`}
          direction="horizontal"
          offset={2}
          onCardClick={() => handleSourceClick('stock')}
          emptyText="Stock"
          testId="stock-pile"
          cheatGlow={glowFor('stock-pile')}
          draggable={hints.some(h => h.sourceTestId === 'stock-pile')}
          onCardDragStart={(e) => handleCardDragStart({ type: 'stock' }, e)}
          onDragOver={(e) => handlePileDragOver({ type: 'stock' }, e)}
          onDrop={(e) => handlePileDrop({ type: 'stock' }, e)}
        />
        <Pile
          pile={state.talon}
          label={`Talon (${state.talon.length})`}
          direction="horizontal"
          offset={2}
          onCardClick={() => handleSourceClick('talon')}
          emptyText="Talon"
          testId="talon-pile"
          cheatGlow={glowFor('talon-pile')}
          draggable={hints.some(h => h.sourceTestId === 'talon-pile')}
          onCardDragStart={(e) => handleCardDragStart({ type: 'talon' }, e)}
          onDragOver={(e) => handlePileDragOver({ type: 'talon' }, e)}
          onDrop={(e) => handlePileDrop({ type: 'talon' }, e)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={() => dispatch({ type: 'hand-to-talon' })}
          disabled={state.phase !== 'commit'}
          title={state.phase !== 'commit' ? 'Commit the game first' : 'Deal 3 cards from hand to talon'}
        >
          Deal Hand → Talon (ht)
        </button>
      </div>

      {selected && (
        <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--gold-light)' }}>
          Selected: {selected.type}{selected.index !== undefined ? ` ${selected.index + 1}` : ''} — click destination
        </div>
      )}
    </div>
  )
}
