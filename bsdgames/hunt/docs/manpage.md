# `hunt(6)` & `huntd(6)` — Man Page Annotation

> Annotated modern mirror of the classic 4.3BSD manual pages for `hunt` and `huntd`.

---

```text
HUNT(6)                      BSD Games Manual                    HUNT(6)

NAME
     hunt — a multi-player multi-terminal game

SYNOPSIS
     hunt [-bcfmqSs] [-n name] [-t team] [-p port] [-w message] [host]

DESCRIPTION
     The object of the game hunt is to kill off the other players. There
     are no rooms, no treasures, and no monsters. Instead, you wander
     around a maze, find grenades, trip mines, and shoot down walls and
     players. The more players you kill before you die, the better your
     score is.

     If the -m flag is given, you enter the game as a monitor (you can see
     the action but you cannot play).

     hunt normally looks for an active game on the local network; if none
     is found, it starts one up on the local host. The location of the
     game may be specified by giving the host argument.

OPTIONS
     -b         Use the automated bot (Otto) to play.
     -c         Enter in cloaked mode.
     -f         Do not fly (standard walking mode).
     -m         Monitor mode: watch game without playing.
     -n name    Specify player handle / callsign.
     -t team    Join a specific squad (e.g. RED, BLUE).
     -p port    Set network port number.
     -q         Quick entry (skip introductory prompts).
     -s         Show driver statistics and active player roster.

AUTHORS
     Conrad Huang, Kenneth Chung, and Greg Couch, Computer Graphics
     Laboratory, University of California, San Francisco.

SEE ALSO
     huntd(6)
```

---

```text
HUNTD(6)                     BSD Games Manual                   HUNTD(6)

NAME
     huntd — hunt daemon, back-end for hunt game

SYNOPSIS
     huntd [-s] [-p port]

DESCRIPTION
     huntd is the game driver for the multi-player game hunt. It coordinates
     player positions, bullet paths, wall destruction, explosions, and
     scoring across the shared maze.

     Normally huntd is started automatically by the first hunt client that
     cannot find an active server, but it can also be run continuously in
     the background on a dedicated game server host.
```

---

## Modern Annotations

1. **Autonomous Daemon Lifecycle:**
   - The dual-binary design (`hunt` vs `huntd`) separates client rendering from stateful world simulation—the exact client-server paradigm adopted a decade later by *Doom Dedicated Server*, *QuakeWorld*, and modern MMOs.
2. **The Monitor Flag (`-m`):**
   - Spectator modes are now a staple of competitive esports; *Hunt* included this feature out of the box in 1985 so students in computer labs could project matches onto overhead screens.
