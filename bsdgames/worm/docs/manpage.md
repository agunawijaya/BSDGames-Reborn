# worm(6) — BSD Reference Manual

An annotated mirror of the classic `worm(6)` manual page from 4.3BSD / NetBSD.

---

```man
WORM(6)                          Games Manual                          WORM(6)

NAME
     worm – Play the growing worm game

SYNOPSIS
     worm [size]

DESCRIPTION
     In worm, you are a little worm, your body is the "o"'s on the screen
     and your head is the "@".

     You move with the hjkl keys and the arrow keys (as in the game snake).
     If you don't press any keys, you continue in the direction you last moved.

     The upper case HJKL keys move you as if you had pressed several (9 for
     HL and 5 for JK) of the corresponding lower case key (unless you run into
     a digit, then it stops).

     On the screen you will see a digit; if your worm eats the digit it will
     grow longer, the actual amount longer depends on which digit it was that
     you ate.  The object of the game is to see how long you can make the worm
     grow.

     The game ends when the worm runs into either the sides of the screen, or
     itself.  The current score (how much the worm has grown) is kept in the
     upper right corner of the screen.

     The optional argument, if present, is the initial length of the worm.

KEYS
     h, Left Arrow   Move left one step
     j, Down Arrow   Move down one step
     k, Up Arrow     Move up one step
     l, Right Arrow  Move right one step
     H, L            Sprint dash horizontally (up to 8-9 steps)
     J, K            Sprint dash vertically (up to 4-5 steps)
     Ctrl-L, \f      Redraw the screen
     Ctrl-C, Ctrl-D  Exit game

AUTHOR
     Michael Toy
     University of California, Santa Cruz / UC Berkeley

SEE ALSO
     curses(3), snake(6), rogue(6)

4th Berkeley Distribution         May 31, 1993         4th Berkeley Distribution
```
