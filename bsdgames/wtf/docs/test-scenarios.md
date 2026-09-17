# `wtf` — Test Scenarios

Manual verification scripts. Run each and confirm the expected output.

---

## Scenario 1: Basic Lookup

```
$ wtf AFAIK
AFAIK: as far as I know
```

**Expected:** Expansion printed, exit code `0`.

## Scenario 2: Natural `is` Syntax

```
$ wtf is RTFM
RTFM: read the fuckin' manual
```

**Expected:** `is` ignored, expansion printed, exit code `0`.

## Scenario 3: Multiple Acronyms

```
$ wtf AFK BBL BRB
AFK: away from keyboard
BBL: [I'll] be back later
BRB: [I'll] be right back
```

**Expected:** One line per acronym, exit code `0`.

## Scenario 4: Unknown Acronym

```
$ wtf XYZABC
Gee...  I don't know what XYZABC means...
```

**Expected:** Error message on stderr, exit code `1`.

## Scenario 5: Custom Database

Create `/tmp/myacros`:

```
FOO	foolish open operation
BAR	binary attribute registry
```

Run:

```
$ wtf -f /tmp/myacros FOO
FOO: foolish open operation
```

**Expected:** Custom expansion printed, exit code `0`.

## Scenario 6: Typed Database

```
$ wtf -t comp CPU
CPU: central processing unit
```

**Expected:** Expansion from `acronyms.comp`, exit code `0`.

## Sign-Off Template

| Date | Tester | Build | Scenarios Passed | Notes |
|---|---|---|---|---|
| | | | | |
