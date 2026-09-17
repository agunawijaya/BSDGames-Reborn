# `gomoku` — Reverse Specification

> Implementation-independent specification of `gomoku`'s mechanics,
> extracted from the original C source.

---

## Objective

- **Win:** be the first to place five of your stones in an
  unbroken line (horizontal, vertical, or one of the two
  diagonals).
- **Tie:** the board is filled without either player achieving
  five in a row (extremely rare on 19×19).
- **Resign / Quit:** either player can voluntarily forfeit.

## State Variables

| Variable | Type | Range | Initial | Persisted |
|---|---|---|---|:---:|
| `board[BAREA]` | struct spotstr[] | occupied by BLACK/WHITE/BORDER/EMPTY | all EMPTY (interior), BORDER (edge) | via save file (as move list) |
| `movenum` | int | ≥ 1 | 1 | derived from move history |
| `movelog[BSZ*BSZ]` | int[] | spot indices | empty | yes (save file) |
| `plyr[BLACK]`, `plyr[WHITE]` | const char * | "you" / prog name | assigned at game start | no |
| `input[BLACK]`, `input[WHITE]` | int | USER / PROGRAM / INPUTF | set by mode | no |
| `interactive` | int | 0 or 1 | 1 unless `-b` | no |
| `test` | int | 0, 1, 2 | 0 | no |
| `frames[FAREA]` | struct combostr[] | precomputed | initialised once by `bdinit` | no |
| `overlap[FAREA*FAREA]` | u_char[] | precomputed | initialised once by `bdinit` | no |
| `intersect[FAREA*FAREA]` | short[] | precomputed | initialised once by `bdinit` | no |
| `hashcombos[FAREA]` | struct combostr*[] | scratch | NULL between moves | no |

Board: 19×19 playable, 20×20 including a border sentinel. Coordinate
system: columns `A..S` (skipping `I`), rows `1..19`.

## Actions / Commands

### Move Entry

- **Move:** two characters — column letter (A–S, no I) + row
  number (1–19). Examples: `K10`, `A1`, `S19`.
- **`save`** — prompt for filename, write move log.
- **`quit`** — end the game immediately.
- **`resign`** — forfeit; opponent wins.

### Game Modes

- **Default** — user versus program.
- **`-u`** — user versus user (hot-seat).
- **`-c`** — program versus program.
- **`-b`** — background mode (stdin/stdout, no `curses`).
- Given a file argument — replay from file, then hand over to
  interactive.

## Rules & Invariants

1. **Board starts empty** (all interior spots EMPTY).
2. **Black moves first.**
3. **Alternating turns.** After Black plays, White plays.
4. **Legal moves:** any interior spot with `s_occ == EMPTY`.
5. **Immediate placement.** Stones don't move once placed. No
   captures.
6. **Win detection:** after each move, check if the moving colour
   has an unbroken five-in-a-row through the just-placed stone.
   In this implementation, `makemove()` performs this check.
7. **Tie:** all 361 spots occupied with no five-in-a-row.
   Practically unreachable.
8. **First AI move** (when applicable): always K10 (spot index
   `PT(K,10)`). `pickmove.c:77-78`.

## RNG Usage

Only one RNG-driven decision affects play, and it is a **tie-break
between equally-valued moves**:

```c
// pickmove.c:214-218 in better()
#ifdef SVR4
    return (rand() & 1);
#else
    return (random() & 1);
#endif
```

**Seed:** `srandom(time(0))` unless in debug mode (`main.c:135-140`).

**Practical effect:** given two moves the heuristic considers equal,
one of them is chosen at random. In debug mode (`-d`), seed is not
set, so the tie-break becomes deterministic and reproducible.

**No random encounters, no dice rolls, no procedural content.**

## Scoring

There is no numeric score. Outcome is `WIN` / `TIE` / `RESIGN`.

## Termination Conditions

- **Win:** `makemove()` returns `WIN`. The moving colour is the
  winner.
- **Tie:** `makemove()` returns `TIE`.
- **Illegal move:** `makemove()` returns `ILLEGAL`. In interactive
  mode this prompts a re-entry; in batch mode it terminates.
- **Resign:** input is `resign`.
- **Quit:** input is `quit` or SIGINT.

## Not in Scope for the Port

- The exact save-file format is a plain list of moves, one per
  line. The port may use SGF instead (see
  [`port-ideas.md`](./port-ideas.md)).
- Big-endian handling of the `union comboval` — port uses
  language-native tagged types.
- The DEBUG-only `whatsup()` REPL — reimplement as a proper debug
  panel in the modernised UI.
- The `-D <debugfile>` flag — replaced by structured logging.

## Ambiguities in the Original

- **What counts as "unbroken five"?** Free gomoku (this
  implementation) counts any five in a row, including six-in-a-row
  ("overlines"). Renju does not. Port must document its choice.
- **First-move restriction.** Free gomoku allows Black to play
  anywhere. Renju restricts Black's opening. Original enforces
  free rules.
- **Illegal-move handling in batch mode** — the code has some
  fallback logic (`main.c:220-241`) that swaps input sources. This
  is subtle and worth verifying with tests before replicating.

## See Also

- [`architecture.md`](./architecture.md) — how this spec is
  implemented.
- [`test-scenarios.md`](./test-scenarios.md) — verification.
