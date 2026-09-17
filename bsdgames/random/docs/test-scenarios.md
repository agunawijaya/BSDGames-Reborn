# `random` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Default 50% Filter

```sh
printf "a\nb\nc\nd\n" | random
```

**Expected:** A random subset of lines, each run different.

## Scenario 2: Custom Denominator

```sh
printf "a\nb\nc\n" | random 10
```

**Expected:** Most likely no output; occasionally one line.

## Scenario 3: Unbuffered Output

```sh
printf "a\nb\n" | random -r 2
```

**Expected:** Random subset, output flushed per character.

## Scenario 4: Exit-Code Mode Range

```sh
random -e 5
```

**Expected:** Exit status between `0` and `4`.

## Scenario 5: Invalid Denominator

```sh
printf "a\n" | random 0
```

**Expected:** Error `denominator is not valid.`

## Scenario 6: No Input in Filter Mode

```sh
random < /dev/null
```

**Expected:** No output, exit `0`.

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
