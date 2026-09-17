# `atc` — Reverse Specification

> Implementation-independent specification of `atc`'s mechanics,
> extracted from the original C source (`main.c`, `update.c`,
> `struct.h`, `grammar.y`).

This document is the contract that `src/` and `tests/` must honour.

Upstream source (not redistributed):
<https://github.com/vattam/BSDGames/tree/master/atc>

---

## Objective

- **Win condition:** none. The game is endless survival.
- **Lose conditions** (any triggers game-over):
  1. Any two air planes end a tick within 1 unit in all three axes
     (collision).
  2. Any plane's `fuel` decrements below 0.
  3. Any plane exits the arena border through a location that
     isn't its destination exit.
  4. Any plane leaves through its destination exit but not at
     altitude 9 (9,000 ft).
  5. Any plane lands at its destination airport but flying the
     wrong direction.
  6. Any plane lands at an airport that isn't its destination.
  7. Any plane exits through the destination when its destination
     was an airport (i.e. exits instead of lands).
  8. Any plane's altitude exceeds 9,000 ft.
  9. Any plane's altitude reaches 0 outside an airport.
- **Success is measured by:** number of planes safely delivered
  (`safe_planes` counter).

## State Variables

### Per-Playfield (Loaded from Game File)

| Variable | Type | Range | Set by | Persisted |
|---|---|---|---|:---:|
| `sp->update_secs` | int | ≥ 1 | Playfield `update` param | via game file |
| `sp->newplane_time` | int | ≥ 1 | Playfield `newplane` param | via game file |
| `sp->width` | int | ≥ 3 | Playfield `width` param | via game file |
| `sp->height` | int | ≥ 3 | Playfield `height` param | via game file |
| `sp->exit[]` | array of SCREEN_POS | on border | Playfield | via game file |
| `sp->beacon[]` | array of SCREEN_POS | inside border | Playfield | via game file |
| `sp->airport[]` | array of SCREEN_POS | inside border | Playfield | via game file |
| `sp->line[]` | array of LINE | anywhere | Playfield | via game file |

### Per-Session (Runtime)

| Variable | Type | Range | Initial | Persisted |
|---|---|---|---|:---:|
| `clck` | int | ≥ 0 | 0 | no |
| `air` | doubly-linked list of PLANE | 0..26 nodes | empty then 1 plane | no |
| `ground` | doubly-linked list of PLANE | 0..26 nodes | empty | no |
| `safe_planes` | int | ≥ 0 | 0 | to score file at end |
| `start_time` | time_t | | `time(NULL)` | no |
| `test_mode` | int | 0 or 1 | 0 | no |
| Score file entries | SCORE[] | | as loaded | yes |

### Per-Plane

| Variable | Type | Range | Set by |
|---|---|---|---|
| `plane_no` | int | 0..25 | `next_plane()` (unused letter) |
| `plane_type` | int | 0 (prop) or 1 (jet) | `random() % 2` |
| `orig_type`, `orig_no` | int, int | T_EXIT or T_AIRPORT, index | Random with collision-avoidance |
| `dest_type`, `dest_no` | int, int | Same | Random, different from origin |
| `altitude` | int | 0..9 | 7 (exit-entry), 0 (airport) |
| `new_altitude` | int | 0..9 | Same as altitude at spawn |
| `dir` | int | 0..7 | Origin's direction |
| `new_dir` | int | 0..7 or MAXDIR+ (circle) | Same as dir at spawn |
| `xpos`, `ypos` | int, int | 0..width-1, 0..height-1 | Origin's coords |
| `fuel` | int | 0..width+height | `sp->width + sp->height` |
| `status` | enum | S_MARKED, S_UNMARKED, S_IGNORED, S_GONE | S_MARKED at spawn |
| `delayd` | int | 0 or 1 | 0 |
| `delayd_no` | int | beacon index | undefined until delayd=1 |

## Actions / Commands

Grammar highlights (see `grammar.y` for full BNF):

### Immediate Commands

| Syntax | Semantic |
|---|---|
| `<plane> a <n>` | Set `new_altitude` = n |
| `<plane> ac <n>` | Set `new_altitude` = altitude + n |
| `<plane> ad <n>` | Set `new_altitude` = altitude - n |
| `<plane> m` | Set `status` = S_MARKED |
| `<plane> i` | Set `status` = S_IGNORED |
| `<plane> u` | Set `status` = S_UNMARKED |

### Delayable Commands (may be followed by `ab <n>` or `@b <n>`)

