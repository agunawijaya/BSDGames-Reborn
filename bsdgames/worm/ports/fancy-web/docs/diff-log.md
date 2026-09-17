# Diff Log — `worm / fancy-web`

> Feature-by-feature narrative of every meaningful decision made
> during this port's build. Structured as **Kept · Changed ·
> Added · Removed · Deferred** per ADR-006 §Universal Port
> Contract #3.
>
> Canonical spec: [`../../../docs/spec.md`](../../../docs/spec.md).
> Reference for the sibling visual toolkit:
> [`../../../../snake/ports/fancy-web/docs/diff-log.md`](../../../../snake/ports/fancy-web/docs/diff-log.md).

---

## Kept (mechanically identical to BSD `worm(6)`)

The invariants that make this port faithful — any veteran of the
1980 original will recognize this.

| Original mechanic | Preserved |
|---|---|
| Player controls a single worm with a head that steers | Head + 44+ growing body segments; only head interacts with world |
| Bounded grid with lethal walls | 30×20 cell grid; wall touch = death |
| Digit food (1-9) scattered on the grid, one at a time | One numbered apple on grid at a time; respawns after eating |
| Eating digit N adds N to a `growing` counter | `worm.growing += apple.value` |
| Growth is **progressive** — tail stays put for N ticks | Same: for N ticks after eating, tail doesn't retract; worm gets one segment longer per tick |
| **Chained score bonus** — `score += growing` after `growing += N` | Same: eat 5 then 9 mid-growth → score += 5, then score += 13 (14 with previous 5, not just 9) |
| Self-collision = death | Same |
| No enemy / no time limit | Same (per user design decision — Opsi 0) |
| Fill entire grid = win | Same (rare, but achievable) |
| Grid steps happen on a fixed clock (SIGALRM tick) | Same discrete-tick model; interval configurable via speed setting |
| Cannot reverse 180° into own neck | Enforced via buffered `pendingDirection` filter |

## Changed (spec-authorized reinterpretation)

`fancy-web` style prefix (per
[ADR-006](../../../../../docs/decisions/006-multi-port-architecture.md))
explicitly allows additive polish. All changes below are
authorized under
[`decisions/fancy-web-001-spec-deviations.md`](./decisions/fancy-web-001-spec-deviations.md).

### 1. Digit character → numbered apple visual

The food is rendered as a shiny apple with the digit displayed
on its face. Value encoded visually across three channels:

- **Size** — apple 1 = 55% cell radius, apple 9 = 100%
- **Color** — palette-driven lerp from `T.appleBase` (pale) at
  value 1 to `T.appleRipe` (vivid) at value 9
- **Digit** — bold monospace numeral centered on the apple, with
  contrast shadow

Rationale: the digit character still communicates value (matches
spec), and the visual reinforces it. Player can read the value
instantly without cognitive parsing.

### 2. Text grid → Canvas 2D

Rendered on 900×600 canvas at native pixel density. Cells are 30
px; grid is 30×20 = 600 cells. Wall boundary is drawn as a thick
lit border to emphasize its lethality.

### 3. Discrete grid steps → continuous visual interpolation

The worm's *logical state* is still discrete cells (one grid
position per segment). But rendering interpolates:

- **Head extends forward** into the next cell as the tick
  progresses (0 → 1 interpolation factor)
- **Tail retracts** from its cell toward the segment in front of
  it (only when not growing that tick)

The result is smooth motion between logical grid states. Faithful
game logic + modern visual feel.

### 4. Single tick rate → user-configurable speed

Original: fixed 1 tick / sec via `alarm(1)`. Port offers three
modes as a settings picker:

- **Classic  ·  3×** — 333 ms per tick (comfortable retro pace)
- **Fast  ·  6×** — 167 ms per tick (modern arcade)
- **Progressive  ·  3→6×** (default) — 333 ms at length 5,
  linearly ramping to 167 ms at length 45+; naturally scales
  difficulty as the worm grows

**Note:** original BSD's 1 tick/sec felt uncomfortably slow in
playtest, so even the "Classic" mode here starts at 3× that rate.
The pure-BSD experience is documented in the ADR but not exposed
as a picker option in v1 — accessible via one-line code edit.

Persisted in localStorage. Rationale in
[`decisions/fancy-web-001-spec-deviations.md`](./decisions/fancy-web-001-spec-deviations.md).

### 5. HJKL running mode → not implemented

BSD original supports `HJKL` (Shift+arrows) for a "burst speed"
mode — worm moves multiple cells per tick until you hit a key or
danger. This port does not implement it in v1; deferred to future
work.

Speed setting partially compensates: choose Fast mode for
uniformly-fast play.

## Added (net-new features)

Authorized under
[`decisions/fancy-web-002-additive-features.md`](./decisions/fancy-web-002-additive-features.md).

### 1. 8 cosmetic themes

Reused verbatim from
[`../../../../snake/ports/fancy-web/`](../../../../snake/ports/fancy-web/):
Neon Grid, Savanna, Jungle, Desert, River, Aztec, Origami,
Midnight. Each theme redefines palette, glow radius, ambient
particle behavior, and (for Midnight) enables star field + moon.

### 2. Speed setting picker

