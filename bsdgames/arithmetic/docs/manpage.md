# `arithmetic` — Man Page Mirror

Original source: `BSDGames-master/arithmetic/arithmetic.6`.

---

## NAME

**arithmetic** — quiz on simple arithmetic

## SYNOPSIS

```
arithmetic [-o +-x/] [-r range]
```

## DESCRIPTION

`arithmetic` asks you to solve problems in simple arithmetic. Each
question must be answered correctly before going on to the next. After
every 20 problems, it prints the score so far and the time taken. You
can quit at any time by typing the interrupt or end-of-file character.

## OPTIONS

| Option | Description |
|---|---|
| `-o +-x/` | Select operators. Default is `+-`. Repeating an operator weights it more heavily. |
| `-r range` | Set the maximum value for operands and results. Default is `10`. |

## ADAPTIVE BIAS

When you get a problem wrong, `arithmetic` remembers the numbers
involved and tends to select those numbers more often in problems of
the same sort. Eventually it forgives and forgets.

## DIAGNOSTICS

- **What?** — wrong answer.
- **Right!** — correct answer.
- **Please type a number.** — non-numeric input.

## SEE ALSO

`bc(1)`, `dc(1)`

## Annotation

- The original program never reveals the correct answer. A modern port
  may want to offer an optional hint mode while preserving this default.
- Division problems include a remainder; the expected answer is the
  integer quotient only.
