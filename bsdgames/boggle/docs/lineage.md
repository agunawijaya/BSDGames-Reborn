# `boggle` — Lineage & Genre Siblings

> Tracing the evolution of word-search grid puzzles, from tabletop dice shakers to modern mobile hits.

---

## Word Puzzle Evolution Timeline

```mermaid
flowchart TD
    Crosswords["The New York World Crossword<br/>(Arthur Wynne, 1913)"]
    Scrabble["Scrabble<br/>(Alfred Mosher Butts, 1938)"]
    
    PhysicalBoggle["Physical Boggle<br/>(Allan Turoff / Parker Brothers, 1972)"]
    BigBoggle["Big Boggle (5x5 Grid)<br/>(Parker Brothers, 1979)"]
    
    BSDBoggle["BSD Boggle<br/>(Barry Brachman, 1988 / 4.4BSD 1993)"]
    
    Scramble["Scramble with Friends / Boggle with Friends<br/>(Zynga, 2012)"]
    Wordament["Microsoft Wordament<br/>(Microsoft Studios, 2011)"]
    Wordle["Wordle<br/>(Josh Wardle, 2021)"]

    Crosswords --> PhysicalBoggle
    Scrabble --> PhysicalBoggle
    PhysicalBoggle --> BigBoggle
    PhysicalBoggle --> BSDBoggle
    BigBoggle --> Wordament
    BSDBoggle --> Scramble
    Wordament --> Wordle

    classDef classic fill:#2d3748,stroke:#4a5568,color:#fff;
    classDef hero fill:#1a365d,stroke:#3182ce,color:#fff;
    classDef modern fill:#22543d,stroke:#38a169,color:#fff;

    class Crosswords,Scrabble,PhysicalBoggle,BigBoggle classic;
    class BSDBoggle hero;
    class Scramble,Wordament,Wordle modern;
```

---

## Key Historical Predecessors

1. **Physical Boggle (1972):**
   - Allan Turoff designed the 16 letter cubes with letter frequencies carefully balanced to maximize valid word formations while preventing letter starvation (e.g. ensuring vowels appear on nearly every cube).
2. **Big Boggle (1979):**
   - Expanded the grid from 4x4 (16 cubes) to 5x5 (25 cubes), introducing a minimum word length of 4 letters and an optional black blocker cube.

---

## Modern Digital Descendants

1. **Microsoft Wordament (2011):**
   - A massive real-time online adaptation where thousands of players simultaneously compete on the identical 4x4 grid across 2-minute rounds, ranking players on speed and word rarity.
2. **Zynga's Scramble with Friends (2012):**
   - Brought asynchronous head-to-head turn-based Boggle to touchscreens with power-ups, multipliers, and word-tracing gestures.
3. **Daily Wordle Variants (Strands, Squareword, 2022+):**
   - Daily puzzle games utilizing spatial grid connections and letter association heuristics popularized by Boggle.
