# How to Play `tetris`

> Manual + strategy guide. Covers: controls, objective, how to win,
> tips & tricks, scoring, and easter eggs.

---

## Objective

Fit the falling shapes together to form complete horizontal rows. Each completed row vanishes, and the rows above fall down. Keep the stack from reaching the top of the well for as long as possible while scoring points.

## Starting the Game

```
$ tetris
```

To start at a specific level or with custom keys:

```
$ tetris -l 5 -k 'jkl pq' -p
```

- `-l 5` starts at level 5 (faster fall).
- `-k 'jkl pq'` sets the six control keys.
- `-p` enables the next-piece preview.

*(Once the port exists, replace `tetris` with the port's launch command and add a screenshot from [`../media/`](../media/).)*

## Controls

Default keys (shown at the bottom of the screen during play):

| Key | Action |
|---|---|
| `j` | Move left |
| `k` | Rotate 1/4 turn counterclockwise |
| `l` | Move right |
| `<space>` | Drop the piece straight to the bottom |
| `p` | Pause (press `RETURN`/`Enter` to resume) |
| `q` | Quit |
| `Ctrl-L` | Redraw the screen |

All six action keys can be remapped with `-k`. They must be distinct.

## Playing

1. A shape appears at the top of the well and begins to fall.
2. Move it left or right and rotate it to fit gaps in the stack.
3. When the shape cannot fall any farther, it locks into place.
4. If a horizontal row becomes completely filled, it disappears and everything above drops down.
5. A new shape appears at the top. Repeat.
6. The game ends when a new shape cannot fit at the spawn position — the stack has reached the top.

## How to Win

There is no fixed win condition. The goal is to survive and maximize your score. Practical advice:

- **Keep the stack low.** A tall stack leaves no room to rotate pieces.
- **Leave a well on one side.** A vertical slot one column wide lets you drop the I-piece for a Tetris (four-line clear).
- **Plan one piece ahead.** If you are using `-p`, use the preview to decide where the current piece should go.
- **Use the drop key for points.** Dropping a piece from high up adds one point per row fallen.
- **Watch the speed.** The game accelerates continuously, not just per level. Eventually it will outpace you.

## Tips & Tricks

- **Rotation is one-direction only.** There is no clockwise rotation. Learn the counterclockwise orientations of each piece.
- **No wall kicks.** A rotation that would overlap anything is rejected. Position pieces in open space before rotating.
- **Flat tops are your friend.** Avoid creating jagged surfaces; flat tops make it easier to place the next piece.
- **The I-piece is rare and precious.** Save a single-column well for it when possible.
- **Pause is safe.** Press `p` if you need a moment; the game does not advance while paused.

## Scoring

| Action | Points |
|---|---|
| Lock a piece into the stack | +1 |
| Each row fallen during a drop | +1 |
| Final displayed score | `raw score × level` |

The original does **not** give extra points for clearing multiple lines at once. The only way to inflate your score is to play at a higher level and drop pieces from greater heights.

**Maximum score:** Unbounded in theory; in practice the game becomes too fast to continue.

## Difficulty Levels & Game Setup Configuration

### Difficulty Modes

Levels 1–9 set the initial fall speed:

| Level | Approximate fall interval |
|---:|---|
| 1 | 1,000 ms |
| 2 | 500 ms |
| 3 | 333 ms |
| 5 | 200 ms |
| 9 | 111 ms |

Higher levels also multiply your final score. Choose a level matching your reflexes.

### Setup Options & Gameplay Archetypes

- **Classic mode:** no preview (`tetris` with no `-p`). Harder, more nostalgic.
- **Modern helper mode:** enable preview (`tetris -p`) for easier planning.
- **Speedrun mode:** launch at level 9 (`tetris -l 9`) and see how long you survive.
- **Custom-key mode:** map controls to your preference with `-k`.

### Rematch & Replay Options

The original has no replay or rematch prompt. A modern port may add:
- **Instant restart** with the same level and keys.
- **Replay file** saving (seed + inputs) for sharing runs.

## Easter Eggs

- **IOCCC lineage.** The game itself is a cleaned-up International Obfuscated C Code Contest winner; the man page proudly notes this heritage.
- **The `/dev/null` check.** At startup the program opens `/dev/null` to verify descriptors 0–2 are open. This is unusual but historically documented behavior.
- **"Wasted serious amounts of time."** The original man page's deadpan description of why the highest score per level is kept forever.

## Common Pitfalls

- **Forgetting there is no clockwise rotation.** New players often try the wrong rotation key.
- **Expecting wall kicks.** A piece wedged against a wall usually cannot rotate.
- **Starting too high.** Level 9 is extremely fast on most terminals.
- **Ignoring the speed ramp.** Even level 1 eventually becomes frantic due to continuous acceleration.

## See Also

- [`spec.md`](./spec.md) — full mechanical specification.
- [`architecture.md`](./architecture.md) — how the original implements these mechanics.
- [`about.md`](./about.md) — history and cultural context.
