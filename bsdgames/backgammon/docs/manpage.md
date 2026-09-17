# backgammon(6) — BSD Reference Manual

An annotated mirror of the classic `backgammon(6)` and `teachgammon` manual page from 4.3BSD / NetBSD.

---

```man
BACKGAMMON(6)                    Games Manual                    BACKGAMMON(6)

NAME
     backgammon – the game of backgammon
     teachgammon – learn to play backgammon

SYNOPSIS
     backgammon [-] [-nrwb] [-pr] [-pw] [-pb] [-t term] [-s file]
     teachgammon

DESCRIPTION
     backgammon lets you play backgammon against the computer or against a
     friend.  All commands are only one letter, so you don't need to type a
     carriage return, except at the end of a move.  The program is mostly
     self-explanatory, so typing a question mark (?) will usually get help.

     If you answer `y' when the program asks if you want the rules, you will
     be transitioned into teachgammon, which explains the rules of the game,
     provides hints on strategy, and runs a practice tutorial game.

OPTIONS
     -n       Do not ask for rules or instructions at startup.
     -pr      Play as Red (human moves ascending: 1 -> 24).
     -pw      Play as White (human moves descending: 24 -> 1).
     -pb      Play two-player hot-seat match (human vs human).
     -t term  Specify terminal type from /usr/share/misc/termcap.
     -s file  Recover previously saved game from file.

MOVE SYNTAX
     A move consists of a sequence of point transitions separated by commas
     or spaces and ending with a newline:

           s-f        Move checker from point s to point f.
           s/r        Move checker from point s by die roll r.

     Available abbreviations:
           s-f1-f2    Chained move: s-f1 followed by f1-f2.
           s/r1r2     Chained roll: move from s by r1, then by r2.
           b or 0     Use for the BAR.
           h or 25    Use for HOME (bearing off).

COMMANDS
     Space, Enter   Roll dice.
     d              Double current game value.
     r              Reprint / redraw the board.
     s              Save game to file.
     q              Quit game.
     ?              Display help message.

FILES
     teachgammon                Rules and tutorial program.
     /usr/share/misc/termcap    Terminal capability database.

AUTHOR
     Alan Char

BUGS
     The program's strategy needs much work.

4th Berkeley Distribution         May 31, 1993         4th Berkeley Distribution
```
