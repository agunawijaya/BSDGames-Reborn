import { describe, expect, it } from 'vitest';
import {
  initGame,
  isLegalMove,
  placeStone,
  resign,
  undoLastMove,
} from '../src/game/engine';
import { BOARD_SIZE, boardIndex, type CellContent, type GameState, type Stone } from '../src/game/state';

// -----------------------------------------------------------------------------
// Test helpers

function applyMoves(
  state: GameState,
  moves: ReadonlyArray<[col: number, row: number]>,
): GameState {
  let s = state;
  for (const [col, row] of moves) {
    s = placeStone(s, { col, row });
  }
  return s;
}

/** Read the stone at (col, row) or 'empty'. */
function cellAt(state: GameState, col: number, row: number): CellContent {
  return state.board[boardIndex(col, row)];
}

// -----------------------------------------------------------------------------
// initGame

describe('initGame', () => {
  it('creates an empty board with Black to move', () => {
    const s = initGame();
    expect(s.board).toHaveLength(BOARD_SIZE * BOARD_SIZE);
    expect(s.board.every((c) => c === 'empty')).toBe(true);
    expect(s.toMove).toBe('black');
    expect(s.status).toBe('playing');
    expect(s.moves).toEqual([]);
    expect(s.winner).toBeNull();
  });
});

// -----------------------------------------------------------------------------
// placeStone — legal moves

describe('placeStone — legal moves', () => {
  it('places the current player\'s stone and passes the turn', () => {
    const s0 = initGame();
    const s1 = placeStone(s0, { col: 9, row: 9 }); // K10
    expect(cellAt(s1, 9, 9)).toBe('black');
    expect(s1.toMove).toBe('white');
    expect(s1.moves).toHaveLength(1);
    expect(s1.moves[0]).toMatchObject({
      stone: 'black',
      col: 9,
      row: 9,
      index: 1,
    });
  });

  it('alternates turns Black → White → Black', () => {
    let s = initGame();
    s = placeStone(s, { col: 9, row: 9 });   // Black K10
    s = placeStone(s, { col: 8, row: 8 });   // White J9
    s = placeStone(s, { col: 10, row: 10 }); // Black L11
    expect(cellAt(s, 9, 9)).toBe('black');
    expect(cellAt(s, 8, 8)).toBe('white');
    expect(cellAt(s, 10, 10)).toBe('black');
    expect(s.toMove).toBe('white');
    expect(s.moves).toHaveLength(3);
  });

  it('is immutable — original state is unchanged after a move', () => {
    const s0 = initGame();
    placeStone(s0, { col: 9, row: 9 });
    expect(s0.toMove).toBe('black');
    expect(s0.moves).toEqual([]);
    expect(cellAt(s0, 9, 9)).toBe('empty');
  });
});

// -----------------------------------------------------------------------------
// placeStone — illegal moves are no-ops

describe('placeStone — illegal moves', () => {
  it('returns the same state when placing on an occupied cell', () => {
    const s0 = initGame();
    const s1 = placeStone(s0, { col: 5, row: 5 });
    const s2 = placeStone(s1, { col: 5, row: 5 });
    expect(s2).toBe(s1);
  });

  it('returns the same state when placing out of bounds', () => {
    const s0 = initGame();
    expect(placeStone(s0, { col: -1, row: 5 })).toBe(s0);
    expect(placeStone(s0, { col: 5, row: BOARD_SIZE })).toBe(s0);
  });

  it('returns the same state when the game has already ended', () => {
    let s: GameState = initGame();
    // Play a five-in-a-row along row 0.
    for (let c = 0; c < 5; c++) {
      s = placeStone(s, { col: c, row: 0 });         // Black
      if (c < 4) s = placeStone(s, { col: c, row: 1 }); // White
    }
    expect(s.status).toBe('won');
    const won = s;

    const attempt = placeStone(won, { col: 10, row: 10 });
    expect(attempt).toBe(won);
  });
});

describe('isLegalMove', () => {
  it('is true for an empty in-bounds cell during play', () => {
    const s = initGame();
    expect(isLegalMove(s, { col: 0, row: 0 })).toBe(true);
    expect(isLegalMove(s, { col: 18, row: 18 })).toBe(true);
  });

  it('is false for occupied cells, out-of-bounds cells, and ended games', () => {
    let s: GameState = initGame();
    s = placeStone(s, { col: 5, row: 5 });
    expect(isLegalMove(s, { col: 5, row: 5 })).toBe(false);
    expect(isLegalMove(s, { col: -1, row: 5 })).toBe(false);
    expect(isLegalMove(s, { col: 5, row: BOARD_SIZE })).toBe(false);

    const done = resign(s);
    expect(isLegalMove(done, { col: 0, row: 0 })).toBe(false);
  });
});

// -----------------------------------------------------------------------------
// Win detection — the core of the spec

