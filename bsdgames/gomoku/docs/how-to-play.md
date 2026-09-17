# How to Play `gomoku`

> Rules, controls, and strategy.

---

## Objective

Be the first to place five of your stones in an unbroken line —
horizontal, vertical, or diagonal — on the 19×19 grid.

## Starting the Game

```
$ gomoku [-bcdu] [-D debugfile] [inputfile]
```

Common invocations:

- `gomoku` — play against the computer.
- `gomoku -u` — user-vs-user hot-seat.
- `gomoku -c` — watch the computer play itself (self-test).
- `gomoku savefile` — resume a game saved earlier.

The game asks whether you want to play Black (moves first) or
White. Black is customarily the first mover in gomoku.

## Board

- 19 columns labelled `A` through `S` (skipping `I` to avoid
  confusion with `1`).
- 19 rows numbered `1` through `19`, bottom to top.

Sample entry: `K10` = column K, row 10 (the exact centre).

The first computer move is always **K10** (`pickmove.c:77-78`).

## Controls

Type a move as `<column><row>`, then Enter. Examples: `K10`,
`H8`, `S1`.

Special commands:

| Command | Effect |
|---|---|
| `quit` | End the game. |
| `resign` | Resign the game. |
| `save` | Save the current state to a file (prompts for name). |

## How to Win Against the AI

Gomoku strategy is about **forcing lines** — creating threats that
your opponent must block, chaining threats together so that you
create *two* forcing threats and they can only block one.

Core concepts:

1. **Open three** (`_XXX_`) — a three-in-a-row with both ends
   open. If not blocked, the opponent can turn it into an open
   four next move, which is winning.
2. **Open four** (`_XXXX_`) — an unblockable win.
3. **Closed four** (`XXXX_`) — one end open. Must be blocked or
   the opponent wins next turn.
4. **Double threat** — creating two threats simultaneously with
   one stone. Only one can be blocked. This is how most games are
   won.

The AI in this implementation understands all of these. To beat
it, you need to *chain* forcing moves.

## Tips & Tricks

- **Take K10** if you can. Central control matters most on an open
  board.
- **Look for your opponent's open threes early** — they compound
  fast.
- **Don't rush**: gomoku positions can look calm and then explode
  in three moves. Every move that isn't a forced response is a
  chance to build your own combo.
- **Diagonals are underrated** — the AI in this implementation
  weighs them equally, but human players often miss diagonal
  threats.

## Scoring

There is no numeric score — the game is win / lose / tie / resign.

## Difficulty / Levels

There is no explicit difficulty setting. The AI's depth is
implicitly bounded by the current move number (see
`pickmove.c:335` where `curlevel` is limited to `(movenum + 1) >> 1`).
Early game: shallower search. Mid-game: deepens automatically. This
is a nice performance trick — deeper search when it matters.

## Easter Eggs

Not particularly known. The debug mode (`-d`) prints internal
combo values that will look opaque unless you've studied
[`architecture.md`](./architecture.md).

If you compile with `DEBUG` defined, sending `SIGINT` invokes a
mini debugger (`whatsup()` in `main.c:355`) where you can:

- `p<coords>` — print the internal combo value at a spot.
- `s<b|w>` — ask the AI to suggest a move for either colour.
- `b` — back up one move.
- `f` — go forward one move.

Not really an easter egg — more of a developer tool that survived
to production.

## Common Pitfalls

- **Ignoring diagonal threats.**
- **Blocking with the wrong stone** — sometimes blocking creates
  a new threat *for the opponent*.
- **Forgetting the board is 19×19 not 15×15** — the classical
  Japanese Renju board is smaller. Some strategies that work on
  15×15 don't scale.

## See Also

- [`spec.md`](./spec.md) — formal rules.
- [`architecture.md`](./architecture.md) — AI internals.
