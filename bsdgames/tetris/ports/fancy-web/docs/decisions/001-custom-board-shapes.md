# ADR 001 — Non-Rectangular Board Shapes

## Status

Accepted

## Context

The canonical BSD `tetris` uses a fixed 10×20 rectangular well. During port-idea exploration, the team identified that the modern Tetris market is saturated with identical rectangular games, and that a **configurable, non-rectangular well** could be a distinctive identity for this port. Board shape changes the spatial puzzle significantly without changing the core tetromino mechanics.

## Options Considered

1. **Keep the original 10×20 rectangle only.**
   - *Pros:* simplest implementation, easiest spec compliance, most familiar.
   - *Cons:* no differentiating identity; competes directly with tetr.io and Tetris Effect on their home turf.

2. **Allow only rectangular board resizing (e.g., 6×30, 20×16).**
   - *Pros:* still easy to implement and reason about.
   - *Cons:* resizing alone does not create new gameplay; a 20-wide board is just slower, a 6-wide board is just faster.

3. **Add wall-defined presets (Canyon, Split, Hourglass, Donut, Staircase, etc.).**
   - *Pros:* creates genuinely different spatial puzzles; pieces must navigate around obstacles; line-clear strategy changes per preset; visually interesting.
   - *Cons:* requires collision detection to treat walls as permanent blocks; line-clear logic must ignore walls when checking full rows; some presets can accidentally block the spawn entry if designed poorly.

4. **Use procedural wall generation instead of fixed presets.**
   - *Pros:* infinite variety.
   - *Cons:* harder to balance; could generate unplayable boards; players lose the ability to choose a known challenge.

## Decision

Adopt **option 3**: implement a set of curated wall-defined presets plus free width/height adjustment. Walls are stored as cells of type `wall` on the same grid as blocks, and collision/line-clear logic treats them as permanent, non-clearable obstacles.

The initial presets are:

- **Normal:** classic open 10×20 rectangle.
- **Tower:** narrow 6×30 rectangle.
- **Wide Well:** broad 20×16 rectangle.
- **Canyon:** only the central 4 columns are playable.
- **Split:** two wells separated by a central wall.
- **Hourglass:** wide top and bottom with a narrow neck in the middle.
- **Donut:** a central wall block that pieces must flow around.
- **Staircase:** a stepped floor rising from left to right.

## Consequences

- The engine must distinguish `wall`, `filled`, and `empty` cells.
- Line-clear checks only non-wall cells; cleared rows are replaced while preserving wall positions.
- Spawn position is computed from the playable top row so pieces do not spawn inside walls.
- Some presets (especially Canyon and Tower) change the effective difficulty dramatically.
- Future presets can be added by extending the wall-generator function in `src/game.js`.
