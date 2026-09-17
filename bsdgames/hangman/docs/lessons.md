# `hangman` — Lessons from the Original Code

> **A textbook.** For each interesting technique in the original C
> source, a short lesson entry. Beginners should be able to pull up
> this file *and the original source* and learn.
>
> Upstream tree: <https://github.com/vattam/BSDGames/tree/master/hangman>

---

## Suggested Reading Order

1. **Lesson 1 — Random seek instead of loading everything** — the easiest "big win" for memory.
2. **Lesson 2 — Table-driven rendering** — builds on the first; shows how data tables simplify code.
3. **Lesson 3 — Incremental running average** — small math trick with no history array.
4. **Lesson 4 — Clean terminal teardown** — practical curses/terminal hygiene.

---

## Lesson 1 — Random Seek Instead of Loading Everything

**File:** `getword.c:55-69`  
**Function:** `getword()`

**What it teaches:** How to pick a random item from a huge file without loading the whole file into memory.

**The excerpt:**

```c
for (;;) {
    pos = (double) rand() / (RAND_MAX + 1.0) * (double) Dict_size;
    fseek(inf, pos, SEEK_SET);
    if (fgets(Word, BUFSIZ, inf) == NULL)
        continue;
    if (fgets(Word, BUFSIZ, inf) == NULL)
        continue;
    Word[strlen(Word) - 1] = '\0';
    if (strlen(Word) < Minlen)
        continue;
    for (wp = Word; *wp; wp++)
        if (!islower((unsigned char)*wp))
            goto cont;
    break;
cont:   ;
}
```

**Why it matters:** In 1983, RAM was scarce. Loading a 100,000-word dictionary into memory would have been wasteful. Instead, the program gets the file size, jumps to a random byte, discards the partial line it landed in, and reads the next complete line. It validates the candidate and retries if necessary. The same pattern appears today in log sampling, reservoir sampling over streams, and reading random rows from CSV files too large for memory.

**See also:** `architecture.md` §Random Events.

---

## Lesson 2 — Table-Driven Rendering

**File:** `extern.c:64-72` and `prman.c:49-58`  
**Function:** `prman()`

**What it teaches:** Store coordinates and characters in a table, then let a tiny loop draw them.

**The excerpt:**

```c
const ERR_POS Err_pos[MAXERRS] = {
    {2, 10, 'O'},
    {3, 10, '|'},
    {4, 10, '|'},
    {5, 9, '/'},
    {3, 9, '/'},
    {3, 11, '\\'},
    {5, 11, '\\'}
};
```

```c
void
prman()
{
    int i;

    for (i = 0; i < Errors; i++)
        mvaddch(Err_pos[i].y, Err_pos[i].x, Err_pos[i].ch);
    while (i < MAXERRS) {
        mvaddch(Err_pos[i].y, Err_pos[i].x, ' ');
        i++;
    }
}
```

**Why it matters:** Drawing a hang-man could be done with a long chain of `if (Errors >= 1) draw_head(); if (Errors >= 2) draw_body(); ...`. Instead, the program stores the position and character of each body part in an array and draws up to `Errors` entries. Adding a new body part is just adding a row to the table. This pattern is everywhere in modern code: sprite animation frames, CSS keyframes, state-transition tables, and configuration-driven UI. Data beats conditional logic.

**See also:** `architecture.md` §Data Structures.

---

## Lesson 3 — Incremental Running Average

**File:** `main.c:82-86`  
**Function:** `main()`

**What it teaches:** How to maintain a mean without storing every value.

**The excerpt:**

```c
for (;;) {
    Wordnum++;
    playgame();
    Average = (Average * (Wordnum - 1) + Errors) / Wordnum;
}
```

**Why it matters:** To compute the average errors per word across the session, the program does not keep an array of past scores. It uses the standard recurrence: multiply the old average by the previous count, add the new value, and divide by the new count. This is O(1) memory and O(1) time per update. The same idea powers streaming statistics, online machine-learning averages, and real-time dashboards that cannot afford to store all historical data.

**See also:** `architecture.md` §Game Loop Detail.

---

## Lesson 4 — Clean Terminal Teardown

**File:** `main.c:93-100`  
**Function:** `die()`

**What it teaches:** When you put a terminal into a special mode, always restore it before exiting.

**The excerpt:**

```c
void
die(dummy)
    int dummy __attribute__((__unused__));
{
    mvcur(0, COLS - 1, LINES - 1, 0);
    endwin();
    putchar('\n');
    exit(0);
}
```

**Why it matters:** curses puts the terminal into `cbreak`/`noecho` mode and may hide the cursor. If the program exits without calling `endwin()`, the user's shell can be left in a broken state. `die()` moves the cursor to the bottom-left, restores normal terminal settings, prints a newline, and only then exits. Modern equivalents include `try/finally` blocks, `atexit()` handlers, and container shutdown hooks — the principle is the same: always undo the environment changes you made.

**See also:** `architecture.md` §Constraints the Original Had To Handle.

---

## Techniques *Not* Covered Here

- **The curses API.** `initscr`, `mvaddstr`, `mvaddch`, `refresh`, `clrtoeol`, etc., are a whole topic on their own. See the NetBSD `curses` tutorial or the manual pages for `curses(3)`.
- **Setgid privilege revocation.** `setregid(getgid(), getgid())` is a Unix security topic better covered by a dedicated privilege-separation lesson (see `tetris` `lessons.md` Lesson 5 for comparison).

## See Also

- [`architecture.md`](./architecture.md) — the fuller picture the lessons draw from.
- [`../../../docs/glossary.md`](../../../docs/glossary.md) — technical terms.
- [`references.md`](./references.md) — primary sources and citations.
