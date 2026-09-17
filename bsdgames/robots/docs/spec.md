# `robots` — Reverse Specification

> Implementation-independent specification of `robots`'s mechanics,
> extracted from the original C source. Not from memory — from the
> code.

This document is the contract that `src/` and `tests/` must honour.

Upstream source (not redistributed in this repo):
<https://github.com/vattam/BSDGames/tree/master/robots>

---

## Objective

- **Win condition:** none. The game is endless.
- **Lose condition:** the player character `@` occupies the same
  cell as any robot `+` at any point during a turn.
- **Draw:** impossible.

Success is measured by *score at time of death*.

## State Variables

| Variable | Type | Range | Initial | Persisted |
|---|---|---|---|:---:|
| `Level` | int | ≥ 1 | 1 (or 4 with `-a`) | no |
| `Score` | u_int32_t | ≥ 0 | 0 | yes (via score file) |
| `Num_robots` | int | 0..40 | `min(Level×10, 40)` | no |
| `Num_scrap` | int | 0..40 | 0 | no |
| `My_pos` | COORD | field bounds | randomly placed | no |
| `Robots[MAXROBOTS]` | COORD[] | field bounds or (-1, -1) | randomly placed | no |
| `Scrap[MAXROBOTS]` | COORD[] | field bounds | none | no |
| `Field[23][60]` | char[][] | count of entities per cell | 0 | no |
| `Dead` | bool | | false | no |
| `Waiting` | bool | | false | no |
| `Wait_bonus` | int | ≥ 0 | 0 | no |
| `Real_time` | bool | | false (unless `-r`) | no |
| `Auto_bot` | bool | | false (unless `-A`) | no |
| Score file entries | SCORE[] | ≤ `MAXSCORES × Max_per_uid` | as loaded | yes |

Field dimensions: `Y_FIELDSIZE = 23`, `X_FIELDSIZE = 60`
(`robots.h:53-54`).
Max robots per level: `MAXROBOTS = 40 = MAXLEVELS × 10`
(`robots.h:57-58`).

## Actions / Commands

### Movement (single step)

| Input | Effect |
|---|---|
| `h` | player.x -= 1 |
| `l` | player.x += 1 |
| `k` | player.y -= 1 |
| `j` | player.y += 1 |
| `y` | player.x -= 1, player.y -= 1 |
| `u` | player.x += 1, player.y -= 1 |
| `b` | player.x -= 1, player.y += 1 |
| `n` | player.x += 1, player.y += 1 |
| `.` or Space | no-op |

**Preconditions:** target square must be inside field bounds
`(0..X_FIELDSIZE-1) × (0..Y_FIELDSIZE-1)`. Attempting to move
outside is a no-op with an error tone.

### Movement (run)

| Input | Effect |
|---|---|
| `H`,`L`,`K`,`J`,`Y`,`U`,`B`,`N` | Move repeatedly in the given direction until adjacent to something dangerous or reaching field edge |
| `>` | Do nothing repeatedly until adjacent to something dangerous |

Player is protected: run commands stop *short* of committing suicide
(`play_level.c:79` — enforced by not moving *onto* a robot). Exception:
during `w` (wait), the player may die.

### Special commands

| Input | Effect |
|---|---|
| `t` | Teleport: `My_pos = *rnd_pos()`. Uniformly random over empty cells. |
| `w` | Set `Waiting = true`. Player does not move; robots move continuously; grants `Wait_bonus` (see §Scoring); loop ends when either `Num_robots == 0` or `Dead`. |
| `q` | Quit. |
| `^L` | Redraw screen. |

### Numeric prefixes

Any command can be preceded by a decimal integer, which repeats it
(e.g. `5h` = move left 5 times, subject to safety rules).

## Turn Order (per iteration of the level loop)

