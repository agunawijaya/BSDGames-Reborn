# Lessons from `quiz`

`quiz` teaches data-driven program design, custom parsing, and the
value of reversible question/answer pairs.

---

## 1. Separate Content from Code

All trivia content lives in plain text files. The program only knows
how to read and match categories.

> **File:** `BSDGames-master/quiz/datfiles/*`

**Why it matters:** Non-programmers can add subjects without touching
source code.

## 2. Build Tiny Domain-Specific Parsers

The custom regexp engine (`rxp.c`) is just powerful enough for the
quiz file syntax.

> **File:** `BSDGames-master/quiz/rxp.c`

**Why it matters:** A full regex library is overkill for a simple
format. A small parser is easier to audit and port.

## 3. Make Data Reversible

Because categories are symmetric, the same file supports two drills:
`quiz victim killer` and `quiz killer victim`.

> **File:** `BSDGames-master/quiz/quiz.c:195-226`

**Why it matters:** Reversible data doubles the usefulness of a
single dataset.

## 4. Track Asked/Answered State Per Record

Each question entry has `q_asked` and `q_answered` flags.

> **File:** `BSDGames-master/quiz/quiz.h:48-53`

```c
typedef struct qentry {
    struct qentry *q_next;
    char *q_text;
    int  q_asked;
    int  q_answered;
} QE;
```

**Why it matters:** Simple state flags enable tutorial mode and
prevent duplicate questions.

## 5. Use a Pager for Long Lists

The subject index is shown through the user's preferred pager.

> **File:** `BSDGames-master/quiz/quiz.c:162-193`

**Why it matters:** Long output should respect user tooling and
terminal size.

## See Also

- [`architecture.md`](./architecture.md) — full control-flow analysis.
- [`spec.md`](./spec.md) — formal rules.
- [`references.md`](./references.md) — sources.
