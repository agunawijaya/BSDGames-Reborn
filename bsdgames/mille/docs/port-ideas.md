# Mille — Port Modernization Ideas

Brainstorming architectural enhancements, visual overhauls, and feature modernizations for the
modern spiritual successor of BSD Mille (*Mille Bornes*).

---

## 1. Gameplay Modernization

### Tiered Artificial Intelligence
1. **Classic Apprentice (1982 Heuristic):** Faithfully replicates Ken Arnold's original priority
   matrix (`comp.c`), with card-counting rules (`Numseen`) and conservative Coup-fourré baiting.
2. **Grand Prix Master (Monte Carlo Tree Search):** Uses forward simulation over remaining unseen
   cards, predicting the probability that an opponent holds a remedy or safety before deploying a hazard.
3. **Speed Demon (Aggressive):** Prioritizes max mileage and early extensions; highly prone to
   breakdowns and Coup-fourré traps.

### Classic 4-Player Partnership Mode
Traditional physical *Mille Bornes* is often played in two teams of two (Partners sitting opposite,
sharing a single Battle pile, Speed pile, and Mileage track). Adding native 4-player 2v2 team play
would dramatically elevate multiplayer replayability.

---

## 2. Visual & UI/UX Design

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │  M I L L E   B O R N E S   R A C E           Match: 3450 / 5000 pts    │
   ├────────────────────────────────────────────────────────────────────────┤
   │  [ OPPONENT VEHICLE ]                                                  │
   │  Speedometer: [  50 MPH (Speed Limit)  ]    Odometer: [ 0450 / 0700 ]  │
   │  Battle Pile: [ 🛑 STOP ]                   Safeties: [ 🛡️ Ace ]       │
   ├────────────────────────────────────────────────────────────────────────┤
   │  [ YOUR VEHICLE ]                                                      │
   │  Speedometer: [ 100 MPH (Unrestricted) ]    Odometer: [ 0525 / 0700 ]  │
   │  Battle Pile: [ 🟢 GO   ]                   Safeties: [ ⛽ Tank ]      │
   ├────────────────────────────────────────────────────────────────────────┤
   │  [ MILEAGE SPLITS ]                                                    │
   │  25 mi: 1   50 mi: 2   75 mi: 1   100 mi: 3   200 mi: 1 (Max 2)        │
   ├────────────────────────────────────────────────────────────────────────┤
   │  [ YOUR HAND ]                                                         │
   │  [1] 🚗 100 mi  [2] ⛽ Gasoline  [3] 🔧 Repairs  [4] 🛡️ Puncture Proof │
   │  [5] 🚗  75 mi  [6] 🟢 Go        [7] 🛑 Stop                           │
   │                                                                        │
   │  Action: Select card (1-7), [D]iscard, [O]rder, [S]ave, [Q]uit >      │
   └────────────────────────────────────────────────────────────────────────┘
```

- **Retro French Art Deco Styling:** Render cards with classic vintage French typography, reminiscent
  of 1950s Edmond Dujardin card decks and Michelin road maps.
- **Automotive Dashboard Gauges:** Visual speedometers, analog odometers, and warning lights
  (blinking fuel light for *Out of Gas*, flashing flat tire icon).
- **Audio & Haptic Effects:**
  - Engine revving sound when playing a *Go* card.
  - Screeching tires when slapped with a *Stop* or *Flat Tire*.
  - A celebratory klaxon French car horn (*"Pouët pouët!"*) upon landing a **Coup-fourré**!

---

## 3. Internet & Multiplayer Architecture

### Handling the Asynchronous Coup-Fourré Online
In physical play, a player shouts "Coup-fourré!" immediately upon being attacked.
In online multiplayer, this presents a race condition.
- **Solution — The Reaction Window:**
  When Player A plays a Hazard on Player B:
  - The server pauses for a **3 to 5-second reaction timer**.
  - Player B's client displays a pulsing **COUP-FOURRÉ!** button (or keyboard shortcut spacebar).
  - If Player B presses it, the Coup-fourré fires. If the timer expires (or Player B clicks "Pass"),
    play proceeds normally to Player B's regular turn.

---

## 4. Persistence & Match Statistics

- **JSON / SQLite Game State:** Replace `varpush.c` raw memory dumps with portable, schema-validated
  JSON representations, allowing games to be saved and resumed across Linux, macOS, and Windows.
- **Driver Career Ledger:**
  - Total miles driven across career.
  - Lifetime Coup-fourré count.
  - Safe Trip badges (700 miles without 200s).
  - Shut-Out trophies (skunking the opponent 700 to 0).

---

## 5. What NOT to Change (Core Identity)

- **The Exact 101-Card Deck:** Never alter card ratios or add arbitrary modern hazards.
- **The Two 200-Mile Limit:** Essential for strategic pacing; unlimited 200s would ruin the game.
- **Scoring Formulas:** Preserve all bonus values (400 for trip, 300 for Coup-fourré, 300 for Safe Trip,
  500 for Shut-Out, 300 for Delayed Action, 200 for Extension).
- **5,000-Point Match Goal:** The classic tournament length that allows dramatic comebacks.

---

## 6. Open Questions for Discussion

1. *Should we provide an auto-Coup-fourré toggle for fast online play, or does manual timing
   preserve the authentic physical tension?*
2. *Should the classic French card names (Coup-fourré, Bornes, Panne d'essence) be available as a
   localized language setting alongside English names?*
