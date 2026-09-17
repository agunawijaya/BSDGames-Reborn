# How to Play `arithmetic`

`arithmetic` is a keyboard-driven math drill.

---

## Controls / Commands

```
arithmetic [-o +-x/] [-r range]
```

| Flag | Meaning |
|---|---|
| `-o +\-x/` | Select operators. Default is `+-`. Repeat an operator to weight it more heavily. |
| `-r range` | Set maximum operand / result range. Default is `10`. |

## How to Win

There is no final win state. The goal is to answer correctly and
quickly. After every 20 questions you see:

```
Rights 18; Wrongs 2; Score 90%
Total time 45 seconds; 2.5 seconds per problem
```

Press RETURN to continue the drill.

## Tips & Tricks

- **Start simple:** no arguments gives addition and subtraction with
  numbers 0–10.
- **Add multiplication:** `arithmetic -o +-\*x`.
- **Note division:** the problem `7 / 3 =` expects the integer
  quotient `2`, not the remainder.
- **Quit:** press Ctrl-C or Ctrl-D. The final score is printed on the
  way out.

## Scoring Mechanism

- One point per right answer.
- One wrong-answer tally per mistake.
- Score = `rights / (rights + wrongs) * 100%`.
- Timing is measured in whole seconds per correct answer.

## Easter Eggs

- The program never reveals the correct answer — a deliberate bit of
  educational tough love.

## Difficulty Levels & Setup Configuration

Difficulty is configured at launch:

| Setup | Command |
|---|---|
| Easy | `arithmetic -r 5` |
| Default | `arithmetic` |
| Harder | `arithmetic -r 50 -o +-\*x` |

Future ports might add timed modes, streak bonuses, or progress levels.
