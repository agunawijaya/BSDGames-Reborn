# `pig` — Manual Test Scenarios

---

## Regression Suite

### T-01 — Consonant-start word

**Setup:** `echo "hello" | pig`
**Expected:** `ellohay`

### T-02 — Vowel-start word

**Setup:** `echo "apple" | pig`
**Expected:** `appleway`

### T-03 — Title case

**Setup:** `echo "Hello" | pig`
**Expected:** `Ellohay`

### T-04 — All caps

**Setup:** `echo "HELLO" | pig`
**Expected:** `ELLOHAY`

### T-05 — QU handling

**Setup:** `echo "queen" | pig`
**Expected:** `eenquay`

### T-06 — Punctuation

**Setup:** `echo "Hello, world!" | pig`
**Expected:** `Ellohay, orldway!`

## Sign-off Template

```
- [ ] T-01 consonant-start word
- [ ] T-02 vowel-start word
- [ ] T-03 title case
- [ ] T-04 all caps
- [ ] T-05 QU handling
- [ ] T-06 punctuation
Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
