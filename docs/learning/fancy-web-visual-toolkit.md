# Learning — Fancy-Web Visual Toolkit

> Canvas 2D procedural rendering techniques accumulated during the
> build of [`bsdgames/snake/ports/fancy-web/`](../../bsdgames/snake/ports/fancy-web/).
> Each technique is proven at 60 fps across 8 themes on 2020-era
> mid-range hardware.
>
> Use these when building any `fancy-web` style port (per
> [ADR-006 §Port Naming Conventions](../decisions/006-multi-port-architecture.md#port-naming-conventions))
> or any procedurally-rendered browser game in this repo.

---

## Table of contents

1. [Single-pass body glow](#1-single-pass-body-glow) — 45× shadow-blur reduction
2. [Offscreen static-layer cache](#2-offscreen-static-layer-cache) — remove 330+ blur ops per frame
3. [Spring-follow chain constraint](#3-spring-follow-chain-constraint) — organic snake-like motion
4. [Perpendicular sine-wave body offset](#4-perpendicular-sine-wave-body-offset) — S-curve slither
5. [State-machine enemy AI + visual telegraphing](#5-state-machine-enemy-ai--visual-telegraphing) — chaseable but dodgeable predators
6. [Enemy sprite variants sharing state machine](#6-enemy-sprite-variants-sharing-state-machine) — owl vs eagle without duplicated logic
7. [Multi-theme palette-driven system](#7-multi-theme-palette-driven-system) — 8 themes from one code path
8. [Clip-based crescent moon](#8-clip-based-crescent-moon) — halo only on bright side
9. [Effect particles with lighter composite](#9-effect-particles-with-lighter-composite) — additive glow bursts
10. [localStorage persistence pattern](#10-localstorage-persistence-pattern) — best-score across sessions
11. [Restart flow with lockout](#11-restart-flow-with-lockout) — no accidental restart
12. [Feather-tapered sprite drawing](#12-feather-tapered-sprite-drawing) — leaf-shaped procedural feathers
13. [Radial gradient for depth](#13-radial-gradient-for-depth) — sculpted look without raster assets
14. [Wing-flap via rotation with state variants](#14-wing-flap-via-rotation-with-state-variants) — glide/dive/climb all from one primitive

---

## 1. Single-pass body glow

### Problem

Snake body has N=45 segments. Naive approach: render each as a
filled circle with `shadowBlur = 22` (or whatever the theme's
glow radius is). Result: 45 shadow-blur ops per frame ×60 fps =
2,700 blur ops/sec. Canvas 2D shadow blur is expensive — each op
requires re-rendering the shape into a blurred region roughly
2×`shadowBlur` in each direction. On a per-segment ~44-pixel-
radius blur, this drops frames on any theme with high glow.

### Solution

Draw the whole body as **one stroke path with shadow, once**.
Draw individual segment fills afterward **without shadow** for
taper and gradient detail.

```js
// One shadow-blur op for the entire body's outer halo:
ctx.shadowBlur = T.snakeGlowRadius;    // e.g. 22 for Neon Grid
ctx.shadowColor = T.snakeGlow;
ctx.strokeStyle = T.snakeHead;
ctx.lineWidth = 20;                     // ~2× segment radius
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.beginPath();
for (let i = 0; i < N; i++) {
  const p = positions[i];
  if (i === 0) ctx.moveTo(p.x, p.y);
  else ctx.lineTo(p.x, p.y);
}
ctx.stroke();

// Then draw segment fills WITHOUT shadow (fast) for taper + gradient:
ctx.shadowBlur = 0;
for (let i = N - 1; i >= 0; i--) {
  const p = positions[i];
  ctx.fillStyle = lerpColor(T.snakeHead, T.snakeTail, p.t);
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
}
```

### Result

45× fewer shadow-blur ops per frame. Visually indistinguishable
(both approaches produce a colored halo mirroring body shape).

### When to use

Any time you have N ≥ 5 shapes forming a contiguous shape and
want them to glow together. This trick generalizes beyond snakes:
particle trails, worm/hunt/adventure player entities, etc.

### Reference

`bsdgames/snake/ports/fancy-web/index.html`, function `renderSnake`.

---

## 2. Offscreen static-layer cache

### Problem

Background gradient + vignette + grid lines + grid dots (with
glow) + Midnight's moon crescent are all **static per theme**.
Rendering them every frame is wasted work — especially the
~330 grid-dot shadow-blur ops on high-glow themes.

### Solution

Create an offscreen canvas, render the static layer into it ONCE
per theme, then blit it each frame with `drawImage()`.

```js
let staticLayer = null;
let staticLayerTheme = null;

function invalidateStaticLayer() {
  staticLayer = null;
  staticLayerTheme = null;
}

function ensureStaticLayer() {
  if (staticLayer && staticLayerTheme === currentTheme) return;
  staticLayer = document.createElement('canvas');
  staticLayer.width = W;
  staticLayer.height = H;
  const sctx = staticLayer.getContext('2d');
  renderStaticLayer(sctx);      // bg gradient, grid, moon, etc.
  staticLayerTheme = currentTheme;
}

function setTheme(name) {
  currentTheme = name;
  T = THEMES[name];
  invalidateStaticLayer();      // <-- critical
}

// Per frame:
function renderGrid(time) {
  ensureStaticLayer();
  ctx.drawImage(staticLayer, 0, 0);
  // Then render only DYNAMIC things: stars twinkle, drift particles, ...
}
```

### Result

~330 shadow-blur ops per frame → 0 for static content. One-time
cache regeneration cost per theme switch (~30-50ms) is negligible.

### What goes in cache

**Cachable (static per theme):** background gradient, vignette,
grid lines, grid dots, moon (Midnight), any decoration that
doesn't animate.

**NOT cachable (dynamic per frame):** twinkling stars, drift
particles that move, effect particles, entity sprites (snake,
enemy, apples), overlays.

### When to use

Any time a browser game has visually rich static background
elements and dynamic foreground elements. Universal for the
`fancy-web` style.

### Reference

`bsdgames/snake/ports/fancy-web/index.html`, functions
`ensureStaticLayer`, `renderStaticLayer`, `renderGrid`.

---

## 3. Spring-follow chain constraint

### Problem

Grid-step motion (Nokia-snake style: teleport one cell per frame)
feels broken in 60 fps continuous play. Smooth interpolation of a
single entity is easy — but a 45-segment body needs each segment
to lag naturally behind the previous one, like a real snake.

### Solution

**Verlet-style distance constraint solver.** Head moves at
constant speed along smoothed input direction. Each following
segment is snapped back to maintain fixed distance from the
previous segment.

```js
// Move head along smoothed input
snake.dx += (input.dx - snake.dx) * dtSmoothing;
snake.dy += (input.dy - snake.dy) * dtSmoothing;
normalize(snake.dx, snake.dy);
const head = snake.segments[0];
head.x += snake.dx * snake.speed * dt;
head.y += snake.dy * snake.speed * dt;

// Constrain each body segment to snake.segLen from previous
for (let i = 1; i < snake.segments.length; i++) {
  const prev = snake.segments[i-1];
  const curr = snake.segments[i];
  const dx = curr.x - prev.x;
  const dy = curr.y - prev.y;
  const d = Math.hypot(dx, dy) || 1;
  if (d > snake.segLen) {
    const t = snake.segLen / d;
    curr.x = prev.x + dx * t;   // pull curr toward prev
    curr.y = prev.y + dy * t;
  }
}
```

### Result

Body follows head with realistic lag. Tail whips when head turns
sharply. Same technique used by slither.io and countless indie
games.

### Tuning

- `snake.segLen` — distance between segments (10-20 px works for
  most sizes)
- `snake.speed` — head speed (100-150 px/sec is playable)
- `dtSmoothing` — input direction blend factor per frame; higher
  = snappier, lower = more organic. `Math.min(1, 0.010 * dt)`
  produces ~130 ms full turn.

### When to use

Any chain/rope/tentacle body. Snake, worm, cable, tail-following
projectiles, etc.

### Reference

`bsdgames/snake/ports/fancy-web/index.html`, `updateSnake`.

---

## 4. Perpendicular sine-wave body offset

### Problem

A pure spring-chain looks OK but a real snake wiggles as it moves
— an S-curve traveling down the body. Adding this at physics
level would fight the constraint solver.

### Solution

Compute segment positions from physics as normal. Then, **at
render time**, apply a perpendicular sine offset per segment,
with phase shift along the chain.

```js
for (let i = 0; i < N; i++) {
  const seg = snake.segments[i];
  // Perpendicular unit vector from segment tangent
  let px, py;
  if (i === 0) { px = -snake.dy; py = snake.dx; }
  else {
    const prev = snake.segments[i-1];
    const dx = prev.x - seg.x, dy = prev.y - seg.y;
    const d = Math.hypot(dx, dy) || 1;
    px = -dy / d; py = dx / d;
  }
  const wavePhase = time * 0.006 + i * 0.35;   // phase shifts down body
  const waveFade = 1 - (i / N) * 0.35;          // fades toward tail
  const wave = 3.2 * Math.sin(wavePhase) * waveFade;
  renderPositions.push({
    x: seg.x + px * wave,
    y: seg.y + py * wave,
    r: computeRadius(i),
  });
}
```

### Result

Classic S-curve slither. Doesn't affect physics/collision (those
still use raw positions); purely a visual effect.

### Tuning

- `time * X` — wave temporal frequency (X = 0.005 to 0.008 works)
- `i * Y` — phase shift per segment (Y = 0.3 to 0.5)
- `AMPLITUDE * sin(...)` — how wide the wiggle (2-4 px for a
  10 px segment feels right)
- `waveFade` — attenuation toward tail

### When to use

Any organic body that should undulate: snakes, water-swimming
creatures, cloth simulations at low fidelity.

---

## 5. State-machine enemy AI + visual telegraphing

### Problem

A naive "move toward player" AI is boring — constant threat with
no strategic depth. A pure random pattern is unfair — player
can't anticipate.

### Solution

**Explicit state machine** with clear phases, each with distinct
movement and a visible visual signal for the player.

```
GLIDE (4.5-7s randomized) — patrol/circle, slow flap
    ↓
LOCK (900ms) — decelerate, lock onto CURRENT player position,
              WARNING RING appears at target
    ↓
DIVE — accelerate toward LOCKED position at high speed,
       wings fold, altitude drops rapidly
    ↓
STRIKE (260ms) — impact frame, kill window active 120ms
    ↓
CLIMB — reverse away, altitude rises, wings flap hard
    ↓ (back to GLIDE)
```

Because the target is **locked** at LOCK→DIVE transition, player
can dodge by moving after that moment. This is the skill
expression — the game rewards anticipation.

```js
switch (eagle.state) {
  case 'lock':
    // ... slow down, drop altitude
    if (eagle.stateTime > 900) {
      eagle.state = 'dive';
      eagle.stateTime = 0;
      eagle.targetX = playerX;   // LOCK player position now
      eagle.targetY = playerY;
    }
    break;
  case 'dive':
    // Fly toward eagle.targetX/Y — NOT current player position
    // ...
}
```

### Visual telegraph

1. **Shadow projection** — enemy's shadow on ground plane scales
   inversely with altitude. Small halo = high; sharp point = about
   to strike.
2. **Lock-on ring** — dashed red circle at `targetX/Y` during
   LOCK and DIVE states. Ring shrinks as time passes; player sees
   where the strike will land.

```js
if (eagle.state === 'lock' || eagle.state === 'dive') {
  const t = eagle.stateTime / (eagle.state === 'lock' ? 900 : 200);
  const r = 40 * (1 - t * 0.6);
  ctx.strokeStyle = `rgba(255,80,80,${0.55 * (1 - t * 0.5)})`;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(eagle.targetX, eagle.targetY, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}
```

### Result

Player learns the timing. Novice dies often; skilled player can
dodge indefinitely. Both fair.

### When to use

Any real-time predator/hazard/attacker in continuous-motion games.

### Reference

`bsdgames/snake/ports/fancy-web/index.html`, `updateEagle`,
`renderEagle`.

---

## 6. Enemy sprite variants sharing state machine

### Problem

Multi-theme game: one theme wants a different-looking enemy
(owl instead of eagle) without duplicating the entire AI state
machine.

### Solution

**State machine drives `state`, `x`, `y`, `wingPhase`, etc.
Sprite renderer branches on `T.enemyShape` to draw the right
sprite** — same inputs, different rendered geometry.

```js
function renderEagle(time) {
  // Shadow + lock-ring + altitude offsets are shape-agnostic:
  drawShadow();
  drawLockRing();

  // Sprite branches on theme:
  ctx.save();
  ctx.translate(eagle.x, drawY);
  ctx.rotate(heading);
  ctx.scale(scale, scale);
  if (T.enemyShape === 'owl') {
    renderOwl(wingAngle, wingSweep);
  } else {
    renderEagleSprite(wingAngle, wingSweep);
  }
  ctx.restore();
}
```

The owl has a rounder body, facial disc, ear tufts, and forward-
facing yellow eyes — a completely different silhouette. But it
uses the same `wingAngle` for flap animation, the same
`wingSweep` for state variation (folded during dive, spread during
strike), the same body/head/tail rendering slots.

### Result

Zero AI-state-machine duplication. Adding a third enemy species
(hawk, harrier, etc.) is 100-150 lines of pure sprite code.

### When to use

Any port with per-theme entity variants. Also useful for player
character customization.

---

## 7. Multi-theme palette-driven system

### Problem

Support 8 completely different visual moods (cyberpunk neon,
warm savanna, cool water, folded paper, etc.) without 8 code
paths.

### Solution

**One `THEMES` object of pure data.** Each entry is a palette
+ a few behavior flags. Runtime lookup at every color-touching
draw call.

```js
const THEMES = {
  'neon-grid': {
    bg: '#050a1a',
    bgGradient: [/* ... */],
    snakeHead: '#00ffff',
    snakeTail: '#ff00ff',
    snakeGlow: '#00ffff',
    snakeGlowRadius: 22,          // per-theme intensity
    apple: '#ff2266',
    appleGlow: '#ff4488',
    enemy: '#ff00ff',
    enemyTip: '#00ffff',
    beak: '#ffcc00',
    driftColors: [/* ... */],
    composite: 'lighter',           // additive blending on
    enemyShape: 'eagle',
    stars: false,
    paperFold: false,
  },
  'midnight': {
    // ...
    composite: 'lighter',
    enemyShape: 'owl',              // owl variant
    stars: true,                    // enable star field + moon
    paperFold: false,
  },
  // 6 more themes...
};

let currentTheme = 'neon-grid';
let T = THEMES[currentTheme];

function setTheme(name) {
  currentTheme = name;
  T = THEMES[name];
  invalidateStaticLayer();          // regen the cached bg
}
```

Every render function reads from `T.*`. No `if (theme === 'x')`
switches in draw code — only palette lookups.

### Behavior flags — the extra dimension

Palette handles 80% of theme identity. Behavior flags handle the
rest:

- `composite: 'lighter'` — additive blending (neon glow themes)
  vs `'source-over'` (natural themes)
- `enemyShape: 'eagle' | 'owl'` — sprite variant
- `stars: true` — enable Midnight's star field + moon crescent
- `paperFold: true` — add fold-line strokes across entities
  (Origami)
- `sandBlow: true` — drift particles move fast horizontally
  (Desert)
- `risingParticles: true` — drift moves upward like bubbles
  (River)

Each flag is a single boolean check in the relevant render loop.

### Result

Adding a 9th theme is ~50 lines of data. No new code paths.
Excellent replay value from a single build.

### When to use

Any game where visual variety matters and you want a single
codebase to serve all variants.

### Reference

`bsdgames/snake/ports/fancy-web/index.html`, `THEMES` object.

---

## 8. Clip-based crescent moon

### Problem

Drawing a bright circle then punching out a dark circle to make
a crescent gets tricky when you want the bright side to glow but
NOT the dark side.

### Naive approaches that break

**Attempt A: `globalCompositeOperation = 'destination-out'`.**
Punches through to the canvas element's CSS background, which
might not match the game's bg gradient (as happened on Midnight
theme — dark circle appeared to overlap the moon).

**Attempt B: overlay a bg-colored circle on top of the bright
moon.** Removes the dark-circle-visual, but the moon's shadow
halo still exists around the WHOLE moon circle, including
around the (now covered) dark side — the halo appears to
surround a phantom shape.

### Solution: clip out the covered region

Use `ctx.clip('evenodd')` to clip the entire covered-region OUT
before drawing the moon with shadow. Result: both the moon's fill
AND its glow halo are trimmed at the crescent boundary.

```js
const moonX = 820, moonY = 80, moonR = 24;
const coverX = 830, coverY = 76, coverR = 22;

ctx.save();
// Clip = whole canvas MINUS cover circle
ctx.beginPath();
ctx.rect(0, 0, W, H);
ctx.arc(coverX, coverY, coverR, 0, Math.PI * 2, true);  // reverse
ctx.clip('evenodd');

// Now draw moon; anywhere inside cover circle is clipped away
ctx.shadowBlur = 30;
ctx.shadowColor = 'rgba(240,235,220,0.7)';
ctx.fillStyle = 'rgba(240,235,220,0.95)';
ctx.beginPath();
ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
ctx.fill();

ctx.restore();
```

### Result

Bright crescent with halo only on the convex outer edge. Dark
side shows bg through — no phantom outline, no double-circle
look.

### When to use

Any crescent/eclipse/partial-shape rendering where you need
selective glow.

### Reference

`bsdgames/snake/ports/fancy-web/index.html`, `renderStaticLayer`
(moon block).

---

## 9. Effect particles with lighter composite

### Problem

Impact bursts need to feel bright and satisfying, not muddy.

### Solution

Use `globalCompositeOperation = 'lighter'` for particle
rendering — pixels add rather than replace, so overlapping
particles brighten toward white.

```js
ctx.save();
ctx.globalCompositeOperation = 'lighter';
for (const p of particles) {
  const a = p.life / p.maxLife;
  ctx.fillStyle = p.color;
  ctx.globalAlpha = a;
  ctx.shadowBlur = 12;
  ctx.shadowColor = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
  ctx.fill();
}
ctx.restore();
```

Three particle types used in the snake port:

- **Pickup burst** (14 particles + shockwave ring) — apple color
- **Strike burst** (22 particles + ring) — enemy color mix
- **Death burst** (30 particles + big ring) — snake colors + white

### Tuning

- Life 400-900ms depending on impact severity
- Initial velocity 50-200 px/s
- Decay: `p.vx *= Math.pow(0.05, dtSec)` (exponential damping)
- Ring: `p.radius += 200 * dtSec` (linearly expanding)

### When to use

Any impact, pickup, explosion, or celebration moment. Additive
blending is essential for the neon feel.

---

## 10. localStorage persistence pattern

### Problem

Best-score should survive across sessions. `localStorage` can
throw (private browsing, quota, disabled) — must not crash the
game.

### Solution

Always wrap in try/catch. Read at load, write on state change.

```js
const BEST_KEY = 'snake-fancy-best';
const game = {
  bestScore: parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0,
  // ...
};

function updateBest() {
  if (game.score > game.bestScore) {
    game.bestScore = game.score;
    try {
      localStorage.setItem(BEST_KEY, String(game.bestScore));
    } catch (e) {
      // Silent — best score just won't persist this session
    }
  }
}
```

### Key naming

Prefix with port name to avoid collisions if multiple ports of
different games are hosted on the same origin someday:
`snake-fancy-best`, not just `best`.

### When to use

Any single-player game with progression. For multi-player use
IndexedDB or a real backend.

---

## 11. Restart flow with lockout

### Problem

Without lockout, a player mashing keys during death restarts
before reading the game-over message. Feels jarring.

### Solution

Small state-machine addition: after death or win, gate restart
input for ~550 ms.

```js
game.canRestart = false;
setTimeout(() => { game.canRestart = true; }, 550);

document.addEventListener('keydown', (e) => {
  if (game.state !== 'playing') {
    if (game.canRestart) restartGame();
    return;
  }
  // ... normal input
});
```

Combined with a fade-in on the overlay so the visual timing feels
intentional (350 ms fade + 550 ms lockout = ~200 ms of visible-
overlay-but-locked, enough to register).

### When to use

Every game with a restart flow. Universal fix for an otherwise
subtle UX bug.

---

## 12. Feather-tapered sprite drawing

### Problem

Bird primary feathers need to look like tapered leaf shapes, not
ellipses or straight lines. Drawing individual feathers
procedurally means you can rotate, animate, or theme them.

### Solution

Compute a base point and a tip point per feather. Draw as a
symmetric tapered shape using two quadratic curves per side.

```js
function drawTaperedFeather(baseX, baseY, tipX, tipY, width) {
  const dx = tipX - baseX, dy = tipY - baseY;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;   // perpendicular unit vector

  ctx.beginPath();
  ctx.moveTo(baseX - nx * width, baseY - ny * width);
  // 35% along, wider (bulge)
  ctx.quadraticCurveTo(
    baseX + dx * 0.35 - nx * width * 1.05,
    baseY + dy * 0.35 - ny * width * 1.05,
    baseX + dx * 0.80 - nx * width * 0.35,
    baseY + dy * 0.80 - ny * width * 0.35
  );
  // Sharp tip
  ctx.quadraticCurveTo(tipX, tipY,
    baseX + dx * 0.80 + nx * width * 0.35,
    baseY + dy * 0.80 + ny * width * 0.35
  );
  ctx.quadraticCurveTo(
    baseX + dx * 0.35 + nx * width * 1.05,
    baseY + dy * 0.35 + ny * width * 1.05,
    baseX + nx * width, baseY + ny * width
  );
  ctx.closePath();
  ctx.fill();
}
```

Add a linear gradient along the length for depth. Add a shaft
line (`ctx.stroke()` from base to tip) for feather detail.

### When to use

Any feather, leaf, petal, or tapered natural shape. Bird wings
(primaries + tail), plant leaves, floral bursts.

### Reference

`bsdgames/snake/ports/fancy-web/index.html`, `drawEagleWing`
(primary feather loop).

---

## 13. Radial gradient for depth

### Problem

Flat vector shapes look flat. Any hint of 3D depth requires
either shading or perspective.

### Solution

Use `createRadialGradient` for spherical objects (apples, heads,
bodies). Center the gradient near a "light source" corner —
lighter there, darker on the opposite side.

```js
// Apple body
const bodyGrad = ctx.createRadialGradient(
  -3 + spin * 2, -3, 1,     // light source: upper-left
  1, 3, w * 1.6              // dark falloff: lower-right
);
bodyGrad.addColorStop(0, lightenColor(T.apple, 0.35));
bodyGrad.addColorStop(0.55, T.apple);
bodyGrad.addColorStop(1, darkenColor(T.apple, 0.35));
ctx.fillStyle = bodyGrad;
ctx.fill();
```

Helper functions to shift a hex color:

```js
function lightenColor(hex, factor) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgb(${
    Math.round(r + (255 - r) * factor)},${
    Math.round(g + (255 - g) * factor)},${
    Math.round(b + (255 - b) * factor)})`;
}
function darkenColor(hex, factor) { /* symmetric */ }
```

### When to use

Every filled shape that should feel 3D: apples, moons, heads,
bodies, buttons.

---

## 14. Wing-flap via rotation with state variants

### Problem

Wings should flap smoothly during flight, but during different
states (dive, strike, climb) they should hold different shapes —
folded, spread, or braking.

### Solution

Two variables control the wing:

- `wingFactor` — the normal flap (sinusoidal per-frame)
- `wingSweep` — the state-specific offset (constant per state)

```js
let wingFactor, wingSweep;
if (eagle.state === 'dive') {
  wingFactor = 0.6;    // folded position
  wingSweep = -0.35;   // pulled back
} else if (eagle.state === 'strike') {
  wingFactor = 0.8;
  wingSweep = 0.4;     // braking spread
} else {
  wingFactor = Math.sin(eagle.wingPhase * flapRate);
  wingSweep = 0;
}
const wingAngle = wingFactor * 0.55;

// Draw left + right wings, mirror-rotated
ctx.rotate(-wingAngle + wingSweep);
drawEagleWing(-1);
ctx.rotate(wingAngle - wingSweep);
drawEagleWing(+1);
```

`flapRate` varies per state: 5.5 for glide (slow), 11 for climb
(fast, effortful).

### Result

One flap primitive drives glide/lock/dive/strike/climb — no
separate wing sprites needed. Same trick works for tail wags,
mouth open-close, etc.

### When to use

Any two-part symmetric appendage animation with multiple pose
states.

---

## Meta pattern — where to draw the line

**Do everything procedurally?** No. Beyond a certain complexity,
procedural becomes unmaintainable. Threshold rules:

- **Simple silhouettes** (< 20 primitives per sprite) — procedural
  wins. Perfect scaling, themeable, no asset pipeline.
- **Detailed illustrations** (feather-by-feather realism, painted
  textures) — CC0 or commissioned asset wins. Faster to author,
  richer than pure code.
- **Effect layers** (particles, glow, motion blur) — always
  procedural. Physics simulations and blend modes handle it
  natively.

The snake port lives fully in the "simple silhouettes + effects"
zone. All 8 themes are palette variants of the same procedural
shapes.

## See also

- [`browser-port-screenshots.md`](./browser-port-screenshots.md)
  — capturing what you built
- [`../decisions/006-multi-port-architecture.md`](../decisions/006-multi-port-architecture.md)
  §Port Naming Conventions — the `fancy-web` style definition
- [`bsdgames/snake/ports/fancy-web/index.html`](../../bsdgames/snake/ports/fancy-web/index.html)
  — the reference implementation for every technique above
- [`bsdgames/snake/ports/fancy-web/docs/diff-log.md`](../../bsdgames/snake/ports/fancy-web/docs/diff-log.md)
  §Performance notes — the chronology of arriving at these
  techniques
