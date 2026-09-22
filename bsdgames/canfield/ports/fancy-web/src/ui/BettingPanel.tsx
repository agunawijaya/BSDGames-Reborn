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
          disabled={phase !== 'inspect'}
          onClick={onCommit}
        >
          Commit (+${COST_OF_GAME})
        </button>
      </div>
      <p className="command-hint">
        {phase === 'buy' && 'Pay $13 to inspect the deal (foundation moves only). Deal Hand is locked.'}
        {phase === 'inspect' && 'Pay $26 to unlock Deal Hand and all tableau moves.'}
        {phase === 'commit' && 'All moves unlocked — Deal Hand → Talon is now available.'}
      </p>
    </div>
  )
}
