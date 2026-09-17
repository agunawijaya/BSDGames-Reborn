# `boggle(6)` — Man Page Annotation

> Annotated modern mirror of the classic 4.4BSD `boggle(6)` manual page.

---

```text
BOGGLE(6)                    BSD Games Manual                    BOGGLE(6)

NAME
     boggle — word search game

SYNOPSIS
     boggle [-b] [-d] [-s seed] [-t time] [-w length] [+ | ++] [boardspec]

DESCRIPTION
     The object of boggle is to find as many words as possible on a 4 by 4
     grid of letters within a specified time limit (default 3 minutes). A
     valid word must be at least 3 letters long and formed by connecting
     adjacent letters horizontally, vertically, or diagonally. No cube may
     be used more than once in a given word.

OPTIONS
     -b         Run in batch mode. A boardspec must be provided, and words
                are read from standard input.
     -d         Enable debugging mode.
     -s seed    Set the random number seed.
     -t time    Set the game time limit in seconds (default 180).
     -w length  Set minimum word length (default 3 letters, minimum 3).
     +          Allow multiple uses of the same cube in a word.
     ++         Allow same cube to be used consecutively (self-adjacency).
     boardspec  A 16-character string explicitly defining board letters.

GAMEPLAY
     Press <space> to start the timer and reveal the board. Type words
     followed by <return>. Entering an empty line displays the remaining
     time. When the time expires, the computer displays the words you
     found, the words you missed, and your score percentage.

AUTHORS
     Barry Brachman, Department of Computer Science, University of
     British Columbia.

HISTORY
     The boggle game first appeared in 4.4BSD (1993).
```

---

## Modern Annotations

1. **Board Specification Syntax:**
   - Passing a 16-character string directly (e.g. `boggle ednoswaaciotacel`) allows testing specific board layouts or challenging friends with the exact same puzzle setup across different computers.
2. **Batch Mode Utility:**
   - The `-b` flag is exceptionally useful for scripting and solver benchmarks:
     ```bash
     cat wordlist.txt | boggle -b aaciotehnpsefhiy
     ```
     filters `wordlist.txt` and outputs only words physically constructible on the specified board.
