# `caesar` — Manual Test Scenarios

> Human-executable test scripts.

---

## Test Environment

- Terminal with stdin/stdout support.
- Platform: any with the port binary.

## Regression Suite

### T-01 — Explicit ROT13

**Setup:** `echo "Uryyb" | caesar 13`
**Expected:** Output is `Hello`.

### T-02 — Auto-detect

**Setup:** `printf 'Khoor Zruog\n' | caesar`
**Expected:** Output is `Hello World`.

### T-03 — Non-letter preservation

**Setup:** `echo "123 !@#" | caesar 5`
**Expected:** Output is `123 !@#`.

### T-04 — Bad rotation value

**Setup:** `echo "test" | caesar -1`
**Expected:** Error message and non-zero exit.

## Sign-off Template

```
- [ ] T-01 explicit ROT13
- [ ] T-02 auto-detect
- [ ] T-03 non-letter preservation
- [ ] T-04 bad rotation value
Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
