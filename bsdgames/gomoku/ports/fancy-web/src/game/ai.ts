// Heuristic AI — a spiritual descendant of the original BSDGames
// `gomoku` pickmove.c heuristic.
//
// The original C source uses precomputed frames + overlap tables to
// score threats in constant time per move. We take a simpler, purely
// online approach that gives play strength comparable to the low-mid
// levels of the original:
//
//   1. If the AI has not moved yet and K10 is empty → play K10 (spec
//      §Rules invariant 8; pickmove.c:77-78).
//   2. Otherwise, for every legal empty cell, sum a pattern score
//      across the 4 line directions:
//        - Simulate placing the AI stone: OFFENCE score.
//        - Simulate placing the opponent's stone: DEFENCE score.
//      Cell value = max(OFFENCE, DEFENCE × 0.92), so the AI takes any
//      winning move but otherwise weights own attacks slightly above
//      defensive blocks.
//   3. Random tie-break among top-scoring cells (spec §RNG Usage —
//      matches the original `better() { return rand() & 1; }` idea).
//
// The pattern score is the classical
// [count-in-a-row × open-ends] table. It's the piece a beginner
// implementing gomoku AI writes first, and it's strong enough to
// beat casual human players while remaining fast and deterministic
// against a seeded RNG.

import {
  BOARD_SIZE,
  boardIndex,
  inBounds,
  type CellContent,
  type GameState,
  type Position,
  type Stone,
} from './state';
import { isLegalMove } from './engine';

const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [1, 0], // horizontal
  [0, 1], // vertical
  [1, 1], // diagonal ↘
  [1, -1], // diagonal ↗
];

/** K10 = column 9, row 9 (0-indexed). Center of the 19×19 board. */
const CENTER: Position = { col: 9, row: 9 };

/**
 * Pattern scoring table. `count` is the number of consecutive
 * `stone` cells (including the just-placed one) in a single direction.
 * `openEnds` is how many of the two ends of that run are empty and in
 * bounds — 0, 1, or 2.
 */
function patternScore(count: number, openEnds: number): number {
  if (count >= 5) return 10_000_000; // WIN
  if (count === 4) {
    if (openEnds === 2) return 100_000; // Open four — unblockable
    if (openEnds === 1) return 8_000; // Simple four — must block
    return 0;
  }
  if (count === 3) {
    if (openEnds === 2) return 1_500; // Open three — becomes open four
    if (openEnds === 1) return 300;
    return 0;
  }
  if (count === 2) {
    if (openEnds === 2) return 200;
    if (openEnds === 1) return 20;
    return 0;
  }
  if (count === 1) {
    if (openEnds === 2) return 10;
    if (openEnds === 1) return 1;
    return 0;
  }
  return 0;
}

/**
 * Score placing `stone` at (col, row) on the given board. Assumes the
 * cell is currently empty and (col, row) is in bounds. Sums pattern
 * scores across the four line directions.
 */
export function scorePlacement(
  board: readonly CellContent[],
  col: number,
  row: number,
  stone: Stone,
): number {
  let total = 0;
  for (const [dx, dy] of DIRECTIONS) {
    // Count consecutive `stone` cells forward.
    let count = 1;
    let c = col + dx;
    let r = row + dy;
    while (
      inBounds(c, r) &&
      board[boardIndex(c, r)] === stone
    ) {
      count++;
      c += dx;
      r += dy;
    }
    const forwardOpen =
      inBounds(c, r) && board[boardIndex(c, r)] === 'empty';

    // Count consecutive `stone` cells backward.
    c = col - dx;
    r = row - dy;
    while (
      inBounds(c, r) &&
      board[boardIndex(c, r)] === stone
    ) {
      count++;
      c -= dx;
      r -= dy;
    }
    const backwardOpen =
      inBounds(c, r) && board[boardIndex(c, r)] === 'empty';

    const openEnds = (forwardOpen ? 1 : 0) + (backwardOpen ? 1 : 0);
    total += patternScore(count, openEnds);
  }
  return total;
}

/**
 * Pick the AI's next move.
 *
 * @param state   Current game state. Must be `playing` and it must be
 *                the AI's turn.
 * @param aiStone The colour the AI plays.
 * @param random  Uniform-in-[0,1) generator for tie-breaks. Injected
 *                so tests can pass a deterministic RNG.
 * @returns       The chosen cell, or `null` if there are no legal moves
 *                or the game is over.
 */
export function pickAiMove(
  state: GameState,
  aiStone: Stone,
  random: () => number = Math.random,
): Position | null {
  if (state.status !== 'playing') return null;
  if (state.toMove !== aiStone) return null;

  // First AI move rule: play K10 if it's still empty. Matches spec.
  const aiPlayedYet = state.moves.some((m) => m.stone === aiStone);
  if (!aiPlayedYet && isLegalMove(state, CENTER)) {
    return CENTER;
  }

  const opponent: Stone = aiStone === 'black' ? 'white' : 'black';
  let bestScore = -Infinity;
  const bestCells: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (state.board[boardIndex(col, row)] !== 'empty') continue;

      const offence = scorePlacement(state.board, col, row, aiStone);
      const defence = scorePlacement(state.board, col, row, opponent);
      const score = Math.max(offence, defence * 0.92);

      if (score > bestScore) {
        bestScore = score;
        bestCells.length = 0;
        bestCells.push({ col, row });
      } else if (score === bestScore) {
        bestCells.push({ col, row });
      }
    }
  }

  if (bestCells.length === 0) return null;
  const pickIndex = Math.min(
    bestCells.length - 1,
    Math.floor(random() * bestCells.length),
  );
  return bestCells[pickIndex];
}
