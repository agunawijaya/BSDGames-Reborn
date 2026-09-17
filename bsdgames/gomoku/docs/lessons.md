# `gomoku` — Lessons from the Original Code

> A textbook. Techniques from Ralph Campbell's AI worth learning.

Upstream source (not redistributed in this repo):
<https://github.com/vattam/BSDGames/tree/master/gomoku>

---

## Lesson 1 — Pre-enumerating Static Patterns

**File:** `bdinit.c`
**Function:** `bdinit()`

**What it teaches:** How to convert an expensive per-move query
into a cheap lookup, by enumerating patterns once at startup.

**The idea:** every possible 5-in-a-row line on the 19×19 board is
enumerated at startup — about 1020 frames. Each empty cell keeps a
list of "frames I belong to" (`spotstr::s_frame[4]`). At move time,
we only re-evaluate the ~4 frames containing that cell, not the
entire board.

**Why it matters:** This is the classic *static-vs-dynamic*
trade-off in algorithmic design. Precompute the invariant part;
recompute only what changed. Applies broadly: Bloom filters
(precomputed hash mask), regex NFAs (precomputed state graph),
game engines (precomputed collision meshes), physics engines
(precomputed inertia tensors).

**See also:** `architecture.md` §Data Structures.

---

## Lesson 2 — Union Type for Bit-Packed Values

**File:** `gomoku.h` (approx., see `union comboval`)

**What it teaches:** How to use a C union to have your data both
ways: as an integer for fast comparison, and as named fields for
readable access.

**The excerpt (typical form):**

```c
union comboval {
    struct {
        u_char a;
        u_char b;
    } c;
    u_short s;
};
```

Then:

```c
// Fast comparison as short
if (sp->s_combo[color].s < sp1->s_combo[color].s) return 1;

// Readable access as fields
cb.c.a = ocb.c.a + 1;
cb.c.b = 0;
```

**Why it matters:** In performance-sensitive code, comparing a
struct field-by-field is slower than a single integer comparison.
Union lets you write `if (a.s < b.s)` (one integer compare) instead
of `if (a.c.a < b.c.a || (a.c.a == b.c.a && a.c.b < b.c.b))` (two
compares with short-circuit).

**Caveat:** endianness. On big-endian machines, the byte order of
`c.a` and `c.b` inside `s` differs. `gomoku` assumes little-endian
via `#include <sys/endian.h>` (see `robots.h:35` in sibling code)
but the code works because the *ordering property* isn't required
— only that the combo values compare consistently.

Modern C++ / Rust use tagged unions or `union` inside `struct`
carefully — same idea.

---

## Lesson 3 — Depth-Limited Search

**File:** `pickmove.c:334-335`

**What it teaches:** How to give an AI a "budget" that automatically
adjusts to the phase of the game.

**The excerpt:**

```c
d = 2;
while (d <= ((movenum + 1) >> 1) && combolen > n) {
    ...
    addframes(d);
    d++;
}
```

**Why it matters:** In early game (movenum small), the search depth
is limited. As the game progresses, deeper composition becomes both
*possible* (more frames are alive) and *necessary* (positions are
sharper). This automatic budget-scaling is elegant.

Modern equivalents: iterative deepening in chess engines, dynamic
policy in reinforcement learning ("explore early, exploit late"),
adaptive step sizes in numerical methods.

---

## Lesson 4 — Bit-Packed Set for Move Filtering

**File:** `pickmove.c:51-56`

**What it teaches:** How to represent a set of board positions as
a bitmap for fast intersection operations.

**The excerpt:**

```c
#define BITS_PER_INT    (sizeof(int) * CHAR_BIT)
#define MAPSZ           (BAREA / BITS_PER_INT)

#define BIT_SET(a, b)   ((a)[(b)/BITS_PER_INT] |= (1 << ((b) % BITS_PER_INT)))
#define BIT_CLR(a, b)   ((a)[(b)/BITS_PER_INT] &= ~(1 << ((b) % BITS_PER_INT)))
#define BIT_TEST(a, b)  ((a)[(b)/BITS_PER_INT] & (1 << ((b) % BITS_PER_INT)))
```

Then in `updatecombo()` at `pickmove.c:1034-1039`:

```c
if (nforce == 0)
    memcpy(forcemap, tmpmap, sizeof(tmpmap));
else {
    for (i = 0; (unsigned int)i < MAPSZ; i++)
        forcemap[i] &= tmpmap[i];    // set intersection
}
```

