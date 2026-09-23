# `pom` — Test Scenarios

Manual verification scripts. Expected output was captured from the
original binary (`bsdgames` 2.17, `/usr/games/pom`) with
`TZ=Asia/Jakarta` (WIB, UTC+7) and “now” on 2026-09-23.

> **Revision 2026-09-24:** scenarios 2–4 originally used 8-digit
> arguments (`20261031`, `20261101`, `20261024`). pom parses an 8-digit
> argument as `yymmddHH` (year 2020, month 26), so the original binary
> answers `illegal time format`. The intended dates also did not match
> the algorithm (31 Oct 2026 is 74% Waning Gibbous, not Full). The
> scenarios now use 10-digit `ccyymmddHH` arguments whose output was
> verified on the real binary. The old inputs survive as scenario 6,
> which documents the parser rule. Found while porting
> [`ports/fancy-web`](../ports/fancy-web/docs/test-scenarios.md).

---

## Scenario 1: Current Phase

```
$ pom
The Moon is Waxing Gibbous (87% of Full)
```

**Expected:** A valid phase description with present tense (“is”), exit
code `0`. The phrase varies with the current date.

## Scenario 2: Known Full Moon

```
$ pom 2026102600
Mon 2026 Oct 26 00:00:00 (WIB):  The Moon will be Full
```

**Expected:** `Full`, exit code `0`.

## Scenario 3: Known New Moon

```
$ pom 2026110900
Mon 2026 Nov  9 00:00:00 (WIB):  The Moon will be New
```

**Expected:** `New`, exit code `0`. Note the space-padded day (`%e`).

## Scenario 4: Quarter Phase

```
$ pom 2026101900
Mon 2026 Oct 19 00:00:00 (WIB):  The Moon will be at the First Quarter
```

**Expected:** `First Quarter` or `Last Quarter`, exit code `0`.

## Scenario 5: Invalid Date

```
$ pom 991399
pom: illegal time format
usage: pom [[[[[cc]yy]mm]dd]HH]
```

**Expected:** Usage message on stderr, exit code `1`.

## Scenario 6: Eight Digits Mean `yymmddHH`

```
$ pom 20261031
pom: illegal time format
usage: pom [[[[[cc]yy]mm]dd]HH]
$ pom 26103100
Sat 2026 Oct 31 00:00:00 (WIB):  The Moon will be Waning Gibbous (74% of Full)
```

**Expected:** The first form is rejected, because month `26` is out of
range. The second form is the 8-digit way to write the same date. Exit
codes `1` and `0`.

## Scenario 7: Past Tense and Date Normalisation

```
$ pom 25011400
Tue 2025 Jan 14 00:00:00 (WIB):  The Moon was Full
$ pom 2026022900
Sun 2026 Mar  1 00:00:00 (WIB):  The Moon was Waxing Gibbous (91% of Full)
```

**Expected:** Past tense (“was”) for times before now. An impossible
day that passes the 01–31 check is normalised by `mktime`
(29 Feb 2026 → 1 Mar).

## Sign-Off Template

| Date | Tester | Build | Scenarios Passed | Notes |
|---|---|---|---|---|
| 2026-09-24 | Claude Opus | `ports/fancy-web` working tree | 1–7 | Automated in `ports/fancy-web/tests/engine.test.js`; also 1,534-case golden comparison with the real binary |
