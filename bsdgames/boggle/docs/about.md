# About `boggle`

> *"Shake the cubes, drop the grid, turn the hourglass, and race to find words before the bell tolls."*

---

## The Pitch

In 1972, freelance game designer Allan Turoff conceived a deceptively simple party game: sixteen wooden cubes printed with letters, trapped inside a 4x4 plastic grid with a domed lid. Shaking the dome scattered the letters into a random matrix, after which players scrambled against a 3-minute sand timer to write down as many connected words as possible. Parker Brothers published it as *Boggle*, and it became an enduring worldwide phenomenon.

In 1988, Canadian computer scientist **Barry Brachman** brought this classic tactile game to the Unix terminal. Rather than merely simulating the board display, Brachman built an uncompromising, exhaustive word search engine. When your 3-minute timer expires, the computer doesn't just score your words—it unleashes a recursive graph search against the entire system dictionary, displaying every single legal English word you overlooked and calculating your exact mastery percentage.

Integrated into Berkeley's official 4.4BSD distribution in June 1993, **`boggle`** remains one of the sharpest, most addictive intellectual drills in the BSDGames collection.

---

## Visual Presentation

![Boggle 4x4 Game Board](../media/01-board.png)
*Figure 1: The authentic 4x4 Boggle board rendered on the terminal grid with countdown clock.*

![Post-Game Performance Analysis](../media/02-results.png)
*Figure 2: Comprehensive round results comparing player submissions against computer dictionary exhaustive search.*

---

## Historical & Cultural Background

| Metadata | Details |
|---|---|
| **Original Board Game** | *Boggle* (invented by Allan Turoff in 1972, Parker Brothers) |
| **BSD Author** | Barry Brachman (Department of Computer Science, University of British Columbia) |
| **First BSD Release** | 4.4BSD (June 1993) |
| **Language** | C (ANSI C) |
| **Upstream Code** | [`vattam/BSDGames/tree/master/boggle`](https://github.com/vattam/BSDGames/tree/master/boggle) |

### The Academic Challenge of Boggle

In the late 1980s, Boggle was a favored problem in computer science departments. Solving a Boggle board efficiently required mastering several fundamental algorithmic techniques:
1. **Adjacency Modeling:** Representing an 8-connected grid where cells can be revisited across words but never twice within the same word.
2. **Combinatorial Explosion:** A 16-cell board contains millions of possible path sequences. Naively checking every path against a dictionary file is too slow for interactive play on 1980s microcomputers.
3. **Dictionary Indexing:** Brachman designed a custom dictionary compiler (`mkindex`) that preprocessed wordlists into binary index buckets, allowing instant prefix validation and sub-second board resolution.

---

## Why It's Fun

1. **High-Stakes Mental Sprint:** 180 seconds on the clock. Your eyes dart across diagonals, reverse paths, and interlocking chains. The pressure is palpable.
2. **Humbling Computer Omniscience:** Seeing the machine produce 45 words you never noticed—including clever anagrams and obscure plurals—inspires an immediate urge to rematch.
3. **Pure Vocabulary & Pattern Recognition:** No dice rolling luck after the initial shake; success is determined entirely by visual pattern recognition, spatial agility, and lexical breadth.
4. **Immediate Learning:** Pressing `<esc>` after a round lets you highlight and trace the physical path of any missed word across the grid.

---

## Difficulty & Progression

Unlike narrative adventure games with levels, *Boggle* employs **configurable session parameters and difficulty tiers**:

### Difficulty Knobs & Tuning

1. **Time Limit (`-t <seconds>`):**
   - **Blitz Mode (60s):** Fast, frantic reflex drill.
   - **Standard Mode (180s / 3 minutes):** The canonical Parker Brothers tournament standard.
   - **Casual / Practice Mode (300s+):** Relaxed exploration for learning new words.
2. **Minimum Word Length (`-w <min>`):**
   - **Default (3 letters):** Standard casual play (`minlength = 3`).
   - **Tournament Pro (4 letters):** `-w 4` filters out trivial 3-letter words like *cat*, *the*, *and*, dramatically raising lexical difficulty.
   - **Master / Grandmaster (5+ letters):** `-w 5` transforms the board into an advanced hunt for compound stems and long prefixes.
3. **Cube Reuse Variants (`+` and `++`):**
   - Standard Boggle forbids reusing the same letter cube in a single word.
   - Flag `+` relaxes reuse rules.
   - Flag `++` (`selfuse`) permits self-adjacency, allowing consecutive repeated letters from the same cube (e.g., forming *"book"* from a single *o* cube).

---

## Known Quirks & Bugs in the Original

1. **The `Qu` Cube Special Case:**
   - In physical Boggle, the letter *Q* is printed as *Qu* because English words almost never pair *Q* without *U*. In Brachman's code, the letter *q* is represented on the cube and automatically expands to *qu* during path checking, but failure to type *u* in player submissions causes rejection.
2. **Dictionary Build Dependency:**
   - In upstream `vattam/BSDGames`, compilation often fails if `/usr/share/dict/words` is missing during `mkindex` execution. Modern packaging requires embedding or providing a bundled wordlist.
3. **Terminal Signal Race:**
   - The asynchronous SIGALRM handler updating the timer clock can occasionally interrupt `fgets` during input if terminal flags are misconfigured.

---

## See Also

- [`how-to-play.md`](./how-to-play.md) — Controls, flags, and scoring.
- [`spec.md`](./spec.md) — Exact cube faces and reverse mechanics specification.
- [`architecture.md`](./architecture.md) — DFS search and dictionary index design.