| Syntax | Semantic |
|---|---|
| `<plane> c[l\|r]` | Set `new_dir` = MAXDIR (circle) |
| `<plane> t <dir>` | Set `new_dir` = absolute direction |
| `<plane> t[l\|-] <dir>` | Set `new_dir` = dir - delta |
| `<plane> t[r\|+] <dir>` | Set `new_dir` = dir + delta |
| `<plane> tL` | Set `new_dir` = dir - 2 (hard left = -90°) |
| `<plane> tR` | Set `new_dir` = dir + 2 |
| `<plane> tta <n>` | Set `new_dir` = toward airport n |
| `<plane> ttb <n>` | Set `new_dir` = toward beacon n |
| `<plane> tte <n>` | Set `new_dir` = toward exit n |
| `<plane> tt* <n>` | Same as ttb |
| `... ab <n>` | Set `delayd=1, delayd_no=n` |
| `... @b <n>` | Same |

### Meta-Commands

- `?` — Print valid next tokens at current parse state (completion).
- Backspace — Delete last input character.
- Enter with empty input — Force immediate update tick.

## Turn Order (Per SIGALRM Tick)

Precisely (from `update.c:55-219`):

1. `clck++`.
2. `erase_all()` — clear radar.
3. **Ground-to-air promotion:** for each ground plane with
   `new_altitude > 0`, move to `air` list.
4. **For each plane in air (in list order):**
   1. If `plane_type == 0` (prop) AND `clck & 1` (odd clock) → skip.
   2. `fuel--`; if `fuel < 0` → LOSER "ran out of fuel."
   3. `altitude += SGN(new_altitude - altitude)`.
   4. If not delayed:
      - `dir_diff = new_dir - dir` (modulo MAXDIR handling)
      - `dir_diff = clamp(dir_diff, -2, +2)`
      - `dir = (dir + dir_diff + MAXDIR) mod MAXDIR`
   5. Move: `xpos += displacement[dir].dx; ypos += displacement[dir].dy`.
   6. If delayed AND `(xpos, ypos) == beacon[delayd_no]`:
      - `delayd = 0`; if `status == S_UNMARKED` set `S_MARKED`.
   7. Destination check:
      - If dest is AIRPORT and position matches and altitude=0:
        - If dir matches airport's dir → `status = S_GONE`.
        - Else → LOSER "landed in the wrong direction."
      - If dest is EXIT and position matches:
        - If altitude=9 → `status = S_GONE`.
        - Else → LOSER "exited at the wrong altitude."
   8. Crash checks:
      - If `altitude > 9` → LOSER "exceded flight ceiling."
      - If `altitude <= 0`:
        - If any airport at (xpos, ypos):
          - If dest_type = AIRPORT (wrong one) → LOSER "landed at wrong airport."
          - Else → LOSER "landed instead of exited."
        - Else → LOSER "crashed on the ground."
      - If out of bounds:
        - If any exit at (xpos, ypos):
          - If dest_type = EXIT (wrong one) → LOSER "exited via the wrong exit."
          - Else → LOSER "exited instead of landed."
        - Else → LOSER "illegally left the flight arena."
5. **Sweep gone:** delete every S_GONE plane; `safe_planes++`.
6. `draw_all()` — repaint.
7. **Collision:** for each pair `(p1, p2)` in air, if `too_close(p1, p2, 1)`
   → LOSER (both crash but game-over on first).
8. **New plane roll:** if `rand() % newplane_time == 0`, call
   `addplane()`.

## Rules & Invariants

1. **Time is discrete.** Ticks fire from `SIGALRM`; between ticks
   the game state is frozen.
2. **Player commands mutate `new_altitude`, `new_dir`, `status`,
   `delayd`, `delayd_no` only.** They never mutate `altitude`,
   `dir`, `xpos`, `ypos` directly.
3. **Rate limits:** altitude changes by exactly 1 per tick;
   direction by up to 2 per tick.
4. **Prop planes tick every other update.** Jet planes every tick.
5. **Fuel = width + height at spawn.**
6. **Enter altitude = 7; exit altitude = 9; land altitude = 0.**
7. **Collision = |Δaltitude| ≤ 1 AND |Δx| ≤ 1 AND |Δy| ≤ 1.**
8. **Maximum 26 concurrent planes** (letters A-Z / a-z).
9. **Spawn is retried on adjacency** — origin must be > 4 away
   from any existing plane. Up to `num_starts` retries.

## Difficulty Levels & Setup Configuration

### Playfield DSL

The playfield file syntax:

```
update    = <int>;    # seconds between ticks
newplane  = <int>;    # geometric mean interval between spawns
width     = <int>;    # arena width
height    = <int>;    # arena height

exit:    ( x y dir ) ( x y dir ) ... ;
beacon:  ( x y ) ( x y ) ... ;
airport: ( x y dir ) ( x y dir ) ... ;
line:    [ (x1 y1) (x2 y2) ] [ (x1 y1) (x2 y2) ] ... ;
```

