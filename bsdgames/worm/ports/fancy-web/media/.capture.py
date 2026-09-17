"""
Screenshot capture for worm / fancy-web — one PNG per theme.

Same pattern as snake / fancy-web: per-theme reload so the worm
starts fresh at grid center each capture, then a short animation
window before the shot.

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
        page = browser.new_page(viewport={"width": 1100, "height": 950})

        for slug, out_name in THEMES:
            page.goto(f"file://{INDEX}")
            page.wait_for_selector("canvas")

            # Give the game loop a moment to start moving
            time.sleep(0.3)

            # Steer up so the worm curves into a nicer arc
            page.keyboard.press("w")
            time.sleep(0.45)

            # Switch to target theme via direct button click
            page.evaluate(f"""
                (() => {{
                    const btn = document.querySelector(
                        '.theme-btn[data-theme="{slug}"]'
                    );
                    if (btn) btn.click();
                }})();
            """)

            # Let scene render + a couple ticks happen so apple + worm
            # settle into an interesting frame
            time.sleep(1.2)

            out_path = HERE / f"{out_name}.png"
            canvas = page.query_selector("canvas")
            canvas.screenshot(path=str(out_path))
            print(f"captured: {out_name}.png")

        browser.close()


if __name__ == "__main__":
    capture()
