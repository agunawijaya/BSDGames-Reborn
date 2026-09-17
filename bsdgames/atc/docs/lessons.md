# `atc` — Lessons from the Original Code

> A textbook. Ed James's `atc` teaches unusually many systems
> concepts for a single ~2400-line C program.

Upstream source (not redistributed in this repo):
<https://github.com/vattam/BSDGames/tree/master/atc>

---

## Lesson 1 — `SIGALRM` + `setitimer` for Real-Time Game Loops

**File:** `main.c:163-176`
**Function:** `main()` signal setup

**What it teaches:** How to build a real-time system with periodic
work using Unix timers and signals — no threads, no polling.

**The excerpt:**

```c
struct itimerval itv;
struct sigaction sa;

sa.sa_handler = update;
sigemptyset(&sa.sa_mask);
sigaddset(&sa.sa_mask, SIGALRM);
sigaddset(&sa.sa_mask, SIGINT);
sa.sa_flags = 0;
sigaction(SIGALRM, &sa, (struct sigaction *)0);

itv.it_value.tv_sec = 0;
itv.it_value.tv_usec = 1;             // first fire in 1 microsecond
itv.it_interval.tv_sec = sp->update_secs;  // then every 5 seconds
itv.it_interval.tv_usec = 0;
setitimer(ITIMER_REAL, &itv, NULL);
```

Then in the main loop, `update()` is called *from* the SIGALRM
handler, while the main thread blocks in `getcommand()` reading
input.

**Why it matters:** Every modern game engine has a "game loop"
that ticks at regular intervals. In Unity or Unreal, it's abstracted
by the engine. Here you see the raw mechanism. Modern equivalents:
`requestAnimationFrame` (web), `SDL_AddTimer` (SDL), `Update()`
(Unity), OS-level timer callbacks. The pattern — *"tell the OS to
call me back every N seconds"* — is universal.

