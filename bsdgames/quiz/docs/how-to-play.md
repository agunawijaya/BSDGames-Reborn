# How to Play `quiz`

`quiz` is a text-file-driven trivia drill.

---

## Controls / Commands

```
quiz [-t] [-i file] [question_category answer_category]
```

| Flag | Meaning |
|---|---|
| `-t` | Tutorial mode: repeat missed questions, show new ones less often. |
| `-i file` | Use a custom index file. |

### In-Game Input

| Input | Effect |
|---|---|
| `<answer>` | Try to answer the current question. |
| empty line | Reveal the correct answer. |
| EOF (Ctrl-D) | Quit and show the score. |

## How to Win

There is no win condition. The goal is to answer as many questions
rightly as possible. The final score is:

```
score = rights * 100 / (rights + wrongs + extra_guesses)
```

## Tips & Tricks

- **List subjects:** run `quiz` with no arguments.
- **Reverse drill:** if `quiz victim killer` is too easy, try
  `quiz killer victim`.
- **Tutorial mode:** use `-t` when learning a new subject.
- **Custom data:** create your own index and data files with colon-separated
  categories.

## Scoring Mechanism

- `rights` — correct answers on the first try.
- `wrongs` — answers given up on (empty line).
- `extra guesses` — additional wrong attempts before a right answer.
- Percentage computed from total interactions.

## Easter Eggs

- The bundled data files include morbid and irreverent subjects,
  reflecting the original authors' sense of humour.

## Difficulty Levels & Setup Configuration

Difficulty is determined by the chosen subject and categories. Future
ports might add difficulty tags per question.
