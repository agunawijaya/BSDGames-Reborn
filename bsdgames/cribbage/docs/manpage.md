# cribbage(6) — BSD Reference Manual

An annotated mirror of the classic `cribbage(6)` manual page from 4.3BSD / NetBSD.

---

```man
CRIBBAGE(6)                      Games Manual                      CRIBBAGE(6)

NAME
     cribbage – the card game of cribbage

SYNOPSIS
     cribbage [-e] [-q] [-r]

DESCRIPTION
     cribbage plays the card game cribbage, with the program playing one hand
     and the user the other.  The program will initially ask the user if the
     game is to be a short (to 61 points) or long (to 121 points) game.  A
     short game is played once around the board; a long game is twice around.
     The default is long game.

     The program prompts for user actions with brief questions.  Card
     specifications may be entered in several forms:
           • Two-character abbreviations such as 5s (five of spades) or th
             (ten of hearts).
           • Spaced pairs such as 5 s or 10 h.
           • Natural phrases like 5 of spades or ten of hearts.
           • If only one card of a given rank is held, entering just the rank
             (e.g., 5 or k) is sufficient.

     When cutting the deck, an integer index between 0 and 51 may be entered,
     or the -r flag may be specified to cut automatically.

OPTIONS
     -e   Explain scoring errors.  When this flag is active, if the player
          miscounts a hand or pegging score, cribbage will explain how the
          correct score was derived, listing all combinations of 15s, pairs,
          runs, and flushes.

     -q   Quiet mode.  Suppresses certain verbose banners and instructions.

     -r   Random cut.  Rather than asking the player to cut the deck, cribbage
          will choose a cut position pseudo-randomly.

FILES
     /var/games/criblog    Historical log of games played and winning margins.

AUTHORS
     Earl T. Cohen wrote the game logic and AI.
     Ken Arnold designed the screen management routines using curses(3).

HISTORICAL NOTE
     Cribbage was invented in the early 17th century by the English poet Sir
     John Suckling.  The curses-based computer version first appeared in
     2.8BSD and 4.1BSD at the University of California, Berkeley (1980).

4th Berkeley Distribution         May 31, 1993         4th Berkeley Distribution
```
