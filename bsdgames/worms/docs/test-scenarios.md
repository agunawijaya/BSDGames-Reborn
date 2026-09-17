# `worms` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Default Run

```sh
worms -d 100
```

**Expected:** 3 worms of length 16 crawl around; exits cleanly on Ctrl-C.

## Scenario 2: Custom Count and Length

```sh
worms -n 5 -l 32 -d 80
```

**Expected:** 5 longer worms move around; no crashes.

## Scenario 3: Field Mode

```sh
worms -f -d 100
```

**Expected:** Screen fills with "WORM" text; worms crawl and erase it.

## Scenario 4: Trail Mode

```sh
worms -t -d 100
```

**Expected:** Worms leave `.` trails behind them.

## Scenario 5: Invalid Delay

```sh
worms -d 2000
```

**Expected:** Error `invalid delay (1-1000)`.

## Scenario 6: Signal Handling

Run `worms -d 100` and send SIGTERM from another terminal:

```sh
kill -TERM <worms-pid>
```

**Expected:** Program exits and terminal is restored.

## Scenario 7: Visual Smoke Test

Watch for at least 10 seconds and confirm:
- Worms stay inside the screen.
- No body segments disappear unexpectedly (except valid tail erasing).
- Characters from `O * # $ % 0 @ ~` are used.

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
