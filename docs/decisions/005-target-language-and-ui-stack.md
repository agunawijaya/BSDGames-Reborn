# ADR-005: Reference Language & UI Stack (for `@bsdgames/shared` and `classic-web` ports)

- **Status:** Accepted (scope narrowed 2026-09-17 per
  [ADR-006](./006-multi-port-architecture.md))
- **Original Date:** 2026-09-17 (morning)
- **Revision Date:** 2026-09-17 (afternoon)
- **Deciders:** Agun Wijaya (repo owner)
- **Scope:** Reference default for (a) the `shared/` package
  (`@bsdgames/shared`) and (b) any port whose style begins with
  `classic-web` (i.e., the reference "plain web" ports). **Not a
  mandate for other ports** — per ADR-006, ports are polyglot and
  choose their own stack.

## Revision Note (2026-09-17, afternoon)

This ADR was originally accepted earlier the same day under the
assumption that one stack would be mandated for every game in the
repo. [ADR-006](./006-multi-port-architecture.md) rewrote that
assumption a few hours later: each game may host multiple polyglot
ports, and no root stack can be universally mandated.

The **decision content is preserved unchanged** — TypeScript + Vite
+ PWA (optional Capacitor Android) remains the right stack for the
purpose it now serves. What changed is the **scope**:

- Before: mandatory stack for all 43 games in the repo.
- After: reference stack for `@bsdgames/shared` (the JS/TS engine
  primitives package) and for any port whose style prefix is
  `classic-web` (the "plain web, minimal chrome" reference ports).

A port under any other style prefix (`fancy-web`, `retro-terminal`,
`mobile-gimmicks`, `native-desktop`, `game-engine`, or anything a
contributor invents) is **unconstrained by this ADR**. It picks its
own stack under the Universal Port Contract of ADR-006.

## Context

The `@bsdgames/shared` workspace package needs a language and
framework. Reference `classic-web` ports (the first one being
`bsdgames/robots/ports/classic-web/`) need one too. This ADR
answers both. The original context — 43 games with wide-ranging
runtime needs, spiritual-successor philosophy, no App Store
required, offline preferred, WebRTC multiplayer — still frames why
the *particular* stack was chosen.

ADR-002 committed to *spiritual successor* semantics — mechanics
preserved, everything else modernized freely — so a faithful C
rebuild is out of scope even for the reference stack.

### Target Profile (owner-directed, 2026-09-17)

The owner has specified the following runtime target for the
**reference `classic-web` ports and the `@bsdgames/shared`
package**. Other-style ports are free to reject any of these
constraints as long as they honor the Universal Port Contract
(ADR-006):

1. **Web + Mobile from a single codebase.** The port must run in a
   browser (desktop) and on mobile (iOS + Android) — not as two
   separate builds maintained in parallel.
2. **No App Store distribution required.** Android target is a
   downloadable **APK** (sideload, or hosted on itch.io / GitHub
   Releases / project website). iOS target is a **PWA installed
   via Safari's "Add to Home Screen"** — the only free,
   Mac-independent path on iOS that gives an app-like install.
   Neither Apple App Store nor Google Play submission is a
   requirement of this ADR.
3. **Offline-capable preferred.** Games should run without a
   network once loaded. Service worker (web + PWA) and bundled
   assets (APK) both cover this.
4. **WebRTC multiplayer** for peer-to-peer games (`hunt`, and
   optionally `phantasia`, `sail`). No mandatory dedicated server
   for the multiplayer story — signaling can be a tiny hosted
   WebSocket.

The relaxed iOS constraint (PWA-via-Safari, not App Store)
materially simplifies the stack: no Apple Developer membership,
no macOS dependency, no code-signing pipeline. Capacitor is
retained as an *optional* Android APK builder, not a required
component of the runtime.

### Runtime Needs Across the 43 Programs