**Caveat:** Signal handlers may not call arbitrary libc functions
(they're not *async-signal-safe*). Ed calls `printf` and `curses`
from `update()`, which is technically undefined behaviour but works
on 1986/2003 BSD in practice. Modern code should either use
`self-pipe` trick or dedicated timer threads.

---

## Lesson 2 — Yacc/Lex for a Domain-Specific Language

**File:** `grammar.y`, `lex.l`
**Function:** `yyparse()`

**What it teaches:** How to use the classic compiler-construction
tools to parse **both** a data-file format and a live command
language, with a shared tokeniser.

**The excerpt (paraphrase — see `grammar.y`):**

```yacc
def:    update_def newplane_def width_def height_def ;

update_def:    UPDATE '=' NUMBER ';'    { sp->update_secs = $3; }
    ;

newplane_def:  NEWPLANE '=' NUMBER ';'  { sp->newplane_time = $3; }
    ;

// later, in the same grammar:

command:     plane_letter action ;
action:      altitude_cmd | turn_cmd | mark_cmd ;
altitude_cmd: 'a' altitude_val ;
```

**Why it matters:** Most programmers today assume compilers are
scary. Ed shows they're a *tool* — bring in `yacc`, describe the
grammar, get a parser for free. In games, DSLs unlock huge things:
level scripts (Doom's WAD), quest definitions (Bethesda's Papyrus),
config files (JSON, YAML, TOML — all originally parser-generated).
Understanding yacc demystifies all of them.

**Modern equivalents:** `pest` (Rust), `nom` (Rust), `chumsky`
(Rust), `Chevrotain` (TypeScript), `Instaparse` (Clojure). Same
idea, cleaner ergonomics.

---

## Lesson 3 — Command Completion via Parser State

**File:** `input.c` + `grammar.y`
**Function:** `?` in the command loop

**What it teaches:** How yacc's LALR(1) tables *know* what tokens
are valid next in the current parse — and how to expose that as a
UX feature.

**The idea:** When the user types `atla`, the parser has consumed
`a` (plane letter), `t` (turn), `l` (left). At this point, the yacc
state table records that valid continuations are `q w e a d c` (a
direction) or `a` (delay-at). If the user hits `?`, `atc` reads
that state and lists the possibilities.

**Why it matters:** Most games hard-code help text. Ed's `?` help
is **generated from the grammar** — it's guaranteed correct, guaranteed
complete, guaranteed to stay in sync with the parser. When the grammar
changes, the help changes automatically. This is the same principle
behind modern IDE autocomplete: the language server exposes parser
state to the editor.

---

## Lesson 4 — Simple Doubly-Linked List for Concurrent Entities

**File:** `list.c`, `struct.h:73-95`

**What it teaches:** How to manage a variable-sized collection of
active game entities using classic C linked-list plumbing.

**The excerpt:**

```c
// struct.h
typedef struct plane {
    struct plane *next, *prev;
    int status;
    // ... plane fields ...
} PLANE;

typedef struct {
    PLANE *head, *tail;
} LIST;

// list.c (paraphrased)
void append(LIST *l, PLANE *p) {
    p->prev = l->tail;
    p->next = NULL;
    if (l->tail) l->tail->next = p;
    else l->head = p;
    l->tail = p;
}
```

**Why it matters:** Two lists — `air` (planes in flight) and `ground`
(planes waiting at airports) — with cheap O(1) insertion and O(N)
iteration. Modern languages (C++, Rust, TS, Python) all provide
built-in dynamic arrays and linked lists. Understanding how they
work under the hood makes you a better user of them.

**Modern equivalent:** `std::list` (C++), `LinkedList` (Java),
`Vec` or `LinkedList` (Rust). But for game entities today, most
engines prefer *contiguous arrays* (ECS-style) for cache friendliness.

---

## Lesson 5 — The `SGN` / `ABS` Compact Math Trick

**File:** `def.h`, used in `update.c:94, 107-110`

**What it teaches:** How to write physics-style state updates in
one line each using compact macros.

**The excerpt:**

```c
#define SGN(x) (((x) < 0) ? -1 : ((x) > 0) ? 1 : 0)
#define ABS(x) (((x) < 0) ? -(x) : (x))

// Altitude: move ±1 toward target
pp->altitude += SGN(pp->new_altitude - pp->altitude);

// Direction: move ±1 (or ±2) toward target
dir_diff = pp->new_dir - pp->dir;
if (dir_diff > 2) dir_diff = 2;
else if (dir_diff < -2) dir_diff = -2;
pp->dir += dir_diff;
```

**Why it matters:** Think of movement as *"step toward goal, clamp
to max step size."* This is the same pattern behind PID controllers,
easing curves in animation, physics integration schemes, and
reinforcement-learning action clipping. The one-line `SGN`
expression *is* discrete calculus.

**Caveat:** Macros evaluate their argument multiple times. `SGN(f())`
calls `f()` up to twice. Use `inline` functions in modern C or
`fn` in Rust for type safety.

---

## Lesson 6 — Pair-Wise O(N²) Collision (When N Is Small)

**File:** `update.c:199-207`

**What it teaches:** When your problem size is bounded, the naive
algorithm is often the best algorithm.

**The excerpt:**

```c
for (p1 = air.head; p1 != NULL; p1 = p1->next)
    for (p2 = p1->next; p2 != NULL; p2 = p2->next)
        if (too_close(p1, p2, 1)) {
            static char buf[80];
            sprintf(buf, "collided with plane '%c'.", name(p2));
            loser(p1, buf);
        }

int too_close(const PLANE *p1, const PLANE *p2, int dist) {
    if (ABS(p1->altitude - p2->altitude) <= dist &&
        ABS(p1->xpos - p2->xpos) <= dist &&
        ABS(p1->ypos - p2->ypos) <= dist)
        return 1;
    return 0;
}
```

**Why it matters:** Modern engines use spatial hashing, quadtrees,
octrees, sweep-and-prune, and BVH acceleration — because N is
thousands or millions of entities. Ed knew his N max was ~26
(alphabet). N² = 676, trivial per tick. **Choosing the naive
algorithm is a valid choice.** Do the math on your bounds before
reaching for a data structure.

Compare `robots`, which used an *occupancy grid* for O(N) collision.
Different problem sizes → different optimum.

---

## Lesson 7 — `getopt` for Clean CLI Parsing

**File:** `main.c:84-109`

**What it teaches:** Standard POSIX way to parse command-line
options in C.

**The excerpt:**

```c
while ((ch = getopt(ac, av, "ulstpg:f:r:")) != -1) {
    switch (ch) {
    case 'u': case '?':
    default:  f_usage++;  break;
    case 'l': f_list++;   break;
    case 's': case 't': f_showscore++; break;
    case 'p': f_printpath++; break;
    case 'r': seed = atoi(optarg); break;
    case 'f': case 'g': file = optarg; break;
    }
}
```

**Why it matters:** Every serious CLI tool since the 1980s uses
`getopt` or a descendant. Colons after letters signify options
that take an argument (`g:` = `-g <value>`). Modern equivalents:
`clap` (Rust), `argparse` (Python), `commander` (Node), `cobra`
(Go). All conceptually the same — declarative option parsing.

---

## Suggested Reading Order

For a beginner:

1. **Lesson 4** (linked list) — start with a familiar data
   structure.
2. **Lesson 5** (SGN macros) — how discrete physics gets written.
3. **Lesson 7** (getopt) — practical CLI hygiene.
4. **Lesson 6** (O(N²) collision) — when the naive way wins.
5. **Lesson 1** (SIGALRM + setitimer) — the game-loop pattern.
6. **Lesson 2** (yacc/lex) — parser generators demystified.
7. **Lesson 3** (parser-state completion) — the elegant trick.

## Techniques Not Covered

- **`curses` details** — see the `ncurses` documentation.
- **`signal(2)` vs `sigaction(2)` history** — Stevens's *APUE*.
- **`utmp` / score file locking** — the file locking dance is
  interesting but tangential to gameplay.
- **The `tunable.c` compile-time defaults** — really only historic
  interest.

## See Also

- [`architecture.md`](./architecture.md) — the fuller picture.
- [`../../docs/glossary.md`](../../docs/glossary.md) — technical
  terms.
