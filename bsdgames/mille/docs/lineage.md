# Mille — Lineage & Heritage

A historical and mechanical genealogy of Mille Bornes, tracing its roots from early 20th-century
card games to Ken Arnold's BSD terminal adaptation and modern digital racing card games.

---

## 1. The Evolutionary Tree

```mermaid
flowchart TD
    TOURING["Touring (1906)<br/>Wallie Dorr · Parker Brothers<br/>Early automotive card race · Mileage & Hazards"]
    DUJARDIN["Mille Bornes (1954)<br/>Edmond Dujardin (Arcachon, France)<br/>French road signs · Coup-fourré · 101-card deck"]
    PARKER["Parker Brothers US Edition (1962)<br/>Licensed English edition · Classic card tray"]
    BSDMILLE["BSD Unix Mille (1982)<br/>Ken Arnold (UC Berkeley CSRG)<br/>First interactive curses multi-window TUI · Heuristic AI"]
    GRASS["Grass (1979)<br/>Euro-style black market derivative of Mille mechanics"]
    ASMODEE["Mille Bornes Digital (Asmodee, 2010s)<br/>Modern mobile apps with animated cars & matchmaking"]
    PORT["BSDGames Reborn Mille<br/>Modern TUI / Web · MCTS AI · 2v2 Partnership Multiplayer"]

    TOURING --> DUJARDIN
    DUJARDIN --> PARKER
    PARKER --> BSDMILLE
    DUJARDIN --> GRASS
    PARKER --> ASMODEE
    BSDMILLE --> PORT
    ASMODEE -.influences.-> PORT
```

---

## 2. Comparative Mechanic Evolution Across Eras

| Era / Title | Deck Size | Hand Size | Race Goal | Reaction Counter | Target Match Score | Platform |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **Touring (1906)** | 100 cards | 5 cards | 100 miles | None | Single-hand race | Physical card deck |
| **Mille Bornes (1954)** | 101 cards | 6/7 cards | 700 / 1000 miles | **Coup-fourré** | 5,000 points | Physical card tray & score sheet |
| **BSD Mille (1982)** | 101 cards | 7 cards | 700 / 1000 miles | **Coup-fourré** | 5,000 points | Curses 80x24 terminal (`newwin`) |
| **Grass (1979)** | 104 cards | 6 cards | Harvest goal | Heat / Protection | Varies | Physical cards |
| **Asmodee Mobile (2010s)** | 101 cards | 7 cards | 700 / 1000 miles | Touch Coup-fourré | 5,000 points | iOS / Android / Web |

---

## 3. Cultural & Genre Siblings

- **Touring (1906):** The undisputed mechanical ancestor. While *Touring* introduced mileage cards
  and hazards (like *Puncture* and *Collision*), Edmond Dujardin transformed it into an enduring
  masterpiece by introducing the **Coup-fourré**, **permanent Safeties**, and the **Extension to 1,000 miles**.
- **Monopoly (Chance/Community Chest):** Both games represent quintessential 20th-century commercial
  board game design, pairing progressive forward motion with sudden, direct-attack event cards.
- **Kart Racers (Mario Kart):** Digital racing games featuring power-ups and sabotage items (banana peels,
  red shells, lightning bolts) share direct conceptual DNA with *Mille Bornes*' hazard attacks.
