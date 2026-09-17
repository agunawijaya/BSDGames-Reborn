# `pom` — Test Scenarios

Manual verification scripts.

---

## Scenario 1: Current Phase

```
$ pom
The Moon is Waxing Crescent (23% of Full)
```

**Expected:** A valid phase description, exit code `0`.

## Scenario 2: Known Full Moon

```
$ pom 20261031
Sat 2026 Oct 31 00:00:00 (WIB):  The Moon will be Full
```

**Expected:** `Full`, exit code `0`.

## Scenario 3: Known New Moon

```
$ pom 20261101
Sun 2026 Nov  1 00:00:00 (WIB):  The Moon will be New
```

**Expected:** `New`, exit code `0`.

## Scenario 4: Quarter Phase

```
$ pom 20261024
Sat 2026 Oct 24 00:00:00 (WIB):  The Moon will be at the First Quarter
```

**Expected:** `First Quarter` or `Last Quarter`, exit code `0`.

## Scenario 5: Invalid Date

```
$ pom 991399
pom: illegal time format
usage: pom [[[[[cc]yy]mm]dd]HH]
```

**Expected:** Usage message on stderr, exit code `1`.

## Sign-Off Template

| Date | Tester | Build | Scenarios Passed | Notes |
|---|---|---|---|---|
| | | | | |
