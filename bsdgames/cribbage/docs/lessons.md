# Lessons from Cribbage

Pedagogical analysis of programming techniques, algorithms, and interface design
in the 1980 BSD C implementation of Cribbage.

---

## 1. Emulating Physical Mechanisms in Software (`io.c:120`, `cribcur.h:45`)

### The Technique
In a physical cribbage board, each player has **two pegs**. When scoring points, a player never
picks up the leading peg; they pick up the **trailing (rear) peg** and jump it forward past the
front peg into the new position. This physical invariant prevents disputes over where the player
started from.

Ken Arnold mirrored this physical behavior directly in curses:
```c
/* Concept from io.c */
void make_move(int player, int points) {
    int old_rear = rear_peg[player];
    int old_front = front_peg[player];
    
    /* Erase the rear peg from curses screen */
    erase_peg_at(old_rear, player);
    
    /* Rear peg leaps ahead of the front peg */
    rear_peg[player] = old_front;
    front_peg[player] = old_front + points;
    
    /* Render the new front peg */
    draw_peg_at(front_peg[player], player);
}
```

### Why It Matters
When porting physical board or card games to digital screens, preserving the tactile rituals
and visual metaphors of the original artifact significantly increases player comfort and trust.
Arnold didn't just store an integer `score`; he modeled the two physical pegs.

---

## 2. Combinatorial Scoring Algorithms (`score.c:70-160`)

### The Technique
Evaluating a 5-card Cribbage hand requires scoring all distinct subsets of sizes 2, 3, 4, and 5
that sum to 15, as well as detecting runs of lengths 3, 4, and 5. In 1980, on PDP-11 and VAX systems
with limited clock cycles, efficiency mattered.

Cohen implemented fifteen-counting using recursive/iterative subset sums over card point values
([`score.c:85`](https://github.com/vattam/BSDGames/tree/master/cribbage/score.c#L85)):
```c
/* Recursive subset sum checking for fifteen */
int fifteens(const CARD *cards, int n, int target) {
    if (target == 0) return 1;
    if (target < 0 || n == 0) return 0;
    
    /* Include cards[0] in sum OR exclude cards[0] */
    return fifteens(cards + 1, n - 1, target - cards[0].val) +
           fifteens(cards + 1, n - 1, target);
}
```

### Why It Matters
Subset sum is the prototypical NP-complete problem, but on fixed set sizes ($N=5$), recursion
with early pruning is clean, readable, and executes in microseconds. Cohen's clean separation
of hand combinations demonstrates how mathematical rules can be mapped into declarative
combinatorial routines.

---

## 3. Rule-Based Heuristic AI Without Search Trees (`support.c:45-240`)

### The Technique
Modern AI often relies on Minimax with Alpha-Beta pruning, Monte Carlo Tree Search (MCTS), or
neural networks. In 1980, terminal games had neither the compute budget nor memory for deep trees.
Earl Cohen built an expert system based on hand equity and trap heuristics:

1. **Discard Heuristic (`support.c:45`):** Evaluates all 15 possible discards. For each discard pair,
   it computes base hand score $H$ plus an empirical expected crib value $E(\text{crib})$.
   - If computer's crib: $\text{Equity} = H + E(\text{crib})$
   - If player's crib: $\text{Equity} = H - E(\text{crib})$
2. **Pegging Defense Heuristic (`support.c:165`):** Instead of calculating full permutations of
   unseen cards, Cohen encoded strategic rules:
   - Never lay a card totaling 5 or 21 (unless forced).
   - If you hold a pair, lead one to bait the opponent into pairing it, then counter with the third card.

### Why It Matters
A well-tuned heuristic system can provide a surprisingly challenging opponent without the overhead
of tree searches. For casual games, domain-specific heuristics often feel more "human" than exhaustive
search algorithms.

---

## 4. Forgiving Natural Language Parsing (`io.c:280-350`)

### The Technique
Early command-line games often failed when users made minor typos or formatted input unexpectedly.
In `getcard()`, Arnold built an extremely forgiving multi-format card parser:

```c
/* Accepts: "kd", "k d", "king of diamonds", "k" */
int getcard(CARD *c) {
    char buf[64];
    /* Parse tokens: strip whitespace, check rank keywords, check suit keywords */
    /* If rank is unique in hand, automatically infer suit */
}
```

### Why It Matters
User experience in text-based games lives and dies on input forgiveness. By allowing abbreviations,
full names, case-insensitivity, and auto-inference of unambiguous ranks, Arnold turned a potentially
tedious input process into a fluid, enjoyable interface.