Three pills below the theme picker. Persistent, live-updatable
(theme changes mid-play work; speed changes take effect on the
next tick).

### 3. Numbered-apple visual encoding

Size + color + digit encode value. Spec preserves the "digit
food" semantic — the visual adds three-channel reinforcement.

### 4. Particle effects

- **Pickup burst** — 10 + `value * 2` particles + shockwave ring
  at eaten apple; scales with apple size
- **Death burst** — 30 particles + 2 rings at death location

### 5. Ambient drift particles

40 particles crossing the canvas with theme-appropriate colors
and behavior (rising bubbles in River, horizontal sand in Desert,
twinkling stars for Midnight).

### 6. localStorage persistence

- `worm-fancy-best` — best score across sessions
- `worm-fancy-settings` — `{speed, theme}` JSON

Try/catch wrapped for private-browsing safety.

### 7. Restart flow with 550 ms lockout

Same pattern as snake port: overlay fades in, restart gated 550 ms
after death or win to prevent mash-key accidental restart.

### 8. Head detail

Eyes (whites + colored pupils per theme, vertical slit if pupil is
bright), occasional tongue flick.

### 9. Progressive body gradient

Head-to-tail linear gradient along the worm's bounding box using
`T.wormHead` → `T.wormBody`. Subtle muscle-pulse highlight on
each segment gives a "breathing" feel.

### 10. HUD row

Score / length / best (left cluster) + current tick interval
(right). Length is meaningful for progression signaling; tick
interval helps the player understand progressive-mode scaling in
real-time.

## Removed (from BSD original)

Nothing mechanic-affecting.

The HJKL running mode is not implemented in v1 (documented as
deferred, not removed — see above).

## Deferred (v2 backlog)

- **Vite + TypeScript** scaffolding
- **PWA manifest** + service worker
- **Touch controls**
- **Sound design** — Tone.js synth: crunch on eat, tension buildup
  as tick shortens, thud on wall, sting on death
- **Automated tests** — Vitest / Playwright
- **Deploy** — live URL
- **Growing indicator** — HUD glyph counting down N pending
  segments
- **HJKL burst mode** — spec-faithful running
- **Adjacent-apple bonus** — visual feedback when chaining
- **Streak highlight** — animate chained bonus
- **User theme packs** — importable JSON
- **Adjustable grid size** — smaller for tighter play, larger for
  slither.io-scale
- **Adjustable starting length** — original CLI accepts
  `-l <n>` arg

## Performance notes

Same techniques as snake port carry the load here:

### 1. Single-pass body glow

Worm drawn as one stroke path with `shadowBlur` once, then
individual segment fills without shadow. Cuts blur ops by ~N×.

### 2. Offscreen static-layer cache

Background gradient + vignette + grid lines + grid dots (with
glow) + wall border + Midnight's moon crescent all rendered once
per theme into an offscreen canvas, blitted each frame.

Cache invalidated in `setTheme()`; regeneration ~30-50 ms
one-time.

## Chronological log

- **2026-09-17 evening** — Port folder scaffolded. Full-scope MVP
  written in single mockup.html: 8 themes, settings picker,
  gameplay, particles, localStorage, restart flow, head detail.
  Straight to gameplay-first (not visuals-first like snake) since
  the visual toolkit was already established.
- **2026-09-17 evening** — First screenshot capture revealed
  worm + apple were **invisible** on all 8 themes — bug: chained
  `lightenColor(lerpColor(...), 0.35)` produced
  `rgb(NaN,NaN,X)` because `parseHex` didn't handle `rgb(...)`
  input format. Diagnosed via Playwright `pageerror` listener.
- **2026-09-17 evening** — Fixed by generalizing color parsing:
  `parseColor()` handles both `#rrggbb` and `rgb(r,g,b)`.
  Renamed `parseHex` → `parseColor`, updated all callers.
- **2026-09-17 late evening** — All 8 theme screenshots regen'd
  correctly. Docs written; renamed mockup.html → index.html;
  ADRs published; promoted to 🟢 Released.
- **2026-09-17 post-release playtest** — User feedback: Classic
  1× (1 tick/sec, BSD verbatim) felt uncomfortably slow, and
  Progressive starting at 1× compounded the problem. Bumped all
  three modes: Classic 1× → 3×, Fast 3× → 6×, Progressive 1→4× →
  3→6×. Docs updated to note that "Classic" no longer means
  "BSD verbatim" — pure-BSD rate is documented as a one-line
  code edit for anyone who wants it.

## See also

- Canonical game docs: [`../../../docs/`](../../../docs/)
- Port ADRs: [`decisions/`](./decisions/)
- Test scenarios: [`test-scenarios.md`](./test-scenarios.md)
- Sibling port that established the visual toolkit:
  [`../../../../snake/ports/fancy-web/docs/diff-log.md`](../../../../snake/ports/fancy-web/docs/diff-log.md)
- Root porting philosophy:
  [`../../../../../docs/decisions/002-porting-philosophy.md`](../../../../../docs/decisions/002-porting-philosophy.md)
- Universal Port Contract:
  [`../../../../../docs/decisions/006-multi-port-architecture.md`](../../../../../docs/decisions/006-multi-port-architecture.md)
