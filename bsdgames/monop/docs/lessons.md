# `monop` — Lessons Learned

> Design and engineering takeaways from reading Ken Arnold's 1980
> Monopoly. Both the good ("adopt this") and the dated
> ("understand it, don't copy it").

---

## What `monop` gets right

### 1. Data-driven board

The board, monopolies, properties, and cards live in **external
data files** (`brd.dat`, `mon.dat`, `prop.dat`, `cards.inp`) —
included at compile time or read at runtime. Adding a "Boardwalk"
edition or a "Mars Colony" reskin needs zero code changes.

**Takeaway:** Separate content from engine, even in 1980.

### 2. Table-driven command dispatch

`comlist[]` and `func[]` in `monop.def` are parallel arrays. Adding
a command means adding two lines. There's no giant `if`/`switch`
chain. This is the same idea as a function-pointer VM opcode
table.

**Takeaway:** For n commands where n > 4, use a dispatch table.

### 3. Unique-prefix command matching

`getinp()` matches the shortest unique prefix. Users can type `p`
for `print`, `q` for `quit`. Only when a prefix is ambiguous does
it ask for clarification. It's the same UX we'd design for a REPL
today, but 45 years earlier.

**Takeaway:** Autocomplete-adjacent UX is cheap to implement and
delightful.

### 4. The `?` help contract

Any string prompt in `monop` accepts `?` to list valid answers.
Consistent, discoverable, never surprises.

**Takeaway:** One universal "what can I say here?" key.

### 5. The debt loop

`force_morg()` is a beautifully simple debt state machine. A
player can spend beyond their cash — the game notes it — but their
turn cannot end until they're solvent. This models real Monopoly
negotiation elegantly.

**Takeaway:** State machines beat validation on every input. Let
the state itself refuse to advance.

### 6. Save/restore was expected

For a 60–180 minute game, `save`/`restore` isn't a nice-to-have —
it's baseline. Ken Arnold understood the user's session model.

**Takeaway:** Match your persistence model to the actual session
length.

### 7. House rule variants documented

The 2-solvent-player auction skip is called out **in the man
page**. Not hidden as a bug; treated as a deliberate rule variant.

**Takeaway:** Document rule variants explicitly. Fork
transparency > silent divergence.

## What is dated

### 1. Binary save format

The save file is a raw byte-dump of the in-memory structs. It is
host-specific, compiler-specific, and pointer-relative
(`heapstart` = `sbrk(0)`). Move the binary to another machine and
saves break.

**Modern replacement:** JSON, YAML, or SQLite. Include a schema
version.

### 2. Custom malloc

`malloc.c` is Chris Kingsley's 1982 Caltech allocator, shipped in
the tree because 1982 libc malloc was slow. Today, libc malloc,
jemalloc, tcmalloc, and mimalloc are all faster and more
robust — no game should ship a custom allocator.

**Modern replacement:** Standard library. Delete `malloc.c`.

### 3. `#define bool char`

Predates `stdbool.h` (C99) by 20 years. Works, but confuses tools.

**Modern replacement:** `_Bool` / `bool` / language native.

### 4. Global-everything

`player`, `cur_p`, `num_play`, `play[]`, `mon[]`, `prop[]`,
`board[]`, `deck[]` — all module-level globals. Testing is
extremely hard because every function reaches into the global
state.

**Modern replacement:** Pass a `GameState` struct (or object /
class) through the API. Unit tests can then set up a state and
call `execute()` on it in isolation.

### 5. `printf`-only I/O

Every function outputs directly to `stdout`. No abstraction. Any
UI overlay (GUI, TUI, web) has to intercept stdout or rewrite the
game.

**Modern replacement:** Separate rules engine from renderer. The
engine returns events/records; a renderer displays them.

### 6. No RNG seeding control

`srand(getpid())` at launch. Not deterministic; not reproducible;
no seed input for testing.

