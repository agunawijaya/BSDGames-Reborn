# How to Play `sail`

> Command a Napoleonic-era wooden warship. Hold the weather gage.
> Rake your enemy. Board and take the prize.

---

## Objective

Depends on scenario. Generally: **cripple or capture the enemy
ships**. Points awarded per ship sunk, captured, or destroyed.

## Starting the Game

```
$ sail [-s [-l]] [-x] [-b] [num]
```

Flags:

- `-s` — show top ten sailors and exit
- `-l` — show login names (only with `-s`)
- `-x` — play the first available ship
- `-b` — no bells
- `num` — start on scenario number

## Setup Flow

1. Game shows list of **32 scenarios** with ship counts and
   status.
2. Type scenario number.
3. Game shows ships available; type ship number to command.
4. Game forks driver process (first player only) to run
   computer ships.
5. Play begins.

## Reading the Screen

- **Sea grid** with ships drawn as 2-char pairs.
- **Ship representation:** `<nation><number>` — first char is
  nationality (b/f/s/a/etc.), second is ship number 0-9.
- **Full sails:** uppercase nation letter (`F0` = French with
  full sails).
- **Surrendered:** `!0`.
- **Sinking:** `~0`.
- **On fire:** `#0`.
- **Captured:** nation of captor; number becomes `&`, `'`, `(`,
  `)`, `*`, or `+`.

### Wind Vane (side of screen)

```
        |
        3
        +
```

- **Number** = wind speed 0-7 (becalmed to hurricane).
- **`+/-`** = wind direction. Wind blows from `+` to `-`.

### Ship Status Pane (side of screen)

```
Load  D! R!
Hull  9
Crew  4  4  2
Guns  4  4
Carr  2  2
Rigg  5 5 5 5
```

- **Load**: port / starboard shot type (`R`=round, `D`=double,
  `C`=chain, `G`=grape). `!` = initial (loaded before battle).
  `*` = still loading.
- **Hull** points.
- **Crew** sections (each with health).
- **Guns** port / starboard.
- **Carr** = carronades port / starboard.
- **Rigg** = rigging health per mast (3 or 4 masts).

### Direction Rose (side of screen)

Shows your possible movements at each wind attitude:

```
         0 1(2)
        \|/
        -^-3(6)
        /|\
         | 4(7)
        3(6)
```

Battle-sail speeds first; full-sail speeds in parens. Facing into
the wind = 0 (in irons).

## Movement Commands

At the `move` prompt, e.g., `move (7, 4):`

- **First number** (7) = max total moves including turns
- **Second number** (4) = max turns
- **Optional `'`** = ship is drifting, must move forward before
  turning

### Movement Grammar

Strings of turns + forward moves:

- **`3`** = 3 forward
- **`l`** = left turn
- **`r`** = right turn
- **`l3`** = left, then 3 forward
- **`r1r1r2`** = right, 1 forward, right, 1 forward, right, 2 forward
- **`d`** = drift (do nothing)

Ship can turn to any of 8 compass headings. Turning stern-first
(bow stationary).

### Wind Penalty

Turning closer to the wind reduces your remaining move
allowance. Turning **into** the wind stops movement immediately
with error `Movement Error; Helm: <partial>`.

## Combat Commands

### Load Shot

Before firing, load your broadsides with a shot type. Types:

| Shot | Range | Effect |
|---|---:|---|
| **round** | 10 | General purpose; hull or rigging |
| **double** | 1 | Extra good hull/rigging; 2 turns to load |
| **chain** | 3 | Rigging only; excellent for demasting |
| **grape** | 1 | Crew slaughter |

### Fire

- **Broadside** — fires both guns and carronades on chosen side.
- **Target hull, rigging, or crew** (limited by range).
- Range > 6 = only rigging allowed.

### Rake

Fire down the length of enemy ship (bow-to-stern axis):

- **Stern rake** — much more damage than bow rake.
- Multiplier applied to broadside effect.

### Boarding

- **Grapple** enemy ship first (or become fouled by collision).
- **Send boarding parties** — cost lives.
- **Defensive boarding parties** fight 2x harder than
  unorganized crew.
- Crew quality matters enormously in boarding.

## Crew Quality

5 tiers, historical accuracy:

| Tier | Damage Modifier |
|---|---|
| **Elite** | +1 hit per broadside vs. Mundane |
| **Crack** | slightly less than Elite |
| **Mundane** | baseline |
| **Green** | below average |
| **Mutinous** | catastrophic |

Americans historically had best crews (higher pay drew British
defectors); British had best training. Some scenarios preserve
this.

## Ship Classes

| Class | Guns | Notes |
|---|---|---|
| **First Rate** | 80-136 | 3 decks; the pride of the fleet |
| **Ship of the Line** | 74 (typical) | The workhorses; fought in line-of-battle |
| **Razee** | 40-64 | Cut-down ship of the line; underwhelming |
| **Frigate** | 32-44 | Fast, versatile; "eyes of the fleet" |
| **Corvette** | up to 30 | Small; carries dispatches |
| **Sloop / Brig** | <20 | Auxiliary |

## Wind and Weather

- **Wind speed 0-7:** 0=becalmed, 7=hurricane.
- **Hurricane destroys all ships** (a rare event).
- **Sea state** affects fire accuracy — high seas (5-6) prevent
  lower gun ports from opening on ships of the line; advantages
  frigates.

## Repairs

- Hull, guns, rigging repair at **2 points per 3 turns**.
- Cannot repair below 0.
- "Repairs Completed" when finished.
- **Computer ships never repair** (per man page).

## Tips & Tricks

1. **Type ahead.** With 7-second poll, always have a command
   queued.
2. **Only the last command in a poll interval is seen** —
   don't spam.
3. **Keep the weather gage.** Windward is the tactical advantage.
4. **Fire double shot for initial broadsides** — the extra-
   lethal opener.
5. **Load chain for demasting** — cripples enemy mobility.
6. **Boarding is expensive** — count lives.
7. **Watch for storms** — high seas favour frigates.
8. **Rake whenever possible** — bow or stern.
9. **Battle sails are safer** — full sails mean 2x rigging
   damage.
10. **Drift is a valid move** — sometimes doing nothing
    prevents disaster.

## Scoring

- Points per ship sunk, captured, or on fire.
- Scenario-dependent.
- Top ten sailors: `sail -s`.
- With login names: `sail -s -l`.

## Difficulty Modes

No explicit difficulty. Determined by scenario + ship choice +
opponent quality (human vs. computer).

## Easter Eggs

- **Scenario 31: Star Trek.** Absurdist inclusion.
- **Scenario 28: Voyage to the Bottom of the Sea.** Fictional.
- **Riggle's `sail.6` opinions** — reads like an essay, with
  personal favorites (C.S. Forester, Alexander Kent).
- **"Riggle Memorial Structures"** — deeply-nested struct chains
  jokingly named after the author.

## Common Pitfalls

- **Ignoring the wind.** Sailing into wind = becalmed.
- **Being drifted.** Two turns without forward = drift; must
  move ahead before major turn.
- **Full sails in gale** — takes double rigging damage.
- **Boarding a full-crew ship with a depleted crew.**
- **Ignoring the 7-second poll delay** — feels slow but has
  reason.
- **Firing at 6+ range without loading round or chain.**

## See Also

- [`spec.md`](./spec.md) — formal rules.
- [`architecture.md`](./architecture.md) — how the multi-process
  engine works.
