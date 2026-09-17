import { describe, expect, it } from 'vitest';
import { pickAiMove, scorePlacement } from '../src/game/ai';
import { initGame, placeStone } from '../src/game/engine';
import type { CellContent, GameState, Position, Stone } from '../src/game/state';
import { BOARD_SIZE, boardIndex } from '../src/game/state';

/** Deterministic RNG for tie-break tests. Always returns 0 → picks
 *  the first candidate in the tie set. */
const zeroRng = () => 0;

// Convenience: apply a sequence of (col, row) moves.
function playMoves(
  initial: GameState,
  moves: ReadonlyArray<[col: number, row: number]>,
): GameState {
  let s = initial;
  for (const [c, r] of moves) s = placeStone(s, { col: c, row: r });
  return s;
}

// -----------------------------------------------------------------------------
// scorePlacement — pattern scoring correctness

describe('scorePlacement', () => {
  function emptyBoard(): CellContent[] {
    return new Array<CellContent>(BOARD_SIZE * BOARD_SIZE).fill('empty');
  }

  function set(board: CellContent[], stone: Stone, positions: ReadonlyArray<[number, number]>): void {
    for (const [c, r] of positions) board[boardIndex(c, r)] = stone;
  }

  it('gives a huge score for creating a five-in-a-row (win)', () => {
    const b = emptyBoard();
    set(b, 'black', [[0, 5], [1, 5], [2, 5], [3, 5]]);
    // Placing at (4, 5) completes five.
    const score = scorePlacement(b, 4, 5, 'black');
    expect(score).toBeGreaterThanOrEqual(10_000_000);
  });

  it('scores an open four much higher than any lesser pattern', () => {
    const b = emptyBoard();
    // _ B B B _  → placing at (0,5) or (4,5) makes an open four... actually
    // an open four means 4-in-a-row with both ends open. Set _ B B _ B _
    // and place middle to get B B B B with open ends? Easiest: build B B B
    // then place adjacent to make BBBB with open ends on both sides.
    set(b, 'black', [[1, 5], [2, 5], [3, 5]]);
    // Placing at (4, 5): B B B B _ with left neighbor at (0,5) empty.
    // count=4, forwardOpen=true (5,5), backwardOpen=true (0,5). Open four.
    const open4 = scorePlacement(b, 4, 5, 'black');
    expect(open4).toBeGreaterThan(50_000);
  });

  it('scores a blocked four (must-block) below open four but above three', () => {
    const b = emptyBoard();
    // W B B B _  → placing at (4,5) makes W B B B B; forward end open,
    // backward end blocked.
    set(b, 'white', [[0, 5]]);
    set(b, 'black', [[1, 5], [2, 5], [3, 5]]);
    const blocked4 = scorePlacement(b, 4, 5, 'black');
    expect(blocked4).toBeGreaterThan(1_000);
    expect(blocked4).toBeLessThan(50_000);
  });

  it('scores an open three above a closed three', () => {
    const b = emptyBoard();
    set(b, 'black', [[1, 5], [2, 5]]);
    // Place at (3, 5): _ B B B _ — open three
    const open3 = scorePlacement(b, 3, 5, 'black');

    const b2 = emptyBoard();
    set(b2, 'white', [[0, 5]]);
    set(b2, 'black', [[1, 5], [2, 5]]);
    // Place at (3, 5): W B B B _ — closed three
    const closed3 = scorePlacement(b2, 3, 5, 'black');

    expect(open3).toBeGreaterThan(closed3);
  });

  it('scores an isolated stone near zero', () => {
    const b = emptyBoard();
    const score = scorePlacement(b, 5, 5, 'black');
    // 4 directions × count=1, open=2 → score is around 40.
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThan(0);
  });
});

// -----------------------------------------------------------------------------
// pickAiMove — behaviour

