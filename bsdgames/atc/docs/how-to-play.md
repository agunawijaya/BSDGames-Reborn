# How to Play `atc`

> Real-time. Command-driven. One-shot. Pay attention.

---

## Objective

Deliver every plane to its correct destination without letting any
of them:

- Collide (adjacent in altitude AND x AND y)
- Run out of fuel
- Exit through the wrong door
- Land at the wrong airport
- Land in the wrong direction
- Exceed 9,000 ft ceiling
- Crash into the ground (altitude 0 outside an airport)

You cannot win. You can only survive longer.

## Starting the Game

```
$ atc [-u?lstp] [-gf game] [-r seed]
```

| Flag | Effect |
|---|---|
| `-l` | List available playfields and exit |
| `-s` / `-t` | Show high scores and exit |
| `-p` | Print special games directory path |
| `-g <name>` / `-f <name>` | Play the named playfield |
| `-r <seed>` | Set the random seed (limited effect) |
| `-u` / `-?` | Usage and exit |

If no `-g` is given, the **first game** in `Game_List` is used
(usually `default`).

### 17 Playfields Available

- **`default`** — 30×21, 5s updates, new plane ~every 10 updates,
  8 exits, 2 beacons, 2 airports. Learn here.
- **`novice`, `easy`** — gentler.
- **`crossover`, `crosshatch`, `box`, `two-corners`, `airports`** —
  puzzle-style layouts.
- **`Killer`, `Atlantis`, `OHare`** — famously hard. Do not
  attempt until you've mastered `default`.
- **`Tic-Tac-Toe`, `game_2`, `game_3`, `game_4`** — experimental
  layouts.

## Reading the Radar

The screen has 4 regions:

1. **Radar** (top-left) — the arena
2. **Information** (right) — time, safe count, plane list
3. **Input** (bottom-left) — your command being typed
4. **Author** (bottom-right) — `ATC - by Ed James`

### Radar Glyphs

| Glyph | Meaning |
|:---:|---|
| `A`, `B`, `C`, … `Z` | **Prop planes** (uppercase, move every OTHER tick) |
| `a`, `b`, `c`, … `z` | **Jet planes** (lowercase, move every tick) |
| Digit next to plane | Altitude in thousands of feet |
| `0`, `1`, `2`, … along border | **Exit points** — labelled with number |
| `*<n>` | **Beacon** — reference points, used for delayed commands |
| `^<n>`, `v<n>`, `<<n>`, `><n>` | **Airport** — the arrow shows required approach/departure direction (`^` = north, `v` = south, etc.) |
| `+` | Guide line (visual only, no gameplay effect) |
| `.` | Empty space |

### Information Area

Example lines from the info panel:

```
B4*A0: Circle @ b1
g7 E4: 225
```

- `B4*A0: Circle @ b1` — Prop `B` at 4,000 ft, `*` = low fuel,
  destination Airport `0`. Next command: circle when reaching
  Beacon `1`.
- `g7 E4: 225` — Jet `g` at 7,000 ft, destination Exit `4`. Now
  turning to 225° (SW).

## Commands

Every command starts with a **plane letter** (case insensitive).

### Immediate Commands (execute next tick)

| Command | Effect |
|---|---|
| `a <n>` | **Absolute altitude** — climb/descend to n × 1,000 ft |
| `ac <n>` | **Climb relative** — up by n × 1,000 ft |
| `ad <n>` | **Descend relative** — down by n × 1,000 ft |
| `a+ <n>` | Same as `ac` |
| `a- <n>` | Same as `ad` |
| `m` | **Mark** — display highlighted |
| `i` | **Ignore** — display dim, no command line |
| `u` | **Unmark** — same as ignore but auto-mark on delayed-command execution |

### Delayable Commands (can be prefixed with a delay-at-beacon)

| Command | Effect |
|---|---|
| `c` / `cr` | **Circle right** (default) |
| `cl` | **Circle left** |
| `t <dir>` | **Turn to absolute direction** |
| `tl <dir>` | **Turn left** by `<dir>` (default: 45°) |
| `t- <dir>` | Same as `tl` |
| `tr <dir>` | **Turn right** by `<dir>` (default: 45°) |
| `t+ <dir>` | Same as `tr` |
| `tL` | **Hard left** (90°) |
| `tR` | **Hard right** (90°) |
| `tt<a\|b\|e\|*> <n>` | **Turn toward** airport / beacon / exit / (`*` = beacon) |

### Direction Keys

Direction is one of `q w e a s d z x c` arranged around `s`:

```
q w e
a s d
z x c
```

- Absolute: `w` = north (0°), `e` = NE (45°), `d` = east (90°),
  `c` = SE, `x` = south, `z` = SW, `a` = west, `q` = NW, `s` = ???.
- Relative: `w` = no turn, `e` = +45°, `q` = -45° (i.e. 45° left).

### The Delay Modifier

Append `ab <n>` or `@b <n>` to a delayable command to execute when
the plane reaches Beacon `<n>`. Both letters are for future
expansion.

Examples:

