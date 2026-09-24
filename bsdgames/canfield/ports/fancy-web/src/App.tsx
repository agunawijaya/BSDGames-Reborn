import { useState, useEffect, useMemo, useCallback } from 'react'
import { useGame } from './hooks/useGame'
import { useSound } from './hooks/useSound'
import { useStorage } from './hooks/useStorage'
import { Table } from './ui/Table'
import { Bankroll } from './ui/Bankroll'
import { BettingPanel } from './ui/BettingPanel'
import { CommandBar } from './ui/CommandBar'
import { AccountBook } from './ui/AccountBook'
import { CountingOverlay } from './ui/CountingOverlay'
import { HelpPanel } from './ui/HelpPanel'
import { HowToPlay } from './ui/HowToPlay'
import { WinAnimation } from './ui/WinAnimation'
import { BettingBox } from './ui/BettingBox'
import { baseRank, recommendedPhaseAction } from './game/engine'

function App() {
  const storage = useStorage()
  const [saved] = useState(() => storage.loadGame())
  const [urlSeed] = useState(() => new URLSearchParams(window.location.search).get('seed'))
  const initialSeed = urlSeed ? Number(urlSeed) : (saved?.seed ?? Date.now())
  const { state, dispatch, dispatchText, canUndo, undo, inspect, commit, newGame: rawNewGame, resetBankroll: rawReset } = useGame(urlSeed ? undefined : saved, initialSeed)
  const { enabled: soundEnabled, setEnabled, playFlip, playClink, playInvalid, playWin } = useSound()
  useStorage(state) // auto-save / resume side effect
  const { recordSession, getScores, clearSavedGame, clearScores } = storage
  const [selected, setSelected] = useState<{ type: 'stock' | 'talon' | 'tableau'; index?: number } | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [helpTab, setHelpTab] = useState<'how-to-play' | 'commands'>('how-to-play')
  const [cheatMode, setCheatMode] = useState(false)
  const [showBetting, setShowBetting] = useState(false)
  const [scores, setScores] = useState(getScores())
  const recommendedAction = useMemo(() => recommendedPhaseAction(state), [state])

  const newGame = useCallback(() => {
    if (state.status === 'playing') {
      recordSession({ ...state, status: 'quit' })
      clearSavedGame()
      setScores(getScores())
    }
    rawNewGame()
  }, [state, recordSession, clearSavedGame, getScores, rawNewGame])

  const resetBankroll = useCallback(() => {
    if (!window.confirm('Reset everything for a new player? This zeroes the bankroll and erases the Account Book.')) return
    clearSavedGame()
    clearScores()
    setScores(getScores())
    rawReset()
  }, [clearSavedGame, clearScores, getScores, rawReset])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        return
      }
      if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        setShowHelp(prev => !prev)
      }
      if (e.key === 'u' || (e.ctrlKey && e.key === 'z')) {
        e.preventDefault()
        undo()
      }
      if (e.key === 'n' || e.key === 'N') {
        newGame()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, newGame])

  useEffect(() => {
    if (state.status === 'won' || state.status === 'lost' || state.status === 'quit') {
      if (state.status === 'won') playWin()
      recordSession(state)
      clearSavedGame()
      setScores(getScores())
    }
  }, [state.status, state, recordSession, clearSavedGame, getScores, playWin])

  const wrappedDispatch = (command: Parameters<typeof dispatch>[0]) => {
    const beforeFoundation = state.foundations.reduce((sum, p) => sum + p.length, 0)
    const next = dispatch(command)
    const afterFoundation = next.foundations.reduce((sum, p) => sum + p.length, 0)
    if (afterFoundation > beforeFoundation) {
      playClink()
    } else {
      playFlip()
    }
    return next
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Canfield · Saratoga Casino</h1>
        <Bankroll amount={state.bankroll} />
      </header>

      <div className="main">
        <Table
          state={state}
          dispatch={wrappedDispatch}
          selected={selected}
          onSelect={setSelected}
          cheatMode={cheatMode}
        />

        <aside className="sidebar">
          <BettingPanel phase={state.phase} onInspect={inspect} onCommit={commit} recommendedAction={cheatMode ? recommendedAction : null} />

          <div className="panel">
            <h3>Controls</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button onClick={newGame}>New Game</button>
              <button onClick={resetBankroll} title="New player: zero the bankroll and erase the Account Book">Reset Bankroll</button>
              <button onClick={undo} disabled={!canUndo}>Undo ($5)</button>
              <button
                className={`toggle${state.countingOn ? ' on' : ''}`}
                aria-pressed={state.countingOn}
                title="Card counting: $1 per hand/talon card you have seen, max $34 (key: c)"
                onClick={() => dispatch({ type: 'toggle-counting' })}
              >
                Count: {state.countingOn ? 'ON' : 'OFF'}
              </button>
              <button onClick={() => setShowHelp(prev => !prev)}>Help (?)</button>
              <button
                className={`toggle${cheatMode ? ' on' : ''}`}
                aria-pressed={cheatMode}
                title="Show legal moves with arrows and glows"
                onClick={() => setCheatMode(prev => !prev)}
              >
                Cheat: {cheatMode ? 'ON' : 'OFF'}
              </button>
              <button
                className={`toggle${soundEnabled ? ' on' : ''}`}
                aria-pressed={soundEnabled}
                onClick={() => setEnabled(prev => !prev)}
              >
                Sound: {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <CommandBar onCommand={(text) => {
            const trimmed = text.trim()
            if (trimmed === 'q' && !window.confirm('Really wish to quit?')) {
              return {}
            }
            if (trimmed === 'b') {
              setShowBetting(prev => !prev)
            }
            const result = dispatchText(text)
            if (!result.error && result.state) {
              const isFoundation = text === 'sf' || text === 'tf' || /^[1-4]f$/.test(text)
              isFoundation ? playClink() : playFlip()
            } else if (trimmed !== 'b') {
              playInvalid()
            }
            return result
          }} />

          {showBetting && <BettingBox state={state} />}
          {state.countingOn && <CountingOverlay state={state} />}
          <AccountBook scores={scores} />
        </aside>
      </div>

      {state.status === 'won' && <WinAnimation foundations={state.foundations} />}
      {(state.status === 'won' || state.status === 'lost' || state.status === 'quit') && (
        <div className={`modal-backdrop${state.status === 'won' ? ' win' : ''}`}>
          <div className="modal">
            <h2>
              {state.status === 'won'
                ? 'You won!'
                : state.status === 'lost'
                ? 'I believe you have lost'
                : 'You quit'}
            </h2>
            <p>Final bankroll: <strong>{state.bankroll >= 0 ? '+' : '-'}${Math.abs(state.bankroll)}</strong></p>
            <p>Cards on foundation: {state.foundations.reduce((sum, p) => sum + p.length, 0)} / 52</p>
            <button onClick={newGame}>Play Again</button>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--gold)', paddingBottom: '0.5rem' }}>
              <button
                onClick={() => setHelpTab('how-to-play')}
                style={{
                  background: helpTab === 'how-to-play' ? 'var(--gold)' : 'var(--felt-dark)',
                  color: helpTab === 'how-to-play' ? '#2a1e10' : 'var(--cream)',
                  border: '1px solid var(--gold)',
                }}
              >
                How to Play
              </button>
              <button
                onClick={() => setHelpTab('commands')}
                style={{
                  background: helpTab === 'commands' ? 'var(--gold)' : 'var(--felt-dark)',
                  color: helpTab === 'commands' ? '#2a1e10' : 'var(--cream)',
                  border: '1px solid var(--gold)',
                }}
              >
                Commands
              </button>
            </div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {helpTab === 'how-to-play' ? (
                <HowToPlay baseRank={baseRank(state)} />
              ) : (
                <HelpPanel />
              )}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button onClick={() => setShowHelp(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
