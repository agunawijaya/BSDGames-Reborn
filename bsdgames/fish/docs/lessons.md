# Lessons from `fish`

`fish` teaches state-machine design, hand representation, and how to
build an AI that feels human without being perfect.

---

## 1. Represent Hands as Count Arrays

Instead of storing individual card objects, `fish` stores how many of
each rank each player holds.

> **File:** `BSDGames-master/fish/fish.c:77-78`

```c
int asked[RANKS], comphand[RANKS], deck[TOTCARDS];
int userasked[RANKS], userhand[RANKS];
```

**Why it matters:** Count arrays make dealing, transferring, and
book-checking trivial. A hand is just 13 integers.

## 2. Shuffle by Swapping

The deck is shuffled with a Fisher-Yates-like loop using `nrandom()`.

> **File:** `BSDGames-master/fish/fish.c:424-433`

```c
for (i = 0; i < TOTCARDS - 1; ++i) {
    j = nrandom(TOTCARDS-i);
    if (j == 0)
        continue;
    temp = deck[i];
    deck[i] = deck[i+j];
    deck[i+j] = temp;
}
```

**Why it matters:** A simple swap shuffle is easy to understand and
sufficient for a card game.

## 3. Build AI Personalities with Small Rules

The normal AI is deterministic; the pro AI adds memory and heuristics.
Both fit in a single function.

> **File:** `BSDGames-master/fish/fish.c:207-262`

**Why it matters:** Distinct, simple behaviours create the feeling of
multiple opponents without complex architecture.

## 4. Use Randomness for Flavour

Rare events (1/1024) add humour and unpredictability.

> **File:** `BSDGames-master/fish/fish.c:345-350`

```c
if (nrandom(1024) == 0723)
    printf("Cheater, cheater, pumpkin eater!\n");
```

**Why it matters:** Small probabilistic touches make a program feel
alive.

## 5. Handle Instructions Gracefully

The program launches the user's preferred pager to show `fish.instr`.

> **File:** `BSDGames-master/fish/fish.c:448-484`

**Why it matters:** Long help text belongs in a separate file and a
familiar viewer, not crammed into the program.

## See Also

- [`architecture.md`](./architecture.md) — full control-flow analysis.
- [`spec.md`](./spec.md) — formal rules.
- [`references.md`](./references.md) — sources.