**Why it matters:** Intersecting two sets of ~400 elements takes
~13 integer AND operations. Compare that to a boolean array
(~400 byte-ANDs) or a `set<int>` (a full traversal).

Modern equivalents: `std::bitset`, `roaring` bitmaps (used in
Elasticsearch), bloom filters, GPU compute masks. Same idea — pack
booleans, use hardware to intersect fast.

---

## Lesson 5 — Hashing for Deduplication

**File:** `pickmove.c:58, 1268-1281`
**Function:** `sortcombo()`

**What it teaches:** How to avoid double-work in combinatorial
search by hashing the "identity" of a candidate solution.

**The idea:** When composing combos, the same set of frames might
be reached by different composition orders. To avoid enumerating
the same combo twice, the code hashes the sorted list of frames
into `hashcombos[]` and checks equality on hit.

**The excerpt (simplified):**

```c
cbp = hashcombos[inx = *scbpp - frames];
if (cbp == NULL) {
    // first time we've seen this combo — add to hash
    hashcombos[inx] = new_combo;
    return 0;
}
do {
    // linear search in bucket for exact match
    if (list_eq(new_combo_frames, existing_frames, n))
        return 1;  // seen before
} while (...);
```

**Why it matters:** Memoisation, dynamic programming, and search
tree pruning all rely on the ability to say "have I seen this state
before?" cheaply. `gomoku` uses a simple hash table keyed on the
first frame of the sorted combo — good enough here because the
bucket sizes are small.

Modern equivalent: transposition tables in chess engines. Same
idea, more sophisticated key.

---

## Lesson 6 — Iterative-Deepening Composition

**File:** `pickmove.c:333-345`
**Function:** `scanframes()`

**What it teaches:** How to build a search from level to level
without repeating work.

**The idea:** Level-2 combos (pairs of frames) are built first.
Level-3 combos are built by extending level-2 combos with an
additional frame — never from scratch. Level-4 extends level-3.
This is iterative deepening with memoisation.

**Why it matters:** Chess engines do this at a much larger scale
(iterative deepening depth-first search + transposition table).
Modern MCTS also builds a tree incrementally. The pattern —
"build cheap, extend, cache" — is universal.

---

## Lesson 7 — Debug Interpreter Baked In

**File:** `main.c:355-491`
**Function:** `whatsup()`

**What it teaches:** How to build a REPL-like debugger *into* your
program, activated by signal.

**The excerpt (simplified):**

```c
#ifdef DEBUG
void whatsup(signum) int signum;
{
    ...
    top:
    ask("cmd? ");
    getline(fmtbuf, sizeof(fmtbuf));
    switch (*fmtbuf) {
    case 'q': quit();
    case 'p': /* print values at spot */
    case 's': /* suggest a move for color */
    case 'b': /* back up */
    case 'f': /* forward */
    ...
    }
    goto top;
}
#endif
```

**Why it matters:** Long before `gdb` was ubiquitous or IDE
debuggers were fast, a "signal → interactive prompt" was a way to
poke a running program. Modern equivalents: Python's `pdb.set_trace()`,
Node's `debugger` keyword, Rust's `rr` recorder. The insight —
*build the debugger into the program if the program is complex
enough to warrant it* — is timeless.

**In the port:** consider a similar debug REPL for the AI. It
massively speeds iteration.

---

## Suggested Reading Order

For a beginner interested in game-AI:

1. **Lesson 1** (pre-enumerated patterns) — the foundational speedup.
2. **Lesson 2** (union types) — small but pervasive.
3. **Lesson 3** (depth-limited search) — see the game-theoretic
   intuition.
4. **Lesson 6** (iterative composition) — how the AI actually
   builds its search.
5. **Lesson 4** (bitmap sets) — a general-purpose data-structure
   lesson.
6. **Lesson 5** (hash-based dedup) — memoisation in disguise.
7. **Lesson 7** (embedded debugger) — a productivity idea.

## Techniques Not Covered

- The `curses` UI (`bdisp.c`) — see the `ncurses` documentation.
- Move parsing (`stoc.c`) — trivial coordinate math.
- Save/load (`main.c:264-267`) — a plain text format.

## See Also

- [`architecture.md`](./architecture.md) — the fuller picture.
- [`../../docs/glossary.md`](../../docs/glossary.md) — technical
  terms.
