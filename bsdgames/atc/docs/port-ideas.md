# `atc` — Port Design Ideas & Modernisation Brainstorm

> Spiritual successor blueprint for Ed James's masterpiece.
> Preserve the dread. Modernise the delivery.

---

## Guiding Question

> If Ed James were writing `atc` today, with 40 years of game
> design, real hardware, and internet infrastructure — what would
> the game feel like, while remaining recognisably `atc`?

---

## Competitive Landscape

"ATC game" is an overloaded label — two completely different
game genres share the name, and they must be assessed
separately. Any port must be clear about which lineage it lives
in, or it will be mispositioned against the wrong competitors.

### The genre split

**Lineage 1 — BSD `atc(6)` (typed-command radar sim)**
Ed James, 1986. You type discrete commands (`A45` = plane A,
altitude 4, direction 5). Tick-based real-time with empty-Enter
fast-forward. Terminal identity. Cognitive load = grammar +
tactical planning + mental radar model.

**Lineage 2 — Flight Control (touch-drag path drawing)**
Firemint, 2009 (iOS). You *touch a plane and drag a path* to
its runway. Continuous real-time. Casual mobile identity.
Cognitive load = spatial reasoning + hand-eye coordination.

These are **not the same genre**. They share theme (planes +
runways + collisions) and vocabulary ("ATC") but nothing else.
The BSD lineage is roughly *typed radar simulator*; the Flight
Control lineage is roughly *casual spatial-puzzle*. Our port
lives squarely in Lineage 1. This distinction is the port's
central positioning advantage — we do not compete head-to-head
with the mobile-giant lineage that dominates awareness.

### The current ceilings — Lineage 2 (Flight Control lineage)

Owns roughly 100× more mindshare than Lineage 1 because it went
mobile-viral. Listed for context; **we are not competing here.**