describe('win detection — five in a row', () => {
  it('detects a horizontal five (spec §Objective, canonical case)', () => {
    let s = initGame();
    // Black plays a horizontal five on row 5 while White plays elsewhere.
    for (let c = 0; c < 5; c++) {
      s = placeStone(s, { col: c, row: 5 }); // Black
      if (c < 4) {
        s = placeStone(s, { col: c, row: 10 }); // White (harmless)
      }
    }
    expect(s.status).toBe('won');
    expect(s.winner?.stone).toBe('black');
    expect(s.winner?.line).toHaveLength(5);
    expect(s.winner?.line[0]).toEqual({ col: 0, row: 5 });
    expect(s.winner?.line[4]).toEqual({ col: 4, row: 5 });
  });

  it('detects a vertical five', () => {
    let s = initGame();
    for (let r = 0; r < 5; r++) {
      s = placeStone(s, { col: 3, row: r }); // Black
      if (r < 4) {
        s = placeStone(s, { col: 15, row: r }); // White
      }
    }
    expect(s.status).toBe('won');
    expect(s.winner?.stone).toBe('black');
    expect(s.winner?.line).toHaveLength(5);
  });

  it('detects a diagonal ↘ five', () => {
    let s = initGame();
    for (let i = 0; i < 5; i++) {
      s = placeStone(s, { col: i, row: i }); // Black on \ diagonal
      if (i < 4) {
        s = placeStone(s, { col: 15, row: i }); // White
      }
    }
    expect(s.status).toBe('won');
    expect(s.winner?.stone).toBe('black');
  });

  it('detects a diagonal ↗ five', () => {
    let s = initGame();
    for (let i = 0; i < 5; i++) {
      s = placeStone(s, { col: i, row: 4 - i }); // Black on / diagonal
      if (i < 4) {
        s = placeStone(s, { col: 15, row: i }); // White
      }
    }
    expect(s.status).toBe('won');
    expect(s.winner?.stone).toBe('black');
  });

  it('detects a middle-fill winning move', () => {
    // Player has X X _ X X and then plays the middle. Middle move
    // completes the five — engine must detect this by looking in
    // BOTH directions from the just-placed stone.
    let s = initGame();
    const blacks: Array<[number, number]> = [[3, 5], [4, 5], [6, 5], [7, 5]];
    const whites: Array<[number, number]> = [[3, 10], [4, 10], [6, 10], [7, 10]];
    for (let i = 0; i < 4; i++) {
      s = placeStone(s, { col: blacks[i][0], row: blacks[i][1] });
      s = placeStone(s, { col: whites[i][0], row: whites[i][1] });
    }
    // Black fills the middle (5, 5).
    s = placeStone(s, { col: 5, row: 5 });
    expect(s.status).toBe('won');
    expect(s.winner?.line).toHaveLength(5);
    expect(s.winner?.line.map((p) => p.col)).toEqual([3, 4, 5, 6, 7]);
  });

  it('does NOT trigger a win when the line is broken by opponent stones', () => {
    let s = initGame();
    s = placeStone(s, { col: 0, row: 0 }); // Black
    s = placeStone(s, { col: 3, row: 0 }); // White (breaks the line)
    s = placeStone(s, { col: 1, row: 0 }); // Black
    s = placeStone(s, { col: 15, row: 0 }); // White elsewhere
    s = placeStone(s, { col: 2, row: 0 }); // Black
    s = placeStone(s, { col: 15, row: 1 }); // White elsewhere
    s = placeStone(s, { col: 4, row: 0 }); // Black
    s = placeStone(s, { col: 15, row: 2 }); // White elsewhere
    s = placeStone(s, { col: 5, row: 0 }); // Black — only 3 in a row of Black on row 0
    expect(s.status).toBe('playing');
  });

  it('treats overlines (6+) as wins per free-gomoku rules', () => {
    // spec §Ambiguities: this port explicitly counts overlines.
    let s = initGame();
    for (let c = 0; c < 6; c++) {
      s = placeStone(s, { col: c, row: 5 }); // Black
      if (c < 5) s = placeStone(s, { col: c, row: 10 });
    }
    expect(s.status).toBe('won');
    expect(s.winner?.line.length).toBeGreaterThanOrEqual(5);
  });
});

// -----------------------------------------------------------------------------
// undoLastMove

describe('undoLastMove', () => {
  it('removes the last placed stone and hands the turn back', () => {
    let s = initGame();
    s = placeStone(s, { col: 9, row: 9 }); // Black K10
    s = placeStone(s, { col: 8, row: 8 }); // White J9
    s = undoLastMove(s);
    expect(cellAt(s, 8, 8)).toBe('empty');
    expect(s.toMove).toBe('white');
    expect(s.moves).toHaveLength(1);
  });

  it('is a no-op on a fresh game with no moves', () => {
    const s = initGame();
    expect(undoLastMove(s)).toBe(s);
  });

  it('restores a completed game to playing state', () => {
    let s: GameState = initGame();
    for (let c = 0; c < 5; c++) {
      s = placeStone(s, { col: c, row: 5 });
      if (c < 4) s = placeStone(s, { col: c, row: 10 });
    }
    expect(s.status).toBe('won');
    s = undoLastMove(s);
    expect(s.status).toBe('playing');
    expect(s.winner).toBeNull();
  });

  it('can step backward through the entire history', () => {
    const moves: Array<[number, number]> = [
      [9, 9],
      [8, 8],
      [10, 10],
      [7, 7],
    ];
    let s = applyMoves(initGame(), moves);
    expect(s.moves).toHaveLength(4);
    for (let expected = 3; expected >= 0; expected--) {
      s = undoLastMove(s);
      expect(s.moves).toHaveLength(expected);
    }
    expect(s.board.every((c) => c === 'empty')).toBe(true);
    expect(s.toMove).toBe('black');
  });
});

// -----------------------------------------------------------------------------
// resign

describe('resign', () => {
  it('sets status to resign', () => {
    const s = resign(initGame());
    expect(s.status).toBe('resign');
  });

  it('is a no-op once the game has ended', () => {
    let s: GameState = initGame();
    for (let c = 0; c < 5; c++) {
      s = placeStone(s, { col: c, row: 5 });
      if (c < 4) s = placeStone(s, { col: c, row: 10 });
    }
    const won = s;
    expect(resign(won)).toBe(won);
  });
});

// The `black wins along [(col, row), (col+1, row)…]` pattern below
// exists so grep-ability of the winning-line assertion stays cheap.
const _blackSideStones: Stone = 'black';
void _blackSideStones;