- Direction letter one of `qwedcxzas`.
- Coordinates 0-indexed.
- Exits must lie on the border.
- Beacons and airports must lie inside the border.
- Lines must be horizontal, vertical, or exactly diagonal.
- Comments begin with `#`.

### Difficulty Table (17 Shipped Playfields)

Every playfield sets its own update/newplane/width/height + arena
layout. Difficulty range:

| Playfield | Character |
|---|---|
| `easy` | Beginner |
| `novice` | Intermediate-friendly |
| `default` | Reference |
| `crossover`, `crosshatch`, `box`, `two-corners`, `airports` | Puzzle |
| `game_2`, `game_3`, `game_4`, `Tic-Tac-Toe` | Experimental |
| `Killer`, `OHare` | Hard |
| `Atlantis` | Notoriously hard |

### Setup Validation

- `read_file(name)` calls `yyparse()` on the playfield file.
- If yacc rejects, exit with error.
- If any exit is not on the border, or any beacon/airport is on
  the border, yacc semantic checks fail (see `grammar.y`).
- If the game name is not in `Game_List`, run in `test_mode = 1`
  (no scoring).

### CLI Flags

| Flag | Effect |
|---|---|
| `-l` | Print `Game_List` contents; exit. |
| `-s` / `-t` | Print score file; exit. |
| `-p` | Print games directory path; exit. |
| `-g <name>` / `-f <name>` | Load `<name>` playfield. |
| `-r <seed>` | Seed `srandom(seed)`. Non-deterministic due to signal timing. |
| `-u` / `-?` | Usage; exit. |

### Session Replay

- **Same seed on relaunch:** deterministic RNG sequence, but
  real-time (`SIGALRM`) timing is subject to kernel scheduling
  and terminal I/O — replay is NOT bit-exact.
- **No save/load mid-game.** Session ends when the game ends.

## RNG Usage

Seed: `srandom(seed)` where seed defaults to `time(NULL)` or
`-r <n>`.

| Site | Distribution | Effect |
|---|---|---|
| `update.c:213` — per-tick spawn roll | Uniform `[0, newplane_time)` | `== 0` → spawn attempt |
| `update.c:312` — new plane type | Uniform `{0, 1}` | 0=prop, 1=jet |
| `update.c:315` — destination selection | Uniform `[0, num_exits + num_airports)` | Splits into exit/airport |
| `update.c:328` — origin selection | Uniform `[0, num_starts) \ {dest}` | Rejects self-loops; retries on adjacency |

## Scoring

- `safe_planes` = number of planes whose `status` reached `S_GONE`
  (delivered correctly).
- Recorded on game-over with: player name (from `getpwuid`),
  hostname, game name, planes safe, time (ticks), real_time
  (wall seconds).
- Score file lock-protected; sorted by `planes safe` descending,
  ties by `real_time` ascending.
- `-s` / `-t` prints the score list.

## Termination Conditions

- **Loss:** any of the 9 losing conditions in §Objective.
- **User quit:** SIGINT (`^C`), SIGQUIT — score saved on exit.
- **Hangup:** SIGHUP, SIGTERM — score saved (`log_score_quit`).
- **Not permitted:** SIGTSTP, SIGSTOP (ignored).

## Not in Scope for the Port

- **`yacc`/`lex` binaries** — port uses modern parsers.
- **Signal-driven game loop** — port uses async runtime or thread.
- **Exact `-r` seed reproduction** — kernel timing doesn't
  reproduce; port provides deterministic replay via input log.
- **`Game_List` file format** — port uses directory scan or
  built-in table.
- **`setregid` privilege drop** — irrelevant on modern non-setgid
  binaries.

## Ambiguities in the Original

- **Direction values `MAXDIR` and `MAXDIR + 1` in `new_dir`
  represent "circle."** But which value means clockwise vs
  counter-clockwise? Verify against `command()` output in
  `update.c:236-238`.
- **`dir_deg()` in `update.c:404-419`** maps direction 0..7 to
  compass degrees (0, 45, 90, ...). But the man page describes
  "s" as one of the direction keys — check `lex.l` for what "s"
  maps to.
- **Fuel formula `p.fuel = sp->width + sp->height`** — for tiny
  test maps this could be dangerously small. Port should
  document minimum sane sizes.

## See Also

- [`architecture.md`](./architecture.md).
- [`test-scenarios.md`](./test-scenarios.md).
