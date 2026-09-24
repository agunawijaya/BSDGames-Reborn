import type { GamePhase } from '../game/types'
import { COST_OF_INSPECTION, COST_OF_GAME } from '../game/types'

export interface BettingPanelProps {
  phase: GamePhase
  onInspect: () => void
  onCommit: () => void
  recommendedAction?: 'inspect' | 'commit' | null
}

export function BettingPanel({ phase, onInspect, onCommit, recommendedAction }: BettingPanelProps) {
  return (
    <div className="panel">
      <h3>Betting</h3>
      <div className="betting-buttons">
        <button
          className={recommendedAction === 'inspect' ? 'cheat-recommended' : ''}
          disabled={phase !== 'buy'}
          onClick={onInspect}
        >
          Inspect (+${COST_OF_INSPECTION})
        </button>
        <button
          className={recommendedAction === 'commit' ? 'cheat-recommended' : ''}
          disabled={phase !== 'inspect' && phase !== 'buy'}
          onClick={onCommit}
        >
          Commit (+${phase === 'buy' ? COST_OF_INSPECTION + COST_OF_GAME : COST_OF_GAME})
        </button>
      </div>
      <p className="command-hint">
        {phase === 'buy' && 'Your first move pays Inspect ($13) automatically. Commit ($39) unlocks Deal Hand right away.'}
        {phase === 'inspect' && 'Pay $26 to unlock Deal Hand. Cards on foundations are credited $5 each at that moment.'}
        {phase === 'commit' && 'All moves unlocked — Deal Hand → Talon is now available.'}
      </p>
    </div>
  )
}