- **[Flight Control](https://en.wikipedia.org/wiki/Flight_Control_(video_game))**
  (Firemint, 2009, iOS) — the genre inventor. Top paid App
  Store game 2009, millions of downloads, spawned the entire
  touch-drag ATC category. Later ported to Android, PSN, XBLA.
  No longer sold but culturally definitive.
- **[Air Control](https://play.google.com/store/apps/details?id=de.rgd.free.aircontrol) / Air Control Lite**
  (Android, ~2010) — one of many Flight Control clones for
  Android. Free/ad-supported. Owns the Android casual slot.
- **[Flight Control Rocket](https://en.wikipedia.org/wiki/Flight_Control_Rocket)**
  (Firemint / EA, 2011) — sequel with power-ups, unlockables,
  spaceships. Casual mobile progression.
- **[ATC Manager](https://apps.apple.com/us/app/atc-manager-2/id1443419257)**,
  **Airport Madness**, **[Flight Control Airport](https://apps.apple.com/us/app/flight-control-air-traffic/id1479739180)**
  and dozens more — Flight Control-lineage clones on both
  App Store and Google Play. Occupy the casual mobile slot
  entirely.

**Common weakness of Lineage 2:** no typed command grammar, no
sense of *being* a controller, no cultural / historical
identity. All are casual mobile spatial puzzles that happen to
use aviation as theme.

### The current ceilings — Lineage 1 (BSD-lineage / typed radar)

The slot we actually compete in. Thin coverage — this is where
the gap is.

- **[Endless ATC](https://endless-atc.com/)** — the dominant
  browser-based Lineage-1-adjacent ATC. Mouse-driven (not
  keyboard-typed), but preserves the *radar-plan-your-turn*
  cognitive mode. Polished, freemium. Owns the "quick browser
  session" slot. Weakness: mouse-clicky arcade feel; no
  command-grammar identity; abstract green-on-black radar with
  no sense of place.
- **[ATC Radar Contact](https://atc-radar-contact.com/)** — a
  more procedural, chart-driven browser sim (subset of real
  airspace procedures). Aviation-nerd-friendly. Weakness:
  visually dry, dated presentation, slow onboarding.
- **[Sector 33](https://www.smartcookies.com/sector33)** (NASA
  Ames) — educational ATC puzzle app for schools. Owns the
  K-12 educational slot. Weakness: gamified/simplified, not for
  adult sim audience.
- **[Global ATC Simulator](https://www.feelthere.com/global-atc-simulator/)**,
  **[Tower!3D](https://www.feelthere.com/tower-3d/)**,
  **[ATC Pro](https://www.aerosoft.com/en/flight-simulation/microsoft-flight-simulator/tools-fs2020/8300/atc-pro)** —
  desktop paid simulators aimed at real controllers /
  aviation professionals. Own the "high-fidelity training
  simulator" slot. Weakness: expensive, steep learning curve,
  non-browser, no cultural / retro identity.
- **[VATSIM](https://vatsim.net/) / [IVAO](https://ivao.aero/)** —
  live-network flight-sim ATC role-play. Occupy the "roleplay as
  real ATC over VOIP with pilots" slot. Not a game; a
  community.
- **Direct BSD `atc(6)` ports** — a handful of GitHub-hosted
  faithful reimplementations of the terminal original
  (typically in Rust, Go, Python). Zero visual polish, zero
  cultural framing, tiny audiences. Occupy the "purist
  faithful port" slot but no more.
- **Chris Sawyer's *Locomotion* / *Transport Fever* airport
  layers** — tangential, but claim some of the "manage aviation
  from above" mindshare.

### What's still open (in Lineage 1)

- **A modern take on the BSD command-grammar identity.** No
  browser ATC preserves the *typed-command* interaction as the
  identity. Endless ATC is mouse-first; direct BSD ports are
  terminal-only. This is the biggest gap and the most on-brand
  slot for this port.
- **Atmosphere-first ATC.** Not one competitor treats *feeling
  like a controller in a real dark room with radar humming* as
  the product. Tower!3D tries but is visually dated and
  simulator-heavy; Endless ATC is minimalist to a fault; BSD
  ports are ascetic by choice.
- **Historical ATC framing.** No product presents itself as
  "ATC as it was on a 1980s radar console" — a specific
  computing-history artefact. This is the same "archaeology"
  identity that carried the `wump` and `adventure` ports.
- **Educational voice-command layer.** Speech-to-command is
  underexplored; the closest competitor is niche add-ons for
  desktop sims. A browser port with optional voice mode teaching
  real ATC phraseology would attract flight-sim,
  aviation-hobbyist, and future-pilot audiences.
- **Daily-challenge / async-competitive framing.** Nobody has
  Wordle-ised ATC — same seed, everyone plays, compare planes
  safely delivered.

### Positioning explicitly

We ship in **Lineage 1 (BSD typed-radar)**, not Lineage 2
(Flight Control touch-drag). This is a positive design choice,
not an accident. The Flight Control lineage owns ~100× more
mindshare, but that mindshare is bound to a specific casual
mobile interaction paradigm we have no interest in replicating.
The BSD lineage is smaller but has a distinct identity
(typed grammar, radar plan-ahead, cognitive rather than
kinaesthetic) that our port can genuinely lead.

If someone asks "isn't this basically Air Control Lite?" the
one-line answer is: **no — that's spatial finger-drawing, this
is typed radar grammar. Same theme, different game.**

### Positioning statement (working)

> Not "another radar sim." A **1986 ATC control-room
> simulator**: sit at a phosphor console, type commands the way
> Ed James's controllers did, hear the room around you, run a
> shift.

The full hook this positioning implies is described in
[Distinctive Hook](#distinctive-hook) below.

## Distinctive Hook

Two candidate framings. **Neither is committed** — this section
brainstorms; the choice becomes a per-game ADR. Both accept that
we will not out-produce Tower!3D and cannot out-live-network
VATSIM, so we must win on *identity* and *atmosphere*.

### Hook A — "Control Room 1986" *(recommended)*

**Premise:** The port is not "an ATC game." It is a **simulator
of being an ATC in 1986**, using Ed James's actual command
grammar and the 17 canonical playfields as your shift rotation.

Three reinforcing layers make the identity:

**1. Atmospheric fidelity nobody has attempted on the web.**

- Curved CRT phosphor radar screen — real scanlines, phosphor
  persistence, screen burn-in that develops over long play
  sessions. WebGL shader.
- Ambient control-room audio (public-domain LiveATC.net loops
  optional, or locally-recorded pastiche): coffee machine
  hissing, distant keyboard clacks, ATC loudspeaker chatter as
  background, subtle radar-sweep hum synced to your tick.
- Room ambience: a subtle warm glow from your keyboard suggests
  you're in a dark room. The rest of the screen is the console.
- No mouse cursor by default. The identity is: *you type.*

**2. Voice-recognition as educational hook — opt-in.**

- Alternative to typing: **speak** commands the way a real
  controller does. "United four-two, descend and maintain three
  thousand" → speech recognition parses to the BSD command
  grammar (`4d3`).
- The prompt teaches real ATC phraseology as you play. Aviation
  audience (flight-sim community, pilots-in-training, aviation
  hobbyists) has a concrete reason to pick this over Endless
  ATC.
- Uses browser Web Speech API — no server dependency.

**3. Shift Rotation + Daily Challenge.**

- Each play session frames as a **shift**: you clock in,
  "inherit" an airspace state left by the previous controller
  (5 planes already in the pattern), work the 15-minute
  compressed shift, sign off.
- **Daily seed**: everyone worldwide gets the same starting
  airspace + spawn schedule for a 24-hour window. Global
  leaderboard by planes safely delivered. Wordle's social loop
  without inventing competitive multiplayer.
- 17 canonical playfields rotate on a weekly cycle so every
  playfield gets a "shift-of-the-week."

**What we lose by not doing this:**

Without the atmospheric hook, we are Endless-ATC-but-typed —
technically distinct, culturally invisible. The typed grammar
alone isn't enough to escape the "why not just play tetr.io of
ATC" trap.

### Hook B — "Radar Archaeology"

**Premise:** Same layered-history identity as the `tetris`
proposal — a museum of ATC-radar interfaces across computing
history.

| Era | Radar | Notes |
|---|---|---|
| 1970s | Analogue PPI scope, mechanical sweep, plane blips only | No callouts; controllers hand-annotated with grease pencil |
| 1980s (**anchor**) | Text-mode `atc(6)` on a green DEC terminal | Ed James's identity |
| 1990s | Colour X11 xatc pastiche | Some sim community skinned atc for X in the 90s |
| 2000s | Modern radar vector display | Callouts, TCAS symbols, weather layer |

Player unlocks eras by achieving landing counts. Each era's
visualisation carries slightly different information density and
input feedback (slower plane update rate on 1970s PPI, more
ambient noise, etc.).

Why it fits: same "computing archaeology" identity as `wump`,
`adventure`, and the proposed `tetris` hook. Consistent product
line across this project's ports.

Weakness: less atmospheric than Hook A; harder to make each
era feel meaningfully different in an ATC context (the
mechanic is the same across eras); risk of five slightly
different green screens.

### Recommendation

Hook A ("Control Room 1986") is the stronger identity for a
first port. Atmosphere is what's most obviously missing from
current web ATC; a single strong era beats five weakly
differentiated ones. Hook B is compelling but harder to
execute in a way that doesn't feel gimmicky — five palette
swaps on the same game. **This is a proposal, not a decision** —
the final choice becomes ADR
`atc/docs/decisions/001-port-identity-hook.md` (still to write).

---

## 1. Gameplay Modernisation

### AI: Better "Plane Autopilot" Behaviour

The original planes have zero autonomous behaviour — they obey
your commands and blindly fly into terrain if you forget them.
This is intentional (you're the intelligence). But small optional
autopilot features would let players scale to bigger fleets:

- **Auto-hold** — plane circles automatically if it would exit
  through the wrong border.
- **TCAS-lite** — a subtle audio cue when two planes will collide
  next tick if no action taken.
- **Auto-descend for approach** — plane self-descends to airport
  altitude when pointed at its destination airport within N tiles.

All **opt-in per plane** via new command flags (e.g. `Xh` = plane X:
auto-hold). Default off — the classic experience remains.

### Mechanics

- **Weather zones** — regions of the arena where planes can only
  descend, not turn. Adds true 3D thinking.
- **Multiple runways per airport** — planes can land in any of
  several allowed directions.
- **Emergency planes** — occasional low-fuel / damaged planes need
  priority routing. Introduces triage.
- **Larger direction resolution** — 16 or 32 compass points, not
  8. Modern radar resolution.
- **Continuous fuel model** — fuel as a float that ticks down at
  variable rate depending on altitude & speed. Realistic.

### Playfields

- **Preserve all 17 originals** as canonical playfields.
- **Import editor** — GUI to design new playfields; export to
  original yacc DSL for compatibility.
- **Community sharing** — steam workshop / GitHub-hosted playfield
  library.
- **Real-world airports** — playfields based on JFK, LHR, Narita
  approach patterns. Educational.

### Difficulty Progression

Introduce **campaign mode**:

- Level 1: 2 planes at a time on `easy`.
- Level 5: Full `default` challenge.
- Level 10: `Killer`.
- Level 15: `Atlantis`.
- Level 20: real-world SFO/JFK approach mode.

Unlockable. Score-based progression. Endless mode = classic
experience preserved.

## 2. UI/UX Design

### Visual Direction

**Two modes:**

- **Retro TUI** — green phosphor on black, exact 1986 aesthetic.
  Default for purists.
- **Modern radar** — realistic ATC scope, vector graphics, callouts
  for each plane showing altitude/direction/destination in a modern
  ATC display style. Optional.

Both share the same command grammar and same underlying game logic.

### Interaction Paradigm

- **Command line** — the original, retained as primary input.
  Muscle memory matters.
- **Keyboard shortcuts** — number keys quick-select planes; single-key
  common commands.
- **Voice input** — speak commands like a real controller ("United
  4-2, descend and maintain 3000"). Uses local speech recognition.
  **Optional and off by default** — this is a modernisation, not a
  purity violation.
- **Touch** — tap a plane, swipe to indicate direction, pinch for
  altitude. Mobile UX.
- **Controller** — planes on left stick, commands on d-pad. Console
  UX.

### Layout

- **Adaptive to screen size** — no more 80×24 lock-in. Radar
  scales, info panel resizes.
- **Multi-monitor** — radar on primary, info + input on secondary.
- **Zoom** — pan and zoom radar on large playfields.

### Accessibility

- **Colourblind palettes** — all 8 default colours have accessible
  alternatives.
- **Screen reader** — game state announced verbally on request
  (`?` in accessibility mode reads current plane list aloud).
- **Slow-time** — an accessibility toggle that stretches ticks
  by 2× or 3×. Available in single-player only; disables score
  logging in ranked mode.
- **Custom keybindings** — everything remappable.

## 3. Multiplayer / Networking

The original is strictly single-player. Add:

- **Cooperative multiplayer (2-4 controllers)** — one shared
  playfield, each player controls a subset of planes. Assigned by
  colour code.
- **Adversarial "Godmode"** — one player controls the ATC, another
  controls the plane spawn generator (choose type, direction,
  destination, timing). Fun asymmetric mode.
- **Async competitive** — same playfield seed, everyone plays
  same starting conditions. Compare scores. Daily challenge.
- **Ghost recording** — replay another player's session as an
  overlay. Learn from the pros.
- **Tournaments** — regular structured events. `atc` esports? Maybe.

## 4. Persistence

- **Local SQLite / JSON scores** replacing the shared score file.
- **Cloud sync** — optional account for cross-device history and
  leaderboards.
- **Match replays** — full input+seed log for exact replay.
- **Playfield history** — track best score per playfield per player.

## 5. Other Modernisation Angles

- **Telemetry (opt-in, anonymised)** — collect: score
  distribution, cause-of-loss frequency (fuel > collision > wrong-exit?),
  playfield popularity. Improves difficulty tuning.
- **Configuration** — flags map to original (`-g`, `-r`, etc.) plus
  new (`--speed 1.5x`, `--tutorial`, `--voice`, `--seed`).
- **Internationalisation** — command grammar in English but plane
  callouts and messages translatable.
- **Modding API** — custom playfields (already), custom plane
  types, custom AI plane behaviours as sandboxed scripts.
- **Educational mode** — real ATC phraseology as an alternative
  command set. Aviation-community friendly.
- **Ports** — desktop (Linux/mac/Win), web (WASM), mobile, VR
  tower mode (see below).

### The VR Tower Fantasy

A separate stretch goal: instead of top-down radar, put the player
**inside a tower** with a real 3D view. Same game logic, same plane
management, but the visual metaphor is "look out the window and see
the planes moving." Uses XR headset. Voice input becomes the natural
UI. Different product, same DNA.

## 6. What NOT to Change

Preserve to remain recognisably `atc`:

- **Real-time tick with player commands submitted between ticks.**
- **Empty-Enter as tick fast-forward.**
- **Deterministic plane state machine** — no autonomous plane AI
  in classic mode.
- **Player types commands, not clicks.** Command grammar is the
  identity.
- **Collision = adjacency in all three axes.**
- **Jets = lowercase, props = uppercase, jets move every tick,
  props every other.**
- **17 canonical playfields with original names and layouts.**
- **Author signature** — `ATC - by Ed James` visible somewhere in
  the modernised UI.
- **`?` completion feature** — grammar-driven help.
- **Score = planes safely delivered.** No time bonus.
- **Suspend NOT permitted** in the default mode. The pain is the
  point.

## 7. Open Questions

Design decisions raised that need per-game ADRs:

- Should voice input be a "modernisation mode" toggle, or a
  separate binary/mode? Voice conflicts with the typing identity.
- What's the pause policy? Original has none. Modern accessibility
  demands one. How do we split "purist mode" (no pause) from
  "accessible mode" (pause allowed, score marked as such)?
- Should the yacc DSL for playfields be preserved (compat with
  community-authored files) or replaced with JSON? Or both, with
  round-trip conversion?
- Should ranked leaderboards distinguish TUI vs modern-radar? The
  latter is arguably easier due to better visual affordances.
- Multiplayer scoring: shared score or per-plane attributed?
- Should the campaign mode be included in v1 or ship-after? Adding
  it changes the "endless survival" purity.

Each becomes an ADR in [`./decisions/`](./decisions/).

## See Also

- [`architecture.md`](./architecture.md) — what we start from.
- [`spec.md`](./spec.md) — mechanic identity to preserve.
- [`./decisions/`](./decisions/) — per-game ADRs.
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
