# `number` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Small Integer

```sh
number 21
```

**Expected:** `twenty-one.`

## Scenario 2: Hundreds

```sh
number 101
```

**Expected:** `one hundred one.`

## Scenario 3: Large Scale

```sh
number 1234567
```

**Expected:** `one million two hundred thirty-four thousand five hundred sixty-seven.`

## Scenario 4: Negative Number

```sh
number -5
```

**Expected:** `minus five.`

## Scenario 5: Decimal Fraction

```sh
number 3.14
```

**Expected:** `three and fourteen hundredths.`

## Scenario 6: Line Mode

```sh
number -l 100
```

**Expected:** `one hundred`

## Scenario 7: Zero

```sh
number 0
```

**Expected:** `zero.`

## Scenario 8: Stdin with Multiple Values

```sh
printf "1\n2\n" | number
```

**Expected:**
```
one.
...
two.
```

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
