# `snake` — Reverse Specification

---

## Objective

- **Success:** move onto the exit (`#`) with money banked. Score =
  `chunk × (loot − penalty) / 25`.
- **Failure:** snake catches you (any snake segment coincides with
  your position). Score = 0.
- **Quit:** press `x`. No score recorded.

## State Variables

| Variable | Type | Range | Initial | Persisted |
|---|---|---|---|:---:|
| `you` | struct point | in field | randomly placed | no |
| `money` | struct point | in field | randomly placed | no |
| `finish` | struct point | in field | randomly placed | no |
| `snake[6]` | struct point[6] | in field | snake[0] random, 1..5 follow via chase() | no |
| `loot` | int | ≥ 0 | 0 | to score file at end |
| `penalty` | int | ≥ 0 | 0 | to score file at end |
| `moves` | int | ≥ 0 | 0 | to score file |
| `chunk` | int | derived from screen | computed at startup | no |
| `lcnt`, `ccnt` | int | ≤ terminal size | from `-l`/`-w` or terminal | no |
| `fast` | int | 0 or 1 | 1 (fast) or 0 with `-t` | no |
| Score files (`_PATH_RAWSCORES`, `_PATH_LOGFILE`) | file | | as loaded | yes |

Field: `lcnt × ccnt` including a 1-cell border on all sides.
Minimum: 4×4 enforced (`snake.c:207-210`), effectively 12×12 for
scoring formula.

## Actions / Commands

| Key(s) | Effect |
|---|---|
| `h`, arrow-L, `s` | Move left 1 |
| `l`, arrow-R, `f` | Move right 1 |
| `k`, arrow-U, `e` | Move up 1 |
| `j`, arrow-D, `c` | Move down 1 |
| `HJKL` uppercase | Long move — toward money's column/row (stops when aligned; snake still gets turns) |
| `SEFC` uppercase | Same idea (keypad-style) |
| `A` | Move to left edge |
| `T` | Move to top edge |
| `P` | Move to right edge |
| `B` | Move to bottom edge |
| `p` | Show a hint pointing toward money |
| `w` | **Spacewarp**: teleport to random empty cell; penalty = 10% of current loot |
| `x`, DEL, EOT | Quit (no score) |
| `Ctrl-Z` | Suspend |
| `Ctrl-L` | Redraw |
| `.` | Repeat last command |
| Number prefix | Repeat next command that many times |

## Turn Order

1. Show cursor at `you`.
2. Wait for input.
3. Interpret input; move player (or spacewarp / quit / etc.).
4. Check: is `you == money`? Yes → `loot += chunk`; place new
   money (see rules below).
5. Check: is `you == finish`? Yes → win; compute cash value.
6. Call `pushsnake()`:
   - `snake[5] = snake[4]; ...; snake[1] = snake[0]`.
   - `chase(&snake[0], &you)` — head moves toward player.
   - Check every snake segment vs. `you`. Match → death.

## Rules & Invariants

1. **Snake is always 6 segments** and always contiguous
   (guaranteed by initial `chase()` chain + `pushsnake()`'s
   segment-follows-previous logic).
2. **Money is always exactly one** on the field.
3. **Exit is fixed for the duration of the game** — placed
   randomly at start, never moves.
4. **Player never overlaps money without collecting** and never
   overlaps exit without winning — both are checked immediately
   after movement.
5. **Snake movement follows player movement**, once per
   player-turn.
6. **Movement is bounded** by field walls — no wrap-around.

## RNG Usage

- **Primitive:** `random() % range`.
- **Seed:** `srandom((int) time(NULL))` at
  `snake.c:192`. (In DEBUG builds, a `-d seed` argument sets a
  fixed seed.)

| Site | Distribution | Effect |
|---|---|---|
| `snrand(&finish)`, `snrand(&you)`, `snrand(&money)`, `snrand(&snake[0])` at startup | Uniform in field, with retry to avoid mutual collision | Initial placement |
| Money re-placement after collection | Uniform, with rejection for exit / status area / player position | New money spot |
| Spacewarp target | Uniform in field | Player teleport |
| End-of-game bonus digit | Uniform 0..9 | Bonus if matches score % 10 |

## Scoring

`cashvalue = chunk × (loot − penalty) / 25`

Where:

- `chunk = 675.0 / (min(lcnt, ccnt) + 8) + 2.5` (approximately;
  see `snake.c:224-233` for the exact clamping).
- `loot` = `chunk × N` where `N` is the number of `$` collected.
- `penalty` = 10% of `loot` per spacewarp, deducted from `loot`
  effectively (via the formula).

## Termination Conditions

1. **Player reaches exit:** win. Record score. Optionally show
   bonus digit (`snake.c:434-439`).
2. **Snake catches player:** die. Score = 0. Message printed.
3. **Player quits (`x`, DEL, EOT):** exit without recording
   score.
4. **SIGINT:** call `stop()`.

## Not in Scope for the Port

- The exact binary format of `_PATH_RAWSCORES` — the port uses
  a modern DB/JSON.
- The `-d seed` DEBUG-only flag — port makes it public via
  `--seed`.
- Exact terminal-dimension-based scoring formula — the port
  may normalise scoring (see [`port-ideas.md`](./port-ideas.md)).

## Ambiguities in the Original

- **When is money placed?** Only after a `$` is collected. So
  there is at most one `$` on the field at any time.
- **How does the game handle the player being on the exit at
  start?** `snrand` retries to avoid mutual collision, but the
  exact retry logic for the initial 4 placements is worth
  reproducing carefully. See `snake.c:237-240`.

## See Also

- [`architecture.md`](./architecture.md).
- [`test-scenarios.md`](./test-scenarios.md).