- `atlab1` — Plane A: turn left when reaching Beacon 1.
- `cc` — Plane C: circle now.
- `gtte4ab2` — Plane G: turn toward Exit 4 when reaching Beacon 2.
- `ma+2` — Plane M: climb 2,000 ft.
- `stq` — Plane S: turn to 315° (NW).
- `xi` — Plane X: ignore.

## The `?` Completion Trick

At any point while typing, hit `?`. The game lists the valid next
characters. Learning `atc`'s command grammar without `?` is
possible; learning it with `?` is *pleasant*.

## Turn Order Per Tick

1. Planes waiting at airports with new_altitude > 0 → moved to air
2. For each plane in air (props skipped on odd ticks):
   1. Fuel decrement (out-of-fuel = loser)
   2. Altitude adjust ±1,000 ft toward `new_altitude`
   3. Direction adjust up to 2 slots (90°) toward `new_dir`
   4. Position update by `displacement[dir]`
   5. Delay check at beacon
   6. Destination check (right airport at 0 altitude, right exit
      at 9,000)
   7. Crash checks (ceiling, ground, exit-wrong)
3. Collision check for every pair in air
4. New-plane roll: `rand() % newplane == 0` → spawn

**Pressing Enter with an empty command forces an immediate tick.**
Use to fast-forward when nothing is happening.

## How to Win (i.e. Survive)

### Rule 1 — Give altitude commands first

Planes enter at 7,000 ft. Exits require 9,000 ft. So *every* plane
needs `a9` before it can leave through an exit.

### Rule 2 — Type ahead

The command grammar is fast to type once memorised. Practice
touch-typing plane-letter + command as a single motor pattern.

### Rule 3 — Use delayed commands liberally

`atlab2` frees your attention. You're setting up the plane to turn
left at Beacon 2, then you can move to another plane. When Plane A
reaches Beacon 2, the turn happens automatically.

### Rule 4 — Ignore and mark strategically

Type `i` on planes whose plans are complete. They stop cluttering
your visual attention. Type `m` to bring them back to mind.

### Rule 5 — Landings first

Landing a plane (right airport, altitude 0, correct direction) frees
one worry. Descend early: `a0`. Type `tta<n>` to point at the
airport. Watch the direction match.

### Rule 6 — Don't panic when a new plane spawns

New planes always enter at 7,000 ft. You have several ticks before
they hit anything. Handle the immediate danger first.

## Tips & Tricks

- **Learn one playfield deeply.** `default` first, until you can
  handle 8-10 planes without panic.
- **Airports have direction.** `^0` = airport 0 faces north.
  Planes land AND take off in this direction. Get direction wrong
  → "landed in the wrong direction" → game over.
- **Beacons are your friends.** Every delay command needs a beacon
  reference. Learn beacon numbers by heart per playfield.
- **Low fuel (`*` in info) is not urgent** — it just means "less
  than LOWFUEL ticks remaining." You have runway. Plan the exit.
- **Empty-Enter fast-forward** is legal and useful when you've set
  up all delayed commands.

## Scoring

- **Primary score:** number of planes safely delivered.
- **Secondary stats:** total time, real time. Shown *for fun* only.
- Ties broken by real time (in favour of shorter).
- Scores displayed with `atc -s`, saved in a shared score file.
- **Playing a non-listed playfield disables scoring** (test mode).

There is no maximum score. There is no "you win." There is only how
long you lasted.

## Difficulty Modes & Configuration

`atc` has no difficulty flag — every difficulty knob is baked into
the **playfield file**. To play harder, choose a harder playfield:

```bash
atc -l                        # list all 17 playfields
atc -g Killer                 # try if you dare
atc -g easy                   # for humans
```

You can **write your own playfield**. See
[`architecture.md`](./architecture.md) §Playfield DSL — the yacc
grammar accepts the format documented in the man page. Custom
playfields don't record scores (test mode), but they're playable.

## Easter Eggs & Quirks

- **`?` command completion** — see above. Not exactly an egg, but
  delightful.
- **Author signature** — `ATC - by Ed James` permanently visible
  in the corner. Ed James signs his work loudly.
- **`SIGTSTP` / `SIGSTOP` ignored** — no Ctrl-Z pause. Deliberate.
- **`-r <seed>` "questionable"** — Ed's own comment in the man page.
- **The `BUGS` file** — Ed's honest four-line confession lives in
  the source tree. Preserved in this port's documentation as
  historical artefact.

## Common Pitfalls

- **Sending a plane the wrong direction to exit** — exits require
  a specific altitude (9,000 ft) but any horizontal direction.
  Only the altitude is enforced.
- **Landing the wrong way** — airports enforce direction. Match it
  or crash.
- **Ignoring `?`** — you cannot learn the grammar without it.
- **Not fast-forwarding** — dull ticks waste real time and slow
  your score-per-hour. Enter often.
- **Forgetting Killer/Atlantis exists** — DO NOT open Killer as your
  first game.

## See Also

- [`spec.md`](./spec.md) — the formal contract this manual mirrors.
- [`architecture.md`](./architecture.md) — how the game engine
  works under the hood.
