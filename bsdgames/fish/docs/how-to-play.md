# How to Play `fish`

`fish` is the BSDGames implementation of Go Fish.

---

## Controls / Commands

```
fish [-p]
```

| Flag | Meaning |
|---|---|
| `-p` | Professional mode (smarter computer opponent). |

### In-Game Input

| Input | Effect |
|---|---|
| `A`, `2`–`10`, `J`, `Q`, `K` | Ask the computer for all cards of that rank. |
| `p` | Switch to professional mode mid-game. |
| `quit` | End the game. |
| `Enter` (empty line) | Show the computer's hand size, deck size, and books. |

## How to Win

Collect more books (sets of four cards of the same rank) than the
computer. The game ends when one player runs out of cards; the player
with the most books wins.

## Tips & Tricks

- **Ask for what you have:** You can only request a rank that already
  exists in your hand.
- **Remember asks:** The computer's pro mode remembers your previous
  requests; use that to your advantage.
- **Watch the deck:** Press Enter to see how many cards remain.
- **Pro mode:** Enable with `-p` or by typing `p` during the game for
  a tougher opponent.

## Scoring Mechanism

- One book = four cards of the same rank.
- Final score is the number of books each player has collected.
- Ties are possible.

## Easter Eggs

- Rare win/loss messages appear with probability 1/1024.
- The computer's "rare cheat" is a documented (if mischievous)
  feature.

## Difficulty Levels & Setup Configuration

| Mode | Command |
|---|---|
| Normal | `fish` |
| Professional | `fish -p` |

Future ports might add multiple AI personalities, online multiplayer,
or timed turns.
