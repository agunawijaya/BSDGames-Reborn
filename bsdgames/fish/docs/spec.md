# `fish` — Specification

A formal reverse-specification of the original `fish` (Go Fish) game.

---

## Objective

Collect more books (sets of four cards of the same rank) than the
computer.

## State Variables

| Variable | Initial | Meaning |
|---|---|---|
| `userhand[RANKS]` | 7 cards | Count of each rank in user's hand. |
| `comphand[RANKS]` | 7 cards | Count of each rank in computer's hand. |
| `deck[TOTCARDS]` | 52-14 cards | Draw pool. |
| `curcard` | `TOTCARDS` | Index of next card to draw. |
| `asked[RANKS]` | 0 | Ranks the computer has asked for. |
| `userasked[RANKS]` | 0 | Ranks the user has asked for (used by pro AI). |
| `promode` | 0 | Professional AI flag. |

## Actions & Commands

| Action | Input |
|---|---|
| Ask for rank | `A`, `2`–`10`, `J`, `Q`, `K` |
| Enable pro mode | `p` |
| Show status | empty line |
| Quit | `quit` |

## Legal Rules & Invariants

1. Each player starts with 7 cards; the rest form the draw pool.
2. A player can only ask for a rank they currently hold.
3. If the opponent holds the requested rank, all matching cards are
   transferred and the asker gets another turn.
4. If the opponent holds none, the asker draws one card.
5. If the drawn card matches the requested rank, the asker gets
   another turn.
6. Four cards of the same rank form a book and are removed from the
   hand.
7. The game ends when at least one hand is empty.
8. The player with the most books wins; ties possible.

## RNG Usage

- `srandom(time(NULL))` seeds at startup.
- `nrandom(n)` returns `random() % n`.
- Used for deck shuffling, starting player, pro-mode decisions, and
  rare messages.

## Termination Conditions

- **Normal:** A hand becomes empty → final book comparison.
- **Quit:** User types `quit` or EOF → immediate exit.

## Difficulty Levels & Setup Configuration

| Mode | Command |
|---|---|
| Normal | `fish` |
| Professional | `fish -p` |

No other configuration.
