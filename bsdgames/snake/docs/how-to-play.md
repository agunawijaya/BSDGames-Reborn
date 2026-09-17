# How to Play `snake`

---

## Objective

Grab as much money as you can, then leave via the exit before the
snake eats you. Money in your pocket at time of exit = your score.
Getting eaten by the snake = zero score, no matter how much you
grabbed.

## Starting the Game

```
$ snake [-w width] [-l length] [-t]
```

Common invocations:

- `snake` — fills the terminal.
- `snake -w 40 -l 20` — smaller field (harder in some ways,
  easier in others).
- `snake -t` — "slow terminal" mode (fewer redraws).

Companion:

```
$ snscore    # list high scores without playing
```

## Screen Elements

| Char | Meaning |
|:---:|---|
| `I` | You |
| `S` | Snake head |
| `s` | Snake tail segments (there are 5) |
| `$` | Money (one at a time) |
| `#` | Exit |
| Border | Field wall |

Field: rectangle, size configurable via `-w`/`-l` or filling the
terminal.

## Controls

### Basic Movement (vi-keys + arrows)

| Key | Direction |
|:---:|---|
| `h` | left |
| `l` | right |
| `k` | up |
| `j` | down |
| Arrow keys | corresponding direction |
| `s`, `e`, `f`, `c` | keypad-style: L, U, R, D (around `d`) |

### Long Movement

| Key | Effect |
|:---:|---|
| `HJKL` (upper-case) | Move all the way toward the money's row or column — but stops when it hits it, and the snake still gets its turns |
| `SEFC` | Same idea, upper-case keypad variants |
| `ATPB` | Move to the four edges (mnemonic: keyboard positions) |
| `p` | "Point" — shows the direction you'd want to go for the money |

### Special

| Key | Effect |
|:---:|---|
| `x` | Quit (no score) |
| `w` | Spacewarp — teleport to escape tight squeezes. **Costs 10% of loot as penalty.** |
| Number prefix | Repeat next command that many times |

## How to Win

There is no game-total "win." Each round ends by either:

- Reaching the exit (`#`) — your money banks as score.
- Getting caught by the snake — score = 0.

To maximise:

1. Get money.
2. Don't die.
3. When you have enough, exit.

## Tips & Tricks

- **The snake moves once per your command.** If you type fast, the
  snake still only gets one move per key. But mistakes are
  expensive.
- **Long-move keys let the snake move as many times as needed.**
  `HJKL` might mean 15 moves for you *and* 15 for the snake. Don't
  use them if the snake is close.
- **The `p` (point) command is free intel.** Use it early when you
  don't know which way the money is.
- **The exit doesn't move.** Keep it in mind as your escape hatch.
- **Bonus digit.** After you finish, a random single digit is
  drawn. If your score's last digit matches, you get a bonus.
  Since you can end at a specific score by choosing when to exit,
  this is a small optimisation game-within-the-game.
- **Spacewarp is powerful.** 10% penalty is often a small price
  for surviving. Do the math: if you have $200 and 3 turns from
  death, warp; you keep $180 alive rather than $0 dead.
- **The snake gets hungrier as you get richer.** No — actually the
  game text says this but the mechanics are: the snake always
  chases at 1 square/turn. The "hungrier" line is flavour text.
  Riches only affect your penalty potential.

## Scoring

`cashvalue = chunk × (loot − penalty) / 25`

Where:

- `chunk = 675.0 / (i + 6) + 2.5` (rounded), `i = min(width, height)`.
- `loot` — total money picked up.
- `penalty` — amount lost to spacewarps (10% of loot each time).

Concretely:

| Screen size (min edge) | `chunk` per `$` |
|---:|---:|
| 12×12 | ~40 |
| 24×24 | ~25 |
| 48×48 | ~15 |

## Difficulty / Variants

- **`-t` slow mode** — designed for slow terminals; fewer redraws.
- **`-w`/`-l`** — smaller fields raise the tension.

There's no "levels" — one game, one attempt.

## Easter Eggs

- **The bonus digit** at end-of-game is a random draw. Line up
  your last score digit and win a bonus.
- **The pinball reference** in the man page ("As in pinball,
  matching the last digit of your score…") — a nod to the arcade
  culture of the day.
- **`snscore`** — the companion "wall of shame" utility.

## Common Pitfalls

- **`HJKL` with the snake nearby.** Long-move gives the snake
  many free turns.
- **Chasing money into a corner.** The snake can trap you against
  edges.
- **Spacewarp when you don't need it.** 10% wasted.
- **Not banking early.** Score = 0 if eaten, no matter how much
  money you were holding.

## See Also

- [`spec.md`](./spec.md) — formal rules.
- [`architecture.md`](./architecture.md) — how the snake AI works.
