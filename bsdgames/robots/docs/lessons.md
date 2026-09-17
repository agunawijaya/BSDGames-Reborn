# `robots` — Lessons from the Original Code

> A textbook. For each interesting technique in the original C
> source, a lesson entry with file:line reference, excerpt, and
> explanation of why it matters and where the same idea appears in
> modern code.

Upstream source (not redistributed in this repo):
<https://github.com/vattam/BSDGames/tree/master/robots>

---

## Lesson 1 — Collision via Occupancy Count

**File:** `robots.h:107` (declaration), `move_robs.c:65, 76, 88` (usage)
**Function:** `move_robots()`

**What it teaches:** How to detect collisions between many mobile
entities in O(1) per entity, without pair-wise checking.

**The excerpt:**

```c
// robots.h:107
extern char Field[Y_FIELDSIZE][X_FIELDSIZE];

// move_robs.c:64-76 (excerpt)
for (rp = Robots; rp < &Robots[MAXROBOTS]; rp++) {
    if (rp->y < 0) continue;
    mvaddch(rp->y, rp->x, ' ');
    Field[rp->y][rp->x]--;                       // leaving old cell
    rp->y += sign(My_pos.y - rp->y);
    rp->x += sign(My_pos.x - rp->x);
    // ... clamp to bounds ...
    Field[rp->y][rp->x]++;                       // arriving in new cell
}

// move_robs.c:88 (collision test)
else if (Field[rp->y][rp->x] > 1) {
    /* multiple things landed here — everyone dies */
}
```

**Why it matters:** Every game engine has to answer "did anything
collide?" The naive approach is O(N²): compare every entity to every
other. `robots` shows an O(N) alternative when the world is discrete:
maintain an occupancy grid, and detect collision as
*count > 1 on any cell*. This is the same idea as spatial hashing in
modern engines (Unity, Godot, Unreal all provide it), and it appears
in Conway's Game of Life, Minecraft's chunk system, and every 2D
tile-based game. `robots` gets it in a byte array.

**See also:** `architecture.md` §AI Logic, `spec.md` §Rules.

---

## Lesson 2 — Trivial AI via `sign()`

**File:** `move_robs.c:66-67, 144-153`
**Function:** `sign()` and the AI inside `move_robots()`

**What it teaches:** Sometimes the "best" algorithm is *no
algorithm*. Design can be more important than technique.

**The excerpt:**

```c
// move_robs.c:66-67
rp->y += sign(My_pos.y - rp->y);
rp->x += sign(My_pos.x - rp->x);

// move_robs.c:144-153
int sign(n)
    int n;
{
    if (n < 0) return -1;
    else if (n > 0) return 1;
    else return 0;
}
```

**Why it matters:** Beginners often assume "smarter AI = better
game." `robots` is a rebuttal. The AI is *deliberately trivial* so
that (a) the player has agency to exploit predictable behaviour, and
(b) computational cost is zero. Modern game design uses the same
insight: enemy behaviour in Pac-Man is a set of tiny state machines;
in Space Invaders it's a lookup table. Even in modern games like
*Vampire Survivors*, most enemies follow trivial "step toward
player" behaviour. Complexity ≠ good gameplay.

**See also:** [`architecture.md`](./architecture.md) §AI Logic.

---

## Lesson 3 — Rejection Sampling for Uniform Random Placement

**File:** `rnd_pos.c:49-62`
**Function:** `rnd_pos()`

**What it teaches:** The simplest correct algorithm for "pick a
random empty cell": pick a random cell, retry if occupied.

**The excerpt:**

```c
// rnd_pos.c:49-62
COORD *
rnd_pos()
{
    static COORD pos;
    do {
        pos.y = rnd(Y_FIELDSIZE - 1) + 1;
        pos.x = rnd(X_FIELDSIZE - 1) + 1;
        refresh();
    } while (Field[pos.y][pos.x] != 0);
    return &pos;
}
```

**Why it matters:** Rejection sampling is a foundational technique
in probability and simulation. It gives you uniform sampling from a
subset of a larger domain when direct sampling from the subset is
hard. Modern uses include: Monte Carlo integration, rejection
sampling in Bayesian inference (e.g. Metropolis-Hastings), random
level generation in games, and cryptographic uniform bounded-random
functions.

The performance caveat is intuitive: if 99% of cells are occupied,
you retry a lot. `robots`' peak density is ~3% (40 robots on 1380
cells), so rejection is fine. But as a general rule: **rejection
sampling is elegant when your acceptance rate is decent**.

**See also:** [`architecture.md`](./architecture.md) §Random Events.

---

## Lesson 4 — PID as RNG Seed

**File:** `main.c:165`

**What it teaches:** How to get "good enough" randomness with zero
system dependencies.