1. Draw screen; wait for input.
2. Interpret input; move player (if move applies).
3. If `Field[My_pos.y][My_pos.x] != 0` after player move → `Dead`.
4. Else call `move_robots(FALSE)`:
   - For each robot with `y >= 0`:
     - Erase old cell; decrement `Field[old.y][old.x]`.
     - `robot.y += sign(My_pos.y - robot.y)`.
     - `robot.x += sign(My_pos.x - robot.x)`.
     - Clamp to field bounds.
     - Increment `Field[new.y][new.x]`.
   - Second pass:
     - If robot.pos == My_pos → `Dead`.
     - Else if `Field[robot.y][robot.x] > 1` → convert to scrap
       (`Scrap[Num_scrap++] = *rp`, `rp.y = -1`, `Num_robots--`,
       `if (Waiting) Wait_bonus++`, `add_score(10)`).
     - Else render robot.
5. If `Num_robots == 0` → level cleared.

## Rules & Invariants

1. **Robots move deterministically.** Given player position and
   robot positions at start of turn, robot positions at end of turn
   are a function.
2. **Field is a occupancy count**, not a symbol grid. Two entities
   in one cell means `Field[y][x] == 2`.
3. **A scrap heap decrements `Num_robots` and increments
   `Num_scrap`.** Two robots hitting the same cell produce one heap
   containing two dead robots; both are counted dead.
4. **A robot hitting an existing scrap heap dies** (because
   `Field[y][x]` was already 1 from the heap, becomes 2 after
   arrival). The heap does *not* grow visually or in count; the
   dead robot is added to `Scrap[]`.
5. **The player never occupies the same `Field` cell as a robot
   without dying.** This is a corollary of the collision rule.
6. **Robots respect field bounds** (`move_robs.c:68-75`); no
   wraparound.

## RNG Usage

Seed: `srand(getpid())` (`main.c:165`).
Primitive: `rand() % range` (`rnd_pos.c:69`).

| Site | Distribution | Effect |
|---|---|---|
| `make_level.c:80` — robot placement (per robot per level) | Uniform over empty cells via `rnd_pos()` | Places one robot |
| `make_level.c:92` — player initial placement (per level) | Uniform over empty cells | Places player |
| `move.c` (teleport handler) — `t` command | Uniform over empty cells | Sets player position |

## Scoring

| Event | ΔScore |
|---|---:|
| Any robot dies | +10 (via `add_score(ROB_SCORE)`; `robots.h:59`) |
| Advance to level 4 with `-a` (once per game) | +600 (`S_BONUS = 60 × ROB_SCORE`; `robots.h:61`) |
| Each robot death while `Waiting` | `Wait_bonus++`. On level clear, `add_score(Wait_bonus)` is applied (`play_level.c:113`). |

**Maximum score:** unbounded. In practice, limited by how long the
player can survive the increasing robot count (capped at 40 per
level, but every level adds pressure).

## Termination Conditions

1. **Player death:** `Dead = TRUE`. Print `AARRrrgghhhh....`. Show
   scores. Optionally start another game.
2. **Player quits (`q`):** Print no epitaph; skip to score summary.
3. **Fatal signal (`SIGINT`):** Call `quit(0)`. No score save.

The game never ends by winning; only by dying, quitting, or signal.

## Not in Scope for the Port

- The `FANCY` compile-time modes (`pattern_roll`, `stand_still`).
- The `Real_time` mode (`-r`) using `SIGALRM` — reimplement using a
  proper timer loop.
- The exact binary format of `robots.scores`; the port uses a
  different persistence backend (see [`port-ideas.md`](./port-ideas.md)).
- K&R function signatures.

## Ambiguities in the Original

- **Wait bonus size.** The man page says "10% for each robot which
  died after you decided to wait." The code (`move_robs.c:94-95`)
  increments `Wait_bonus` by 1 per robot death while waiting, and
  then `play_level.c:113` calls `add_score(Wait_bonus)` — giving +1
  per robot, not +10%. The port will document whichever
  interpretation is chosen in `diff-log.md`.
- **`>` do-nothing safety.** The man page says "do nothing for as
  long as possible" — presumably meaning "until moving would kill
  you." The exact semantics from the source: it stops one turn
  before a robot would land on you.

## See Also

- [`architecture.md`](./architecture.md) — the code that implements
  this spec.
- [`test-scenarios.md`](./test-scenarios.md) — how we verify this
  spec in the port.
