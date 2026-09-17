# Learning — Browser-Port Screenshot Pipeline

> How to capture screenshots for HTML/JavaScript-based ports
> (`fancy-web`, `classic-web`, `mobile-gimmicks`, etc.). Uses
> **Playwright + Chromium in WSL2**. Complements the terminal-
> game pipeline in
> [`docs/scripts/README.md`](../scripts/README.md).

---

## When to use which pipeline

| Port shape | Pipeline | Tools |
|---|---|---|
| Original BSDGames binary in a terminal | Terminal pipeline | WSL + tmux + wkhtmltoimage + ImageMagick |
| Browser-based port (HTML + Canvas + JS) | Browser pipeline (this doc) | WSL + Playwright + Chromium |

The terminal pipeline is documented in
[`docs/scripts/README.md`](../scripts/README.md) and implemented
by [`docs/scripts/capture-screenshots.sh`](../scripts/capture-screenshots.sh).
It captures a running binary via `tmux capture-pane`.

The browser pipeline (this doc) loads `index.html` via `file://`
and captures the canvas element via Playwright.

## Reference implementation

[`bsdgames/snake/ports/fancy-web/media/.capture.py`](../../bsdgames/snake/ports/fancy-web/media/.capture.py)
— captures 8 theme screenshots for the snake fancy-web port.

The script is prefixed with a dot so it doesn't clutter the
port's `media/` listing (which is dominated by the PNGs).

## Installation

One-time setup in WSL2 (Ubuntu-based; Debian similar):

```bash
# Playwright Python bindings — needs --break-system-packages on
# newer Ubuntu due to PEP 668
pip install --break-system-packages playwright

# Chromium browser binary (~200MB)
python3 -m playwright install chromium

# Headless shell (smaller, no window frame) — needed for
# canvas.screenshot() to work reliably
python3 -m playwright install chromium-headless-shell
```

Verify:

```bash
python3 -c "
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    p.chromium.launch().close()
    print('OK')
"
```

## Basic pattern

```python
from playwright.sync_api import sync_playwright
from pathlib import Path
import time

HERE = Path(__file__).parent
INDEX = (HERE.parent / "index.html").resolve()

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1100, "height": 900})
    page.goto(f"file://{INDEX}")
    page.wait_for_selector("canvas")

    # Let game loop warm up
    time.sleep(1.0)

    # Screenshot just the canvas element
    canvas = page.query_selector("canvas")
    canvas.screenshot(path=str(HERE / "01-default.png"))

    browser.close()
```

## Multi-theme capture

Two approaches, both proven:

### Approach A — Per-theme reload (recommended)

**Fresh page load per theme.** Snake resets to center; no risk of
game state (e.g. hitting an edge and triggering escape overlay)
contaminating the shot.

```python
THEMES = [
    ("neon-grid", "01-neon-grid"),
    ("savanna",   "02-savanna"),
    # ... more themes
]

for slug, out_name in THEMES:
    page.goto(f"file://{INDEX}")             # fresh state every time
    page.wait_for_selector("canvas")
    time.sleep(0.3)                          # game warm up

    # Steer for a nicer composition (optional)
    page.keyboard.press("w")
    time.sleep(0.35)

    # Switch theme via direct button click
    page.evaluate(f"""
        (() => {{
            const btn = document.querySelector(
                '.theme-btn[data-theme="{slug}"]'
            );
            if (btn) btn.click();
        }})();
    """)

    # Let scene animate to a rich moment
    time.sleep(1.1)

    canvas = page.query_selector("canvas")
    canvas.screenshot(path=str(HERE / f"{out_name}.png"))
```

**Why per-theme reload:** in the first iteration of the snake
port capture, I clicked through all themes in one session.
By the 3rd theme, the snake had reached the right edge, triggered
"ESCAPED" overlay, and stuck there — 5 of 8 screenshots came out
showing the overlay instead of gameplay.

### Approach B — Single session, choreographed steering

If reloading is expensive (large asset load, wasm init), stay in
one session but steer the snake in a controlled loop to keep it
away from edges. Trickier to get right; only worth it if load
time is a problem.

## Driving the DOM from Python

Playwright's `page.evaluate()` runs arbitrary JavaScript in the
page context. Use it to trigger UI events:

