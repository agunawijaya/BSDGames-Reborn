# `wump` — Lessons from the Original Code

> **A Textbook for Programmers.** Educational breakdowns of algorithmic, structural,
> and systems techniques found in the original BSD C source of `wump.c`.

---

## Lesson 1 — Guaranteeing Graph Connectivity via Coprime Strides

**File:** `wump.c:520-530, 554-567`  
**Functions:** `gcd()`, `cave_init()`

### What It Teaches
How number theory (greatest common divisor and modular coprimality) can generate a guaranteed Hamiltonian cycle across $N$ nodes without graph search algorithms like BFS or Tarjan's SCC.

### The Excerpt

```c
int
gcd(a, b)
	int a, b;
{
	int r;

	r = a % b;
	if (r == 0)
		return (b);
	return (gcd(b, r));
}

/* inside cave_init() */
do {
	delta = (random() % (room_num - 1)) + 1;
} while (gcd(room_num, delta + 1) != 1);

for (i = 1; i <= room_num; ++i) {
	link = ((i + delta) % room_num) + 1;	/* connection */
	cave[i].tunnel[0] = link;		/* forw link */
	cave[link].tunnel[1] = i;		/* back link */
}
```

### Why It Matters
When procedurally generating game maps or network topologies, ensuring that every node is reachable from every other node is a critical invariant. A naive random edge generator often creates isolated clusters or disconnected subgraphs.

Instead of running an expensive connected-components check after random generation, Taylor leverages an elegant mathematical property: in modular arithmetic, stepping by a constant stride $S = \delta + 1$ modulo $R$ visits every element in $\mathbb{Z}_R$ in a single cycle if and only if $\gcd(R, S) = 1$. This guarantees an underlying Hamiltonian cycle in $O(R)$ time with negligible overhead.

Modern game developers use similar modular arithmetic generators in procedural dungeon crawlers, ring-buffer hash functions, and procedural star-system navigators.

---

## Lesson 2 — Accumulating Alertness via Static Function Variables

**File:** `wump.c:505-516`  
**Function:** `shoot()`

### What It Teaches
Using static local variables to maintain persistent internal state across function invocations without polluting the global namespace.

### The Excerpt

```c
{
	/* each time you shoot, it's more likely the wumpus moves */
	static int lastchance = 2;

	if (random() % (level == EASY ? 12 : 9) < (lastchance += 2)) {
		move_wump();
		if (wumpus_loc == player_loc)
			wump_kill();
		lastchance = random() % 3;
	}
}
```

### Why It Matters
In procedural games, game actors often need an "alertness" meter that ramps up as the player creates noise or misses attacks. A naive programmer might create global variables or pass complicated state structs down every call stack.

In C, declaring `static int lastchance` inside a block scope restricts the variable's visibility strictly to that lexical block, while preserving its value across subsequent calls. Every missed arrow increments `lastchance` by 2, steadily ratcheting up the tension until the creature inevitably awakens and hunts the player down. Once triggered, it resets back to a small randomized base.

In modern languages, this pattern is typically encapsulated in closures, actor state, or state-machine classes. Understanding how early C developers handled localized state machines without object-oriented overhead is a valuable lesson in minimalist systems design.

---

## Lesson 3 — Sensory BFS Without Dynamic Memory Allocation

**File:** `wump.c:716-730`  
**Function:** `wump_nearby()`

### What It Teaches
Executing multi-hop graph proximity queries with zero memory allocations using nested array iterations.

### The Excerpt

```c
int
wump_nearby()
{
	int i, j;

	/* check for a wumpus within TWO caves of where we are */
	for (i = 0; i < link_num; ++i) {
		if (cave[player_loc].tunnel[i] == wumpus_loc)
			return (1);
		for (j = 0; j < link_num; ++j)
			if (cave[cave[player_loc].tunnel[i]].tunnel[j] ==
			    wumpus_loc)
				return (1);
	}
	return (0);
}
```

### Why It Matters
A general $K$-hop neighborhood query in graph theory usually uses a Breadth-First Search (BFS) queue. However, allocating a queue, tracking visited nodes, and pushing pointers creates heap overhead and requires cleanup.

Because $K=2$ and the tunnel count $L$ is bounded ($L \le 25$), Taylor explicitly unrolls the 2-hop search into two nested loops. The inner loop directly accesses `cave[cave[player_loc].tunnel[i]].tunnel[j]`. It evaluates in $O(L^2)$ time with zero heap allocation, zero stack overhead, and complete cache locality.

For embedded systems, high-performance game loops, and real-time sensor loops, unrolling fixed small-depth graph expansions remains standard practice.

---

## Lesson 4 — Safe Parsing of Variable-Length Space-Delimited Lists

**File:** `wump.c:426-444`  
**Function:** `shoot()`

### What It Teaches
Using standard C string tokenizers (`strtok`) safely inside a counted loop to parse multi-segment flight paths without buffer overruns.

### The Excerpt

```c
arrow_location = player_loc;
for (roomcnt = 1;; ++roomcnt, room_list = NULL) {
	if (!(p = strtok(room_list, " \t\n"))) {
		if (roomcnt == 1) {
			(void)printf(
		"The arrow falls to the ground at your feet!\n");
			return(0);
		} else
			break;
	}
	if (roomcnt > 5) {
		(void)printf(
"The arrow wavers in its flight and and can go no further!\n");
		break;
	}
	next = atoi(p);
```

### Why It Matters
Command parsing in retro text games is notoriously susceptible to buffer overflows and infinite loops. Taylor's design uses `strtok()` by passing `room_list` on the first iteration and `NULL` on subsequent iterations.

Crucially, the loop enforces a strict guard: `if (roomcnt > 5) break;`. This prevents infinite paths even if the user feeds a malicious 500-word input string. Additionally, checking `if (roomcnt == 1)` provides custom feedback if the user typed `s` with no rooms, making the interface feel responsive and natural.

---

## Suggested Reading Order

1. **Lesson 1 (Coprime Strides):** Best entry point for mathematical graph generation.
2. **Lesson 3 (Sensory Search):** Demonstrates how adjacency structures are traversed without heap overhead.
3. **Lesson 2 (Static Alertness):** Shows how game balance and threat escalation are implemented with minimal state.
4. **Lesson 4 (Tokenized Parsing):** Explains how text inputs are validated and translated into physical mechanics.

---

## Techniques Not Covered Here

- **Troff/Nroff Macro Formatting (`wump.6`):** The Unix man page uses the `-man` macro package. Modern tools use CommonMark/Markdown.
- **Process Spawning via `fork`/`execl` (`instructions()`):** The original spawned an external pager program (`cat` or `more`) to read `/usr/share/games/wump.info`. In modern architecture, instructions are packaged directly into the binary or documentation assets.
