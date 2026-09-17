# `sail` — Lessons from the Original Code

> A textbook. `sail` teaches multi-process IPC via files, a
> technique that reappears throughout Unix history.

Upstream source (not redistributed):
<https://github.com/vattam/BSDGames/tree/master/sail>

---

## Lesson 1 — `link()`-Based Mutual Exclusion

**File:** `sync.c`
**Function:** the `sync_open` / `sync_release` pair

**What it teaches:** How to build mutual exclusion using only
POSIX `link()` semantics — no `flock()`, no `fcntl()`, no
kernel help.

**The pattern:**

```c
for (n = 0; link(sync_file, sync_lock) < 0 && n < 30; n++)
    sleep(2);
// Critical section: sync_lock exists and only I have it.
// ... read/write sync_file ...
unlink(sync_lock);
```

**Why it works:** Unix guarantees a hard link points to exactly
one underlying file. If `link()` succeeds, the atomic operation
in the kernel means only one process at a time can create the
link name. Others fail with `EEXIST` and busy-wait.

**Why it matters:** This trick was widely used in early Unix.
Modern equivalents:

- **`flock(2)`** — advisory file locks.
- **`fcntl(F_SETLK)`** — record locking.
- **`open(O_CREAT | O_EXCL)`** — atomic file creation
  (semantically identical to `link` for locking).
- **Distributed locks** — Redis `SETNX`, ZooKeeper ephemeral
  nodes.

