import type { CfscoresRecord } from '../game/scoring'

export interface AccountBookProps {
  scores: CfscoresRecord
}

export function AccountBook({ scores }: AccountBookProps) {
  return (
    <div className="panel">
      <h3>Account Book (cfscores)</h3>
      <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
        Total net: <strong style={{ color: scores.totalNet >= 0 ? '#99ff99' : '#ff9999' }}>
          {scores.totalNet >= 0 ? '+' : '-'}${Math.abs(scores.totalNet)}
        </strong>
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {scores.games.length === 0 && (
          <div className="command-hint">No finished sessions yet.</div>
        )}
        {scores.games.map((game, i) => (
          <div key={i} style={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.25rem 0' }}>
            <div>Seed {game.seed} — {game.wins} cards up — net {game.net >= 0 ? '+' : ''}{game.net}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
