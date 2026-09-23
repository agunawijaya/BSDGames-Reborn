# Working Notes — `pom` · fancy-web

---

## Legacy layout of the game folder

`bsdgames/pom/` still has the **pre-ADR-006 layout**: `src/`, `tests/`
and `docs/diff-log.md` sit at game level (the first two are empty), from
before ports moved under `ports/<name>/`. This port **does not touch
them**. Its code, tests and diff-log live under `ports/fancy-web/`. A
future cleanup (the owner’s call) can remove the empty game-level `src/`
and `tests/` and fold the game-level `diff-log.md` into this port’s or
retire it.

## Golden fixtures

`tests/fixtures/pom-binary-golden.json` was generated with Ubuntu’s
`bsdgames` package (`/usr/games/pom`) under WSL:

- 900 random `ccyymmddHH` dates (years 1902–2100), 250 random
  `yymmddHH` dates (both sides of the `69` pivot), 40 each of `mmddHH`,
  `ddHH` and `HH`, and 22 malformed inputs;
- all run under `TZ=UTC`, and a subset under `TZ=Asia/Jakarta`;
- each entry records `now` (Unix seconds at capture), `arg`, `stdout`,
  `stderr` and `code`.

To regenerate, run a Python loop over `subprocess.run(['/usr/games/pom',
arg], env={'TZ': tz})` on any Linux with `bsdgames` installed, and
record `int(time.time())` alongside each run. Keep the file as the
binary’s output. Never hand-edit it.

## Time zones

- Browsers expose only `Intl`’s zone names, so the caption shows
  `(GMT+7)` where the C library prints `(WIB)`. The engine accepts any
  zone object; tests use `fixedZone(420, 'WIB')` and match byte-for-byte.
- DST: `localZone().mktime` uses JS `Date`, which picks the post-transition
  offset for skipped local times, as glibc usually does. There is no
  fixture for DST gaps.

## Known limitations

- The procedural Moon is *plausible*, not photographic. The maria and
  named craters are at real coordinates, but their shapes are
  approximations.
- The equirectangular surface map pinches at the poles. Relief is faded
  within about 13° of the poles to hide it. Poles only show at the limb,
  or when the Moon is dragged.
- Moon position in the sky is compositional. pom has no observer
  location, so there is no altitude, azimuth or bright-limb tilt.
- Accuracy is pom’s: Duffett-Smith’s simplified theory puts phase
  instants within a few hours of modern ephemerides (for example,
  pom’s Full Moon is 26 Oct 2026 ≈ 11:14 WIB).
- Requires WebGL2. Without it, a message shows and the text UI still
  works.

## Performance notes

See [`architecture.md`](./architecture.md#performance-rtx-4060-laptop-angled3d11).
The heavy per-pixel pieces are the 25-row lit-distance soft minimum
(skipped beyond 4.5 Moon radii), five star layers, the Milky Way fBm,
and the lake’s second pass through `above()`, which replaces rather than
adds to the direct sky evaluation.

## Screenshot workflow

`npm run shots` starts its own server on port 5399, pins
`Asia/Jakarta` + `en-GB`, and writes `media/01…08`. Captions in the
README describe those exact dates. If the bake shaders change, re-run
it.
