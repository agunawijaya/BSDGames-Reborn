# `banner` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Single Word

```sh
banner HI
```

**Expected:** Large ASCII art spelling "HI" using `#` characters.

## Scenario 2: Narrow Width

```sh
banner -w 40 HI
```

**Expected:** Smaller, scrunched version of "HI".

## Scenario 3: Multiple Words

```sh
banner HELLO WORLD
```

**Expected:** Banner spanning multiple lines.

## Scenario 4: Stdin Mode

```sh
printf "TEST\n" | banner
```

**Expected:** Banner spelling "TEST".

## Scenario 5: Unsupported Character

```sh
banner A~B
```

**Expected:** `~` renders as blank space between `A` and `B`.

## Scenario 6: Long Message

```sh
banner "THE QUICK BROWN FOX"
```

**Expected:** Banner renders without crashing.

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
