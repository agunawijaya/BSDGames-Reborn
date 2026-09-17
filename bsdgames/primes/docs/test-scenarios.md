# `primes` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Small Range

```sh
primes 2 20
```

**Expected:** `2 3 5 7 11 13 17 19` (one per line).

## Scenario 2: Single Argument

```sh
primes 90
```

**Expected:** Primes from 97 upward (first few lines: `97`, `101`, `103`, ...).

## Scenario 3: Stdin Mode

```sh
printf "50\n" | primes
```

**Expected:** `53`, `59`, `61`, ...

## Scenario 4: Validation Count

```sh
primes 0 10000000 | wc -l
```

**Expected:** `664579`

## Scenario 5: Empty Range

```sh
primes 10 10
```

**Expected:** Error `start value must be less than stop value.`

## Scenario 6: Negative Input

```sh
primes -5 10
```

**Expected:** Error `negative numbers aren't permitted.`

## Scenario 7: Invalid Format

```sh
primes abc 10
```

**Expected:** Error `abc: illegal numeric format.`

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