describe('pickAiMove', () => {
  it('plays K10 on its first move when the centre is available', () => {
    // AI is black — game starts, AI moves.
    const s = initGame();
    const move = pickAiMove(s, 'black', zeroRng);
    expect(move).toEqual({ col: 9, row: 9 });
  });

  it('plays K10 as its first move even when it is playing white, if K10 is still empty', () => {
    // Black plays A1 (a bad opening). AI (white) moves — K10 is free.
    const s = playMoves(initGame(), [[0, 0]]);
    const move = pickAiMove(s, 'white', zeroRng);
    expect(move).toEqual({ col: 9, row: 9 });
  });

  it('falls back to the heuristic when K10 is already taken and it is the AI\'s first move', () => {
    // Black opened at K10; AI (white) has no first-move rule to hit.
    const s = playMoves(initGame(), [[9, 9]]);
    const move = pickAiMove(s, 'white', zeroRng);
    expect(move).not.toBeNull();
    expect(move).not.toEqual({ col: 9, row: 9 });
  });

  it('takes the winning move when it has one', () => {
    // Set up: AI is Black with four in a row along row 5, extend at (4,5).
    let s = initGame();
    // Black already moved once (so K10 first-move rule is skipped for later
    // calls). Play a fabricated sequence to reach the target position.
    s = placeStone(s, { col: 9, row: 9 });    // Black K10
    s = placeStone(s, { col: 15, row: 15 });  // White (spread — no threat)
    s = placeStone(s, { col: 0, row: 5 });    // Black
    s = placeStone(s, { col: 17, row: 14 });  // White (spread — no threat)
    s = placeStone(s, { col: 1, row: 5 });    // Black
    s = placeStone(s, { col: 15, row: 13 });  // White (spread — no threat)
    s = placeStone(s, { col: 2, row: 5 });    // Black
    s = placeStone(s, { col: 17, row: 12 });  // White (spread — no threat)
    s = placeStone(s, { col: 3, row: 5 });    // Black — four in a row on row 5
    s = placeStone(s, { col: 15, row: 11 });  // White (spread — no threat)
    // Now it's Black's (AI's) turn again. AI should play (4,5) to win.
    const move = pickAiMove(s, 'black', zeroRng);
    expect(move).toEqual({ col: 4, row: 5 });
  });

  it('blocks the opponent\'s immediate winning threat', () => {
    let s = initGame();
    // Black (human) builds a four-in-a-row threat.
    s = placeStone(s, { col: 9, row: 9 });   // Black K10
    s = placeStone(s, { col: 0, row: 0 });   // White (AI has already had first move logic)
    s = placeStone(s, { col: 0, row: 5 });   // Black
    s = placeStone(s, { col: 18, row: 0 });  // White
    s = placeStone(s, { col: 1, row: 5 });   // Black
    s = placeStone(s, { col: 18, row: 1 });  // White
    s = placeStone(s, { col: 2, row: 5 });   // Black
    s = placeStone(s, { col: 18, row: 2 });  // White
    s = placeStone(s, { col: 3, row: 5 });   // Black — has an open-ish four
    // AI (white) should block at (4, 5) — the extension end that Black
    // could reach next.
    const move = pickAiMove(s, 'white', zeroRng);
    expect(move).toEqual({ col: 4, row: 5 });
  });

  it('returns null when the game has ended', () => {
    // Black wins.
    let s: GameState = initGame();
    for (let c = 0; c < 5; c++) {
      s = placeStone(s, { col: c, row: 5 });
      if (c < 4) s = placeStone(s, { col: c, row: 10 });
    }
    expect(s.status).toBe('won');
    // Regardless of colour, no move to make.
    expect(pickAiMove(s, 'white', zeroRng)).toBeNull();
    expect(pickAiMove(s, 'black', zeroRng)).toBeNull();
  });

  it('returns null when it is not the AI\'s turn', () => {
    const s = initGame(); // Black to move
    expect(pickAiMove(s, 'white', zeroRng)).toBeNull();
  });

  it('uses the injected RNG for tie-breaks', () => {
    // On an empty board with no first-move rule (AI has already moved),
    // multiple cells might tie. Verify the RNG index chooses among them.
    let s = initGame();
    s = placeStone(s, { col: 9, row: 9 }); // Black
    s = placeStone(s, { col: 8, row: 8 }); // White (AI has moved once)
    s = placeStone(s, { col: 10, row: 10 }); // Black
    // Now AI's second move. Build a candidate set is board-dependent;
    // verify with rng returning 0 gets a specific cell reproducibly.
    const moveA = pickAiMove(s, 'white', () => 0);
    const moveB = pickAiMove(s, 'white', () => 0);
    expect(moveA).toEqual(moveB);
  });
});

// Cheap self-check to prevent AI regressions: play out 20 turns of AI
// vs AI and expect the game to converge (i.e. either finish or make
// legal progress). Full spec compliance is validated by engine tests;
// this just guards against pathological AI outputs.
describe('AI-vs-AI smoke test', () => {
  it('runs a 30-turn AI-vs-AI game without producing illegal states', () => {
    let s: GameState = initGame();
    const rng = () => 0.5; // stable pick
    for (let i = 0; i < 30; i++) {
      if (s.status !== 'playing') break;
      const stone: Stone = s.toMove;
      const move: Position | null = pickAiMove(s, stone, rng);
      if (move === null) break;
      const next = placeStone(s, move);
      // Illegal move would return the same state.
      expect(next).not.toBe(s);
      s = next;
    }
    // Should have progressed at least a few moves.
    expect(s.moves.length).toBeGreaterThan(2);
  });
});
