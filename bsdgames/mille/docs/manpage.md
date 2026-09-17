# mille(6) — BSD Reference Manual

An annotated mirror of the classic `mille(6)` manual page from 4.3BSD / NetBSD.

---

```man
MILLE(6)                         Games Manual                         MILLE(6)

NAME
     mille – play Mille Bornes against the computer

SYNOPSIS
     mille [file]
     mille -r

DESCRIPTION
     mille plays a two-handed game of Mille Bornes with the computer.  The
     program manages screen updates using curses(3) and prompts for user
     actions using letter commands.

     If a file name is given, mille will restore the game saved in that file.
     If the -r flag is given, mille will restore the default saved game.

CARDS
     The game is played with a deck of 101 cards:

     Hazard (18)           Repair (38)           Safety (4)
     ----------------------------------------------------------------------
     Out of Gas (2)        Gasoline (6)          Extra Tank (1)
     Flat Tire (2)         Spare Tire (6)        Puncture Proof (1)
     Accident (2)          Repairs (6)           Driving Ace (1)
     Stop (4)              Go (14)               Right of Way (1)
     Speed Limit (3)       End of Limit (6)

     Distance Cards (46)
     ----------------------------------------------------------------------
     25 Miles (10), 50 Miles (10), 75 Miles (10), 100 Miles (12), 200 Miles (4)

RULES
     Object:
     The point of this game is to get a total of 5000 points across several
     hands.  Each hand is a race to put down exactly 700 miles before your
     opponent does (or 1000 miles if going for an Extension).

     Board Layout:
     The screen is divided into several areas:
           SAFETY AREA: Safeties played for permanent protection.
           HAND:        The cards in your hand (7 cards, or 8 during turn).
           BATTLE:      Battle pile for Hazard and Remedy cards.
           SPEED:       Speed pile for Speed Limit and End of Limit cards.
           MILEAGE:     Counters showing total distance completed.

     Turn Play:
     Each turn starts with a draw from the deck.  The player then plays a
     card or discards one.  Playing a safety entitles the player to an
     immediate extra turn.

     200-Mile Card Restriction:
     No player may play more than two 200-mile cards in any single hand.

     Coup-Fourre:
     If an opponent plays a Hazard card, and you hold the corresponding
     Safety card in your hand, you may play it immediately, even before
     drawing.  This removes the attack, grants permanent immunity, awards
     a 300-point bonus, and gives you an immediate extra turn.

SCORING
     Points awarded at the end of each hand:
           Milestones Played:    1 point per mile completed.
           Each Safety:          100 points.
           All 4 Safeties:       300 points bonus.
           Each Coup-Fourre:     300 points bonus.
           Trip Completed:       400 points bonus (winner only).
           Safe Trip:            300 points bonus (completed without 200s).
           Delayed Action:       300 points bonus (finished after deck empty).
           Extension:            200 points bonus (completed 1000 miles).
           Shut-Out:             500 points bonus (opponent got 0 miles).

COMMANDS
     P, 1-8       Play the specified card.
     D, d 1-8     Discard the specified card.
     O            Order / sort cards in hand.
     S            Save current game state.
     R, ^L        Redraw screen.
     Q            Quit game.

AUTHORS
     Ken Arnold
     (The game itself is a product of Parker Brothers, Inc.)

SEE ALSO
     curses(3), Ken Arnold, "Screen Updating and Cursor Movement Optimization:
     A Library Package".

4th Berkeley Distribution         May 31, 1993         4th Berkeley Distribution
```
