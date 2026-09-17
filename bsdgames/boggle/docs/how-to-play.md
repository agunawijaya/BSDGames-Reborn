# `boggle` — How to Play

> Complete gameplay rules, controls, scoring algorithms, and command-line options.

---

## 1. Objective

Find as many valid English words of 3 or more letters on a 4x4 grid within 3 minutes (180 seconds).

A legal word must satisfy:
1. **Adjacency:** Consecutive letters must be horizontally, vertically, or diagonally adjacent on the 4x4 board.
2. **No Re-use:** A specific letter cube may only be used **once per word** (unless the `+` or `++` flag is enabled).
3. **Dictionary Validity:** The word must exist in the game's English dictionary. Proper nouns, abbreviations, hyphens, and contractions are illegal.
4. **Length:** Words must contain at least 3 letters (or the minimum length specified by `-w`).

---

## 2. Controls & Terminal Input

The game runs directly inside your terminal window using raw TUI mode:

| Key / Action | Effect |
|---|---|
| `<space>` | Starts the 3-minute round timer and reveals the board letters. |
| `<word> + <Enter>` | Submit a word. If valid on the board and meets minimum length, it is staged for scoring. |
| `<Enter>` (empty line) | Displays remaining time on the clock (e.g. `2:45`). |
| `^D` or `EOF` | Conclude the round early and trigger final tally. |
| `\033` (`<Esc>`) | Post-game word locator: highlights how any missed word was connected on the board. |
| `^L` or `^R` | Redraw the terminal screen. |
| `q` | Quit the game after round completion. |
| `<space>` (after round) | Start a new round with freshly shaken cubes. |

---

## 3. Command-Line Options & Difficulty Setup

```bash
boggle [-b] [-d] [-s seed] [-t time] [-w minlength] [+ | ++] [board-string]
```

### Options Breakdown

| Flag / Argument | Purpose & Permitted Values | Default |
|---|---|:---:|
| `-t <time>` | Sets round duration in seconds ($1 \dots 3600$). | `180` (3 minutes) |
| `-w <min>` | Sets minimum acceptable word length ($3 \dots 15$). | `3` letters |
| `-s <seed>` | Sets PRNG seed for deterministic / reproducible boards. | `0` (time-seeded) |
| `-b` | **Batch Mode:** Reads words from standard input and prints all valid words on the board. Requires board specification. | Disabled |
| `-d` | Debug mode: prints search tree traversals. | Disabled |
| `+` | Allows cube reuse across a single word. | Disabled |
| `++` | (`selfuse`) Allows self-adjacency (repeated letters from same cube). | Disabled |
| `[16-char string]` | Custom board layout (e.g. `boggle aaciotehnpsefhiy`). | Random shake |

### Popular Difficulty Presets

- **Casual Play:** `boggle -t 300` (5 minutes, standard 3-letter words).
- **Tournament Pro:** `boggle -w 4` (3 minutes, only words $\ge 4$ letters count).
- **Lightning Blitz:** `boggle -t 60 -w 3` (1 minute high-intensity sprint).
- **Grandmaster Challenge:** `boggle -w 5 -t 180` (3 minutes, only long compound words $\ge 5$ letters).

---

## 4. Scoring Mechanism

The original BSD `boggle` evaluates performance primarily through **lexical capture percentage**:

$$\text{Player Percentage} = \frac{\text{Words Found}}{\text{Words Found} + \text{Words Missed}} \times 100\%$$

### Traditional Parker Brothers Point System (Reference)

For comparison and multiplayer tournaments, the traditional point table scales with word length:

| Word Length | Points Awarded |
|:---:|:---:|
| 3 letters | 1 point |
| 4 letters | 1 point |
| 5 letters | 2 points |
| 6 letters | 3 points |
| 7 letters | 5 points |
| 8+ letters | 11 points |

---

## 5. Tips & Word-Finding Strategies

1. **Scan Common Endings:** Identify adjacent *S*, *E*, *D*, *R*, and *T* cubes. Once you spot a base stem (e.g. *REST*), quickly branch out: *REST*, *RESTS*, *RESTED*, *RESTER*.
2. **Look for Plurals:** Almost every regular noun on the board that touches an *S* doubles your word count.
3. **Don't Overlook Small Words:** In standard `-w 3` mode, three-letter words (*AND*, *THE*, *CAT*, *DOG*, *ONE*, *TIE*) take seconds to enter and rapidly raise your found percentage.
4. **Vowel Hubs:** Locate vowels (*A*, *E*, *I*, *O*, *U*) surrounded by consonants. These clusters are fertile grounds for radial 4-letter words.
5. **Trace Backwards:** If you see an interesting letter cluster like *TION*, trace backward to find preceding consonants: *ACTION*, *NATION*.