`sail` (via Cohen's "pubcaves") pioneered this pattern in a
game context.

**Caveat:** the man page admits it's imperfect. On crash
recovery, `fsck` sometimes found stale locks. Real-world
robustness = 99%, not 100%.

---

## Lesson 2 — Two-Program Architecture via `fork()`

**File:** `pl_main.c`, `dr_main.c`, driver-fork logic in
`pl_main`

**What it teaches:** How to cleanly separate concerns via
process boundaries — one process per player, plus a shared
world-simulation process.

**The pattern:**

```c
if (first_player) {
    if (fork() == 0) {
        // Child becomes the driver
        driver_main();
    }
}
// Parent continues as player process
player_main();
```

**Why it matters:** Separation of concerns:

- **Player process**: handles UI, input, per-player display.
- **Driver process**: runs computer ships, resolves turns,
  maintains global state.

This is **actor-model** avant la lettre. Modern equivalents:

- **Microservices** — different services for different concerns.
- **Erlang / Elixir actors** — process per entity.
- **Web workers** — offload work from UI thread.
- **Game server / client split** — universal in networked games.

`sail`'s split matches almost exactly the modern client-server
game architecture, just implemented locally with `fork()` and a
tempfile.

---

## Lesson 3 — Tempfile as a Shared Database

**File:** `sync.c`, message-passing infrastructure

**What it teaches:** How to use a plain file as an ad-hoc
multi-process database.

**The pattern:**

```c
// Player 1 wants to move:
lock();
seek_to_ship_record(my_ship_id);
write_command_to_ship_record(cmd);
unlock();

// Driver reads:
lock();
for each ship: read_command_from_ship_record;
resolve_turn();
for each ship: write_updated_state;
unlock();
```

**Why it matters:** This is a **shared-memory database**
implemented via file I/O. Modern equivalents:

- **SQLite** — file-based DB with locking.
- **Redis** — in-memory shared state.
- **Shared memory** (`shmget`, POSIX shm) — proper mechanism.
- **Memory-mapped files** (`mmap`) — modern efficient version.

`sail` uses the crudest form and still works. Sometimes the
crudest form is enough.

---

## Lesson 4 — Poll-Cycle Pipelining as UX Discipline

**File:** `pl_*.c` main loop

**What it teaches:** How to make a slow polling-based system
feel responsive through **command pipelining**.

**The pattern:** The player process polls the tempfile every 7
seconds. Between polls, the user can type commands that get
buffered. When the poll happens, all buffered commands are
written to the file. Meanwhile, driver's already processed the
previous batch.

**Result**: end-to-end latency of 7-21 seconds per command, but
if the user types a command *before* seeing the previous one's
result, the pipeline stays full.

**Why it matters:** Modern web apps use this exact pattern:

- **Optimistic UI updates** — show the intended state immediately,
  fix it if the server disagrees.
- **Debouncing** — accumulate user input, send in batches.
- **React batching** — DOM updates coalesce.
- **Netcode** — client predicts, server confirms.

The man page even names it *"pipelining"* — surprising for 1980.

---

## Lesson 5 — Scenario Data as a Table

**File:** `game.c`, `parties.c`, `globals.c`

**What it teaches:** How to encode 32 different historical
scenarios as data rather than code.

**The pattern:** A scenario is a structure with:

- Ship count
- Ship specs (which class, which nation, which crew quality)
- Starting positions
- Wind conditions

Adding a new scenario = adding a table entry. Adding a new ship
class = adding a row to the ship class table.

**Why it matters:** **Data-driven design**. Same principle as
D&D character sheets, Diablo item drops, and every RPG progression
table. Modern equivalents:

- **JSON / YAML / TOML** for game content.
- **CSV** for spreadsheet-driven balance.
- **Level editors** exporting data files.
- **Steam Workshop** for community-authored content.

`sail`'s 32 scenarios are the ancestor of every scenario editor
in every strategy game since.

---

## Lesson 6 — 2-Character Ship Encoding

**File:** display rendering

**What it teaches:** How to pack a surprising amount of info into
2 characters using **case, symbol substitution, and glyph
variation**.

**The encoding:**

- `b0` = British ship #0, battle sails.
- `B0` = British ship #0, **full sails** (uppercase = full).
- `!0` = surrendered.
- `~0` = sinking.
- `#0` = on fire.
- `a&` = British ship #0 captured by American (number substituted).

That's **nation, number, sail state, and status** in 2 chars.

**Why it matters:** Information density in constrained UI. Modern
equivalents:

- **Icon systems** (Slack, Discord user status).
- **Emoji conventions** in social networks.
- **Terminal escape codes** for colour.
- **CSS classes** applied via state.

Terminal games force you to think about density. `sail` does it
beautifully.

---

## Lesson 7 — Historical Data as Balance Anchor

**File:** scenario tables in `parties.c`

**What it teaches:** How to use real history as game balance —
Elite American crews, Mundane British crews after long deployment,
etc.

**Why it matters:** The scenarios are *not* balanced 50/50 — they
reflect historical realities. Playing Guerriere with Mundane crew
against Constitution with Elite crew is losing by design, because
that's what history shows.

Modern game equivalents:

- **XCOM: Enemy Unknown** difficulty tiers reflecting real-world
  military scenarios.
- **Total War series** — historical battle scenarios.
- **Hearts of Iron** — WWII asymmetry preserved.
- **World in Conflict** — Cold War scenarios.

`sail` was doing serious wargaming in an era of pure arcade.

---

## Lesson 8 — Colorful Man Page as Documentation

**File:** `sail.6`

**What it teaches:** How to write documentation that's genuinely
readable, entertaining, and historically informative.

**The excerpt (from man page):**

> *"I wrote the first version of Sail on a PDP-11/70 in the fall
> of 1980. Needless to say, the code was horrendous, not portable
> in any sense of the word, and didn't work."*

> *"Whether or not this really works is open to speculation. When
> ucbmiro was rebooted after a crash, the file system check
> program found 3 links between the Sail temporary file and its
> link file."*

**Why it matters:** Docs that admit weaknesses are more
credible. Docs with personality get read. Riggle wrote his man
page like a Napoleonic naval essay, complete with C.S. Forester
recommendations. Compare to modern generated API docs. Which
would you rather read?

Modern equivalents:

- **`man git`** — clear, personality-free.
- **Rust book** — accessible, examples-driven.
- **Rich Hickey's essays** — technical + philosophical.
- **`cargo` and `poetry`** — helpful CLI messages.

`sail.6` is a model.

---

## Suggested Reading Order

For a beginner:

1. **Lesson 8** (man page style) — quickest read, sets tone.
2. **Lesson 6** (2-char encoding) — smallest concrete technique.
3. **Lesson 5** (data-driven scenarios) — practical patterns.
4. **Lesson 7** (historical balance) — game design wisdom.
5. **Lesson 4** (poll pipelining) — UX under latency.
6. **Lesson 2** (fork() split) — process architecture.
7. **Lesson 3** (tempfile as DB) — data layer.
8. **Lesson 1** (link() lock) — the tricky one.

## Techniques Not Covered

- **Angle calculation** in integer math (Ed Wang's `angle()`).
- **Boarding resolution formulas**.
- **AI captain decision-making** (mostly rule-based, not
  interesting educationally).

## See Also

- [`architecture.md`](./architecture.md).
- [`../../docs/glossary.md`](../../docs/glossary.md).
