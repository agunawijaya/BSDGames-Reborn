# `bcd` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Single Word

```sh
bcd HELLO
```

**Expected:** A punched card with `HELLO` in the text row and corresponding holes.

## Scenario 2: Stdin Input

```sh
printf "WORLD\n" | bcd
```

**Expected:** A punched card for `WORLD`.

## Scenario 3: Lowercase Input

```sh
bcd hello
```

**Expected:** Card text row shows `HELLO` (uppercase).

## Scenario 4: Long Input Truncation

```sh
bcd "THIS IS A VERY LONG LINE THAT EXCEEDS FORTY EIGHT CHARACTERS"
```

**Expected:** Only the first 48 characters are rendered.

## Scenario 5: Q and R Distinct

```sh
bcd QR
```

**Expected:** `Q` and `R` have different hole patterns.

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
