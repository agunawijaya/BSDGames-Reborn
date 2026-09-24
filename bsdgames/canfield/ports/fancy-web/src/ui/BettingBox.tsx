import type { GameState } from '../game/types'
import {
  COST_OF_HAND,
  COST_OF_INSPECTION,
  COST_OF_GAME,
  COST_OF_RUNTHROUGH_HAND,
} from '../game/types'

export interface BettingBoxProps {
  state: GameState
}

export function BettingBox({ state }: BettingBoxProps) {
  const hand = COST_OF_HAND
  const inspection = state.phase !== 'buy' ? COST_OF_INSPECTION : 0
  const game = state.phase === 'commit' || state.phase === 'finished' ? COST_OF_GAME : 0
  const runs = state.handRuns * COST_OF_RUNTHROUGH_HAND
  const information = state.totalInfoCost
  const thinktime = 0 // tracked live; simplified for this view
  const totalCosts = hand + inspection + game + runs + information + thinktime
  const wins = state.foundations.reduce((sum, pile) => sum + pile.length, 0) * 5
  const net = state.bankroll
  const returnPct = totalCosts > 0 ? ((wins / totalCosts - 1) * 100) : 0

  const rows = [
    { label: 'Hands', values: [hand, 0, 0] },
    { label: 'Inspections', values: [inspection, 0, 0] },
    { label: 'Games', values: [game, 0, 0] },
    { label: 'Runs', values: [runs, 0, 0] },
    { label: 'Information', values: [information, 0, 0] },
    { label: 'Think time', values: [thinktime, 0, 0] },
    { label: 'Total costs', values: [totalCosts, 0, 0], bold: true },
    { label: 'Winnings', values: [wins, 0, 0] },
    { label: 'Net worth', values: [net, 0, 0], bold: true },
    { label: 'Return', values: [`${returnPct.toFixed(0)}%`, '0%', '0%'], bold: true },
  ]

  return (
    <div className="panel">
      <h3>Betting Info</h3>
      <table className="help-table">
        <thead>
          <tr>
            <th>Costs</th>
            <th>Hand</th>
            <th>Game</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label} style={row.bold ? { fontWeight: 'bold' } : undefined}>
              <td>{row.label}</td>
              {row.values.map((v, i) => <td key={i}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="command-hint">
        Game/Total columns are tracked across the current app session.
      </p>
    </div>
  )
}
