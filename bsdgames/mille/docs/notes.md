# Mille — Engineering Notes

Informal technical observations, deck probability distribution, curses window coordinates,
and AI card valuation tables from BSD `mille`.

---

## 1. Deck Probability Analysis (101 Cards Total)

The exact distribution of cards across the 101-card deck:

```
[ Distance Cards: 46 / 101 (45.5%) ]
  - 25 Miles:   10 cards  (9.9%)
  - 50 Miles:   10 cards  (9.9%)
  - 75 Miles:   10 cards  (9.9%)
  - 100 Miles:  12 cards (11.9%)
  - 200 Miles:   4 cards  (4.0%)

[ Stop / Go / Right of Way: 19 / 101 (18.8%) ]
  - Stop (Hazard):          4 cards (4.0%)
  - Go (Remedy):           14 cards (13.9%)  <-- Highest single card frequency in deck
  - Right of Way (Safety):  1 card  (1.0%)

[ Gas / Empty / Extra Tank: 9 / 101 (8.9%) ]
  - Out of Gas:   2 cards (2.0%)
  - Gasoline:     6 cards (5.9%)
  - Extra Tank:   1 card  (1.0%)

[ Tire / Flat / Puncture Proof: 9 / 101 (8.9%) ]
  - Flat Tire:       2 cards (2.0%)
  - Spare Tire:      6 cards (5.9%)
  - Puncture Proof:  1 card  (1.0%)

[ Accident / Repairs / Driving Ace: 9 / 101 (8.9%) ]
  - Accident:      2 cards (2.0%)
  - Repairs:       6 cards (5.9%)
  - Driving Ace:   1 card  (1.0%)

[ Speed Limit / End of Limit: 9 / 101 (8.9%) ]
  - Speed Limit:   3 cards (3.0%)
  - End of Limit:  6 cards (5.9%)
```

### Strategic Probability Takeaway
Because there are **14 Go cards** in the deck (nearly $14\%$ of all cards), chances of drawing a Go
card are relatively high. In contrast, hazard remedies (*Gasoline*, *Spare Tire*, *Repairs*) only have
**6 copies** each ($5.9\%$), making severe breakdowns twice as difficult to fix without their
corresponding Safety!

---

## 2. Curses Window Geometry (`mille.h:63-75`)

Ken Arnold carefully dimensioned the windows to fit an $80 \times 24$ CRT display:

```
Row 00 ┌────────────────── BOARD (17 x 40) ─────────────────┐
       │ Line 0: Title banner                               │
       │ Line 1-4: Computer status & Safeties               │
       │ Line 5-8: Player status & Safeties                 │
       │ Line 10: Move prompt (MOVE_Y=10, MOVE_X=20)        │
       │ Line 15: Error banner (ERR_Y=15, ERR_X=5)          │
Row 17 ├────────────────── MILES (7 x 80) ──────────────────┤
       │ Line 17-23: Running milestone counts (25..200)     │
Row 24 └────────────────────────────────────────────────────┘
```

When displaying the final score, the `Score` window (17 lines × 40 columns) is superimposed
over the `Board` window, presenting an itemized score matrix before returning to play.

---

## 3. AI Card Valuation Constants (`comp.c`)

In `comp.c`, Ken Arnold defined `V_VALUABLE = 40`.
When the computer AI is forced to discard a card, it calculates a numerical penalty score:
- **Safeties:** Valuation score = $1000$ (practically never discarded).
- **Go Card:** Valuation score = $80$ (heavily protected).
- **High Distance (100, 75):** Valuation score = $40$–$60$.
- **Redundant Remedies:** If the corresponding safety has already been played, remedies become
  worthless ($0$) and are discarded immediately.
- **Low Distance (25):** Low valuation ($10$), discarded freely if hand space is needed.
