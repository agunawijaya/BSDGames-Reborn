# Lessons from `battlestar`

> Pedagogical software engineering lessons extracted from David Riggle's 1979/1983 C codebase for the PDP-11/70.

---

## 1. Bitwise Set Operations for Memory-Constrained Systems

### Context & Original Code
In 1979, the DEC PDP-11/70 ran with a 16-bit virtual address space limiting programs to 64 KB of user text and data. Storing separate boolean flags or complex structs for 64 inventory objects across 275 rooms would quickly exhaust RAM.

Riggle implemented bitwise sets using array macros in [`extern.h:45-52`](https://github.com/vattam/BSDGames/tree/master/battlestar/extern.h#L45-L52):

```c
#define BITS (8 * sizeof (int))
#define testbit(array, index)    (array[index/BITS] & (1 << (index % BITS)))
#define setbit(array, index)     (array[index/BITS] |= (1 << (index % BITS)))
#define clearbit(array, index)   (array[index/BITS] &= ~(1 << (index % BITS)))
```

### Why It Matters
- **Space Efficiency:** An entire inventory state (tracking up to 64 distinct objects) requires only two 32-bit integers (`int inven[2]`), consuming just 8 bytes of memory!
- **Constant Time Operations:** Testing or setting an item's presence in a room requires exactly one division, modulo, and bit-shift operation—executed in a single machine cycle on the PDP-11 CPU.
- **Modern Relevance:** Embedded systems, low-power IoT microcontrollers, and high-performance game engines still rely on compact bitfields and bitmasks for entity-component tagging and collision filters.

---

## 2. Pointer Swapping for State Machine Transformation

### Context & Original Code
Instead of sprinkling conditional checks (`if (is_night) ... else ...`) inside hundreds of room printing and traversal functions, Riggle structured the entire world into two parallel arrays: `dayfile[]` and `nightfile[]`.

In [`command1.c:28-40`](https://github.com/vattam/BSDGames/tree/master/battlestar/command1.c#L28-L40):

```c
extern struct room dayfile[];
extern struct room nightfile[];
extern struct room *location;

if (ourtime % (2 * CYCLE) < CYCLE) {
    location = dayfile;
} else {
    location = nightfile;
}
```

### Why It Matters
- **Zero Branching Overhead:** All room accesses throughout the engine use `location[position].link[dir]` or `location[position].desc`. By simply swapping the pointer `location`, every room in the game instantly changes its description, ambient lighting, and door connectivity with a single assignment statement.
- **Data-Driven Separation:** Content designers can tweak night descriptions without touching procedural game logic, prefiguring modern data-driven ECS (Entity-Component-System) architectures.

---

## 3. Direction Normalization via Trigonometric / Modular Rotation

### Context & Original Code
Allowing players to navigate using both absolute compass bearings (`north`, `south`) and relative directions (`ahead`, `back`, `left`, `right`) introduces cognitive complexity. If facing West, what does `right` mean?

Riggle resolved this cleanly with modular arithmetic in [`command1.c:85-115`](https://github.com/vattam/BSDGames/tree/master/battlestar/command1.c#L85-L115):

```c
/* Cardinal constants: NORTH=0, EAST=1, SOUTH=2, WEST=3 */
switch (rel_move) {
case AHEAD:
    target_dir = direction;
    break;
case RIGHT:
    target_dir = (direction + 1) % 4;
    break;
case BACK:
    target_dir = (direction + 2) % 4;
    break;
case LEFT:
    target_dir = (direction + 3) % 4;
    break;
}
```

### Why It Matters
- **Simplicity Over Complex Matrices:** Rather than calculating trigonometric angles ($\sin, \cos$) or floating-point rotation vectors, the 4 cardinal directions are mapped to integer rings modulo 4. Turning 90 degrees right is simply $(d + 1) \bmod 4$; turning 180 degrees is $(d + 2) \bmod 4$.
- **Lesson for Beginners:** Modular arithmetic is a powerful tool for discrete coordinate systems, wrap-around toroidal maps, and rotational symmetries in grid-based games.

---

## 4. Graceful Degradation of Systems via Medical Modeling

### Context & Original Code
In many RPGs, player health is an abstract numerical pool of Hit Points (HP). When HP drops from 100 to 1, the character runs and fights with 100% effectiveness until dying at 0 HP.

In `battlestar`, Riggle modeled health as an array of discrete anatomical injuries in [`extern.h:130-142`](https://github.com/vattam/BSDGames/tree/master/battlestar/extern.h#L130-L142) and [`cypher.c:160-185`](https://github.com/vattam/BSDGames/tree/master/battlestar/cypher.c#L160-L185):

```c
if (card(injuries, NUMOFINJURIES)) {
    puts("\nYou have suffered:\n");
    for (n = 0; n < NUMOFINJURIES; n++)
        if (injuries[n])
            printf("\t%s\n", ouch[n]);
    printf("\nYou can still carry up to %d kilogram%s\n", WEIGHT, (WEIGHT == 1 ? "." : "s."));
}
```

### Why It Matters
- **Atmospheric Immersion:** Reading *"You have suffered: a fractured skull and deep incisions"* creates far greater narrative tension than *"HP: 42/100"*.
- **Mechanical Coupling:** Injuries directly constrain actions: a broken arm prevents wielding a heavy two-handed sword; a fractured back cuts carrying capacity in half; a broken leg slows movement. This creates rich tactical trade-offs between carrying treasure vs. carrying defense gear.

---

## 5. Security Practices & Unix Privilege Dropping

### Context & Original Code
On early multi-user Unix systems, games often ran with `setgid` privileges (set to group `games`) so they could write shared high-score files in `/var/games` without giving normal users write access to the directory. If a game had a buffer overflow or shell escape, an attacker could compromise the `games` group.

In [`battlestar.c:50-54`](https://github.com/vattam/BSDGames/tree/master/battlestar/battlestar.c#L50-L54):

```c
/* Open the score file then revoke setgid privileges */
open_score_file();
setregid(getgid(), getgid());
```

### Why It Matters
- **The Principle of Least Privilege:** Open the privileged resource (the score file descriptor) immediately upon startup, and then immediately revoke elevated permissions (`setregid(getgid(), getgid())`) before reading any user input.
- **Defensive Design:** Even if an exploit was discovered in the command parser or string buffers later, the process was running with ordinary user privileges, preventing privilege escalation.
