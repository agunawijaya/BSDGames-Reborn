# Hack — BSDGames Reborn

> The iconic display-oriented Dungeons & Dragons roguelike originally created by
> **Jay Fenlason**, **Kenny Woodland**, **Mike Thome**, and **Jon Payne** (1982–1984),
> massively expanded by **Andries Brouwer** (CWI Amsterdam, 1984–1985), and distributed in 4.3BSD.
> The direct historical ancestor of **NetHack**.

---

## At a Glance

- **Original Title:** *Hack — exploring the Dungeons of Doom*
- **Authors:** Jay Fenlason, Kenny Woodland, Mike Thome, Jon Payne (original authors); Andries Brouwer (major expansion & rewrite)
- **Original Release:** 1982–1985 (integrated into 4.3BSD in 1986)
- **Genre:** Roguelike Dungeon Crawler / Tactical Turn-Based RPG
- **Complexity:** **XL** (~30 procedural dungeon levels, 58+ monster species, hundreds of magical items, emergent AI)
- **Upstream Source:** [`vattam/BSDGames/tree/master/hack`](https://github.com/vattam/BSDGames/tree/master/hack)
- **Port Status:** 🟠 **Documentation Phase (Pre-Porting)**

---

## What Makes Hack Legendary?

1. **The Direct Ancestor of NetHack:** In 1987, Mike Stephenson took Andries Brouwer's *Hack 1.0.3* source code and formed the NetHack DevTeam. Almost every iconic NetHack mechanic originated here in BSD *Hack*.
2. **Persistent "Bones" Levels across Players (`hack.bones.c`):** When your character dies in the dungeon, your exact level layout, your ghost (`pm_ghost`), your grave, and your cursed gear are serialized to disk (`bonD0.x`). In future playthroughs (even by different Unix users on the same machine), players stumble across your tombstone and battle your restless ghost!
3. **The Faithful Pet Dog (`hack.dog.c`):** Unlike Rogue's lonely dungeon crawl, *Hack* gave the player a loyal pet dog (or little dog) that follows, fights alongside you, retrieves items, and whimpers before cursed items, acting as an organic curse-detection tool.
4. **Interactive Shopkeepers & The Dungeon Economy (`hack.shk.c`):** Subterranean general stores staffed by eccentric shopkeepers who calculate item values, extend credit, call the Keystone Kops on shoplifters, or blast thieves with wands of death.
5. **The Mystery of Unidentified Magic (`hack.o_init.c`):** In every new game, potion colors (*bubbly*, *ruby*, *milky*), scroll labels (*ELBIB YLOH*, *NR 9*), and wand materials are randomly shuffled. Players must deduce their functions through trial, price identification, or scrolls of identify.
6. **Multi-Segment Long Worms (`hack.worm.c`):** Monstrous underground worms that move as a linked list of body segments, slithering realistically through narrow corridors.
7. **The Sacred Word of Protection (`hack.engrave.c`):** Scratching the mystical name *"Elbereth"* into the dust with your fingers or a wand causes attacking monsters to flee in terror.

---

## Documentation Taxonomy

All documentation is stored in [`docs/`](./docs/):

| Document | Purpose |
|---|---|
| [`about.md`](./docs/about.md) | Historical brochure, Fenlason's high school origins, Brouwer's CWI expansion, and NetHack lore. |
| [`how-to-play.md`](./docs/how-to-play.md) | Complete manual: controls, movement, pet care, shops, identification, and Elbereth. |
| [`walkthrough.md`](./docs/walkthrough.md) | Universal Ascendant Protocol: Survival strategies from Dungeon Level 1 to the Amulet of Yendor. |
| [`world-map.md`](./docs/world-map.md) | Dungeons of Doom progression, procedural room/corridor generation, vaults, and shops. |
| [`spec.md`](./docs/spec.md) | Reverse specification, formal state, rules, bones mechanics, and **Complete 58-Monster Table**. |
| [`architecture.md`](./docs/architecture.md) | Deep dive into turn loops, monster AI, pet dog mechanics, shopkeepers, and bones files. |
| [`lessons.md`](./docs/lessons.md) | Pedagogical engineering lessons: asynchronous persistent bones sharing, emergent AI, and DAWG item randomization. |
| [`port-ideas.md`](./docs/port-ideas.md) | Modernization brainstorm: graphical tilesets, cloud shared bones server, seedable procedural runs. |
| [`diff-log.md`](./docs/diff-log.md) | Original 1985 BSD Hack 1.0.3 features vs. modern spiritual successor enhancements. |
| [`notes.md`](./docs/notes.md) | Working technical notes, binary level serialization formats, and termcap quirks. |
| [`manpage.md`](./docs/manpage.md) | Annotated mirror of classic `hack(6)` manual page. |
| [`lineage.md`](./docs/lineage.md) | Comprehensive roguelike family tree: D&D $\rightarrow$ Rogue $\rightarrow$ Hack $\rightarrow$ NetHack $\rightarrow$ Modern Roguelikes. |
| [`test-scenarios.md`](./docs/test-scenarios.md) | End-to-end verification scripts, shop transactions, bones level testing, and QA sign-off template. |
| [`references.md`](./docs/references.md) | Historical citations, USENET archives, and NetHack DevTeam primary sources. |
| [`decisions/`](./docs/decisions/) | Architecture Decision Records (ADRs) overriding root defaults. |

---

## Upstream Attribution

Original C source is maintained in the [vattam/BSDGames](https://github.com/vattam/BSDGames/tree/master/hack) repository. Copyright (c) 1982 Jay Fenlason; Copyright (c) 1985 Andries Brouwer. All rights reserved. See root [`ATTRIBUTION.md`](../../ATTRIBUTION.md).