| Category | Examples | Runtime needs |
|---|---|---|
| Stream utility | `caesar`, `factor` | text I/O, no realtime |
| Static toy | `rain`, `worms` | canvas + `requestAnimationFrame` |
| Turn-based grid | `robots`, `hangman`, `gomoku` | grid render + input + save |
| Real-time arcade | `tetris`, `snake` | rAF loop + non-blocking input + timing |
| Adventure | `adventure`, `battlestar`, `hack` | text UI + save/restore |
| Real-time multiplayer | `hunt` | WebRTC signaling + P2P mesh |
| Simulation | `atc`, `trek` | timers + parser |

No game requires native mobile capabilities (camera, GPS,
biometrics, native filesystem). All 43 needs are covered by the
modern web platform surface.

### Constraints Inherited From Other ADRs

- **[ADR-002](./002-porting-philosophy.md)** — spiritual successor.
  Retro aesthetics (monospace, ASCII, green-on-black palette) are
  encouraged but not required per game.
- **[ADR-001](./001-monorepo-flat-structure.md)** — 43 flat game
  folders. The stack must accommodate a monorepo with shared code.

## Options Considered

Language and framework are tightly coupled with the deployment
target here, so options are presented as complete stacks.

### Option A — TypeScript + Vite PWA (+ optional Capacitor Android)

**Description:** Core game engines written in vanilla TypeScript.
Vite for build + dev server. Deployment is a Progressive Web App
with a service worker for offline. Same URL serves three targets:
desktop browser, Android PWA (via Chrome "Install app"), and iOS
PWA (via Safari "Add to Home Screen"). Capacitor v6 is an
**optional** add-on that wraps the same web build into a
distributable `.apk` for Android sideload — used only if a file
deliverable is preferred over URL install. No iOS native shell,
no Apple Developer membership, no Mac required.

**Pros:**
- **One codebase, one deploy, three targets** (desktop browser,
  Android PWA/APK, iOS PWA). Same `dist/` directory covers
  everything.
- **Zero platform-signing overhead on the default path** — no
  Apple Developer ($99/yr) and no Google Play developer ($25
  one-time) required. Add them later if the owner reverses the
  no-store decision.
- **Offline is native to the platform** — one service worker
  serves both web and PWA installs; APK bundles the assets
  natively.
- **WebRTC works everywhere** — same browser API in desktop, in
  installed PWA, and in the Capacitor Android webview. No plugin
  bridging.
- **Pedagogical fit.** TypeScript is the most readable of the
  serious options; vanilla TS classes (no heavy framework) keep
  the code close to `spec.md`. `lessons.md` file-line references
  stay short and legible.
- **Lightest bundle** of the shortlist. A typical game core is
  <50 KB gzipped; PWA shell adds ~20 KB.
- **Deployment is free at any scale relevant to this project** —
  Vercel / Netlify / GitHub Pages / Cloudflare Pages for the PWA;
  `cap build android` produces the APK locally.
- **Retro aesthetic is trivially preserved** with a monospace font
  and CSS palette — no engine fight.

**Cons:**
- iOS PWA has real limitations vs a native shell: no background
  audio while screen locked, IndexedDB / cache eviction is more
  aggressive than on Android, push notification support has
  historically lagged. For BSDGames game classes none of these
  are blockers, but they exist.
- Capacitor webview performance ceiling on Android is lower than
  a native renderer. Adequate for every BSDGames game class, but
  not a candidate if we later add a 60fps 3D or physics-heavy
  game.
- If the owner later reverses the "no App Store" decision, iOS
  App Store distribution *does* require re-adding Capacitor iOS,
  a Mac, and a paid Apple Developer account. Same path Option A
  originally offered — the option is preserved, not exercised.

**Suitable when:** Games are 2D grid/canvas with modest
performance needs, distribution is via URL and optional APK, and
we accept iOS PWA's platform limitations. This is exactly our
profile.

### Option B — React Native (Expo) + Expo Web

**Description:** React Native via Expo for iOS/Android; Expo Web
compiles the same components to a web build using React Native
Web. Game rendering via `react-native-skia` (mobile-first
Skia bindings that also run in browsers). WebRTC via
`react-native-webrtc` on mobile, native browser API on web.

