# Lessons from `dab`

`dab` is a tidy example of object-oriented game programming in C++ and
of writing a heuristic AI for a combinatorial game.

---

## 1. Model the Domain with Classes

The program separates concerns into small, focused classes:

- `BOARD` — board state and move application.
- `BOX` — view of a single box's edges.
- `PLAYER` / `HUMAN` / `ALGOR` — player behaviour.
- `GAMESCREEN` / `TTYSCRN` — terminal rendering.

**Why it matters:** Separating state, logic, and presentation makes
the code easier to test and port.

## 2. Use Local Search for Simple Games

The AI does not search the full game tree. It looks for immediate
closures, safe moves, and least-damaging sacrifices.

> **File:** `BSDGames-master/dab/algor.cc:296-314`

```cpp
void ALGOR::play(const BOARD& b, size_t& y, size_t& x, int& dir) {
    if (find_max_closure(y, x, dir, b))
        return;
    if (find_good_turn(y, x, dir, b))
        return;
    if (find_min_closure(y, x, dir, b))
        return;
}
```

**Why it matters:** For many games, a well-chosen set of local
heuristics is strong enough and far cheaper than minimax.

## 3. Make a Copy of the Board to Simulate Moves

The AI frequently copies the board (`BOARD nb(b)`) so it can simulate
moves without affecting the real game state.

> **File:** `BSDGames-master/dab/algor.cc:137` / `191` / `243`

**Why it matters:** Immutable scratch copies make search code safer
and easier to reason about.

## 4. Randomise Iteration to Vary Gameplay

The `RANDOM` class shuffles the order in which the AI scans the board,
so the same position can lead to different moves in different games.

> **File:** `BSDGames-master/dab/algor.cc:65-66`

```cpp
RANDOM rdy(b.ny()), rdx(b.nx());
```

**Why it matters:** Deterministic AI can feel robotic. Small random
variations keep repeated games interesting.

## 5. Treat Curses as a Replaceable Backend

The `GAMESCREEN` abstraction isolates ncurses calls, so the core game
logic does not depend on terminal details.

**Why it matters:** A clear screen abstraction simplifies ports to
GUI, web, or test harnesses.

## See Also

- [`architecture.md`](./architecture.md) — full control-flow analysis.
- [`spec.md`](./spec.md) — formal rules.
- [`references.md`](./references.md) — sources.
