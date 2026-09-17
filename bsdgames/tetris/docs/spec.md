# `tetris` — Reverse Specification

> Implementation-independent specification of the game's mechanics,
> extracted from the original C source. **Not from memory — from the
> code.**
>
> This document is the contract that `src/` and `tests/` must honour.

---

## Objective

- **Win condition:** There is no traditional win condition. The player aims to maximize score by clearing rows and surviving as long as possible.
- **Lose condition:** A newly spawned piece cannot be placed at the spawn position; the stack has reached the top of the playfield.
- **Draw / stalemate:** Not applicable.

## State Variables

| Variable | Type | Range | Initial | Persisted? |
|---|---|---|---|:---:|
| `board[]` | `cell` (`unsigned char`) array, size `B_SIZE` = 276 | 0 = empty, 1 = occupied | Sentinels pre-filled; interior empty | no |
| `curshape` | pointer to `struct shape` | one of 7 base shapes | random | no |
| `nextshape` | pointer to `struct shape` | one of 7 base shapes | random | no |
| `pos` | `int` (board index) | valid board cell | `A_FIRST * B_COLS + (B_COLS / 2) - 1` | no |
| `score` | `int` | 0..∞ | 0 | no (in memory); final score written to high-score file |
| `level` | `int` | 1–9 | 2 (default) or CLI value | no |
| `fallrate` | `long` (microseconds per tick) | derived from level | `1000000 / level` | no |
| `showpreview` | `int` | 0 or 1 | 0 (false), or 1 if `-p` | no |
| `keys[6]` | `char` array | printable keys | `"jkl pq"` (default) or `-k` value | no |
| `key_msg[100]` | `char` array | display string | derived from `keys` | no |
| `curscreen[]` | `cell` array, size `B_SIZE` | previous frame | empty | no |
| high-score records | `struct highscore` array | name, score, level, time | read from score file | yes |

### Shape state

```c
struct shape {
    int rot;        /* index of rotated version of this shape */
    int off[3];     /* offsets to other blots if center is at (0,0) */
};
```

There are 19 entries in the shape table: 7 primary shapes plus their rotated forms. The `rot` field chains to the next rotation.

## Actions / Commands

All commands are single keystrokes. The default mapping is shown; any key can be remapped with `-k`.

| Command | Key (default) | Effect | Preconditions |
|---|---|---|---|
| Move left | `j` | Decrement `pos` by 1 if `fits_in(curshape, pos - 1)` is true. | Game running, not paused. |
| Rotate CCW | `k` | Replace `curshape` with `&shapes[curshape->rot]` if the rotated shape fits at `pos`. | Game running, not paused. |
| Move right | `l` | Increment `pos` by 1 if `fits_in(curshape, pos + 1)` is true. | Game running, not paused. |
| Drop | `<space>` | Move `pos` down until the piece no longer fits, scoring one point per row fallen. Then lock the piece. | Game running, not paused. |
| Pause | `p` | Suspend gameplay; wait for `RETURN`/`\n` to resume. | Game running. |
| Quit | `q` | End game immediately, show final score and high scores. | Any time during play. |
| Redraw | `Ctrl-L` (`\f`) | Clear screen and redraw the key message. | Any time. |

No command may use the same key as another command; the game validates that all six `keys` are distinct.

## Rules & Invariants

1. **Board geometry.** The logical board is 12 columns × 23 rows (`B_COLS` × `B_ROWS`). The visible playfield is columns 1–10 of rows 1–20. Column 0, column 11, row 0, and rows 21–22 are sentinel walls pre-filled at startup.
2. **Collision.** A shape fits at a candidate position only if the center cell and all three offset cells are currently empty.
3. **Rotation.** Only one rotation direction is supported: counterclockwise quarter-turns via a lookup table. There are no wall kicks or floor kicks.
4. **Gravity tick.** If no input arrives before `fallrate` microseconds expire, the current piece attempts to fall one row. If it cannot fall, it locks, the player scores one point, completed rows are cleared, and a new piece is spawned.
5. **Continuous acceleration.** Every tick reduces `fallrate` by `fallrate / 3000`, regardless of the chosen level. The game therefore speeds up indefinitely.
6. **Scoring.** Final displayed score = `score * level`. Intermediate `score` increments by 1 per locked piece and by 1 per row fallen during a drop.
7. **Spawn.** New pieces are chosen uniformly at random from the 7 base shapes. The spawn position is `A_FIRST * B_COLS + (B_COLS / 2) - 1`.
8. **Game over.** If a newly spawned piece does not fit at the spawn position, the loop terminates.
9. **High-score rules.** One entry per user per level, at most nine scores per user total, scores older than five years expire unless they are the highest on that level.

