# Worm — Original Code Architecture

A technical deep-dive into Michael Toy's 1980 real-time arcade game loop, `SIGALRM` timer architecture,
curses screen-buffer collision engine, and doubly-linked list body queue in BSD `worm`.

---

## 1. Upstream Source Structure

The entire implementation of BSD Worm resides in a concise, highly focused C source file located in
[`vattam/BSDGames/tree/master/worm`](https://github.com/vattam/BSDGames/tree/master/worm):

```
vattam/BSDGames/tree/master/worm/
├── worm.c          # Monolithic engine: game loop, signal timers, linked list, curses UI
└── worm.6          # UNIX troff manual page source
```

---

## 2. Real-Time Game Loop Control Flow

```mermaid
flowchart TD
    START(["Launch worm [size]"]) --> INIT["Initialize curses & check dimensions<br/>worm.c:109-125"]
    INIT --> SETUP_WIN["Create stw (status) and tv (playfield)<br/>worm.c:130-139"]
    SETUP_WIN --> SPAWN_WORM["Initialize worm linked list (life())<br/>worm.c:140 / worm.c:158"]
    SPAWN_WORM --> SPAWN_PRIZE["Spawn initial food digit (prize())<br/>worm.c:141 / worm.c:249"]
    
    SPAWN_PRIZE --> LOOP{"running > 0?"}
    
    LOOP -->|Yes (Sprint Dash)| DEC_RUN["running--<br/>process(lastch)<br/>worm.c:146"]
    LOOP -->|No (Normal Step)| WAIT_INPUT["Wait for Keypress (getch())<br/>or SIGALRM timeout (alarm(1))<br/>worm.c:152"]
    
    WAIT_INPUT --> PROCESS["process(ch)<br/>worm.c:260"]
    DEC_RUN --> PROCESS
    
    PROCESS --> EVAL_TARGET{"Inspect cell ahead:<br/>winch(tv, y, x)<br/>worm.c:323"}
    
    EVAL_TARGET -->|Digit ('1'..'9')| EAT["Consume Prize:<br/>growing += digit<br/>score += growing<br/>running = 0<br/>prize() spawns new digit<br/>worm.c:325-331"]
    EAT --> ADVANCE
    
    EVAL_TARGET -->|Empty Space (' ')| ADVANCE["Advance Worm Body:<br/>1. Unlink & free tail if growing == 0<br/>2. Prepend newlink() at (x, y)<br/>3. Redraw head @ and body o<br/>worm.c:311-344"]
    
    EVAL_TARGET -->|Wall '*' or Body 'o'| CRASH["crash() -> leave(0)<br/>Game Over!<br/>worm.c:333 / worm.c:354"]
    
    ADVANCE --> SET_TIMER["alarm(1) reset timer<br/>worm.c:351"]
    SET_TIMER --> LOOP
    CRASH --> END(["Exit Program"])
```

---

## 3. Real-Time UNIX Signal Timer Architecture (`worm.c:106-155`)

In 1980, before POSIX threads or high-resolution `select()`/`poll()` timers, real-time action games
in UNIX relied on kernel software interrupts:

### The `SIGALRM` Interrupt Mechanism
1. In `main()`, Michael Toy registered a signal handler for `SIGALRM`:
   ```c
   signal(SIGALRM, wake);
   ```
2. Whenever the worm takes a step without user input, an alarm is scheduled:
   ```c
   alarm(1);  /* Schedule SIGALRM in 1 second */
   ```
3. When `getch()` blocks waiting for user input, if 1 second elapses without a keypress, the kernel
   delivers `SIGALRM`, firing `wake()`:
   ```c
   void wake(int signo) {
       signal(SIGALRM, wake);
       /* Interrupted system call forces getch() to return ERR,
          causing process() to step forward using lastch! */
   }
   ```
4. If the user presses a key before the timer expires, `alarm(0)` cancels the pending alarm,
   the turn is processed immediately, and a fresh 1-second alarm is armed.

---

## 4. Screen Buffer Collision Detection via `winch()` (`worm.c:323-333`)

Rather than maintaining a separate 2D spatial grid array (e.g. `grid[LINES][COLS]`), Toy used a
technique characteristic of early curses games: **direct screen buffer interrogation**:

```c
/* Upstream collision check in worm.c:323 */
if (isdigit(ch = winch(tv))) {
    /* Target cell contains a character '1'..'9' */
    growing += ch - '0';
    prize();
    score += growing;
} else if (ch != ' ') {
    /* Target cell contains '*' (wall) or 'o' (body segment) */
    crash();
}
```

`winch(tv)` reads the character stored in the virtual curses window at the current cursor coordinates.
This eliminated the memory overhead of a separate collision matrix, ensuring that what was rendered
on screen was mathematically identical to the physical collision geometry.

---

## 5. Doubly Linked List Body Queue (`worm.c:59-73`, `worm.c:311-344`)

The worm's anatomy is managed via a classical doubly linked list:

```c
struct body {
    int x;
    int y;
    struct body *prev;
    struct body *next;
} *head, *tail, goody;
```

### Constant-Time $O(1)$ Operations
- **Advancement ($O(1)$):** When moving forward, a new head node is allocated via `newlink()` (`malloc`),
  linked to the current `head`, and stamped with `@` on the display.
- **Tail Reclamation ($O(1)$):** If `growing == 0`, the `tail` node's screen cell is overwritten with
  space `' '`, the node is unlinked (`tail->next->prev = NULL`), and `free(tail)` returns its memory
  to the heap.
- **Dynamic Growth ($O(1)$):** If `growing > 0`, the tail reclamation step is skipped; `growing` is
  decremented, and the tail remains fixed in place, naturally lengthening the worm by 1 node.

---

## 6. Window Geometry Partitioning (`worm.c:130-139`)

Toy partitioned the terminal into two non-overlapping curses windows:
1. **`stw` (Status Window):** Dimensions $1 \times (\text{COLS}-1)$ positioned at row 0.
   Renders the title banner `" Worm"` at column 0 and live score `"Score: %3d"` at column $\text{COLS}-12$.
2. **`tv` (Playfield / Terminal Viewport):** Dimensions $(\text{LINES}-1) \times (\text{COLS}-1)$
   positioned at row 1. Framed by `box(tv, '*', '*')`, creating the fatal outer perimeter enclosure.