```python
# Click a button by data attribute
page.evaluate("""
    document.querySelector('.theme-btn[data-theme="midnight"]').click();
""")

# Read a state variable exposed on window
score = page.evaluate("() => window.game && window.game.score")

# Wait for a specific overlay text
page.wait_for_function(
    "() => document.querySelector('#gameOverlay').textContent.includes('ESCAPED')",
    timeout=5000
)
```

**Note:** if the game's internals are inside an IIFE and no
globals are exposed, you can only drive UI (clicks, keys). Debug-
exposing globals (e.g. `window.game = game;`) can be gated behind
`?debug=1` query strings for capture builds without polluting
production.

## Keyboard input

Playwright's keyboard API is straightforward:

```python
page.keyboard.press("ArrowRight")     # single tap
page.keyboard.press("d")               # letter key
page.keyboard.down("Shift")            # hold
page.keyboard.up("Shift")              # release
page.keyboard.type("Alice")            # type a string
```

Beware that `keyboard.press("w")` and `keyboard.press("W")` are
different keys. Modern games typically bind both (via
`.toLowerCase()`); check yours.

## Canvas vs full-page screenshots

Two choices:

- **`canvas.screenshot()`** — captures only the canvas element.
  Result is the game visual with no HTML frame.
- **`page.screenshot()`** — captures the full page including
  header, theme picker, footer.

For port media, canvas-only is usually right — it composes into
docs cleanly and shows the game itself, not the surrounding
demo chrome.

For port README hero shots, full-page can be nicer because it
shows the theme picker and HUD in context.

## Viewport sizing

Set viewport `width` and `height` at browser launch or `new_page`.
Wider than the canvas gives whitespace around it in full-page
shots; matching the canvas exactly is best for canvas-only.

The snake port canvas is 900×600; viewport 1100×900 in the
reference script gives some margin for the theme picker and
score row that appear when using full-page capture.

## Common pitfalls

### `Executable doesn't exist at ... chrome-headless-shell`

You installed `chromium` but not `chromium-headless-shell`. Both
are needed. Run:

```bash
python3 -m playwright install chromium-headless-shell
```

### First-run needs `pip install --break-system-packages`

Modern Ubuntu (24.04+) enforces PEP 668. Playwright doesn't
have a system package. Either use `--break-system-packages`, a
venv, or `pipx`.

### `file://` URLs can be unreliable

If the game loads sub-resources with fetch/XHR, browser CORS
rules may block them from `file://`. If that happens, run a
tiny HTTP server for the capture:

```python
import http.server, threading, socketserver

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass  # silence

def serve(port):
    with socketserver.TCPServer(("", port), QuietHandler) as httpd:
        httpd.serve_forever()

threading.Thread(target=serve, args=(8765,), daemon=True).start()
page.goto("http://localhost:8765/index.html")
```

### Timing sensitivity

If a screenshot shows a half-drawn frame, add `page.wait_for_timeout(100)`
or use `page.wait_for_function()` to wait for an explicit
render-complete signal.

### Screenshot returns unexpectedly small

`page.screenshot()` captures the visible viewport. If the game
canvas is 900×600 but the viewport is 400×300, you'll get a
400×300 shot with a scrolled canvas. Set viewport to at least
canvas dimensions before capture.

## File organization

Convention used in `snake/ports/fancy-web/media/`:

```
media/
├── .capture.py                    helper — dot-prefixed, hidden
├── 01-neon-grid.png               numbered by picker order
├── 02-savanna.png
├── ...
└── 08-midnight.png
```

Numbering matches the theme picker's visual order. Filename
matches the theme's slug. PNG for lossless capture — small
enough at Canvas resolution to be fine (~300 KB per shot).

## When you need to regenerate

- After visual changes to sprites, palette, or effects
- After adding a new theme (add row to `THEMES` list + capture)
- After a fresh browser install to catch rendering regressions

Just re-run the capture script. It's idempotent — overwrites
existing files in place.

## See also

- [`fancy-web-visual-toolkit.md`](./fancy-web-visual-toolkit.md)
  — the visual techniques being captured
- [`../scripts/README.md`](../scripts/README.md) — terminal
  game screenshot pipeline (different tool, same purpose)
- [`../scripts/capture-screenshots.sh`](../scripts/capture-screenshots.sh)
  — the terminal-pipeline reference implementation
- [`../../bsdgames/snake/ports/fancy-web/media/.capture.py`](../../bsdgames/snake/ports/fancy-web/media/.capture.py)
  — the browser-pipeline reference implementation
