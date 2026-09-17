# Lessons from Worm

Pedagogical analysis of data structures, signal-driven real-time event loops,
and screen-buffer collision techniques in the 1980 BSD C implementation of Worm.

---

## 1. $O(1)$ Doubly Linked FIFO Queue for Snake Bodies (`worm.c:59-73`, `worm.c:311-344`)

### The Technique
In growing snake games, the entity's body behaves as a First-In, First-Out (FIFO) queue: new segments
are added at the head, while old segments are removed from the tail.

A naive beginner implementation often stores coordinates in a fixed array:
```c
/* Naive anti-pattern: O(N) shift on every single tick! */
for (int i = length; i > 0; i--) {
    body[i] = body[i - 1];
}
```
On a 1980 VAX or PDP-11 CPU running at 1 to 5 MHz, shifting an array of 200 segments every second
consumed valuable CPU cycles and caused visible stutter.

Michael Toy used a bidirectional doubly linked list:
```c
/* Upstream data structure in worm.c:68-73 */
struct body {
    int x;
    int y;
    struct body *prev;
    struct body *next;
} *head, *tail;
```
- **Push Head ($O(1)$):** Allocate a node, link it to `head`, make it the new head.
- **Pop Tail ($O(1)$):** Unlink `tail`, advance `tail = tail->next`, free the old tail.
No segments between head and tail ever need to be modified or shifted in memory!

### Why It Matters
This is a textbook demonstration of choosing the right data structure for the access pattern.
For any snake or path-following game, a linked list or circular ring buffer provides guaranteed
constant-time updates regardless of how long the snake grows.

---

## 2. Real-Time Action via `SIGALRM` Interrupts (`worm.c:106-155`)

### The Technique
Modern game developers take game loops for granted: `while (running) { process_input(); update(); render(); sleep(16ms); }`.
In early UNIX systems, however, `getch()` was a blocking system call that halted process execution
until a key was pressed on the terminal.

Toy solved this by harnessing kernel signals:
```c
signal(SIGALRM, wake);
alarm(1);
ch = getch(); /* Blocks until a key is pressed OR SIGALRM arrives */
```
When `alarm(1)` fires, the operating system interrupts `getch()`, returning an error code (`ERR`).
The game detects the timeout and advances the worm forward automatically using the direction from
the previous tick (`lastch`).

### Why It Matters
Understanding signal-driven asynchronous I/O is crucial for systems programming. Before threads
and event loops (`epoll`, `kqueue`, `libuv`) became standard, POSIX signals provided the foundational
mechanism for preemptive multitasking in UNIX applications.

---

## 3. Screen Buffer as the Physics Collision Grid (`worm.c:323-333`)

### The Technique
Most modern game engines maintain a distinct model-view separation: a 2D array stores the game state
(`grid[y][x] = WALL`), and a renderer translates that array into pixels or characters.

In `worm`, Toy leveraged Ken Arnold's `curses` library to unify physics and rendering:
```c
/* Upstream collision check in worm.c:323 */
ch = winch(tv);
if (isdigit(ch)) {
    /* Hit food prize */
} else if (ch != ' ') {
    /* Hit wall '*' or body 'o' */
    crash();
}
```
`winch()` peeks directly into the curses window character buffer. If the character under the cursor
is anything other than empty floor (`' '`) or a prize digit, collision is triggered immediately.

### Why It Matters
While strict separation of model and view is best practice for large systems, inspecting the display
buffer was an ingenious memory-saving optimization for micro-architectures with less than 64 KB of RAM.
It guaranteed zero discrepancy between what the player saw and where the collision occurred.

---

## 4. Hardware-Aware Baudrate Throttling (`worm.c:115`, `worm.c:345`)

### The Technique
When players held down sprint keys (`HJKL`), the worm dashed up to 8 characters in rapid succession.
Over a 300-baud acoustic coupler modem, transmitting 8 full curses coordinate jump sequences took
nearly two full seconds, causing severe terminal lag.

Toy inserted an adaptive transmission check:
```c
slow = (baudrate() <= 1200);
/* During sprint runs, skip rendering intermediate steps on slow lines */
if (!(slow && running)) {
    wmove(tv, head->y, head->x);
    wrefresh(tv);
}
```

### Why It Matters
Software should gracefully adapt to hardware throughput constraints. Dropping non-essential visual
frames during burst operations to preserve responsive input control is a core principle of performance
engineering that remains vital in web applications and cloud gaming today.
