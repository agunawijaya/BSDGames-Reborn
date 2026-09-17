# `trek` — Lessons from the Original Code

> A textbook. Eric Allman's 1976 codebase is a genuine C
> engineering artefact — every file teaches something.

Upstream source (not redistributed):
<https://github.com/vattam/BSDGames/tree/master/trek>

---

## Lesson 1 — Command Dispatch via Function-Pointer Table

**File:** `play.c:59-85`
**Function:** `Comtab[]` and `play()`

**What it teaches:** How to build an extensible command interpreter
in C using a table of `{name, function_pointer, value}` triples.

**The excerpt:**

```c
struct cvntab {
    const char *abrev;      // required prefix
    const char *full;       // continuation suffix
    void (*value)(int);     // command handler
    int   value2;           // extra int to disambiguate
};

const struct cvntab Comtab[] = {
    { "abandon",   "",        abandon,  0 },
    { "ca",        "pture",   capture,  0 },
    { "cl",        "oak",     shield,   -1 },
    // ...
    { NULL, NULL, NULL, 0 }
};

// Dispatcher:
r = getcodpar("\nCommand", Comtab);
(*r->value)(r->value2);
```

**Why it matters:** Adding a new command = adding one row to the
table. `play()` never changes. This is the **Command Pattern**
avant la lettre — Eric shipped it in 1976, and the Gang of Four
canonised it in 1994. Every modern REPL, shell, and IDE command
palette uses this idea.

Modern equivalents:

- **Enum + match** in Rust / Swift / Kotlin: `match cmd { Cmd::Warp(f) => warp(f), ... }`
- **HashMap of closures** in Python / JS / Ruby: `commands = {"warp": handler_warp, ...}`
- **Reflection-based dispatchers** (Java's `Method.invoke`, Python's `getattr`).

`trek`'s C table wins on cache locality and readability.

---

## Lesson 2 — Prefix Matching for User-Friendly Command Parsing

**File:** `getpar.c`, `Comtab[]` in `play.c`

**What it teaches:** How to accept both `srscan` and `s` without
ambiguity, by structuring commands as `{prefix, suffix}` pairs.

**The excerpt (concept):**

```c
{ "s",  "rscan",  srscan, 0 },   // matches "s", "sr", "srs", ...
{ "sh", "ield",   shield, 0 },   // matches "sh", "shi", ...
{ "st", "atus",   srscan, -1 },  // matches "st", "sta", ...
```

Any input matching only one row's prefix + suffix is dispatched.
`"s"` alone is ambiguous → the parser prompts for clarification.

**Why it matters:** This is how Vim commands work
(`:se` → `:set`). It's how CLI arg parsers auto-complete (`git
com` → `git commit`). It's how bash's built-in completion works.
Prefix trees (tries) are the general data structure; Eric's flat
table is a special case efficient for small command sets.

Modern equivalents:

- **`clap`** (Rust) — declarative CLI with auto-completion.
- **`readline`** — shell prefix matching.
- **Trie-based autocomplete** in every IDE.

---

## Lesson 3 — Snapshot-Based Rollback via `memcpy`

**File:** `trek.h:334`, event `E_SNAP` in `events.c`

**What it teaches:** How to implement game-state rollback with the
simplest possible mechanism: copy the entire state into a buffer.

**The excerpt:**

```c
// trek.h:334
char snapshot[sizeof Quad + sizeof Event + sizeof Now];

// Later, on E_SNAP event:
memcpy(Etc.snapshot, &Quad, sizeof Quad);
memcpy(Etc.snapshot + sizeof Quad, Event, sizeof Event);
memcpy(Etc.snapshot + sizeof Quad + sizeof Event, &Now, sizeof Now);

// To restore:
memcpy(&Quad, Etc.snapshot, sizeof Quad);
// etc.
```

**Why it matters:** Save/load, undo/redo, rollback netcode in
fighting games (`GGPO`, `rollback in `Street Fighter 6`), and
transaction commit/rollback in databases all use this idea. The
naïve "just copy everything" version has been rediscovered every
generation.

Trade-offs Eric knew:

- **Simple**: `memcpy` is fast.
- **Correct**: whole state, no pointers to worry about (`trek`
  uses fixed-size arrays throughout).
