// Canonical board size from `bsdgames/gomoku/docs/spec.md` §State
// Variables (`BSZ = 19`). Do not change without updating the spec.
export const BOARD_SIZE = 19;

// Column letters A..T skipping I (Go/gomoku tradition — I is skipped
// to avoid confusion with numeral 1). Length matches BOARD_SIZE.
export const COLUMN_LETTERS = 'ABCDEFGHJKLMNOPQRST';

// Hoshi (star) point positions — the traditional 4-4 / 4-10 / 4-16 /
// 10-4 / 10-10 / 10-16 / 16-4 / 16-10 / 16-16 marks on a 19x19 board,
// stored 0-indexed as (col, row).
export const HOSHI_POINTS: readonly Position[] = [
  { col: 3, row: 3 },
  { col: 3, row: 9 },
  { col: 3, row: 15 },
  { col: 9, row: 3 },
  { col: 9, row: 9 }, // center — the K10 opening move
  { col: 9, row: 15 },
  { col: 15, row: 3 },
  { col: 15, row: 9 },
  { col: 15, row: 15 },
];

export type Stone = 'black' | 'white';

export type CellContent = Stone | 'empty';

export type Position = Readonly<{ col: number; row: number }>;

export type Move = Readonly<{
  stone: Stone;
  col: number;
  row: number;
  /** Turn number, 1-indexed. */
  index: number;
}>;

export type GameStatus =
  | 'playing'
  | 'won'    // one side placed five-in-a-row
  | 'tie'    // board full with no winner
  | 'resign'; // one side resigned

export type WinInfo = Readonly<{
  stone: Stone;
  /** The five (or more, in the case of overlines) stones that formed the win. */
  line: readonly Position[];
}>;

/**
 * Immutable game state. Each move produces a new GameState via
 * engine.movePlayer (or engine.movePlayerAt with explicit coords).
 * The board itself is stored as a flat readonly array of length
 * BOARD_SIZE * BOARD_SIZE for cheap structural sharing.
 */
export type GameState = Readonly<{
  board: readonly CellContent[]; // length BOARD_SIZE * BOARD_SIZE
  toMove: Stone;
  status: GameStatus;
  moves: readonly Move[];
  /** Populated when status transitions to 'won'. */
  winner: WinInfo | null;
}>;

/**
 * Board index from (col, row). Rows 0..BOARD_SIZE-1 top-to-bottom,
 * cols 0..BOARD_SIZE-1 left-to-right.
 */
export function boardIndex(col: number, row: number): number {
  return row * BOARD_SIZE + col;
}

export function inBounds(col: number, row: number): boolean {
  return col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE;
}
