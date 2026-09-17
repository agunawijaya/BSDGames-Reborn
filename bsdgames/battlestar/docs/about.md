# About `battlestar`

> *"In the days before the darkness came, when battlestars ruled the heavens... Three He made and gave them to His daughters, Beautiful nymphs, the goddesses of the waters."*

---

## The Pitch

Imagine waking up in silk pajamas aboard a dying battlestar cruiser as sirens wail, bulkheads collapse, and laser fire shears through the steel decks. You scavenge a laser blaster, fight through frantic crewmates and Cylon boarders to reach the sole remaining Viper starfighter, and blast through launch tubes into the pitch-black vacuum of space.

After dogfighting alien raiders across orbital coordinates, your crippled fighter crash-lands onto an uncharted tropical archipelago. Here, high technology abruptly gives way to ancient myths: enchanted woods, bloodthirsty elves, slumbering water goddesses, forgotten ruins, and mystical talismans.

Written on the Cory Hall PDP-11/70 minicomputer at the University of California, Berkeley in 1979, **`battlestar`** is one of the most eccentric, ambitious, and atmospheric interactive fiction works of the early Unix era. It seamlessly marries 1970s space opera (drawing direct inspiration from Glen A. Larson's *Battlestar Galactica*) with high fantasy swordplay, tropical island survival, and a dual-world day/night simulation.

---

## Visual Presentation

![Awakening in Luxurious Stateroom](../media/01-start.png)
*Figure 1: Starting the game in Room 22 aboard the crumbling Battlestar cruiser.*

![Orbital Viper Flight Simulation](../media/02-flight.png)
*Figure 2: The interactive curses-based space dogfight minigame (`fly.c`), tracking fuel, torpedoes, and Cylon interceptors.*

![Ascension to Wizard Victory](../media/03-victory.png)
*Figure 3: Uniting the three magical amulets of the water goddesses to achieve grand victory and the highest rank.*

---

## Historical & Cultural Background

| Metadata | Details |
|---|---|
| **Original Title** | *Battlestar — a tropical adventure game* |
| **Author** | David W. Horatio Riggle (credited humorously in source as *"His Lordship, Admiral David W. Horatio Riggle"*) |
| **Platform** | Digital Equipment Corporation (DEC) PDP-11/70 running 2BSD / 4.1BSD Unix |
| **Institution** | Computer Science Division, EECS Department, University of California, Berkeley (Cory Hall) |
| **Release Date** | Fall 1979 (Initial version); Version 4.2 distributed with 4.2BSD in August 1983 |
| **Language** | C (K&R C, later standardized to ANSI C in NetBSD) |
| **Upstream Code** | [`vattam/BSDGames/tree/master/battlestar`](https://github.com/vattam/BSDGames/tree/master/battlestar) |

### The Cory Hall Hacker Lore

During the late 1970s, the Cory Hall basement at UC Berkeley was a hothouse of operating system innovation and creative computing. While Bill Joy and Chuck Haley were writing `vi`, `csh`, and the virtual memory kernel enhancements that became BSD, computer science students were pushing terminal hardware to its limits with interactive games.

David Riggle developed *Battlestar* as an experiment in building a rich parser-driven adventure directly in the C language. At the time, most large adventures (like Crowther & Woods' *Colossal Cave Adventure*) had originated in Fortran. Riggle sought to demonstrate that C's concise pointer semantics, bitwise operations, and structured types made it ideal for modeling complex interactive worlds.

Riggle embedded playful tributes to his Berkeley contemporaries directly into the source code. In [`init.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/init.c#L88-L105), the game maintains an explicit list of "hereditary wizards":
- `riggle` (David Riggle himself)
- `chris` (Chris Torek, longtime BSD contributor)
- `edward` (Edward Wang, developer of the BSD `window` multiplexer)
- `dmr` (Dennis M. Ritchie, co-creator of Unix and C)
- `ken` (Ken Thompson, co-creator of Unix)

Conversely, entering names like `wnj` (Bill Joy), `root`, or `ted` identified the player as a "bad guy," triggering suspicious in-game responses.

---

## Why It's Fun

1. **Genre Fusion (Space Opera + Sword & Sorcery):** One moment you are loading photon torpedoes into a starfighter; the next, you are swinging a broadsword against malicious wood-elves in a tropical grove or diving into emerald pools to meet water nymphs.
2. **Dynamic Day / Night Cycles:** The world is living and reactive. Every 100 turns, daylight fades into twilight and darkness. Ruined structures become pitch-black, requiring a lit lantern or matches, while dangerous wood-elves emerge from jungle shadows armed with halberds.
3. **True Spatial Mechanics (Compass & Relative Movement):** You are not locked into typing `north` or `south`. You can navigate egocentrically using `ahead`, `back`, `left`, and `right`. The game continuously tracks your facing direction, calculating perspective on the fly.
4. **Mini-Games Inside Interactive Fiction:** Flying the Viper in orbit is not a scripted cutscene—it is a functional 2D arcade minigame (`fly.c`) rendered using Berkeley `curses`, requiring keyboard dogfighting skills against incoming Cylon raiders.
5. **Detailed Medical Trauma:** Rather than simple hit points, combat inflicts localized trauma: cracked skulls, severed backbones, broken ribs, and severed limbs. Each injury impairs physical actions and reduces carrying capacity.
6. **Multi-Faceted Personality Rating:** Winning or retiring doesn't yield a dry score number; it computes a psychological profile evaluating **Pleasure**, **Power**, and **Ego**, awarding titles like *Junior Voyeur*, *Don Juan*, *Klingon*, *Darth Vader*, *Mr. Roarke*, or *Sauron the Great*.

---

## Difficulty & Progression

Unlike level-based arcade games, *Battlestar* implements an **open-world multi-stage narrative progression**:

### Progression Stages

1. **Stage 1: The Starship Evacuation (Rooms 1–31):**
   - Immediate time pressure. The battlestar is collapsing. You must explore the decks, acquire weapons (knife, laser pistol, bomb), find clothing, locate launch tube #7, and launch the lone remaining Viper fighter before the cruiser explodes.
2. **Stage 2: Orbital Combat & Planetary Re-entry (Rooms 32–68):**
   - Space navigation requiring careful fuel (`TANKFULL 250`) and torpedo management (`TORPEDOES 10`). You must dogfight through Cylon raiders and plot re-entry coordinates before fuel exhaustion causes an unrecoverable crash.
3. **Stage 3: Island Exploration & Artifact Gathering (Rooms 69–246):**
   - Surviving on the tropical island across alternating day and night cycles. Gathering food (coconuts, papayas, mangoes) to prevent starvation, evading or slaying nocturnal wood-elves, locating archaeological tools (shovel, rope, mallet), and discovering ancient temples.
4. **Stage 4: The Three Water Goddesses & The Citadel (Rooms 247–275):**
   - Locating the secret grottoes of the three nymphs. Solving their individual trials to receive the **Amulet**, the **Medallion**, and the **Talisman**.
5. **Stage 5: Wizard Ascension & Endgame:**
   - Uniting all three talismans triggers a cosmic resonance, transforming the player into an immortal Wizard. The player gains access to the reality-bending `su` command and achieves total victory.

### Scaling & Constant-Difficulty Design

- **Implicit Turn Pressure:** The player has finite biological endurance. Starvation sets in if food is neglected (`ate`), sleepiness degrades combat reflexes (`snooze`), and injuries bleed over time until bandaged or healed with enchanted potions.
- **Nocturnal Escalation:** When night falls (`CYCLE 100`), room illumination drops to zero in covered areas, and high-tier aggressive enemies (armed Elves and Woodsmen) spawn across outdoor paths.
- **Carry Weight & Encumbrance:** Players are strictly limited to 60 kg (`MAXWEIGHT`) and 10 bulk units (`MAXCUMBER`). Every broken bone dynamically lowers this threshold, forcing strategic rationing of tools and weapons.

---

## Known Quirks & Bugs in the Original

1. **Passwordless Wizard Cheat:** If the player runs the game under a Unix user account named `riggle`, `chris`, `edward`, `dmr`, or `ken`, the game automatically grants Wizard status at startup, allowing instant room teleportation via `su`.
2. **Darkness Trap Death:** Dropping or extinguishing your only light source inside an unlit subterranean room leaves you permanently blind (`notes[CANTSEE]`), rendering movement impossible unless you fumble with matches.
3. **Terminal Resizing Glitch in `fly.c`:** The curses-based flight simulator assumes an exact 80x24 terminal grid. Resizing the terminal during flight causes coordinate corruption or curses buffer assertion failures.
4. **Save File Cryptography:** The original save game routine (`save.c`) applied a trivial XOR encryption mask using the user's username, making `.Bstar` save files easily editable with standard hex editors.

---

## See Also

- [`how-to-play.md`](./how-to-play.md) — Controls, commands, and survival strategy.
- [`world-map.md`](./world-map.md) — Topological maps and Master Room Directory.
- [`walkthrough.md`](./walkthrough.md) — Step-by-step victory guides.
- [`spec.md`](./spec.md) — Reverse technical specification.