- **Wasteful**: copies fields that didn't change.

Modern equivalents:

- **Structural sharing** (persistent data structures) —
  Clojure, Immutable.js, Rust `Arc<T>` with copy-on-write.
- **Delta compression** — save only what changed since last
  snapshot.
- **Command sourcing / event sourcing** — reconstruct state
  from a log of events.

For small state (~a few KB), Eric's memcpy is still the right
answer.

---

## Lesson 4 — `setjmp` / `longjmp` for Game-Over Recovery

**File:** `main.c:158, 240-244`, `lose.c`

**What it teaches:** How to bail out of arbitrarily deep call
stacks in C using non-local jumps.

**The excerpt:**

```c
// main.c
jmp_buf env;

int main(...) {
    // ...
    if (setjmp(env)) {
        // We're here because someone called longjmp(env, ...).
        // Ask if the user wants another game.
        if (!getynpar("Another game")) exit(0);
    }
    do {
        setup();
        play();  // Runs forever until game over → longjmp
    } while (getynpar("Another game"));
}

// lose.c
void lose(int reason) {
    // Print message, compute score.
    longjmp(env, 1);  // Jump back to setjmp in main.
}
```

**Why it matters:** C has no exceptions. `setjmp`/`longjmp` is
the escape hatch. From any function deep in the call stack,
`longjmp` unwinds to the matching `setjmp` in O(1) — no
destructor calls, no stack unwind machinery.

Trek uses this for two things:

1. Any of the 13 loss functions can call `lose()` from anywhere.
2. `terminate` command calls `myreset` which calls `longjmp`
   directly (`play.c:88-94`).

**Caveats:**

- Skips C++ destructors → leaks (not an issue in pure C).
- Loses control-flow safety — hard to reason about.
- Modern C code prefers `Result` types or explicit error paths.
- Rust bans `longjmp` entirely.

But for a C game in 1976 without exceptions? Perfect.

---

## Lesson 5 — Parametric Difficulty as a Struct

**File:** `trek.h:275-308`, `setup.c`

**What it teaches:** How to isolate all difficulty knobs into a
single struct, then vary them by skill/length via lookup table.

**The excerpt:**

```c
struct Param_struct {
    char klings;                       // # Klingons
    double time;                        // time budget
    int klingpwr;                      // Klingon power
    double hitfac;                     // Klingon hit factor
    double damprob[NDEV];              // per-device damage prob
    double eventdly[NEVENTS];          // event delay multipliers
    char moveprob[6];                  // Klingon move state probs
    // ... 30+ more fields ...
};
extern struct Param_struct Param;
```

`setup.c` selects a row from a difficulty table indexed by
`{Game.skill, Game.length}` and fills `Param` accordingly. Every
system then reads `Param` at runtime.

**Why it matters:** **Data-driven design.** Balance-tuning
becomes editing a table, not rewriting code. Game designers can
tweak difficulty without touching engineers. Modern equivalents:

- **Excel spreadsheets** for RPG stats (Blizzard famously does
  this).
- **JSON / YAML config files** for game economies.
- **Data-oriented design** for ECS engines.
- **A/B testing** in live-service games.

Trek got there in 1976 with a struct.

---

## Lesson 6 — Event Scheduler with Priority Queue Semantics

**File:** `events.c`, `schedule.c`

**What it teaches:** How to build a discrete-event simulation
where events fire at scheduled times.

**The excerpt (concept):**

```c
struct event {
    unsigned char x, y;
    double date;        // when it fires
    char evcode;        // what happens
    unsigned char systemname;
};
#define MAXEVENTS 25
extern struct event Event[MAXEVENTS];

struct event *schedule(int type, double delta, int x, int y, int sysname);
void reschedule(struct event *e, double newdelta);
void unschedule(struct event *e);

// events(0):
// For each Event[i] with date <= Now.date + Move.time, fire it.
```

**Why it matters:** Discrete event simulation drives:

- **Network simulators** (ns-3, NS-2).
- **Business process modelling**.
- **Physics engines** (some fixed-timestep + event queues).
- **MMO server ticks** — scheduled respawns, patrols, world events.
- **Cron / systemd timers** — event-fire-at-time.

