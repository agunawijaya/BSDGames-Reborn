# `phantasia` — Lessons from the Original Code

> A textbook. Edward Estes's 1986 code teaches ideas that
> distributed systems engineers rediscover every decade.

Upstream source (not redistributed):
<https://github.com/vattam/BSDGames/tree/master/phantasia>

---

## Lesson 1 — Shared File as IPC Channel

**File:** across `main.c`, `fight.c`, `interplayer.c`
**Function:** the entire game

**What it teaches:** How to coordinate multiple concurrent
processes using nothing but a shared file and `flock()`.

**The pattern:**

```c
FILE *cf = fopen("/var/games/phantasia/characters", "r+");
flock(fileno(cf), LOCK_EX);
fseek(cf, playerid * sizeof(struct player), SEEK_SET);
fwrite(&Player, sizeof(struct player), 1, cf);
flock(fileno(cf), LOCK_UN);
```

**Why it matters:** Every distributed system needs coordination.
Modern approaches use Redis, ZooKeeper, etcd, distributed
consensus algorithms (Raft, Paxos). `phantasia` runs on a single
Unix host and gets coordination via the filesystem — a database
with `flock()`. This is the same technique behind:

- **SQLite** — file-based DB with locking.
- **Git** — repository as filesystem, ref locks.
- **Mail spools** — historical /var/mail one-file-per-user.
- **CUPS print queues** — file-based job coordination.

Simple, robust, portable. `phantasia` didn't need Redis in 1986.

---

## Lesson 2 — Fixed-Size Record Files for O(1) Random Access

**File:** `phantstruct.h`, `main.c` file operations

**What it teaches:** How to design a "database" as a plain file
where each record is a fixed size and player_id = offset /
record_size.

**The idea:**

```c
struct player {
    char name[20];
    char password[16];
    unsigned type;
    double strength;
    // ...
    // ~200 bytes fixed size
};

// Read player N:
fseek(cf, N * sizeof(struct player), SEEK_SET);
fread(&Player, sizeof(struct player), 1, cf);
```

**Why it matters:** Fixed-size records + array-offset addressing =
O(1) lookup with zero index overhead. Modern databases use this
for their row-heap files internally. Reveals the *why* behind
"row size" in databases.

Modern equivalents:

- **B-tree indexes** — variable-size records, log(N) lookup.
- **LSM trees** — Cassandra, LevelDB.
- **Columnar stores** — Parquet, ClickHouse.

But the fundamental idea — *give every record a numeric identity
and use it as an offset* — survives.

---

## Lesson 3 — Event Queue as a Shared File ("Mailbox Pattern")

**File:** `interplayer.c`
**Function:** PvP coordination

**What it teaches:** How to build an event notification system
between processes without any special IPC infrastructure.

**The idea:** A "void file" is a shared file where events (attack
requests, cast targets, chat messages) are dropped by one process
and picked up by another on its next loop iteration.

```c
// Process A drops event:
flock(void_fd, LOCK_EX);
fseek(void_fd, target_id * sizeof(event), SEEK_SET);
fwrite(&event, sizeof(event), 1, void_fd);
flock(void_fd, LOCK_UN);

// Process B on its loop:
flock(void_fd, LOCK_EX);
fseek(void_fd, my_id * sizeof(event), SEEK_SET);
fread(&event, sizeof(event), 1, void_fd);
if (event.type != NONE) handle_event(&event);
flock(void_fd, LOCK_UN);
```

**Why it matters:** This is a **mailbox pattern** — one of the
oldest IPC ideas. Modern equivalents:

- **Message queues** — RabbitMQ, Kafka, SQS.
- **Actor mailboxes** — Erlang, Akka.
- **Redis pub/sub**.
- **Postgres LISTEN/NOTIFY**.

`phantasia` gets it with 15 lines of C in `interplayer.c`.

**Caveat:** Polling latency = one turn-tick. Not suitable for
sub-millisecond games. Fine for text RPG.

---

## Lesson 4 — Per-Class Progression Trees

**File:** `phantglobs.c`, `misc.c`
**Function:** stat updates on level up

**What it teaches:** How to encode differentiated character
progression via type-specific coefficient tables.

**The pattern (paraphrased):**

```c
struct type_progression {
    const char *name;
    double str_per_level;
    double mana_per_level;
    double energy_per_level;
    double brains_per_level;
    double magic_per_level;
} class_table[] = {
    { "Magic User", 2.0, 75, 20, 6.0, 2.75 },
    { "Fighter",    3.0, 40, 30, 3.0, 1.5 },
    { "Elf",        2.5, 65, 25, 4.0, 2.0 },
    { "Dwarf",      5.0, 30, 35, 2.5, 1.0 },
    { "Halfling",   2.0, 30, 30, 4.5, 1.0 },
    // ...
};

// On level up:
Player.strength += class_table[Player.type].str_per_level;
Player.mana    += class_table[Player.type].mana_per_level;
// ...
```

