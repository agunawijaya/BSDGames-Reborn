# Lessons from Mille

Pedagogical analysis of systems programming techniques, interface engineering,
and event-driven game logic in the 1982 BSD C implementation of Mille.

---

## 1. Multi-Window Terminal Partitioning (`print.c:35`, `mille.h:63-75`)

### The Technique
Before Ken Arnold created `curses`, full-screen terminal programs had to write custom VT100
escape sequences and track cursor coordinates manually. Monolithic full-screen refreshes were
unbearably slow over 300/1200 baud serial lines.

In `mille`, Arnold split the terminal into three virtual sub-windows using `newwin()`:
```c
/* Upstream window allocation concept in print.c */
Board = newwin(BOARD_Y, BOARD_X, 0, 0);     /* Top-left game status */
Miles = newwin(MILES_Y, MILES_X, BOARD_Y, 0);/* Middle mileage tally  */
Score = newwin(SCORE_Y, SCORE_X, 0, 0);     /* Modal score summary  */
```
When a player played a 50-mile card:
1. Only the `Board` window's Battle pile and the `Miles` window's counter row were marked dirty.
2. Curses computed the minimal cursor jumps to update those exact characters.
3. The hand and prompt areas remained untouched.

### Why It Matters
This was the architectural precursor to modern partitioned TUI frameworks (such as `tmux`,
Ratatui, and Bubbletea). Decomposing a complex UI into bounded, independently dirty-flagged
viewports is a timeless pattern for optimizing rendering performance.

---

## 2. Event-Driven Reactive Interrupts in Turn-Based Play (`move.c:140-195`)

### The Technique
Most turn-based card games follow a strict synchronous cycle: *Player A acts $\rightarrow$ Player B acts*.
*Mille Bornes*, however, features an asynchronous counter-attack: the **Coup-fourré**. When Player A
plays an *Accident*, Player B does not wait for their turn; they can immediately intercept the action.

Arnold implemented this reactive interrupt pattern by inserting an interception check immediately
upon applying any Hazard card ([`move.c:165`](https://github.com/vattam/BSDGames/tree/master/mille/move.c#L165)):
```c
/* Conceptual reactive check in move.c */
if (is_hazard(card)) {
    if (has_matching_safety(victim, card)) {
        if (prompt_coup_fourre(victim)) {
            execute_coup_fourre(victim, card);
            /* Victim preempts normal turn order and takes an immediate turn! */
            current_player = victim;
            return;
        }
    }
}
```

### Why It Matters
This is an early manifestation of the **Interceptor / Event-Hook Pattern**. Inserting reactive
hooks into the core action pipeline allows game rules to break strict turn ordering dynamically,
paving the way for mechanics like "Instant" spells in *Magic: The Gathering* or counter-moves in
modern strategy games.

---

## 3. Card Counting and Hidden-State Tracking (`mille.h:190`, `comp.c:85`)

### The Technique
In a card game, optimal AI requires knowing what cards remain unseen in the draw deck.
Arnold implemented a static card frequency table in `table.c` (`Numcards[20]`) and a running
observation ledger `Numseen[20]`.

Whenever any card was played, discarded, or revealed:
```c
Numseen[card]++;
```
During its decision phase in `comp.c`, the AI uses this ledger to evaluate probabilities:
```c
/* Example AI evaluation in comp.c:84-86 */
if (card == C_LIMIT && Numseen[C_25] == Numcards[C_25] && Numseen[C_50] == Numcards[C_50]) {
    /* If all 25 and 50 mile cards have already been played, a Speed Limit is a total freeze! */
    canstop = TRUE;
}
```

### Why It Matters
Demonstrates how perfect memory of public events enables a simple rule-based AI to simulate
advanced card-counting and deduction without needing expensive Monte Carlo simulations.

---

## 4. Binary Memory Dumps vs. Portable Serialization (`varpush.c:30-80`)

### The Technique
To implement save/restore, Arnold wrote `varpush()`:
```c
void varpush(int fd, void (*func)(int, void *, size_t)) {
    (*func)(fd, &Player, sizeof(Player));
    (*func)(fd, &Deck, sizeof(Deck));
}
```
For saving, `func` was `write()`. For restoring, `func` was `read()`.

### Why It Matters (The Anti-Pattern Lesson)
While elegant in its brevity (less than 50 lines of C!), this pattern tightly couples saved files
to compiler struct padding, integer sizes (`sizeof(int)` = 16 vs 32 vs 64-bit), and CPU endianness.
Moving a save file between different machines inevitably crashed the binary.
A modern successor must use self-describing, platform-independent serialization formats (JSON,
Protocol Buffers, or CBOR).