**Pros:**
- Genuinely native mobile (native views, not webview) — best
  raw performance on mobile.
- Expo's OTA update model is powerful for hobby-scale distribution.
- Large React talent pool.

**Cons:**
- **Game rendering is not first-class in RN.** `react-native-skia`
  is good but every game engine has to be written against a Skia
  canvas API that behaves subtly differently on web vs mobile.
- **RN Web is a compatibility layer, not a first-class target.** For
  a monorepo of 43 games where web is a co-equal target, this is a
  real tax.
- WebRTC requires bridging two different codepaths (web API vs
  `react-native-webrtc`) — same-shape API but different bug
  surfaces.
- Expo build service (EAS) is required for reliable native builds;
  free tier is limited.
- Pedagogical cost: contributors must understand React, RN, RN Web,
  and Skia to read most game code. Higher barrier than Option A.

**Suitable when:** Mobile is the *primary* target and web is a
demo/secondary channel — the opposite of our profile.

### Option C — Flutter + Flutter Web + Flame

**Description:** Dart language, Skia-based rendering across all
targets. Flame is Flutter's mature 2D game engine. WebRTC via the
`flutter_webrtc` plugin (unified surface across web + mobile).

**Pros:**
- Truly one runtime, one rendering pipeline across all targets.
- Flame is purpose-built for the exact class of 2D games in BSDGames.
- Excellent App Store story — Flutter apps are indistinguishable
  from native to end users.

**Cons:**
- **Dart ecosystem is smaller than TypeScript's** — fewer teaching
  resources, fewer collaborators.
- **Flutter Web bundle is ~2 MB minimum** for the engine alone —
  hostile to PWA loading for a game as small as `caesar` or `rain`.
- Flutter Web still is not on parity with mobile/desktop targets
  (canvas renderer has known quirks, HTML renderer is deprecated).
- Contributor onboarding — Dart is a learning cost the project
  doesn't otherwise justify.

**Suitable when:** The project is native-mobile-first with premium
polish, and web is acceptable-not-primary.

### Option D — Godot 4 (multi-export)

**Description:** A full game engine that exports to HTML5, iOS, and
Android from a single project. GDScript (Python-like) or C# for
game logic. Built-in WebRTC.

**Pros:**
- Purpose-built for games; renderer, input, audio, save all first-class.
- Node-based scene architecture maps well to composable game
  entities.
- Free, open source, mature.

**Cons:**
- **Changes the pedagogical direction.** Instead of "here is a
  small program that shows you how tetris works from scratch,"
  every game becomes "here is a Godot project." `lessons.md`
  becomes about Godot, not about game programming techniques.
  This is a mission-drift risk against the "teach" pillar.
- Godot HTML5 export is ~15 MB minimum — heavy for the smaller
  games.
- Editor-driven workflow doesn't fit the file-and-`git`-first
  monorepo shape.
- iOS build path requires macOS + Xcode + Apple developer signing
  — same as any option, but Godot's iOS pipeline has historically
  been the roughest.

**Suitable when:** The project is fundamentally a game showcase
and pedagogy is secondary. Not our profile.

### Option E — Separate Frontends, Shared TypeScript Core

**Description:** Pure TypeScript game engines with no rendering. A
web frontend (Vite + Canvas) and a native mobile frontend (Swift
+ SwiftUI for iOS, Kotlin + Jetpack Compose for Android) each
consume the shared engine.

**Pros:**
- Best-in-class native feel on each platform.
- Cleanest possible separation of engine and presentation
  (excellent pedagogical artifact — matches the `spec.md` /
  `architecture.md` split).

**Cons:**
- **3× frontend work.** For 43 games, this is a project killer.
- Requires ongoing iOS *and* Android *and* web expertise across
  every contributor.
- The core-vs-frontend split, while pedagogically clean, is
  overkill for games as small as `caesar` or `hangman`.

**Suitable when:** The project has funded engineering for each
platform and each game justifies bespoke UX. Not our situation.

### Options Rejected Without Full Analysis

Included briefly so the pedagogical record shows they were
considered:

