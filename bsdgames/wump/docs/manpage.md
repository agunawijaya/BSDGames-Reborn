# `wump` — Original Man Page (Annotated)

> Mirror of the original `wump.6` man page from BSDGames, converted
> to Markdown and annotated with historical context and technical notes.
>
> Upstream source: <https://github.com/vattam/BSDGames/blob/master/wump/wump.6>

---

## Copyright & License Notice

```text
Copyright (c) 1989, 1993
	The Regents of the University of California.  All rights reserved.

This code is derived from software contributed to Berkeley by
Dave Taylor, of Intuitive Systems.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. Neither the name of the University nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.

	@(#)wump.6	8.1 (Berkeley) 5/31/93
```

---

## NAME

`wump` — hunt the wumpus in an underground cave

## SYNOPSIS

```bash
wump [-h] [-a arrows] [-b bats] [-p pits] [-r rooms] [-t tunnels]
```

## DESCRIPTION

The game `wump` is based on a fantasy game first presented in the pages of *People's Computer Company* in 1973. In *Hunt the Wumpus* you are placed in a cave built of many different rooms, all interconnected by tunnels. Your quest is to find and shoot the evil Wumpus that resides elsewhere in the cave without running into any pits or using up your limited supply of arrows.

### Options

| Option | Argument | Description | Default |
|---|---|---|---|
| `-a` | *arrows* | Specifies the number of magic arrows the adventurer gets. | `5` |
| `-b` | *bats* | Specifies the number of rooms in the cave which contain bats. | `3` |
| `-h` | — | Play the hard version — more pits, more bats, and a generally more dangerous cave. | Off (`EASY`) |
| `-p` | *pits* | Specifies the number of rooms in the cave which contain bottomless pits. | `3` |
| `-r` | *rooms* | Specifies the number of rooms in the cave. Range: 10 to 250. | `20` (manpage mentions `25`, but C source default is `20`) |
| `-t` | *tunnels* | Specifies the number of tunnels connecting each room in the cave to another room. Must be $\ge 2$. | `3` |

> [!WARNING]
> Beware, too many tunnels in a small cave can easily cause it to collapse! The cave generator rejects configurations where `link_num > MAX_LINKS_IN_ROOM (25)` or `link_num > room_num - (room_num / 4)`.

## CAVE TOPOLOGY & SENSES

While wandering through the cave you will notice that, while there are tunnels everywhere, there are some mysterious quirks to the cave topology, including some tunnels that go from one room to another, but not necessarily back! Also, most pesky of all are the rooms that are home to large numbers of bats, which, upon being disturbed, will en masse grab you and move you to another portion of the cave (including those housing bottomless pits, sure death for unwary explorers).

Fortunately, you are not going into the cave without any weapons or tools, and in fact your biggest aids are your senses:
- **Smell:** You can smell the rather odiferous Wumpus up to **two** rooms away (`*sniff*`).
- **Feel:** You can feel the drafts created by an adjacent bottomless pit (`*whoosh*`).
- **Hearing:** You can hear the rustle of giant bats roosting in neighboring caves (`*rustle*`).

## COMBAT & SHOOTING

To kill the Wumpus, you will need to shoot it with one of your magic arrows. You do not have to be in the same room as the creature, and can instead shoot the arrow from as far as three or four rooms away!

When shooting an arrow, you type a list of space-separated room numbers that you would like the arrow to travel through (e.g., `s 12 15 8`). If at any point in its travels it cannot find a tunnel to the room you specify from the room it is in, it will instead fly randomly down one of the available tunnels. If unlucky, the wild arrow may even fly back into your current room and hit you!

---

## HISTORICAL & TECHNICAL ANNOTATIONS

1. **Default Room Discrepancy:** The man page text states "The default cave size is twenty-five rooms", whereas line 73 of `wump.c` defines `#define ROOMS_IN_CAVE 20`. This is a classic documentation-to-implementation drift common in early Unix utility packages.
2. **Semi-Euclidean Cave Warning:** If a player enters a negative room number, the program outputs: `"Sorry, but we're constrained to a semi-Euclidean cave!"`. This joke dates back to Gregory Yob's design philosophy: Yob specifically created *Hunt the Wumpus* to rebel against standard grid-based games (like *Star Trek* or *Hurkle*) which were constrained to Euclidean Cartesian grids.
3. **Magic Tunnel:** In the implementation, specifying room `room_num + 1` triggers a hidden "magic tunnel" mechanic that teleports the adventurer with a flashing sensory prompt (`jump()`).
