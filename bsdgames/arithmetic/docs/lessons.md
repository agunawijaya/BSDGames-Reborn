# Lessons from `arithmetic`

`arithmetic` is a compact case study in interactive programs, adaptive
quizzing, and linked lists.

---

## 1. Build a Simple Adaptive Model with Penalties

The program does not use machine learning; it uses a weighted random
pool. Wrong answers add penalty "tickets" that make the same numbers
more likely to reappear.

> **File:** `BSDGames-master/arithmetic/arithmetic.c:294-321`

```c
void penalise(value, op, operand) {
    op = opnum(op);
    p = malloc(sizeof(*p));
    p->next = penlist[op][operand];
    penlist[op][operand] = p;
    penalty[op][operand] += p->penalty = WRONGPENALTY;
    p->value = value;
}
```

**Why it matters:** Simple, transparent models are often enough for
educational tools. They are also easier to debug and explain.

## 2. Decay Bias by Using It

When a penalised number is selected, its penalty is decremented. Over
time, the user's old mistakes fade from the pool.

> **File:** `BSDGames-master/arithmetic/arithmetic.c:351-360`

```c
if (p->penalty > value) {
    value = p->value;
    penalty[op][operand]--;
    if (--(p->penalty) <= 0) {
        p = p->next;
        free(*pp);
        *pp = p;
    }
    return(value);
}
```

**Why it matters:** Decaying penalties prevent the system from fixating
on stale mistakes and let it adapt to current weaknesses.

## 3. Separate Problem Generation from Answer Checking

The `problem()` function generates one question and loops internally
until the answer is correct. Statistics are handled elsewhere.

> **File:** `BSDGames-master/arithmetic/arithmetic.c:195-279`

**Why it matters:** Clear separation makes it easy to change the
question format, add hints, or switch to a GUI without rewriting the
core loop.

## 4. Flush Prompts in Interactive Programs

The code calls `fflush(stdout)` after printing the problem so the user
sees the prompt immediately, even if stdout is buffered.

> **File:** `BSDGames-master/arithmetic/arithmetic.c:237`

```c
(void)fflush(stdout);
```

**Why it matters:** Forgetting to flush is a common bug in interactive
command-line programs; the prompt may not appear until a newline is
written.

## 5. Handle EOF Gracefully

The program exits cleanly when `fgets` returns NULL, instead of looping
forever on end-of-file.

> **File:** `BSDGames-master/arithmetic/arithmetic.c:245-247`

```c
if (!fgets(line, sizeof(line), stdin)) {
    (void)printf("\n");
    return(EOF);
}
```

**Why it matters:** Respect standard input conventions so the program
works in pipelines and scripts.

## See Also

- [`architecture.md`](./architecture.md) — full control-flow analysis.
- [`spec.md`](./spec.md) — formal behaviour.
- [`references.md`](./references.md) — sources.
