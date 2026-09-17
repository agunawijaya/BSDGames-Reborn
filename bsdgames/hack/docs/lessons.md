# Lessons from `hack`

> Pedagogical software engineering lessons extracted from Jay Fenlason and Andries Brouwer's 1982–1985 C codebase.

---

## 1. Asynchronous Persistent World-Sharing (The Bones Pattern)

### Context & Original Code
In 1984, before internet servers and multiplayer databases were common, how could independent single-player game sessions interact?

Brouwer implemented cross-session asynchronous persistence in [`hack.bones.c:45-80`](https://github.com/vattam/BSDGames/tree/master/hack/hack.bones.c#L45-L80):

```c
/* Serialize dead player's level to a shared system spool directory */
sprintf(bones, "bonD0.%d", dlevel);
if ((fd = open(bones, O_WRONLY | O_CREAT | O_EXCL, 0660)) >= 0) {
    savelev(fd, dlevel);
    close(fd);
}
```

### Why It Matters
- **Asynchronous Social Gameplay:** Without a network connection, players sharing a multi-user Unix machine experienced an organic multiplayer ecosystem. Stumbling across your friend's ghost and recovering their cursed broadsword created vivid communal storytelling.
- **Modern Relevance:** This exact mechanic is the direct architectural forerunner of *Dark Souls* bloodstains, *Spelunky* ghost runs, and modern asynchronous roguelite graves.

---

## 2. Emergent Simulation via Orthogonal Interaction Rules

### Context & Original Code
Instead of hardcoding hundreds of specific quest scripts, *Hack* implemented a small set of universal physical and magical rules that interact dynamically.

In [`hack.eat.c`](https://github.com/vattam/BSDGames/tree/master/hack/hack.eat.c) and [`hack.shk.c`](https://github.com/vattam/BSDGames/tree/master/hack/hack.shk.c):
- Dogs are friendly NPCs that eat meat and dislike cursed items.
- Shopkeepers own all items resting on shop tiles.
- If you drop a tripe ration outside a shop, your dog picks up an expensive uncursed broadsword from inside the shop and carries it out to you to fetch the meat!
- Because the dog took the item and not the player, the shopkeeper does not consider it a crime, allowing the player to legally acquire the item for free!

### Why It Matters
- **The Core of Immersive Sims:** Complex, delightful behaviors emerge naturally from consistent foundational systems rather than scripted cutscenes. Designing orthogonal systems (items have owners; dogs fetch items; shopkeepers track player inventory) yields unexpected gameplay strategies that surprise even the game's creators.

---

## 3. Appearance Shuffling for Knowledge Invalidation

### Context & Original Code
In many RPGs, once a player memorizes that a red potion is "Healing", all future mystery is lost.

In [`hack.o_init.c:50-95`](https://github.com/vattam/BSDGames/tree/master/hack/hack.o_init.c#L50-L95), *Hack* randomizes all visual descriptions at startup:

```c
/* Permute potion appearance descriptions across effect indices */
for (i = 0; i < NUM_POTIONS; i++) {
    j = rn2(NUM_POTIONS);
    swap_descriptions(potion_colors[i], potion_colors[j]);
}
```

### Why It Matters
- **Separation of Appearance and Semantics:** Every run forces the player to engage in scientific deduction and risk assessment. It tests the player's understanding of game mechanics rather than rote memorization.
- **Pedagogical Takeaway:** Decoupling internal data IDs from user-facing representation is a foundational software design principle that enables procedural variation, localization, and accessibility theming.
