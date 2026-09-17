# `sail` — Reverse Specification

> Implementation-independent specification of `sail`'s mechanics,
> extracted from the man page and source overview.

Upstream source (not redistributed):
<https://github.com/vattam/BSDGames/tree/master/sail>

---

## Objective

Scenario-specific. Generally: cripple, capture, or destroy enemy
ships. Points per outcome.

## State Variables

### Per-Game

- **Scenario** (1-32).
- **Wind speed** (0-7).
- **Wind direction**.
- **Turn count**.
- **Shared tempfile** state.

### Per-Ship

- **Nation** (character: b, f, s, a, ...).
- **Number** (0-9).
- **Position** (x, y).
- **Facing** (0-7 compass).
- **Sail state** — battle / full.
- **Hull points** (max varies by ship class).
- **Rigging** — per mast (3 or 4 masts).
- **Guns** — port / starboard sections.
- **Carronades** — port / starboard.
- **Crew** — 3 sections with health.
- **Crew quality** — Elite / Crack / Mundane / Green / Mutinous.
- **Load** — shot type per broadside (port / starboard).
- **Load state** — ready / loading / initial.
- **Boarding parties** — offensive / defensive count.
- **Fouled with** — reference to fouled ship (if any).
- **Grappled with** — reference to grappled ship (if any).
- **Status** — active / surrendered / sinking / on-fire / captured.
- **Captor nation and number** (if captured).
- **Repairs pending** — hull / guns / rigging counters.

## Actions / Commands

### Movement (at `move` prompt)

Command string grammar:

- Digit = forward that many squares
- `l` = left turn
- `r` = right turn
- `d` = drift (no move)

Move allowance = (max moves, max turns) shown in prompt.

Turning into wind aborts with error.

### Combat

- **`f`** or similar — fire broadside.
- Load new shot type.
- Grapple, board, fight actions (subcommands).

### Meta

- **`q`** — quit.
- **Various** — help, redraw, find ship, window movement.

## Rules & Invariants

1. **Bow stays stationary during turn.** Stern pivots.
2. **Ship cannot sail into wind.** Facing wind = 0 speed.
3. **After 2 turns without forward movement, drift starts.**
4. **Drifted ships must move forward before major turns.**
5. **Turning closer to wind reduces remaining move allowance.**
6. **Full sails = 2x speed, 2x rigging damage taken.**
7. **Battle sails = normal speed and damage.**
8. **Rake damage** (bow-to-stern axis) multiplies broadside
   effect.
9. **Stern rakes hit harder than bow rakes.**
10. **Range > 6 = rigging shots only** (not hull).
11. **Elite crews +1 broadside hit** vs. Mundane.
12. **Double shot takes 2 turns to load.**
13. **Repairs at 2 points per 3 turns.**
14. **Cannot repair below 0.**
15. **Computer ships never repair.**
16. **Hurricane (wind 7) destroys all ships.**
17. **High seas (5-6) prevent ships of the line from opening
    lower gun ports.**
18. **Only last command in a poll interval is seen by driver.**

## RNG Usage

Seed: `srand(time(NULL))` at startup.

Sites:

| Site | Distribution | Effect |
|---|---|---|
| Damage roll | Weighted by range, crew quality, guns | Actual hits |
| Fire spread | Chance per turn if hulled | Sinking / burning |
| Weather change | Every N turns | Wind speed/direction shift |
| Boarding resolution | Weighted by crew + parties | Casualty count |
| AI captain decision | Random within rule constraints | Move/fire/board |
| Load quirks | Small | Initial vs. later broadside effectiveness |

## Difficulty Levels & Setup Configuration

### CLI Flags

- `-s` — show scoreboard.
- `-l` — with `-s`, show logins.
- `-x` — auto-play first available ship.
- `-b` — no bells.
- `num` — start on scenario `num`.

### Scenario Selection

32 scenarios enumerated in scenario table. Each specifies:

- Ship count (2 to 10).
- Ships (class, nation, number, crew quality).
- Starting positions.
- Wind conditions.
- Player-vs-computer mix policy.

### Setup Validation

- Scenario number must be 1-32.
- Ship number must exist in chosen scenario.
- Ship must be available (not already claimed by another
  player).

### Session Replay

- No save/load mid-scenario.
- Scoreboard persists across scenarios (top ten sailors).
- Tempfile is deleted at scenario end.

## Scoring

- Ships sunk: points per class.
- Ships captured: points per class + prize bonus.
- Ships on fire (destroyed): points.
- Scenario-specific victory conditions may add multipliers.
- Top ten sailors: `sail -s`.

## Termination Conditions

- **Ship sunk**: hull = 0 → sinking → destroyed.
- **Ship surrenders** ("strikes colors"): after being battered
  into listing hulk.
- **Ship on fire**: random chance at listing hulk stage;
  explodes eventually.
- **Ship captured**: nation and number change to captor.
- **Scenario ends** when all opposing ships are neutralized.
- **Hurricane**: all ships destroyed.
- **Player quit**: `q` command.

## Not in Scope for the Port

- **`link()`-based locking** — replace with proper locks.
- **7-second poll cycle** — replace with real-time or
  configurable.
- **`fsck`-recoverable lock leaks** — port must be robust.
- **Version 7 Unix constraints** — irrelevant.
- **Integer-only math for angles** — modernize.
- **Tempfile in `/tmp/#sailsink.NN`** — replace with proper
  session storage.

## Ambiguities in the Original

- **Ed Wang's `angle()`**: *"still doesn't work perfectly"*.
  Modern port should reverse engineer and formalize.
- **`Riggle Memorial Structures`** access patterns — deeply
  nested but functional.
- **Load-state transitions** — some edge cases not fully
  documented.
- **Boarding resolution formulas** — approximate in man page.

## See Also

- [`architecture.md`](./architecture.md).
- [`test-scenarios.md`](./test-scenarios.md).
