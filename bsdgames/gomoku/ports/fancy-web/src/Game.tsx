import { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './Board';
import { pickAiMove } from './game/ai';
import { initGame, placeStone, resign, undoLastMove } from './game/engine';
import type { GameState, Position, Stone } from './game/state';
import { Sidebar, type OpponentMode } from './ui/Sidebar';

// Delay before the AI places its stone, so a human sees each side's
// move rather than instant back-to-back placements.
const AI_MOVE_DELAY_MS = 500;

export function Game() {
  const [state, setState] = useState<GameState>(() => initGame());
  const [opponent, setOpponent] = useState<OpponentMode>('ai');
  const [humanStone, setHumanStone] = useState<Stone>('black');
  const aiMoveTimer = useRef<number | null>(null);

  const aiStone: Stone = humanStone === 'black' ? 'white' : 'black';

  const cancelPendingAiMove = () => {
    if (aiMoveTimer.current !== null) {
      window.clearTimeout(aiMoveTimer.current);
      aiMoveTimer.current = null;
    }
  };

  const handlePlace = useCallback(
    (at: Position) => {
      if (opponent === 'ai' && state.toMove !== humanStone) return;
      setState((prev) => placeStone(prev, at));
    },
    [opponent, state.toMove, humanStone],
  );

  const handleUndo = useCallback(() => {
    cancelPendingAiMove();
    setState((prev) => {
      // In vs-AI mode, undo two moves so the human resumes their turn
      // (skip the AI's response).
      if (opponent === 'ai' && prev.moves.length >= 2) {
        const oneBack = undoLastMove(prev);
        return undoLastMove(oneBack);
      }
      return undoLastMove(prev);
    });
  }, [opponent]);

  const handleNewGame = useCallback(() => {
    cancelPendingAiMove();
    setState(initGame());
  }, []);

  const handleResign = useCallback(() => {
    cancelPendingAiMove();
    setState((prev) => resign(prev));
  }, []);

  const handleOpponentChange = useCallback((mode: OpponentMode) => {
    cancelPendingAiMove();
    setOpponent(mode);
    setState(initGame());
  }, []);

  const handleSwapSides = useCallback(() => {
    cancelPendingAiMove();
    setHumanStone((prev) => (prev === 'black' ? 'white' : 'black'));
    setState(initGame());
  }, []);

  // Drive AI moves.
  useEffect(() => {
    if (opponent !== 'ai') return;
    if (state.status !== 'playing') return;
    if (state.toMove !== aiStone) return;

    aiMoveTimer.current = window.setTimeout(() => {
      aiMoveTimer.current = null;
      const at = pickAiMove(state, aiStone);
      if (at) {
        setState((prev) => placeStone(prev, at));
      }
    }, AI_MOVE_DELAY_MS);

    return () => {
      cancelPendingAiMove();
    };
  }, [opponent, aiStone, state]);

  return (
    <div className="game-layout">
      <div>
        <Board state={state} onPlace={handlePlace} />
        <footer className="footer">
          Gomoku — fancy-web port ·{' '}
          <a
            href="https://github.com/agunawijaya/BSDGames-Reborn"
            target="_blank"
            rel="noreferrer noopener"
          >
            source
          </a>{' '}
          · MIT
        </footer>
      </div>
      <Sidebar
        state={state}
        opponent={opponent}
        humanStone={humanStone}
        onUndo={handleUndo}
        onNewGame={handleNewGame}
        onResign={handleResign}
        onOpponentChange={handleOpponentChange}
        onSwapSides={handleSwapSides}
      />
    </div>
  );
}
