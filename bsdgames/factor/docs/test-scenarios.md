# `factor` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Small Composite

```sh
factor 60
```

**Expected:** `60: 2 2 3 5`

## Scenario 2: Prime Input

```sh
factor 97
```

**Expected:** `97: 97`

## Scenario 3: Repeated Factor

```sh
factor 64
```

**Expected:** `64: 2 2 2 2 2 2`

## Scenario 4: Stdin Mode

```sh
printf "12\n100\n" | factor
```

**Expected:**
```
12: 2 2 3
100: 2 2 5 5
```

## Scenario 5: Negative Input

```sh
factor -5
```

**Expected:** Error `negative numbers aren't permitted.`

## Scenario 6: Zero Input

```sh
factor 0
```

**Expected (original):** Program exits silently.

## Scenario 7: Large 32-bit Integer

```sh
factor 2147483647
```

**Expected:** `2147483647: 2147483647` (Mersenne prime)

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
