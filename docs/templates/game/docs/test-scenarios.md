# `<GAME>` — Manual Test Scenarios

> Human-executable playthrough scripts. For anything unit tests
> can't easily cover: `curses` UI, real-time, RNG, multiplayer,
> installer flow. Run these before releases.
>
> Automated tests live under `../tests/`. This file is for the
> human eye.

---

## Test Environment

- **Terminal:** [minimum size, recommended size]
- **Platform:** [OSes covered by manual QA]
- **Build:** [how to build the port before testing]

## Regression Suite

Run these before every release.

### T-01 — Smoke test

**Setup:** Fresh install; no save file.
**Steps:**
1. Launch `<game>` with no arguments.
2. Observe that the game starts in a valid state.
3. Quit immediately (`q` or equivalent).
4. Observe clean exit.
**Expected:** No crash; terminal restored to sane state.

### T-02 — Basic gameplay

**Setup:** ...
**Steps:**
1. ...
2. ...
**Expected:** ...

### T-03 — [describe]

...

## Feature-Specific Scenarios

### F-01 — [feature name, e.g. save/load]

**Setup:** ...
**Steps:** ...
**Expected:** ...

### F-02 — [random event]

**Setup:** Seed the RNG to a value that triggers the event.
**Steps:**
1. Play up to the trigger point.
2. Confirm the event fires.
3. Confirm the consequence (score change / death / etc.).
**Expected:** As per [`spec.md`](./spec.md) RNG table.

## Multiplayer Scenarios (if applicable)

### M-01 — Two-player game start

**Setup:** Two terminals / two clients.
**Steps:** ...
**Expected:** Both clients see synchronised state within [tick].

## Regression from Bugs

*As bugs are fixed, add a scenario that reproduces the bug so it
doesn't regress.*

### R-YYYYMMDD — [bug slug]

Bug reference: [issue link]
Repro steps: ...
Expected after fix: ...

## Sign-off Template

Once all scenarios pass:

```
- [ ] T-01 smoke
- [ ] T-02 basic gameplay
- [ ] F-01 save/load
- [ ] ...
Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
