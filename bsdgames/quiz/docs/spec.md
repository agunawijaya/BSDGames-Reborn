# `quiz` — Specification

A formal reverse-specification of the original `quiz` utility.

---

## Objective

Drill the player on facts from a data file by asking questions from
one category and expecting answers from another.

## State Variables

| Variable | Initial | Meaning |
|---|---|---|
| `qlist` | empty | Linked list of question/answer records. |
| `qsize` | 0 | Number of records loaded. |
| `catone` | 0 | Index of question category. |
| `cattwo` | 0 | Index of answer category. |
| `tflag` | 0 | Tutorial mode flag. |
| `rights` | 0 | Correct first-try answers. |
| `wrongs` | 0 | Revealed answers. |
| `guesses` | 0 | Extra wrong attempts. |

## Actions & Commands

| Action | Syntax |
|---|---|
| List subjects | `quiz` |
| Start drill | `quiz category1 category2` |
| Tutorial drill | `quiz -t category1 category2` |
| Custom index | `quiz -i myindex.txt cat1 cat2` |

## Legal Rules & Invariants

1. With no arguments, the program lists subjects from the index file.
2. With two arguments, it searches the index for a subject whose
   category titles match both arguments.
3. Matching is case-insensitive.
4. The same data file can be used with arguments in either order.
5. Questions are selected randomly from unanswered records.
6. In tutorial mode, 80% of selections are already-asked but
   unanswered records.
7. A correct answer marks the record answered.
8. An empty answer reveals the correct answer and marks it wrong.
9. Wrong answers allow retry without penalty beyond the extra-guess
   counter.
10. EOF ends the drill and prints the score.

## RNG Usage

- `srandom(time(NULL))` seeds at startup.
- `random()` selects the next question index.

## Termination Conditions

- **Normal:** All questions answered or EOF → score printed.
- **Usage error:** Wrong arguments → usage printed, exit `1`.

## Difficulty Levels & Setup Configuration

| Flag | Effect |
|---|---|
| `-t` | Tutorial mode. |
| `-i file` | Custom index file. |

Difficulty is implicit in the chosen subject/categories.
