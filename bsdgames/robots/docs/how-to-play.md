# How to Play `robots`

> Manual + strategy guide. Covers: controls, objective, how to win,
> tips & tricks, scoring, easter eggs.

---

## Objective

Survive as many levels as possible by manipulating the robots into
killing themselves. When all robots on the field die, you advance to
a bigger level. You cannot "win" — the game continues until you die.

## Starting the Game

```
$ robots [-Asjtan] [scorefile]
```

Common invocations:

- `robots` — normal game from level 1.
- `robots -a` — advance mode: start at level 4 for a bonus.
- `robots -t` — auto-teleport when you would otherwise die.
- `robots -j` — jump mode: don't animate `run` movements (faster).
- `robots -A` — auto-bot demo: watch the computer play itself.
- `robots -s` — show the score file only, don't play.

## Screen Elements

| Char | Meaning |
|:---:|---|
| `@` | You |
| `+` | A robot |
| `*` | A scrap heap (dead robot) |
| ` ` | Empty square |

Field: 60 columns × 23 rows. Score displays at top-right.

## Controls

### Movement (single step)

Uses `vi`-style keys. Lower-case = one square.

| Key | Direction |
|:---:|---|
| `h` | left |
| `l` | right |
| `k` | up |
| `j` | down |
| `y` | up-left |
| `u` | up-right |
| `b` | down-left |
| `n` | down-right |
| `.` or Space | stay put for one turn |

### Movement (run)

Upper-case = "run as far as possible in that direction." Stops
short of danger.

| Key | Meaning |
|:---:|---|
| `HLKJYUBN` | Run in the corresponding direction |
| `>` | Do nothing for as long as safely possible |

### Special

| Key | Effect |
|:---:|---|
| `t` | **Teleport** to a random empty square |
| `w` | **Wait** until you die or all robots die |
| `q` | Quit |
| `^L` | Redraw screen |

All commands accept a numeric prefix: `5l` = "right, five times."

## How to Win a Level

There is no "win" of the whole game — only "survive the next level."
To survive a level, ensure every robot on the field dies without any
of them touching you.

Strategy fundamentals:

1. **Robots move deterministically.** Each turn, every robot moves
   one square in your direction (both x and y independently, sign-of-diff).
   So if you know your position and theirs, you know theirs next
   turn.
2. **Robots don't avoid each other.** If two robots would land on
   the same square, both die. If a robot would land on an existing
   scrap heap, it dies.
3. **Your job is geometry.** Position yourself so that when they all
   step forward, they collide with each other or with existing scrap
   heaps.

## Tips & Tricks

### The Diagonal Trick

If a robot is directly above you, moving up will just make it move
up too — no progress. Instead move diagonally (e.g. `u` = up-right)
and it may collide with a lateral neighbour.

### The Scrap Corridor

Once you have a scrap heap, it becomes a magnet: robots will happily
walk into it. Position yourself so the shortest line between the
robot and you passes through the heap.

### Wait for the Endgame

Once only 1–3 robots remain and you have a clear scrap-heap trap set,
press `w`. The robots march into the trap while you sit still, and
you collect a 10% bonus for each one that dies during your wait.
**But do not do this if you are exposed** — the wait ends by *you
dying* just as gladly as by them all dying.

### The Advance Bonus

Skipping levels with `-a` gives you a one-time 600-point bonus but
starts you on the harder level 4. Worth it if you're confident.

### When to Teleport

Teleporting is a last resort. It lands you on a random empty square
with no consideration for safety. Use `-t` (auto-teleport) to make
the game teleport you only when you *would otherwise* certainly die.

## Scoring

| Event | Points |
|---|---:|
| One robot dies (any cause) | +10 |
| Advance bonus (with `-a` flag, one-time) | +600 |
| Wait bonus | +1 per robot that died during the wait, per robot that had died before you started waiting, ×10% ratio (see below) |

**Wait bonus formula:** During a `w`, each robot death increments
`Wait_bonus` by 1. If you survive to the next level, you get
`Wait_bonus × 10%` bonus... actually the code adds `Wait_bonus`
directly to score (each `add_score(ROB_SCORE)` also does
`Wait_bonus++` if `Waiting`; see `move_robs.c:94-95`), giving
effectively a +1 bonus per robot per wait — the man page frames it
as 10%.

**Maximum score** is unbounded — the game continues until you die.
Only your top scores make it into `robots.scores`.

## Difficulty / Levels

- Level N has `min(N × 10, 40)` robots (cap set by `MAXROBOTS = 40` in
  `robots.h:58`).
- Level 1 has 10 robots. By level 4, the field is at max capacity.
- Advance mode (`-a`) skips directly to level 4.

## Easter Eggs

The `FANCY` compile-time option enables two special score-file
modes, activated by naming the score file specially:

- **`pattern_roll`** — the game plays a specific pattern-based
  strategy for the auto-bot.
- **`stand_still`** — the auto-bot never moves.

These are barely-documented easter eggs from Christos Zoulas'
autobot contribution. See `main.c:88-99`.

## Common Pitfalls

- **Cornered by 2 robots on non-parallel diagonals.** No move
  saves you; every square gets a robot. Teleport or die.
- **The `.` do-nothing command in dangerous positions.** Robots
  still get to move. Do nothing when they will collide, not when
  they will reach you.
- **The `w` command in an unsafe spot.** It commits you until
  everything resolves.
- **Ignoring the field boundary.** Robots that would leave the
  field are clamped to the edge (`move_robs.c:68-75`) — they don't
  wrap. This means you can herd them into corners.

## See Also

- [`spec.md`](./spec.md) — full mechanical specification.
- [`architecture.md`](./architecture.md) — how the AI and RNG
  actually work.
- [`../../docs/decisions/`](../../docs/decisions/) — root ADRs
  affecting all games.
