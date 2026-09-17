"""
Screenshot capture for snake / fancy-web — one PNG per theme.

Loads index.html fresh for each theme so the snake is always at
its starting position (center) and won't reach an edge and trigger
the "ESCAPED" overlay mid-capture. Between goto and screenshot,
gives the game ~1.2 seconds of motion so the snake has curved
into an interesting slither shape.

Usage:
    python3 .capture.py

Output: 01-neon-grid.png ... 08-midnight.png next to this script.

Not part of the port's runtime — capture-time helper only.
Prefixed with a dot so it doesn't clutter the media/ listing.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
import time

HERE = Path(__file__).parent
INDEX = (HERE.parent / "index.html").resolve()

THEMES = [
    ("neon-grid", "01-neon-grid"),
    ("savanna",   "02-savanna"),
    ("jungle",    "03-jungle"),
    ("desert",    "04-desert"),
    ("river",     "05-river"),
    ("aztec",     "06-aztec"),
    ("origami",   "07-origami"),
    ("midnight",  "08-midnight"),
]


def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1100, "height": 900})

        for slug, out_name in THEMES:
            # Fresh page load — snake starts at center every time
            page.goto(f"file://{INDEX}")
            page.wait_for_selector("canvas")

            # Give the game a moment to start its loop
            time.sleep(0.3)

            # Steer up so snake curves into an interesting arc instead of
            # travelling as a straight rightward line
            page.keyboard.press("w")
            time.sleep(0.35)

            # Now switch to the target theme (offscreen static-layer cache
            # regenerates on setTheme() — takes a few ms)
            page.evaluate(f"""
                (() => {{
                    const btn = document.querySelector('.theme-btn[data-theme="{slug}"]');
                    if (btn) btn.click();
                }})();
            """)

            # Let the scene animate to a rich moment: eagle in a state,
            # apples spinning, some drift particles, snake in mid-curve.
            time.sleep(1.1)

            out_path = HERE / f"{out_name}.png"
            canvas = page.query_selector("canvas")
            canvas.screenshot(path=str(out_path))
            print(f"captured: {out_name}.png")

        browser.close()


if __name__ == "__main__":
    capture()
