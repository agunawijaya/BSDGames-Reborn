# `arithmetic` — Test Scenarios

Manual verification scripts. Because the program is interactive,
scenarios use scripted input.

---

## Scenario 1: Default Addition/Subtraction

```
$ printf '7\n5\n' | arithmetic
3 + 4 =   7
Right!
8 - 3 =   5
Right!
```

**Expected:** Two Right! responses, then score screen after 20
questions or EOF. Exit `0`.

## Scenario 2: Wrong Answer Triggers Penalty

```
$ printf '1\n7\n' | arithmetic -o +
3 + 4 =   1
What?
3 + 4 =   7
Right!
```

**Expected:** Wrong answer prints `What?`, then the same problem
repeats until correct.

## Scenario 3: Multiplication Mode

```
$ printf '12\n' | arithmetic -o x -r 5
3 x 4 =   12
Right!
```

**Expected:** Right! for correct product.

## Scenario 4: Division Quotient

```
$ printf '2\n' | arithmetic -o / -r 5
5 / 2 =   2
Right!
```

**Expected:** Integer quotient accepted.

## Scenario 5: Invalid Flag

```
$ arithmetic -o ^
arithmetic: unknown key.
```

**Expected:** Error message, exit `1`.

## Sign-Off Template

| Date | Tester | Build | Scenarios Passed | Notes |
|---|---|---|---|---|
| | | | | |
