// Gomoku game engine — pure logic, no React, no DOM.
// Contract: `bsdgames/gomoku/docs/spec.md`.

import {
  BOARD_SIZE,
  boardIndex,
  inBounds,
  type CellContent,
  type GameState,
  type Move,
  type Position,
  type Stone,
  type WinInfo,
} from './state';

/** Number of stones in a row required to win. Free-gomoku rules (spec
 *  §Ambiguities): overlines (6+) also count. */
const WIN_LENGTH = 5;

// The four unique line directions (dx, dy) — horizontal, vertical,
// and both diagonals. Since we scan in BOTH directions from the just-
// placed stone for each of these, we don't include the negatives.
const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],  // horizontal
  [0, 1],  // vertical
  [1, 1],  // diagonal ↘
  [1, -1], // diagonal ↗
];

// -----------------------------------------------------------------------------
// Public API

export function initGame(): GameState {
  return {
    board: new Array<CellContent>(BOARD_SIZE * BOARD_SIZE).fill('empty'),
    toMove: 'black',
    status: 'playing',
    moves: [],
    winner: null,
  };
}

/**
 * Attempt to place the current player's stone at (col, row). Returns
 * the updated state — or the *original* state unchanged if the move
 * is illegal (out of bounds, occupied cell, or game already over).
 */
export function placeStone(state: GameState, at: Position): GameState {
  if (state.status !== 'playing') return state;
  if (!inBounds(at.col, at.row)) return state;

  const idx = boardIndex(at.col, at.row);
  if (state.board[idx] !== 'empty') return state;

  const nextBoard = state.board.slice() as CellContent[];
  nextBoard[idx] = state.toMove;

  const move: Move = {
    stone: state.toMove,
    col: at.col,
    row: at.row,
    index: state.moves.length + 1,
  };

  // Win check — evaluate around the just-placed stone in all four
  // directions.
  const winner = findWinThrough(nextBoard, at.col, at.row, state.toMove);
  if (winner) {
    return {
      board: nextBoard,
      toMove: state.toMove, // record who moved last (the winner)
      status: 'won',
      moves: [...state.moves, move],
      winner,
    };
  }

  // Tie check — extremely rare in practice on 19×19.
  if (state.moves.length + 1 >= BOARD_SIZE * BOARD_SIZE) {
    return {
      board: nextBoard,
      toMove: state.toMove,
      status: 'tie',
      moves: [...state.moves, move],
      winner: null,
    };
  }

  return {
    board: nextBoard,
    toMove: state.toMove === 'black' ? 'white' : 'black',
    status: 'playing',
    moves: [...state.moves, move],
    winner: null,
  };
}

/**
 * Undo the last move. If there are no moves, returns state unchanged.
 * If the game had ended, restore it to `playing`. Multiple calls step
 * backward through history.
 */
export function undoLastMove(state: GameState): GameState {
  if (state.moves.length === 0) return state;

  const last = state.moves[state.moves.length - 1];
  const nextBoard = state.board.slice() as CellContent[];
  nextBoard[boardIndex(last.col, last.row)] = 'empty';

  return {
    board: nextBoard,
    toMove: last.stone, // the player who just un-moved gets to go again
    status: 'playing',
    moves: state.moves.slice(0, -1),
    winner: null,
  };
}

export function resign(state: GameState): GameState {
  if (state.status !== 'playing') return state;
  return {
    ...state,
    status: 'resign',
  };
}

/**
 * Return true if the given cell is currently empty (a legal target for
 * the next placement).
 */
export function isLegalMove(state: GameState, at: Position): boolean {
  if (state.status !== 'playing') return false;
  if (!inBounds(at.col, at.row)) return false;
  return state.board[boardIndex(at.col, at.row)] === 'empty';
}

// -----------------------------------------------------------------------------
// Win detection

function findWinThrough(
  board: readonly CellContent[],
  col: number,
  row: number,
  stone: Stone,
): WinInfo | null {
  for (const [dx, dy] of DIRECTIONS) {
    const line: Position[] = [{ col, row }];

    // Extend in the (+dx, +dy) direction.
    let c = col + dx;
    let r = row + dy;
    while (inBounds(c, r) && board[boardIndex(c, r)] === stone) {
      line.push({ col: c, row: r });
      c += dx;
      r += dy;
    }

    // Extend in the (-dx, -dy) direction.
    c = col - dx;
    r = row - dy;
    while (inBounds(c, r) && board[boardIndex(c, r)] === stone) {
      line.unshift({ col: c, row: r });
      c -= dx;
      r -= dy;
    }

    if (line.length >= WIN_LENGTH) {
      return { stone, line };
    }
  }
  return null;
}
