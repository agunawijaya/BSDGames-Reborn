# Cribbage — Engineering Notes

Informal technical observations, coordinate mappings, scoring edge cases, and design notes.

---

## 1. Ken Arnold's Coordinate Geometry (`cribcur.h`)

Ken Arnold mapped the pegboard to standard $80 \times 24$ terminal lines.
The screen is vertically partitioned into:
- **Lines 0–2:** Title banner and score summary (`SCORE: YOU: X COMP: Y`).
- **Lines 4–11:** The visual pegboard tracks:
  - Line 5: Player track row 1 (Holes 1–30).
  - Line 6: Player track row 2 (Holes 31–60).
  - Line 7: Visual bracket markings (`[ 5 ] [10] ... [30]`).
  - Line 9: Computer track row 1 (Holes 1–30).
  - Line 10: Computer track row 2 (Holes 31–60).
  - Line 11: Visual bracket markings.
- **Lines 13–15:** Starter card, cut notices, and running pegging totals.
- **Lines 17–22:** Active hand display, prompt messages, and input line.

In a 121-point game, when a player wraps around 60 holes, the board conceptually "clears" or
indicates Lap 2 by wrapping back to hole 1, tracking total points in the header.

---

## 2. The Traditional Score Logging System (`pathnames.h`)

Original BSD systems tracked cribbage statistics across all system users via a shared file:
- Defined in `pathnames.h` as `_PATH_LOG` (typically `/var/games/criblog`).
- Recorded: user ID, computer score, player score, game mode (short/long), timestamp.
- On modern multi-user systems, setgid games permissions have fallen out of favor due to security
  audits; the modern port should store records in user-local directories (`~/.local/share/bsdgames/cribbage.json`
  or `%APPDATA%\bsdgames\cribbage.json`).

---

## 3. Scoring Edge Cases & Gotchas

1. **The Crib Flush Trap:**
   - In the player's or computer's hand, a 4-card flush scores **4 points** (plus 1 more if the cut card matches, making 5).
   - In the **crib**, a 4-card flush scores **0 points**! All 5 cards (4 crib cards + starter) must match the suit to score a flush (5 points).
2. **Double Runs vs Single Sequences:**
   - Hand: `7♠, 7♥, 8♦, 9♣` with cut `2♦`.
   - Contains two distinct 3-card runs: `(7♠, 8♦, 9♣)` and `(7♥, 8♦, 9♣)` = 6 points.
   - Plus a pair of 7s = 2 points.
   - Total = 8 points (called a "Double Run of Three").
3. **His Heels vs His Nobs:**
   - **His Heels:** Starter card cut is a **Jack** $\rightarrow$ Dealer scores **2 points immediately**.
   - **His Nobs:** Player holds a **Jack** whose suit matches the cut card $\rightarrow$ Player scores **1 point during the show**.

---

## 4. Discard Equity Reference Matrix

Empirical average hand + crib value yields for common 2-card discards:

| Discard Pair | To Own Crib (Expected Yield) | To Opponent's Crib (Risk Penalty) | Strategic Classification |
|---|:---:|:---:|---|
| **5-5** | $+8.8$ pts | $+8.8$ pts (Disastrous) | Optimal for self; suicide to opponent. |
| **2-3** | $+6.5$ pts | $+6.5$ pts (Very High) | Strong for self (sum=5); bad to opponent. |
| **7-8** | $+6.8$ pts | $+6.8$ pts (High) | High run & 15 potential. |
| **King-9** | $+3.2$ pts | $+3.2$ pts (Low) | Premier defensive balk discard. |
| **Queen-8** | $+3.4$ pts | $+3.4$ pts (Low) | Safe balk discard. |
| **King-Ace** | $+3.1$ pts | $+3.1$ pts (Minimal) | Premier defensive balk discard. |