**Modern replacement:** Accept `--seed N` (or env var). Save the
seed in the save file for reproducible replays.

### 7. `goto` for control flow in `do_move()`

Uses `goto ret;` labels. Not wrong — Ken Arnold does it well —
but modern C prefers early returns or explicit state transitions.

### 8. Copyrighted content baked in

Card text like "Advance to Boardwalk" and property names like
"Park Place" are Parker Brothers-copyrighted. Any port needs new
flavor text and property names.

**Modern replacement:** Design a **generic content pack** as the
default, and support **user-authored content packs** for
themed variants (Monopoly-clone, sci-fi, education, etc.).

## Non-obvious details worth preserving

### `printline()` — the ruler

```c
#define printline() printf("------------------------------\n")
```

A 30-dash horizontal rule around card resolutions. Trivially
simple, but incredibly effective at parsing the game log.

**Takeaway:** Visual delimiters cost nothing.

### `lucky_mes[]` — flavor text pool

An array of 11 messages ("You lucky stiff", "How beautifully
Cosmic", "Your karma must certainly be together") randomly chosen
for advancement cards. Adds personality without content bloat.

**Takeaway:** A small array of rotating messages beats one
canonical response.

### The `swap()` XOR macro

```c
#define swap(A1,A2) if ((A1) != (A2)) { \
    (A1) ^= (A2); (A2) ^= (A1); (A1) ^= (A2); }
```

XOR-swap to avoid a temporary. In 1980 registers were precious;
today the compiler generates worse code from this than from `tmp
= A; A = B; B = tmp;`. Educational, but delete in a port.

### `heapstart` — a pointer relocation base

`sbrk(0)` records where the heap starts. Save/restore uses it to
translate absolute pointers to relative offsets and back. This is
what a serializer does today — pointer relocation via base +
offset. `monop` reinvents it inline.

**Takeaway:** Understand the problem it solves before ripping it
out — a schema-based serializer must solve the same
graph-of-pointers issue.

## Comparison with other BSDGames of the era

- **`robots`** (Ken Arnold too): random-seeded, single-player, no
  save. `monop` is far more architecturally sophisticated.
- **`snake`** (Ken Arnold): single-player action, no state
  persistence. Different genre entirely.
- **`sail`** (Dave Riggle, 1980): multi-user via `fork()` and
  file locks. Way more complex plumbing, but similar era.
- **`phantasia`** (1986): multi-user via shared file. `monop`
  is single-terminal but with equally deep state — the depth is
  in economic rules rather than networking.

## For the porter's TODO list

1. **Delete `malloc.c`.** Use libc.
2. **Delete `sbrk` reference.** Use a real serializer.
3. **Delete `#define bool char`.** Use language native.
4. **Extract `execute()` into a stateless rules-engine module** —
   input: game state + command. Output: new game state +
   events.
5. **Design a content-pack format** — first pass: a JSON schema
   for board, cards, prices, colors, rent tables. Then design
   authoring tools.
6. **Ship the original Ken Arnold "monop" content as pack #1**,
   with a distinct name (see AGENTS.md §Naming).
7. **Design a network multiplayer mode** — but keep single-terminal
   local play as the default.
8. **Design an AI opponent** — the single glaring gap in `monop`
   is the inability to play against the computer. Strategies for
   Monopoly AI are well-studied (Q-learning agents in academic
   papers).

## References

- Ken Arnold's other BSD contributions:
  <https://en.wikipedia.org/wiki/Ken_Arnold_%28computer_programmer%29>
- Chris Kingsley's Caltech allocator origin (1982):
  <https://man.freebsd.org/cgi/man.cgi?query=malloc.c>
- Discussion of `sbrk` vs `mmap` and why heaps look this way:
  see W. Richard Stevens, *Advanced Programming in the UNIX
  Environment*, ch. 7 & 14.

## See also

- Concrete port suggestions: [`port-ideas.md`](./port-ideas.md).
- Working notes: [`notes.md`](./notes.md).