**The excerpt:**

```c
// main.c:165
srand(getpid());
```

**Why it matters:** In 1984 there was no `/dev/urandom`, no
`arc4random`, no `random()` with a large state. `getpid()` gave you
a 16-bit or 32-bit unique-per-invocation number "for free."
Modern seeding uses monotonic clocks, hardware RNG, and OS-managed
entropy pools — but the Unix philosophy of "use what's available"
is still exemplary. Compare `srand(time(NULL))` (predictable if you
know the second) and `srand(getpid())` (predictable if you know the
PID). Neither is cryptographically secure. Both are fine for games.

**See also:** [`architecture.md`](./architecture.md) §Seed.

---

## Lesson 5 — `setjmp` / `longjmp` for Non-Local Control Flow

**File:** `robots.h:117` (declaration), `play_level.c:70` (setjmp),
`move_robs.c:112` (longjmp)

**What it teaches:** How to escape deeply-nested control flow
without unwinding manually. C's answer to exceptions.

**The excerpt:**

```c
// robots.h:117
extern jmp_buf End_move;

// play_level.c:70
setjmp(End_move);
while (!Dead && Num_robots > 0) { ... }

// move_robs.c:109-113
if (was_sig) {
    refresh();
    if (Dead || Num_robots <= 0)
        longjmp(End_move, 0);
}
```

**Why it matters:** In real-time mode, robots move on a `SIGALRM`
signal — potentially in the middle of `get_move()` waiting for
input. When the signal handler wants to abort the current turn, it
can't just `return` (it's in a different call stack). `longjmp`
jumps directly back to the `setjmp` point in `play_level()`. Modern
languages provide exceptions, `panic!`/recover, or coroutines for
the same purpose. Understanding `setjmp`/`longjmp` demystifies all
of them.

**Caveat:** `longjmp` skips destructors and can leak resources. In
`robots` there are no resources at risk. In a modern language,
prefer exceptions or Result-like error types.

**See also:** [`../../docs/glossary.md`](../../docs/glossary.md).

---

## Lesson 6 — Global State + Extern Declarations

**File:** `robots.h:100-115`, `extern.c`

**What it teaches:** The pre-`static` style of sharing state
between C compilation units — common in 1980s Unix source.

**The excerpt:**

```c
// robots.h:100-101
extern bool Dead, Full_clear, Jump, Newscore, Real_time, Running,
    Teleport, Waiting, Was_bonus, Auto_bot;

// extern.c: the actual definitions
bool Dead, Full_clear, Jump, ...;
```

**Why it matters:** Modern style would encapsulate state in a
`struct GameState *`, pass pointers, avoid globals. In 1984 the
compiler didn't check enough, the linker was primitive, and the
performance cost of pointer indirection was measurable. Globals
were the norm. Reading old C teaches you to *see* the state graph
even when it's not explicit in function signatures.

For the port: encapsulate all this into a proper `struct` or module.
It's not a stylistic upgrade; it's necessary for testability and
multi-instance play (imagine two `robots` games running side by
side).

---

## Lesson 7 — K&R Function Definition Style

**File:** everywhere. Example: `move_robs.c:47-50`.

**What it teaches:** How pre-ANSI C looked, so you can read old
codebases.

**The excerpt:**

```c
void
move_robots(was_sig)
    int was_sig;
{
    ...
}
```

vs. modern:

```c
void
move_robots(int was_sig)
{
    ...
}
```

**Why it matters:** Anyone reading old C — kernel, embedded, BSD
utilities — will encounter K&R signatures. Recognising them is the
difference between "confused for 10 minutes" and "OK, moving on."
Both styles compile with modern C compilers. K&R style is
deprecated but not removed.

---

## Suggested Reading Order

For a beginner starting with this game:

1. **Lesson 2** (trivial AI) — the design philosophy.
2. **Lesson 1** (occupancy grid) — the core data trick.
3. **Lesson 3** (rejection sampling) — the RNG method.
4. **Lesson 4** (PID seed) — small but memorable.
5. **Lesson 6** (globals) — helps read the rest.
6. **Lesson 5** (setjmp/longjmp) — a niche gem.
7. **Lesson 7** (K&R style) — background knowledge for reading old C.

## Techniques Not Covered

- `curses` library API — too broad; see the `ncurses`
  documentation and [`glossary.md`](../../docs/glossary.md).
- Signal handling details — see `signal(7)` and `sigaction(2)`.
- The `SCORE` file format — a niche binary layout; see
  [`spec.md`](./spec.md).

## See Also

- [`architecture.md`](./architecture.md) — the fuller picture the
  lessons draw from.
- [`../../docs/glossary.md`](../../docs/glossary.md) — technical
  terms.
