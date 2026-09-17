# How to Play `dab`

`dab` is the terminal version of Dots and Boxes.

---

## Controls / Commands

```
dab [-a] [-w] [-n ngames] [-p <c|h><c|h>] [xdim [ydim]]
```

| Flag | Meaning |
|---|---|
| `-a` | Don't use the terminal's alternate character set. |
| `-w` | Wait for a key press between games. |
| `-n ngames` | Play this many games in a row (useful with `-p cc`). |
| `-p cc/hh/ch/hc` | Choose human (`h`) or computer (`c`) for each player. |
| `xdim ydim` | Board size in boxes. Default is `3 3`. |

### In-Game Keys

| Key | Action |
|---|---|
| `h` / `j` / `k` / `l` | Move cursor left / down / up / right. |
| `u` | Move diagonally right-up. |
| `y` | Move diagonally left-up. |
| `b` | Move diagonally left-down. |
| `n` | Move diagonally right-down. |
| `Space` | Draw the edge under the cursor. |
| `Ctrl-L` / `Ctrl-R` | Redraw the screen. |
| `q` | Quit. |

## How to Win

Complete the fourth side of more boxes than your opponent. Each box is
worth one point. The player with the most points when the board is full
wins.

## Tips & Tricks

- **Chain control:** Try to force your opponent to open long chains
  for you.
- **Double-cross:** In advanced play, sacrifice two boxes to keep
  control of a larger chain.
- **Extra turns:** Every box you complete gives you another move; plan
  sequences that let you close multiple boxes in one turn.
- **Small boards:** A 3x3 board is fast and tactical; larger boards
  reward long-term planning.

## Scoring Mechanism

- One point per completed box.
- Final score is displayed at game end.
- Match totals are tracked when `-n` is used.

## Easter Eggs

None documented. The alternate character set draws slightly prettier
borders if your terminal supports it.

## Difficulty Levels & Setup Configuration

| Setup | Command |
|---|---|
| Human vs computer (default) | `dab` |
| Two humans | `dab -p hh` |
| Computer vs computer demo | `dab -p cc -w -n 5` |
| Larger board | `dab 5 5` |

Future ports might add AI difficulty levels, undo, and networked
multiplayer.
