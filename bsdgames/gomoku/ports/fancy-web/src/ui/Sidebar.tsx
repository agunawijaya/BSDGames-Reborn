import { useEffect, useRef } from 'react';
import { toNotation } from '../game/coords';
import type { GameState, Stone } from '../game/state';

export type OpponentMode = 'ai' | 'hotseat';

type SidebarProps = Readonly<{
  state: GameState;
  opponent: OpponentMode;
  humanStone: Stone;
  onUndo: () => void;
  onNewGame: () => void;
  onResign: () => void;
  onOpponentChange: (mode: OpponentMode) => void;
  onSwapSides: () => void;
}>;

export function Sidebar({
  state,
  opponent,
  humanStone,
  onUndo,
  onNewGame,
  onResign,
  onOpponentChange,
  onSwapSides,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <StatusCard state={state} opponent={opponent} humanStone={humanStone} />
      <ModeCard
        opponent={opponent}
        humanStone={humanStone}
        onOpponentChange={onOpponentChange}
        onSwapSides={onSwapSides}
      />
      <ControlsCard
        state={state}
        onUndo={onUndo}
        onNewGame={onNewGame}
        onResign={onResign}
      />
      <MoveHistoryCard state={state} />
    </aside>
  );
}

function StatusCard({
  state,
  opponent,
  humanStone,
}: Readonly<{
  state: GameState;
  opponent: OpponentMode;
  humanStone: Stone;
}>) {
  if (state.status === 'won') {
    const winner = state.winner!;
    return (
      <section className="card">
        <h2>Result</h2>
        <div className="status-title winner">
          <span className={`stone-dot ${winner.stone}`} aria-hidden="true" />
          {winner.stone === 'black' ? 'Black' : 'White'} wins!
        </div>
        <p className="status-sub">
          {winner.line.length}-in-a-row after {state.moves.length} move
          {state.moves.length === 1 ? '' : 's'}.
        </p>
      </section>
    );
  }
  if (state.status === 'tie') {
    return (
      <section className="card">
        <h2>Result</h2>
        <div className="status-title tie">Tie game</div>
        <p className="status-sub">Board full. Extremely rare.</p>
      </section>
    );
  }
  if (state.status === 'resign') {
    const winnerColor = state.toMove === 'black' ? 'white' : 'black';
    return (
      <section className="card">
        <h2>Result</h2>
        <div className="status-title winner">
          <span className={`stone-dot ${winnerColor}`} aria-hidden="true" />
          {winnerColor === 'black' ? 'Black' : 'White'} wins by resignation
        </div>
      </section>
    );
  }
  const aiThinking = opponent === 'ai' && state.toMove !== humanStone;
  return (
    <section className="card">
      <h2>To move</h2>
      <div className="status-title">
        <span className={`stone-dot ${state.toMove}`} aria-hidden="true" />
        {state.toMove === 'black' ? 'Black' : 'White'}
        {aiThinking && (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#8a7757',
              fontWeight: 400,
              marginLeft: '0.5rem',
            }}
          >
            (AI thinking…)
          </span>
        )}
      </div>
      <p className="status-sub">
        {state.moves.length === 0
          ? 'Click any intersection to begin.'
          : `Move ${state.moves.length + 1}.`}
      </p>
    </section>
  );
}

function ModeCard({
  opponent,
  humanStone,
  onOpponentChange,
  onSwapSides,
}: Readonly<{
  opponent: OpponentMode;
  humanStone: Stone;
  onOpponentChange: (mode: OpponentMode) => void;
  onSwapSides: () => void;
}>) {
  return (
    <section className="card">
      <h2>Mode</h2>
      <div className="controls">
        <button
          type="button"
          onClick={() => onOpponentChange('ai')}
          style={{
            background: opponent === 'ai' ? '#3a2a1a' : undefined,
            borderColor: opponent === 'ai' ? '#3a2a1a' : undefined,
            color: opponent === 'ai' ? '#f5efe0' : undefined,
          }}
        >
          Vs AI
        </button>
        <button
          type="button"
          onClick={() => onOpponentChange('hotseat')}
          style={{
            background: opponent === 'hotseat' ? '#3a2a1a' : undefined,
            borderColor: opponent === 'hotseat' ? '#3a2a1a' : undefined,
            color: opponent === 'hotseat' ? '#f5efe0' : undefined,
          }}
        >
          Hot-seat
        </button>
      </div>
      {opponent === 'ai' && (
        <div style={{ marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onSwapSides}
            style={{
              fontFamily: 'inherit',
              fontSize: '0.8rem',
              padding: '0.45rem 0.6rem',
              borderRadius: 6,
              border: '1px solid #c9b48a',
              background: 'transparent',
              color: '#8a7757',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            You: <b style={{ color: '#3a2a1a' }}>{humanStone === 'black' ? 'Black' : 'White'}</b>
            {' · swap sides'}
          </button>
        </div>
      )}
    </section>
  );
}

function ControlsCard({
  state,
  onUndo,
  onNewGame,
  onResign,
}: Readonly<{
  state: GameState;
  onUndo: () => void;
  onNewGame: () => void;
  onResign: () => void;
}>) {
  const canUndo = state.moves.length > 0;
  const isPlaying = state.status === 'playing';
  return (
    <section className="card">
      <h2>Controls</h2>
      <div className="controls">
        <button type="button" onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
        <button
          type="button"
          onClick={onResign}
          disabled={!isPlaying || state.moves.length === 0}
        >
          Resign
        </button>
        <button
          type="button"
          className="primary"
          onClick={onNewGame}
          style={{ gridColumn: '1 / -1' }}
        >
          New game
        </button>
      </div>
    </section>
  );
}

function MoveHistoryCard({ state }: { state: GameState }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [state.moves.length]);

  const pairs: Array<{
    n: number;
    black: string | null;
    white: string | null;
  }> = [];
  for (let i = 0; i < state.moves.length; i += 2) {
    pairs.push({
      n: i / 2 + 1,
      black: toNotation(state.moves[i].col, state.moves[i].row),
      white:
        i + 1 < state.moves.length
          ? toNotation(state.moves[i + 1].col, state.moves[i + 1].row)
          : null,
    });
  }

  return (
    <section className="card">
      <h2>Move history</h2>
      <div ref={scrollRef} className="moves">
        {pairs.length === 0 && <div className="moves-empty">No moves yet.</div>}
        {pairs.map((p) => (
          <div key={p.n} className="moves-row">
            <span className="moves-num">{p.n}.</span>
            <span className="moves-move">{p.black ?? ''}</span>
            <span className={`moves-move${p.white ? '' : ' empty'}`}>
              {p.white ?? '—'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
