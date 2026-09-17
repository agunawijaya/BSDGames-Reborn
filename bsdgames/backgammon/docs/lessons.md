# Lessons from Backgammon

Pedagogical analysis of mathematical game modeling, termcap terminal optimization,
and decoupled tutorial system architecture in the 1980 BSD C implementation of Backgammon.

---

## 1. Mathematical Board Symmetry via Signed Integers (`back.h:53-62`, `check.c:40-90`)

### The Technique
In Backgammon, two players move in opposite directions across the same 24 points. A naive software
implementation might maintain two separate board arrays, duplicate move logic for clockwise vs
counter-clockwise movement, or create complex branching statements.

Alan Char solved this with mathematical elegance using a single 1D signed array:
```c
/* board[26]: negative = White, positive = Red */
int board[26];
int cturn; /* 1 = Red, -1 = White */
```
To check if a target point $g$ is legally accessible to player `cturn`:
```c
/* Upstream concept in check.c */
int is_legal_target(int g, int cturn) {
    /* If cturn is +1 (Red), board[g] >= -1 (White has <= 1 checker) */
    /* If cturn is -1 (White), board[g] <= +1 (Red has <= 1 checker) */
    return (cturn * board[g] >= -1);
}
```
Furthermore, movement advances by $s + (\text{cturn} \times r)$. A single code path validates both
players across the entire board.

### Why It Matters
Exploiting algebraic symmetry in game rules drastically reduces code duplication, eliminates
off-by-one bugs, and makes state representation compact and mathematically verifiable.

---

## 2. Exact Combinatorial Odds Evaluation (`odds.c:30-95`, `table.c:20-50`)

### The Technique
Rather than estimating hitting chances using Monte Carlo sampling, Alan Char built a deterministic
evaluator over the exact sample space of two dice ($6 \times 6 = 36$ outcomes):

```c
/* Upstream logic in odds.c:count() */
int count(int dist, int cturn) {
    int hits = 0;
    for (int r1 = 1; r1 <= 6; r1++) {
        for (int r2 = 1; r2 <= 6; r2++) {
            if (can_hit_with(dist, r1, r2, cturn)) {
                hits++;
            }
        }
    }
    return hits; /* Return numerator out of 36 */
}
```
The routine accounts for direct hits ($r_1 = d$ or $r_2 = d$), combined rolls ($r_1 + r_2 = d$ with
open intermediate points), and doublets ($r_1 = r_2$ giving 4 moves).

### Why It Matters
For small, discrete probability spaces (like 2d6 with 36 outcomes), exhaustive evaluation is
infinitely superior to simulation: it executes in sub-microsecond time and yields exact, zero-variance
odds for decision-making.

---

## 3. High-Speed Screen Delta Updating with Termcap (`fancy.c:45-120`)

### The Technique
Before ncurses provided high-level window abstractions, Alan Char wrote `fancy.c` to directly
interface with the Berkeley `termcap` library:
- Evaluated terminal capabilities (`cm` for cursor motion, `cl` for clear screen).
- Maintained an in-memory mirror of currently displayed board characters.
- When a checker moved from point 12 to 16, instead of reprinting the 24-line board, `fancy.c`
  used `tgoto()` to reposition the cursor precisely to the coordinates of point 12 and 16,
  updating only the altered character cells.

### Why It Matters
Minimizing I/O throughput over constrained bandwidth links (300/1200 baud) forced early UNIX
engineers to develop delta-compression display algorithms. Understanding terminal cursor addressing
gives modern developers deep appreciation for modern TUI frameworks.

---

## 4. Decoupled Interactive Tutorial Architecture (`teachgammon/teach.c`, `main.c:125`)

### The Technique
Most computer games of the era included static text documentation or man pages.
Alan Char took a radically pedagogical approach by creating `teachgammon` as an independent
companion binary:
- If a user answered `y` to the rules prompt in `backgammon`, `main.c` executed:
  `execv(TEACH, av);` replacing the match process with the interactive tutor.
- `teachgammon` presented lessons, asked comprehension questions, and set up interactive practice
  board positions from static data tables (`teachgammon/data.c`), validating student moves before
  resuming regular play.

### Why It Matters
Separating tutorial workflows into a standalone executable keeps the core match engine lean and
focused, while providing a rich, dedicated environment for learning.
