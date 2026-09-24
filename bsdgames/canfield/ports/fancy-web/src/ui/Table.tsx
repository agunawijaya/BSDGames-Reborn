import { useEffect, useMemo, useRef, useState } from 'react'
import type { GameState, Command, Card } from '../game/types'
import { baseRank, foundationNextRank, foundationSuit, legalMoveHints, MoveHint, isCommandLegal } from '../game/engine'
import { RANK_LABELS, SUIT_SYMBOLS } from '../game/types'
import { Pile } from './Pile'
import { CheatOverlay } from './CheatOverlay'
import { FlyingCard } from './FlyingCard'

export interface TableProps {
  state: GameState
  dispatch: (command: Command) => GameState
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
  const lastHoverTargetRef = useRef<{ type: MoveHint['target']['type']; index?: number } | null>(null)
  const prevStateRef = useRef<GameState>(state)
  const [flying, setFlying] = useState<FlyingItem[]>([])
  const [error, setError] = useState('')
  const hints = useMemo(() => legalMoveHints(state), [state])

  const showError = (msg: string) => {
    setError(msg)
    window.setTimeout(() => setError(''), 1500)
  }

  // Explain *why* a move is refused, especially the empty-space rules that
  // surprise people (canfield.c tabok(), ~876-893).
  const explainIllegal = (command: Command): string => {
    const emptyTarget = (to: number) => state.tableaus[to].length === 0
    if (command.type === 'talon-to-tableau' && emptyTarget(command.to) && state.stock.length > 0) {
      return 'Empty space: the talon may fill it only after the stock is used up.'
    }
    if (command.type === 'tableau-to-tableau' && emptyTarget(command.to)) {
      return "A pile can't be moved into an empty space."
    }
    if (command.type === 'hand-to-talon' && state.phase !== 'commit') {
      return 'Commit the game to unlock Deal Hand.'
    }
    return "Can't move there"
  }

  const tryDispatch = (command: Command, errorMsg?: string) => {
    const message = errorMsg ?? explainIllegal(command)
    if (!isCommandLegal(state, command)) {
      showError(message)
      return false
    }
    const next = dispatch(command)
    if (next === state) {
      showError(message)
      return false
    }
    return true
  }

  // Empty tableau slots are valid drops, but highlighting all of them in cheat mode is noisy.
  const visibleHints = useMemo(() => {
    return hints.filter(h => {
      if (!h.targetTestId) return true
      const tableauMatch = h.targetTestId.match(/^tableau-(\d+)$/)
      if (tableauMatch) {
        const idx = parseInt(tableauMatch[1], 10)
        return state.tableaus[idx].length > 0
      }
      return true
    })
  }, [hints, state.tableaus])

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