**Why it matters:** Data-driven differentiation. Adding a new
class = adding a row to the table. Balancing = tweaking numbers.
No branches. Modern game equivalents:

- **D&D 5e class tables** — direct descendant.
- **XP progression curves** in every RPG since.
- **RPG balancing spreadsheets** (Blizzard's are legendary).
- **Skill trees** in Diablo, Path of Exile.

`phantasia`'s 5×5 grid of type × stat coefficient is the germ.

---

## Lesson 5 — Password Hashing (Or the Absence Thereof)

**File:** password comparison in login flow

**What it teaches:** The importance of password *hashing* — by
showing what happens without it.

**The pattern (simplified):**

```c
struct player {
    char password[16];  // stored in plaintext (!)
    // ...
};

// Login check:
if (strcmp(input_password, Player.password) == 0) {
    // logged in
}
```

**Why it matters:** In 1986, hash functions were understood but
not universally applied. `phantasia` stored passwords in plaintext
in the character file — anyone with read access to the file could
extract everyone's passwords. This was normal for the era but
would be a security incident today.

Modern equivalents:

- **`bcrypt`, `scrypt`, `argon2`** — the modern password hashes.
- **HTTPS**, TLS — protect passwords in transit.
- **`sudo` and `su`** — proper privilege separation.

The port MUST hash passwords. This is a security ADR.

---

## Lesson 6 — RNG Discipline via `ROLL()` Macro

**File:** `phantglobs.c`, `misc.c`

**What it teaches:** How to concentrate all RNG into named
helper functions rather than sprinkling `rand()` throughout.

**The pattern:**

```c
#define ROLL(base, range) ((base) + (rand() % (range)))
// Usage:
double str = ROLL(50, 20);  // 50-69 range

double drandom(void) { return (double)rand() / RAND_MAX; }
```

**Why it matters:** Same idea as `trek`'s `ranf()` and `atc`'s
`ranf`/`franf`. Consolidating RNG:

- Makes it greppable.
- Enables mocking in tests.
- Documents intent (`ROLL(base, range)` is clearer than
  `rand() % 20 + 50`).
- Isolates the seeding decision.

Modern equivalents:

- **`rand::thread_rng().gen_range(50..70)`** in Rust.
- **`Random.uniform(50, 70)`** in Python.
- **Injected RNG** via constructor for testable code.

---

## Lesson 7 — ASCII Data File as User-Generated Content

**File:** `monsters.asc`

**What it teaches:** How to enable *modding* through a plain-text
data file.

**The pattern:** `monsters.asc` is a text file where each monster
is described:

```
Name          Str  Quick  Energy  Brains  Magic  ...
Balrog        250  45     500     60      20     ...
Nazgul        180  50     400     70      25     ...
...
```

The game reads this at startup. Admins with edit access can add,
remove, or tweak monsters without recompilation.

**Why it matters:** This is **modding** avant la lettre. Modern
equivalents:

- **Doom WADs** — user-editable level files.
- **Bethesda Creation Kit** — mods as data.
- **Skyrim / Fallout mods** — massive community content.
- **Balatro custom cards** — recent example.

The idea "game logic in code, content in data" is one of the
most important game-engineering insights. Estes ships it in 1986.

---

## Lesson 8 — Turn-Level Persistence via Full-Record Rewrite

**File:** `main.c` end of loop

**What it teaches:** How to make save/load *implicit* rather
than an explicit user action.

**The pattern:** After every command, the entire player record
is written back to the character file. There is no explicit
"save game" command. `quit` just closes cleanly.

**Why it matters:** Removes an entire category of bug ("I forgot
to save and lost 3 hours"). But at a cost: disk I/O every turn.
In 1986 on a shared-disk multi-user Unix, this was fine. On
modern SSDs, still fine. On networked storage, might be
expensive.

Modern equivalents:

- **Auto-save** in every modern game.
- **CRDT-based state sync** for collaborative apps.
- **Event sourcing** — persist events not state.

`phantasia`'s pattern is the simplest possible auto-save. Elegant.

---

## Suggested Reading Order

For a beginner:

1. **Lesson 6** (`ROLL()` macro) — smallest, universal.
2. **Lesson 4** (per-class table) — data-driven design.
3. **Lesson 8** (implicit persistence) — save/load philosophy.
4. **Lesson 2** (fixed-size records) — database internals.
5. **Lesson 7** (ASCII monster file) — modding roots.
6. **Lesson 1** (file as IPC) — distributed systems fundamentals.
7. **Lesson 3** (mailbox pattern) — event systems.
8. **Lesson 5** (password non-hashing) — security cautionary tale.

## Techniques Not Covered

- **`curses` usage** — see the `ncurses` docs.
- **`flock(2)` semantics** — see `flock(2)` man page.
- **Detailed spell resolution** — very game-specific.

## See Also

- [`architecture.md`](./architecture.md) — the wider picture.
- [`../../docs/glossary.md`](../../docs/glossary.md) — technical
  terms.