- **Rust + `ratatui` (TUI-only)** — cannot reach mobile or App
  Store. Fails the target profile.
- **Go + `bubbletea` (TUI-only)** — same reason.
- **Python + `textual` (TUI-only)** — same reason.
- **C + `ncurses`** — contradicts ADR-002 *and* fails the target
  profile.
- **Rust + Bevy → WASM + native mobile** — Bevy's mobile story is
  pre-1.0 and its WASM bundle is heavier than Option A's entire
  game core.
- **Unity** — proprietary tooling, licensing overhead, misaligned
  with a small open-source pedagogical repo.
- **Kotlin Multiplatform** — capable but adds two toolchains
  (Kotlin/JS + Kotlin/Native) for no gain over Option A on this
  game class.

## Decision

**We chose Option A — TypeScript + Vite PWA (+ optional Capacitor
Android) — as the reference stack for `@bsdgames/shared` and
`classic-web`-style ports.**

Option A is the only stack that satisfies all four target
requirements — web, mobile without an App Store, offline, WebRTC
— from a single codebase for a reference port, while also serving
the three mission pillars at that reference level:

- **Preserve.** DOM/CSS or Canvas render the retro aesthetic
  faithfully; monospace fonts and ASCII palettes cost nothing.
- **Modernize.** PWA installability on both mobile OSes, offline
  service worker, optional Capacitor APK for Android sideload,
  WebRTC multiplayer — all modernize boxes checked without
  hand-waving and without paying Apple's tax.
- **Teach.** TypeScript is the most readable of the shortlist;
  vanilla TS classes without a heavy framework keep ports close to
  their `spec.md` — the cleanest possible bridge between spec and
  code for `lessons.md` to point at.

With App Store removed from the requirements, the case against
Options B, C, D, and E strengthens further. React Native and
Flutter both trade a heavy runtime for native App Store polish
that we no longer need. Godot's HTML5 export weight and pedagogical
drift remain unchanged. Separate frontends are still unaffordable
at 43 games. Capacitor is retained in Option A as an *optional*
Android APK builder, not a mandatory piece of the runtime — the
default path (PWA only) requires zero native tooling.

## Consequences

### Positive

- One deploy pipeline per `classic-web` port (`vite build` →
  static hosting; optional `cap build android` → APK for release
  page).
- **No paid developer accounts and no macOS dependency** on the
  default path.
- Every `classic-web` port becomes shareable via a URL — powerful
  for the "teach" pillar. Same URL works as install source on
  Android Chrome and iOS Safari.
- WebRTC works uniformly across `classic-web` ports that need it.
- Offline is a service-worker config, not a runtime rewrite.
- **New under ADR-006:** `@bsdgames/shared` becomes an opt-in
  library, not a mandate. Ports in other styles are free to
  ignore it or grow their own shared package in their own
  language.

### Negative / Risks

- iOS PWA is a second-class citizen on Apple's platform. Cache
  eviction is more aggressive than Android; some browser APIs
  land later. Mitigation: bundle-size discipline, use
  `Cache-Control: immutable` for game assets, and design saves to
  survive cache eviction (server-backed sync as a future ADR).
- Android WebView versioning quirks (Capacitor path) will hit us
  eventually. Budget for platform bugs.
- WebRTC signaling still needs a small server (typically ~50 LOC
  Node/Bun WebSocket) for peer discovery. Peer connection itself
  stays P2P — no game traffic through the server.
- Bundle discipline required — 43 games in one PWA could bloat
  the initial download. Mitigation: per-game route-level code
  splitting (Vite handles this natively).
- Reversing the "no App Store" decision later means adding
  Capacitor iOS + a Mac + an Apple Developer account. Path is
  preserved; cost is deferred, not eliminated.

### Follow-on Work

- Populate `shared/` as the workspace package `@bsdgames/shared`
  (per ADR-006): Vite + TypeScript + PWA plugin, engine primitives
  (`Grid`, `RNG`, `InputMap`, `SaveStore`), retro theme CSS.
  Publishable but publish itself is optional.