## Difficulty Levels & Setup Configuration

### Difficulty Modes / Levels

Levels are integer values 1 through 9. The level affects:

- **Initial fall speed:** `fallrate = 1,000,000 / level` microseconds per row. Level 1 = 1 second/row; level 9 ≈ 111 ms/row.
- **Score multiplier:** final score = raw `score * level`.

There are no separate "easy / normal / hard" modes; level is the only difficulty knob.

### Setup & Invariant Bounds

| Flag / Option | Parameter | Range | Validation | Rejection |
|---|---|---|---|---|
| `-l level` | start level | 1–9 inclusive | `if (level < 1 || level > 9) { usage(); exit(1); }` | prints usage and exits |
| `-k keys` | 6 distinct keys | any 6 distinct printable chars | `if (strlen(keys) != 6) usage();` plus duplicate check | prints usage and exits |
| `-p` | preview | boolean | none | enables next-piece preview |
| `-s` | show scores | boolean | none | prints high scores and exits |

The program also validates that file descriptors 0, 1, and 2 are open by checking that an `open("/dev/null", O_RDONLY)` returns a descriptor ≥ 3; if not, it exits immediately.

### Session Replay Semantics

There is no replay or saved-game feature. Each run:
- Seeds RNG from the process ID (`srandom(getpid())`).
- Generates a fresh random sequence of pieces.
- Starts with an empty visible playfield.

High scores persist across sessions in the score file; they are not tied to a specific run's piece sequence.

## RNG Usage

| Trigger | Distribution | Effect |
|---|---|---|
| Spawn next piece | Uniform over 7 base shapes (`random() % 7`) | Selects `nextshape` from `shapes[0..6]` |

**Seed strategy:** Fresh per run. `srandom(getpid())` is called once at startup. The sequence is therefore nondeterministic across different process invocations but reproducible only if a process ID repeats.

There is no 7-bag, no piece history, and no bias correction.

## Scoring

- `+1` point every time a piece locks into the stack.
- `+1` point for every row the piece falls during a drop command.
- Final displayed score = `score * level`.

Example: clearing 1 row with a piece that fell 10 rows after a drop at level 3 yields roughly `(1 lock + 10 drop) * 3 = 33` points, plus any additional pieces locked during row-clear animation.

## Termination Conditions

1. **Lose — top-out.** A newly spawned piece does not fit at the spawn position. The game breaks the main loop, clears the screen, prints the final score, saves the score if it qualifies, and shows the high-score list.
2. **Quit.** The player presses the quit key. Same shutdown sequence as a loss.
3. **Show scores (`-s`).** The program prints high scores and exits before entering the game loop.
4. **Invalid arguments.** The program prints usage and exits before entering the game loop.

## Not in Scope

Things the original does that a modern port may choose differently:

- Wall kicks, floor kicks, or SRS rotation rules.
- Hold queue or ghost piece.
- Multi-line clear bonuses (the original scores one point per lock regardless of how many rows clear).
- Reproducible seeds or replay files.
- Network multiplayer.

See [`port-ideas.md`](./port-ideas.md) for modernisation decisions.

## Ambiguities in the Original

- **Row-clear animation.** The code clears one full row, redraws, sleeps, then shifts rows down. The exact visual timing depends on terminal speed and is not specified as a gameplay rule. A port should preserve the per-row clear but may tune the delay.
- **Drop scoring edge cases.** A drop scores per row fallen. If the piece is already on the ground, pressing drop scores 0 additional points but still locks the piece. This is preserved from the original.
- **Preview interaction with rotation.** The preview simply draws `nextshape` in the upper-left area; it does not consume a rotation state. The port will keep the preview as an informational display only.

## See Also

- [`architecture.md`](./architecture.md)
- [`test-scenarios.md`](./test-scenarios.md)
