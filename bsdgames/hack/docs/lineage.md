# `hack` — Lineage & Genre Siblings

> Tracing the genealogy of the roguelike genre, from early tabletop D&D to modern action roguelites.

---

## The Roguelike Family Tree

```mermaid
flowchart TD
    DND["Dungeons & Dragons<br/>(Gygax & Arneson, 1974)"]
    Colossal["Colossal Cave Adventure<br/>(Crowther & Woods, 1976)"]
    Rogue["Rogue<br/>(Toy, Wichman, Arnold, 1980)"]
    
    Hack["Hack<br/>(Fenlason & Brouwer, 1982-1985)"]
    Moria["Moria<br/>(Robert Alan Koeneke, 1983)"]
    
    NetHack["NetHack<br/>(Mike Stephenson & DevTeam, 1987+)"]
    Angband["Angband<br/>(Alex Cutler & Andy Astrand, 1990)"]
    ADOM["Ancient Domains of Mystery (ADOM)<br/>(Thomas Biskup, 1994)"]
    DCSS["Dungeon Crawl Stone Soup<br/>(Linley Henzell, 1997+)"]
    
    Spelunky["Spelunky / Modern Roguelites<br/>(Derek Yu, 2008+)"]
    PixelDungeon["Pixel Dungeon / Shattered PD<br/>(Watabou / 00-Evan, 2012+)"]

    DND --> Rogue
    Colossal --> Rogue
    Rogue --> Hack
    Rogue --> Moria
    Hack --> NetHack
    Moria --> Angband
    NetHack --> ADOM
    NetHack --> DCSS
    NetHack --> Spelunky
    NetHack --> PixelDungeon

    classDef classic fill:#2d3748,stroke:#4a5568,color:#fff;
    classDef hero fill:#1a365d,stroke:#3182ce,color:#fff;
    classDef modern fill:#22543d,stroke:#38a169,color:#fff;

    class DND,Colossal,Rogue,Moria classic;
    class Hack,NetHack hero;
    class Angband,ADOM,DCSS,Spelunky,PixelDungeon modern;
```

---

## Direct Heritage: From Hack to NetHack

- **1980 (Rogue):** Established ASCII grid movement, procedural dungeons, hunger clocks, and permadeath.
- **1982–1985 (Hack):** Expanded Rogue with interactive shops, pet dogs, bones levels, long worms, and 58+ monster classes.
- **1987 (NetHack):** Mike Stephenson, Izchak Miller, and the DevTeam branched Brouwer's Hack source to add quests, branching branches (Sokoban, Mines, Gehennom), and the famous devteam philosophy: *"The DevTeam thinks of everything."*
- **2000s+ (Modern Roguelikes):** *Pixel Dungeon*, *Brogue*, *Spelunky*, *The Binding of Isaac*, and *Enter the Gungeon* directly inherited the systemic room-and-corridor design and emergent hazard mechanics born in *Hack*.