- Update root `AGENTS.md` §2 (repo structure) and §6 (per-game
  taxonomy) to reflect both ADR-005 (this file) and ADR-006.
- Update `porting-guide.md` Step 10 for the reference stack —
  folder layout is now `bsdgames/<game>/ports/classic-web/src/`,
  testing via Vitest.
- Retire "awaiting language ADR" notes from `progress.md`
  (already done 2026-09-17). Reformat the dashboard to per-port
  rows per ADR-006 follow-on work.
- Draft a separate ADR for the WebRTC signaling server (host,
  protocol, auth) when the first multiplayer `classic-web` port
  is scheduled — not needed for `robots/classic-web`.
- Draft a separate ADR for save/leaderboard storage
  (localStorage vs IndexedDB vs cloud) — not needed for
  `robots/classic-web` at pilot.
- **Do not** create per-port language ADRs that override this ADR
  — the override mechanism is simpler than that under ADR-006:
  the port's style prefix (`fancy-web`, `retro-terminal`, etc.)
  is itself the signal that ADR-005 does not apply. Only
  `classic-web` ports read this ADR as their default.

## Forward-Compatibility Rules

To keep the App Store submission path clean without paying the
cost now, the following engineering constraints apply to
**`classic-web` ports and `@bsdgames/shared`** from day one. These
are not nice-to-haves — they are enforced in code review and, once
`shared/` exists, in lint/CI rules. Ports in other styles may
adopt these rules if useful but are not bound by them.

1. **Hash routing only.** Use `/#/<game>` (or in-memory routing);
   never HTML5 History API. Capacitor serves from `file://`,
   which cannot rewrite paths back to `index.html`.
2. **No iframe-based rendering tricks.** WKWebView (iOS) and
   Android WebView diverge from browsers on iframe policy. Render
   into the top-level document — DOM or Canvas.
3. **Bundle size discipline.** Target < 500 KB gzipped per game
   route (initial payload). iOS Safari PWA cache evicts aggressively;
   bloated bundles re-download often. Enforced via CI bundle-size
   check once `shared/` is populated.
4. **Offline-first save.** All persistent state (saves, high
   scores, settings) must work end-to-end with the network cut.
   Cloud sync is additive, never a hard dependency. Apple review
   has historically flagged apps that error out when offline.
5. **No unsupported browser APIs.** Avoid APIs whose support in
   WKWebView is missing or unstable — notably WebGPU,
   `SharedArrayBuffer` without cross-origin isolation (unavailable
   under `file://`), and background audio during screen lock.
   Check MDN's WKWebView column before adopting a new API.
6. **Per-target smoke test before "Released".** A game is not
   marked Released in `progress.md` until it has been verified on
   (a) desktop Chrome, (b) Android Chrome PWA, (c) iOS Safari PWA.
   Real device or emulator both acceptable.

Violations block the "cost deferred, not eliminated" promise.
Enforce them now; they get harder to retrofit later.

## References

- [ADR-001 — Monorepo flat structure](./001-monorepo-flat-structure.md)
- [ADR-002 — Porting philosophy: spiritual successor](./002-porting-philosophy.md)
- [ADR-004 — Per-game doc taxonomy](./004-per-game-doc-taxonomy.md)
  (revised 2026-09-17 with canonical vs port-level split).
- [ADR-006 — Multi-port architecture](./006-multi-port-architecture.md)
  (narrowed this ADR's scope).
- Root [`AGENTS.md`](../../AGENTS.md) §1 (mission), §2 (repo
  structure — `shared/` is contingent on this ADR).
- Owner directive, 2026-09-17: web + mobile targets, distribution
  as APK sideload (Android) and PWA-via-Safari (iOS) — no App
  Store submission required, offline preferred, WebRTC
  multiplayer.
- [Vite](https://vite.dev/), [vite-plugin-pwa](https://vite-pwa-org.netlify.app/),
  [Capacitor v6](https://capacitorjs.com/), [WebRTC
  API](https://developer.mozilla.org/docs/Web/API/WebRTC_API) —
  the four pillars of the recommended stack.
