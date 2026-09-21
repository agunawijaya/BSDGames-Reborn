# ADR 002 — Survival Mode and Starting Garbage Stack

## Status

Accepted

## Context

The original BSD `tetris` starts from an empty well and uses gravity acceleration as its only pressure. Modern Tetris players are familiar with additional pressures such as garbage rows and time/score targets. The port needs optional modes beyond "endless marathon" to keep sessions varied.

## Options Considered

1. **Only Marathon mode (endless until top-out).**
   - *Pros:* faithful to the original; simplest.
   - *Cons:* can feel endless and may not engage players who want a concrete goal.

2. **Time Attack / Sprint (clear N lines as fast as possible).**
   - *Pros:* clear goal; competitive replayability.
   - *Cons:* does not stress the custom board shapes differently from Marathon.

3. **Survival mode with rising garbage rows.**
   - *Pros:* constant pressure; synergizes with custom board shapes (some shapes make garbage harder to manage); easy to understand.
   - *Cons:* requires garbage insertion logic that interacts safely with the active piece; can feel unfair if interval is too short.

4. **Score target mode (reach N points).**
   - *Pros:* simple goal.
   - *Cons:* less dramatic tension than rising garbage.

## Decision

Adopt **options 1 and 3** for the MVP: keep Marathon as the default endless mode, and add Survival mode where a garbage row is pushed up from the bottom at regular intervals. The interval shortens as level increases.

Additionally, allow players to configure a **starting garbage stack** before the game begins, with controls for stack height and hole density. This lets players practice digging out of a messy board.

## Consequences

- The engine has a `addGarbageRow()` method that shifts the board up and fills the bottom row with one random hole per playable column.
- If the active piece overlaps after garbage insertion, it is pushed upward; if it cannot be pushed to a valid position, the game ends.
- The starting stack generator reuses the same hole-density logic and is applied during board initialization.
- Future modes (Sprint, Score Attack) can reuse the garbage logic.
