import { useState, useEffect, useMemo } from 'react'
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
import { baseRank, recommendedPhaseAction } from './game/engine'

function App() {
  const storage = useStorage()
  const saved = storage.loadGame()
  const urlSeed = new URLSearchParams(window.location.search).get('seed')
  const initialSeed = urlSeed ? Number(urlSeed) : Date.now()
  const { state, dispatch, dispatchText, canUndo, undo, inspect, commit, newGame } = useGame(saved, initialSeed)
  const { enabled: soundEnabled, setEnabled, playFlip, playClink, playInvalid, playWin } = useSound()
  useStorage(state) // auto-save / resume side effect
  const { recordSession, getScores, clearSavedGame } = storage
  const [selected, setSelected] = useState<{ type: 'stock' | 'talon' | 'tableau'; index?: number } | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [helpTab, setHelpTab] = useState<'how-to-play' | 'commands'>('how-to-play')
  const [cheatMode, setCheatMode] = useState(false)
  const [scores, setScores] = useState(getScores())
  const recommendedAction = useMemo(() => recommendedPhaseAction(state), [state])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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
    if (state.status === 'won') {
      playWin()
      recordSession(state)
      clearSavedGame()
      setScores(getScores())
    }
  }, [state.status, state, recordSession, clearSavedGame, getScores, playWin])

  const wrappedDispatch = (command: Parameters<typeof dispatch>[0]) => {
    const beforeFoundation = state.foundations.reduce((sum, p) => sum + p.length, 0)
    dispatch(command)
    const afterFoundation = state.foundations.reduce((sum, p) => sum + p.length, 0)
    if (afterFoundation > beforeFoundation) {
      playClink()
    } else {
      playFlip()
    }
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
              <button onClick={undo} disabled={!canUndo}>Undo ($5)</button>
              <button onClick={() => dispatch({ type: 'toggle-counting' })}>Count (c)</button>
              <button onClick={() => setShowHelp(prev => !prev)}>Help (?)</button>
              <button onClick={() => setCheatMode(prev => !prev)}>
                Cheat {cheatMode ? 'On' : 'Off'}
              </button>
              <button onClick={() => setEnabled(prev => !prev)}>
                Sound {soundEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <CommandBar onCommand={(text) => {
            const result = dispatchText(text)
            if (!result.error) {
              const isFoundation = text === 'sf' || text === 'tf' || /^[1-4]f$/.test(text)
              isFoundation ? playClink() : playFlip()
            } else {
              playInvalid()
            }
            return result
          }} />

          <CountingOverlay state={state} />
          <AccountBook scores={scores} />
        </aside>
      </div>

      {state.status === 'won' && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Session Complete</h2>
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
