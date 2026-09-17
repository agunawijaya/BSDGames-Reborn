# `ppt` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Encode Single Word

```sh
ppt HI
```

**Expected:** Top edge, tape rows for `H` and `I`, bottom edge.

## Scenario 2: Encode from Stdin

```sh
printf "A\n" | ppt
```

**Expected:** Top edge, one row for `A`, bottom edge.

## Scenario 3: Round-Trip Decode

```sh
printf "TEST\n" | ppt | ppt -d
```

**Expected:** `TEST` (possibly with trailing newline).

## Scenario 4: Decode Rejects Arguments

```sh
ppt -d HI
```

**Expected:** Usage error.

## Scenario 5: Longer Text

```sh
ppt "HELLO WORLD"
```

**Expected:** Tape rows for all characters plus a space row between words.

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