Modern equivalents:

- **Priority queue / binary heap** for O(log N) insert/extract.
- **Timer wheels** for time-bounded events (Linux kernel, Netty).
- **Async runtimes** (Tokio, asyncio) — same idea generalised.

Trek uses a flat 25-entry array + linear scan. For N=25, that's
optimal.

---

## Lesson 7 — One File Per Command

**File:** `abandon.c`, `attack.c`, ..., `warp.c` (23 command
files)

**What it teaches:** Extreme separation of concerns. Adding a
new command means adding a new file, one line in the dispatch
table, and one prototype in `trek.h`.

**Why it matters:** For a 1976 codebase, this is unusually
disciplined. Compare to games of the same era where entire game
logic often lived in one file. Eric's discipline made:

- **Parallel development possible** — multiple people can edit
  different commands.
- **Testing per command** — swap in a mock, unit-test a command.
- **Diffs readable** — a change to `phasers` doesn't touch
  `move`.

Modern equivalents:

- **Microservices** — same principle, network-boundary
  separated.
- **Single-responsibility principle** (SOLID).
- **Command handlers in CQRS** — one class per command.

But there's a cost: **55 files for a game.** Overkill for
`hangman`. Right for `trek`. Judgement.

---

## Lesson 8 — RNG Primitive Split: `ranf(n)` and `franf()`

**File:** `ranf.c`

**What it teaches:** Provide two clean primitives — bounded int
and unit float — and let all game code use them consistently.

**The excerpt:**

```c
int ranf(int max) { return rand() % max; }
double franf(void) { return rand() / (double)RAND_MAX; }
```

**Why it matters:** Discipline. Every RNG use site can be
grepped — `ranf(` or `franf(`. No hidden `rand()` sprinkled.
Testing becomes possible: swap `ranf` with a deterministic
implementation.

Modern equivalents:

- **`thread_rng()`** in Rust with `.gen_range(0..max)` and
  `.gen::<f64>()`.
- **`random.randint(a, b)`** and **`random.random()`** in Python.
- **Deterministic PRNG** for tests (Rust `rand_pcg`, Python
  `random.seed`).

`ranf` has the classic `rand() % max` bias (see earlier
`robots` lesson). For a game, negligible.

---

## Lesson 9 — Portable-Terminal-Speed Detection

**File:** `main.c:187-191`

**What it teaches:** How to adapt UX to the terminal without
asking the user.

**The excerpt:**

```c
if (tcgetattr(1, &argp) == 0) {
    if (cfgetispeed(&argp) < B1200)
        Etc.fast++;
}
```

If the terminal is < 1200 baud, enable "fast mode" (skip
animations). Otherwise, run the full sequences.

**Why it matters:** UX adapts to constraints. Modern equivalents:

- **`prefers-reduced-motion` CSS media query** — same idea for
  users with vestibular sensitivity.
- **Bandwidth-aware UIs** — high-quality vs low-quality streams.
- **Battery-aware apps** — reduce animation when battery low.

Trek adapts to the terminal it's on. Modern software adapts to
the user it's serving. Same principle.

---

## Suggested Reading Order

For a beginner learning from `trek`:

1. **Lesson 1** (command table) — the core pattern.
2. **Lesson 2** (prefix matching) — UX detail.
3. **Lesson 8** (RNG discipline) — quick and universal.
4. **Lesson 5** (parametric difficulty) — data-driven design.
5. **Lesson 7** (one file per command) — modularity philosophy.
6. **Lesson 6** (event scheduler) — discrete event simulation.
7. **Lesson 4** (setjmp/longjmp) — non-local control.
8. **Lesson 3** (memcpy snapshot) — game-state rollback.
9. **Lesson 9** (terminal speed detection) — adaptive UX.

## Techniques Not Covered

- **Klingon AI FSM** — worth its own study; too involved for a
  short lesson.
- **The `cvntab` full parser** — see `getpar.c` for details.
- **The 13-lose-code enumeration** — good example of a domain
  taxonomy but not a transferable technique.

## See Also

- [`architecture.md`](./architecture.md) — the whole picture.
- [`../../docs/glossary.md`](../../docs/glossary.md) — technical
  terms.
