# `hack(6)` — Man Page Annotation

> Annotated modern mirror of the classic 4.3BSD `hack(6)` manual page.

---

```text
HACK(6)                      BSD Games Manual                    HACK(6)

NAME
     hack — exploring the Dungeons of Doom

SYNOPSIS
     hack [-d] [-s] [-u name] [-r role]

DESCRIPTION
     hack is a display-oriented dungeons & dragons-like game. Both display
     and command structure resemble rogue.

     To win the game, you must retrieve the Amulet of Yendor from the
     deepest recesses of the Dungeons of Doom and climb back out to the
     surface. Along the way you will encounter ferocious monsters, hidden
     vaults, magical shops, and the corpses and ghosts of adventurers who
     died before you.

COMMANDS
     Movement uses the standard vi keys (h, j, k, l, y, u, b, n).
     Common commands include:
           w (wield weapon), W (wear armor), T (take off armor),
           P (put on ring), R (remove ring), e (eat food),
           q (quaff potion), r (read scroll), z (zap wand),
           a (apply tool), d (drop item), t (throw projectile),
           E (engrave message), s (search for secret doors).

FILES
     /usr/games/lib/hackdir/record    high-score table
     /usr/games/lib/hackdir/bonD0.*   bones files of fallen players
     /usr/games/lib/hackdir/rumors    fortune cookie text database

AUTHORS
     Jay Fenlason, Kenny Woodland, Mike Thome, and Jon Payne.
     Extended and rewritten by Andries Brouwer.

HISTORY
     The hack game first appeared in 4.3BSD (1986).
```

---

## Modern Annotations

1. **Bones File Archival:**
   - The manual explicitly notes the `bonD0.*` files. In multi-user university environments, `/usr/games/lib/hackdir/` was world-readable and group-writable so that all student accounts contributed to the shared cemetery.
2. **The Dungeons of Doom Lore:**
   - *Hack* codified the name "Dungeons of Doom" and the "Amulet of Yendor" (Yendor is famously *Rodney* spelled backwards, named after an early computer lab colleague).
