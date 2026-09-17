# `dab` — Specification

A formal reverse-specification of the original `dab` game.

---

## Objective

Score more boxes than the opponent by drawing edges on a rectangular
grid of dots.

## State Variables

| Variable | Initial | Meaning |
|---|---|---|
| `_nx`, `_ny` | From args or 3 | Number of boxes horizontally/vertically. |
| `_b[ny][nx]` | 0 | Edge-ownership bitmap per box. |
| Player scores | 0 | Boxes claimed by each player. |
| Current player | 0 | Index of player whose turn it is. |

## Actions & Commands

| Action | Syntax |
|---|---|
| Start default game | `dab` |
| Human vs human | `dab -p hh` |
| Computer demo | `dab -p cc -n 5` |
| Larger board | `dab 5 5` |

## Legal Rules & Invariants

1. The board is a grid of dots with `_nx * _ny` boxes.
2. On a turn, a player draws one horizontal or vertical edge between
   two adjacent dots.
3. If the edge completes the fourth side of one or more boxes, the
   player claims those boxes and must move again.
4. If no box is completed, the turn passes to the other player.
5. The game ends when every box has four sides.
6. The player with the most boxes wins.
7. In-game keys: `hjkl` move, `uybn` diagonal move, `space` draw,
   `q` quit.

## RNG Usage

- `RANDOM` shuffles the AI's board-scanning order using `random()`.
- This only affects which equally-good move the AI chooses; it does
  not affect move legality.

## Termination Conditions

- **Normal:** Board full → final scores shown.
- **Quit:** `q` pressed → exit immediately.

## Difficulty Levels & Setup Configuration

| Flag | Effect |
|---|---|
| `-p hh` | Two human players (hot-seat). |
| `-p cc` | Computer vs computer (demo). |
| `-p ch` / `-p hc` | Human vs computer. |
| `xdim ydim` | Set board size in boxes. |
| `-n N` | Play N games back-to-back. |

No in-game difficulty slider; the AI is fixed.