  const glowFor = (testId: string): 'source' | 'target' | undefined => {
    if (!cheatMode) return undefined
    const isSource = visibleHints.some(h => h.sourceTestId === testId)
    const isTarget = visibleHints.some(h => h.targetTestId === testId)
    if (isSource) return 'source'
    if (isTarget) return 'target'
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
    lastHoverTargetRef.current = null
    e.dataTransfer.setData('application/json', JSON.stringify(source))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handlePileDragOver = (
    target: { type: MoveHint['target']['type']; index?: number },
    e: React.DragEvent
  ) => {
    const source = draggedSourceRef.current
    if (!source) return
    lastHoverTargetRef.current = target
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
      if (tryDispatch(match.command)) {
        onSelect(null)
      }
    } else if (target.type === 'tableau' && target.index !== undefined) {
      // Dropped on a target that has no legal move: say why.
      suppressNextClickRef.current = true
      setTimeout(() => { suppressNextClickRef.current = false }, 100)
      const to = target.index
      if (source.type === 'talon') showError(explainIllegal({ type: 'talon-to-tableau', to }))
      else if (source.type === 'tableau' && source.index !== undefined) showError(explainIllegal({ type: 'tableau-to-tableau', from: source.index, to }))
      else showError("Can't move there")
    } else {
      showError("Can't move there")
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

  // Double-click a playable top card to send it to a foundation.
  const handleDoubleClick = (type: 'stock' | 'talon' | 'tableau', index?: number) => {
    onSelect(null)
    suppressNextClickRef.current = false
    const command: Command =
      type === 'stock' ? { type: 'stock-to-foundation' }
      : type === 'talon' ? { type: 'talon-to-foundation' }
      : { type: 'tableau-to-foundation', from: index ?? 0 }
    tryDispatch(command, 'That card cannot go to a foundation yet.')
  }

  const handleFoundationClick = () => {
    if (!selected) return
    let ok = false
    if (selected.type === 'stock') ok = tryDispatch({ type: 'stock-to-foundation' })
    if (selected.type === 'talon') ok = tryDispatch({ type: 'talon-to-foundation' })
    if (selected.type === 'tableau' && selected.index !== undefined) {
      ok = tryDispatch({ type: 'tableau-to-foundation', from: selected.index })
    }
    if (ok) onSelect(null)
  }

  const handleTableauClick = (to: number) => {
    if (!selected) {
      if (suppressNextClickRef.current) return
      handleSourceClick('tableau', to)
      return
    }
    if (selected.type === 'tableau' && selected.index === to) {
      // Second click of a double-click (or a plain re-click): just deselect.
      onSelect(null)
      return
    }
    let ok = false
    if (selected.type === 'stock') {
      ok = tryDispatch({ type: 'stock-to-tableau', to })
    } else if (selected.type === 'talon') {
      ok = tryDispatch({ type: 'talon-to-tableau', to })
    } else if (selected.type === 'tableau' && selected.index !== undefined) {
      ok = tryDispatch({ type: 'tableau-to-tableau', from: selected.index, to })
    }
    if (ok) onSelect(null)
  }

  // The browser sends no `drop` event to a target that refuses the drag, so
  // explain the refusal when the drag ends without a successful drop.
  useEffect(() => {
    const onDragEnd = () => {
      const source = draggedSourceRef.current
      const target = lastHoverTargetRef.current
      draggedSourceRef.current = null
      lastHoverTargetRef.current = null
      if (!source || !target) return
      if (target.type === 'tableau' && target.index !== undefined) {
        const to = target.index
        if (source.type === 'talon') showError(explainIllegal({ type: 'talon-to-tableau', to }))
        else if (source.type === 'stock') showError(explainIllegal({ type: 'stock-to-tableau', to }))
        else if (source.type === 'tableau' && source.index !== undefined) showError(explainIllegal({ type: 'tableau-to-tableau', from: source.index, to }))
      } else {
        showError("Can't move there")
      }
    }
    window.addEventListener('dragend', onDragEnd)
    return () => window.removeEventListener('dragend', onDragEnd)
  })

  // Phase changes are announced with a transient notice, not a permanent banner.
  const [notice, setNotice] = useState<string | null>(null)
  useEffect(() => {
    const notices: Record<string, { text: string; ms: number }> = {
      buy: {
        text: 'BUY PHASE — Your first move automatically pays Inspect ($13). Or click Commit ($39) to unlock Deal Hand right away.',
        ms: 9000,
      },
      inspect: {
        text: 'INSPECT PHASE — Inspect ($13) paid. All moves are allowed except Deal Hand. Click Commit ($26) to unlock it; cards already on foundations are then credited $5 each.',
        ms: 7000,
      },
      commit: {
        text: 'COMMIT PHASE — All moves unlocked. Deal Hand → Talon is now available.',
        ms: 5000,
      },
    }
    const entry = notices[state.phase]
    if (!entry) {
      setNotice(null)
      return
    }
    setNotice(entry.text)
    const timer = window.setTimeout(() => setNotice(null), entry.ms)
    return () => window.clearTimeout(timer)
  }, [state.phase, state.seed])

  const phaseLabel = { buy: 'Buy', inspect: 'Inspect', commit: 'Commit', finished: 'Finished' }[state.phase]

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
      <CheatOverlay hints={visibleHints} tableRef={tableRef} cheatMode={cheatMode} />
      <div className="phase-tag" data-testid="phase-tag">Phase: {phaseLabel}</div>
      {notice && (
        <div className="phase-notice" role="status" aria-live="polite" onClick={() => setNotice(null)} title="Click to dismiss">
          {notice}
        </div>
      )}

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
            onCardDoubleClick={() => handleDoubleClick('tableau', i)}
            emptyText={`T${i + 1}`}
            testId={`tableau-${i}`}
            cheatGlow={glowFor(`tableau-${i}`)}
            draggable={state.tableaus[i].length > 0}
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
          onCardDoubleClick={() => handleDoubleClick('stock')}
          emptyText="Stock"
          testId="stock-pile"
          cheatGlow={glowFor('stock-pile')}
          draggable={state.stock.length > 0}
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
          onCardDoubleClick={() => handleDoubleClick('talon')}
          emptyText="Talon"
          testId="talon-pile"
          cheatGlow={glowFor('talon-pile')}
          draggable={state.talon.length > 0}
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
      {error && (
        <div style={{
          textAlign: 'center',
          marginTop: '0.5rem',
          color: '#ff9999',
          fontWeight: 'bold',
          animation: 'shake 0.3s ease-in-out',
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
