# `morse` — Manual Test Scenarios

---

## Regression Suite

### T-01 — Encode letter

**Setup:** `echo "A" | morse`
**Expected:** `.-
...-.-`

### T-02 — Decode letter

**Setup:** `echo ".-" | morse -d`
**Expected:** `A`

### T-03 — Encode with spoken style

**Setup:** `echo "A" | morse -s`
**Expected:** `dit daw` followed by SK.

### T-04 — Decode word

**Setup:** `echo "... --- ..." | morse -d`
**Expected:** `SOS`

### T-05 — Unknown token

**Setup:** `echo "-------" | morse -d`
**Expected:** `x`

## Sign-off Template

```
- [ ] T-01 encode letter
- [ ] T-02 decode letter
- [ ] T-03 encode with spoken style
- [ ] T-04 decode word
- [ ] T-05 unknown token
Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
