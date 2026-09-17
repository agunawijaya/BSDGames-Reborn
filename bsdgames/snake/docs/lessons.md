# `snake` — Lessons from the Original Code

Upstream source (not redistributed in this repo):
<https://github.com/vattam/BSDGames/blob/master/snake/snake/snake.c>

---

## Lesson 1 — Shared Primitives (`chase()` for AI and setup)

**File:** `snake.c:242-243` (setup use), and inside `pushsnake()`
(AI use).
**Function:** `chase()`

**What it teaches:** A well-designed primitive can serve multiple
purposes. Look for symmetry in your problem and factor it out.

**The excerpt (setup):**

```c
// snake.c:240-243
snrand(&snake[0]);
for (i = 1; i < 6; i++)
    chase(&snake[i], &snake[i - 1]);
```

**And in `pushsnake()`** (paraphrased):

```c
// AI move: head chases player
chase(&snake[0], &you);
```

**Why it matters:** Recognising that "follow a target" is the same
operation whether you're initialising a chain or running an AI is
insight. Contrast this with a hypothetical implementation that
has `place_snake_segments()` and `move_snake_head()` as separate
functions — twice the code, twice the surface for bugs.

Modern equivalents: functional composition, higher-order functions,
strategy pattern. Same idea.

---

## Lesson 2 — Dynamic Scoring via Empirical Formula

**File:** `snake.c:216-233`

**What it teaches:** Sometimes the best "algorithm" is a
hand-crafted formula fit to empirical data points.

**The excerpt:**

```c
// snake.c:216-223 (comment)
/*
 * chunk is the amount of money the user gets for each $.
 * The formula below tries to be fair for various screen sizes.
 * ...
 * This formula is a hyperbola which includes the following points:
 *    (24, $25)    (original scoring algorithm)
 *    (12, $40)    (experimentally derived by the "feel")
 *    (48, $15)    (a guess)
 */
if (i < 12) i = 12;
i += 2;
chunk = (675.0 / (i + 6)) + 2.5;
```

**Why it matters:** In game design, "playtesting until it feels
right" is a legitimate methodology. The formula here isn't
derived from theory — it's a hyperbola *fitted to three data
points that felt fair in playtesting*. This is a good introduction
to the concept of *game feel* as a rigorous engineering concern.

Modern equivalents: play-tuning in AAA games (Elo curves,
progression pacing), difficulty curves in game economy design.

---

## Lesson 3 — Rejection Sampling with Explicit Zones

**File:** `snake.c:418-425`

**What it teaches:** How to place random entities while respecting
multiple constraints — cleanly.

**The excerpt:**

```c
do {
    snrand(&money);
} while ((money.col == finish.col && money.line == finish.line) ||
         (money.col < 5 && money.line == 0) ||
         (money.col == you.col && money.line == you.line));
```

**Why it matters:** Rejection with multiple explicit exclusion
zones — one for the exit, one for the score display, one for the
player. Compact, readable, and correct. This is exactly the
pattern you'd use for spawn systems in modern games: reject
spawn point if inside safe zone, on top of another spawn, or in
a level-specific exclusion area.

**See also:** [`../../robots/docs/lessons.md`](../../robots/docs/lessons.md)
Lesson 3 for a purer version of rejection sampling.

---

## Lesson 4 — Macros as Named Constants and Small DSLs

**File:** `snake.c:84, 90-94, 100-101`

**What it teaches:** How C's preprocessor was used before `enum`
and `inline` were universal.

**The excerpt:**

```c
#define PENALTY  10        /* % penalty for invoking spacewarp */
#define ME        'I'
#define SNAKEHEAD 'S'
#define SNAKETAIL 's'
#define TREASURE  '$'
#define GOAL      '#'
#define pchar(point, c) mvaddch((point)->line + 1, (point)->col + 1, (c))
#define delay(t)        usleep(t * 50000);
```

**Why it matters:** Two idioms shown together:

1. **Named single-value constants.** Modern C uses `const int` or
   `enum` for the same purpose. In K&R C, `#define` was the tool.
2. **Function-like macros.** `pchar(point, c)` is a tiny domain-
   specific mini-language: "draw character c at point". This
   improves readability of the calling code enormously; compare
   `pchar(&you, ME)` with `mvaddch(you.line + 1, you.col + 1, 'I')`.

**Caveat:** macros lack type safety and evaluate arguments
multiple times if not careful. Modern languages provide `inline`
functions or `constexpr` for the same benefits with type safety.

---

## Lesson 5 — Single-File Programs

**File:** `snake.c` — the whole game.

**What it teaches:** Not every project needs a folder tree of
`src/`, `lib/`, `include/`. Sometimes one file is *right*.

**Why it matters:** ~1000 lines. Complete game. One file. When
you're evaluating an architecture, ask: is the boundary between
files an aid to comprehension, or friction? For `snake`, one file
lets a reader see everything. For `gomoku` (also considered),
the split into `main`, `bdinit`, `bdisp`, `pickmove`, `makemove`
is genuinely helpful.

Modern lesson: don't over-partition small programs. Also don't
under-partition large ones. Judgement, not rule.

---

## Lesson 6 — File-Scope Globals for State

**File:** `snake.c:103-116`

**What it teaches:** How pre-`struct-of-state` C organised state
— all in globals — and why it's *usually* wrong today.

**The excerpt:**

```c
struct point you;
struct point money;
struct point finish;
struct point snake[6];

int loot, penalty;
int moves;
int fast = 1;

int rawscores;
FILE *logfile;

int lcnt, ccnt;
int chunk;
```

**Why it matters:** Every function sees every state variable.
Any function can mutate anything. Testing is nearly impossible —
you can't spin up two independent games in the same process.

**In the port:** the very first refactor should be encapsulating
these into a `GameState` struct passed to every function. This is
a small change with big benefits: testability, thread-safety,
multi-instance play.

---

## Suggested Reading Order

1. **Lesson 6** (globals) — background for reading everything else.
2. **Lesson 5** (single-file) — orient yourself.
3. **Lesson 1** (`chase()`) — the elegant reuse pattern.
4. **Lesson 3** (rejection with zones) — the RNG-placement idiom.
5. **Lesson 2** (empirical scoring) — game design as engineering.
6. **Lesson 4** (macros) — C preprocessor as a tool.

## Techniques Not Covered

- `curses` API — see external docs.
- `usleep()` for delay — obsolete on modern systems; use monotonic
  clocks or async timers instead.
- Signal handling — same as `robots`.

## See Also

- [`architecture.md`](./architecture.md).
- [`../../docs/glossary.md`](../../docs/glossary.md).
