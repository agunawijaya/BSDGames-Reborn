# `adventure` — Lessons from the Original Code

> **A Systems Textbook.** Educational analyses of memory virtualization,
> hash tables, anti-cheat serialization, and state-machine techniques
> from Jim Gillogly's C source for *Colossal Cave Adventure*.

---

## Lesson 1 — Text Virtualization on Memory-Constrained Hardware

**File:** `hdr.h:86-91` and `io.c`  
**Functions:** `speak()`, `startup()`

### What It Teaches
How early developers loaded massive narrative script databases into tiny address spaces (e.g. PDP-11 16-bit 64KB limits) using file-offset virtualization rather than loading all strings into the heap.

### The Excerpt

```c
struct text {
    char   *seekadr;    /* Msg start in virtual disk/file */
    int     txtlen;     /* length of msg starting here */
};

#define RTXSIZ  205
extern struct text rtext[RTXSIZ];   /* random text messages */
#define MAGSIZ  35
extern struct text mtext[MAGSIZ];   /* magic messages */
extern int     clsses;
#define CLSMAX  12
extern struct text ctext[CLSMAX];   /* classes of adventurer */
```

### Why It Matters
In 1977, keeping hundreds of long narrative descriptions resident in RAM was impossible. Gillogly's C port read the text database (`glorkz`) during build/startup, calculating the exact byte offset and length of each message.

When the game needs to print a room description, it does not hold the text in a global array; it simply seeks to `seekadr`, reads `txtlen` bytes into a small shared scratchpad, and streams it to the terminal.

Today, this is the foundational pattern behind **virtual memory paging**, **game asset streaming** in modern 3D open-world engines, and zero-copy memory-mapped file I/O (`mmap`).

---

## Lesson 2 — Vocabulary Hashing with 5-Character Truncation

**File:** `vocab.c:15-45`  
**Function:** `vocab()`

### What It Teaches
Using fixed-width hash tables with linear probing to achieve $O(1)$ keyword resolution without standard library hash structures.

### The Excerpt

```c
int
vocab(word, val)
	const char *word;
	int     val;
{
	int     hash, i;

	for (hash = 0, i = 0; i < 5 && word[i]; i++)
		hash += word[i];
	hash = (hash * 37) % HTSIZE;

	while (voc[hash].atab) {
		if (strncmp(voc[hash].atab, word, 5) == 0)
			return (voc[hash].val);
		hash = (hash + 1) % HTSIZE;
	}
	return (-1);
}
```

### Why It Matters
Before modern string dictionaries, hash tables had to be implemented from scratch with high performance. Gillogly hashes the sum of the first 5 characters multiplied by a prime constant ($37$) modulo a power-of-two table size (`HTSIZE = 512`), using linear open addressing to resolve collisions.

This truncation rule explains why interactive fiction players famously type 5-letter abbreviations like `INVEN`, `NORTH`, and `PLUGH`. Understanding this hash structure is essential for anyone building embedded parsers or custom domain-specific languages (DSLs).

---

## Lesson 3 — Anti-Play Latency & Time Math

**File:** `wizard.c:56-74, 85-102`  
**Functions:** `datime()`, `Start()`

### What It Teaches
How mainframe administrators calculated wall-clock elapsed time across days and leap years to enforce workplace game policies.

### The Excerpt

```c
void
datime(d, t)
	int    *d, *t;
{
	time_t  tvec;
	struct tm *tptr;

	time(&tvec);
	tptr = localtime(&tvec);
	/* day since 1977  (mod leap)   */
	*d = (tptr->tm_yday + 365 * (tptr->tm_year - 77)
             + (tptr->tm_year - 77) / 4 - (tptr->tm_year - 1) / 100
             + (tptr->tm_year + 299) / 400);
	/* bug: this will overflow in the year 2066 AD (with 16 bit int) */
	/* it will be attributed to Wm the C's millenial celebration    */
	/* and minutes since midnite */
	*t = tptr->tm_hour * 60 + tptr->tm_min;
}
```

### Why It Matters
Because *Adventure* caused massive productivity losses in university computer labs and research institutions in the late 1970s, the code enforced an anti-play lockout: if you suspended your game, you were blocked from resuming for at least 45 minutes (`latncy = 45`) unless you were a designated "wizard".

Gillogly's date calculation manually accounts for leap years and Gregorian calendar corrections. Note the famous inside joke in the comment: on a 16-bit integer machine, the day count overflows in the year 2066—exactly 1,000 years after William the Conqueror's conquest of England in 1066!

---

## Lesson 4 — Anti-Save-Scumming via Single-Use File Invalidation

**File:** `main.c:79-93` and `save.c`  
**Function:** `main()`

### What It Teaches
Preserving the stakes of death in permadeath games by unlinking save files upon restoration.

### The Excerpt

```c
if (argc > 1) {
    i = restore(argv[1]);
    switch (i) {
    case 0:
        yea = Start();
        k = null;
        unlink(argv[1]);    /* Don't re-use the save */
        goto l8;
    case 1:
        errx(1, "can't open file");
    case 2:
        rspeak(202);        /* You dissolve */
        exit(1);
    }
}
```

### Why It Matters
When players can save their game before a dangerous encounter and reload if they die, the tension of exploration evaporates. Gillogly prevented this by executing `unlink(argv[1])` the moment the save was restored. If the player died on the next turn, their save was already gone from the filesystem.

Modern roguelikes (e.g. NetHack, FTL, Darkest Dungeon) use this exact same pattern to maintain ironman stakes.

---

## Suggested Reading Order

1. **Lesson 1 (Text Virtualization):** Fundamental to understanding how `glorkz` feeds the engine.
2. **Lesson 2 (Vocabulary Hashing):** The heart of the two-word parser.
3. **Lesson 4 (Single-Use Saves):** Shows the philosophical commitment to permadeath stakes.
4. **Lesson 3 (Time Latency Math):** A humorous and insightful window into 1970s mainframe administration.

---

## Techniques Not Covered Here

- **Cyclic Redundancy Checks (`crc.c`):** Uses bitwise polynomial long division to verify binary save structs against hex edits.
- **Dwarf Pathfinding Search (`subr.c`):** Graph neighbor crawling to stalk the player.
