# `hack` — Working Notes & Engine Quirks

> Technical observations, memory structures, and file layout quirks discovered during codebase reverse-engineering.

---

## 1. The Multi-File Level Persistence Architecture

Unlike modern roguelikes that hold the entire dungeon in system memory, *Hack* was written for systems where RAM was tightly constrained.
- Only the **current level** is loaded into active memory structures (`struct rm levl[80][24]`).
- When descending to level 2 via stairs (`>`), the game calls `savelev()` in `hack.lev.c`:
  - It writes a binary snapshot file named `xlock.2` or `<pid>.1` into the temporary directory.
  - It then synthesizes level 2 in the exact same memory buffer.
- Returning up the stairs (`<`) causes `hack.lev.c` to read back `<pid>.1` from disk, restoring the exact state of dropped items, bloodstains, and corpses.

---

## 2. The Mechanics of "Elbereth" (`hack.engrave.c`)

The sacred dust engraving is implemented as a string comparison on the player's current coordinate:
```c
int in_elbereth() {
    struct engrave *ep = engrave_at(u.ux, u.uy);
    return (ep && !strcmp(ep->engr_txt, "Elbereth"));
}
```
- Attacking a monster while standing on the engraving scuffs the letters in the dust!
- Each attack has a probability of erasing one letter (`"Elberet"`), eventually breaking the enchantment.

---

## 3. The Shopkeeper Credit Loophole (`hack.shk.c`)

When a player drops gold inside a shop, the shopkeeper adds that amount to the player's credit balance:
```c
eshk.credit += gold_value;
```
If an adventurer uses a pet dog to carry unpaid items outside the shop doorway, the shopkeeper never marks the item as stolen. The player can then walk back in, "sell" the stolen item back to the shopkeeper, and accumulate unlimited gold. This legendary exploit was famously preserved in early versions of NetHack as a badge of honor for clever players.
