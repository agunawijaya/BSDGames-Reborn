// One-shot screenshot capture for README media. Not part of the app;
// invoked manually to refresh `media/` after visual changes.
//
// Usage:
//   1. Start dev server:  `npm run dev` (background)
//   2. Run this script:   `node scripts/capture-screenshots.mjs`
//   3. Screenshots land in `media/`.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = resolve(__dirname, '..', 'media');
const URL = process.env.APP_URL ?? 'http://localhost:5173';

async function waitForR3F(page) {
  // Wait for the R3F canvas to be attached AND for a first paint to
  // land. Just presence of the canvas element isn't enough on WebGL
  // scenes — the initial frame takes ~200-500 ms after mount.
  await page.waitForSelector('canvas', { state: 'attached', timeout: 30_000 });
  await page.waitForFunction(
    () => {
      const c = document.querySelector('canvas');
      return c instanceof HTMLCanvasElement && c.width > 0 && c.height > 0;
    },
    { timeout: 30_000 },
  );
  // Extra settle for camera lerp + bloom to reach steady state.
  await page.waitForTimeout(700);
}

async function press(page, key, count = 1, gapMs = 260) {
  for (let i = 0; i < count; i++) {
    await page.keyboard.press(key);
    await page.waitForTimeout(gapMs);
  }
}

async function main() {
  await mkdir(MEDIA_DIR, { recursive: true });

  const browser = await chromium.launch({
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Surface console errors so a broken build doesn't yield blank shots.
  page.on('pageerror', (err) => console.error('pageerror:', err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('console.error:', msg.text());
  });

  console.log(`navigating to ${URL} …`);
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await waitForR3F(page);

  // 1. Spawn view — fully zoomed out ("planet from afar").
  console.log('shot 1/4: 01-spawn (max zoom out)');
  await page.screenshot({ path: resolve(MEDIA_DIR, '01-spawn.png') });

  // Move to focus interior, then zoom in a few notches for the
  // classic gameplay view.
  await press(page, '=', 5, 150);
  await page.waitForTimeout(600);
  await press(page, 'l', 3, 260);
  await press(page, 'j', 2, 260);
  await page.waitForTimeout(500);
  console.log('shot 2/4: 02-gameplay (mid zoom, player + robots visible)');
  await page.screenshot({ path: resolve(MEDIA_DIR, '02-gameplay.png') });

  // Zoom in far enough to trigger follow-player mode.
  await press(page, '=', 6, 150);
  await page.waitForTimeout(600);
  await press(page, 'l', 1, 260);
  await page.waitForTimeout(700);
  console.log('shot 3/4: 03-follow-player (high zoom, camera follows player)');
  await page.screenshot({ path: resolve(MEDIA_DIR, '03-follow-player.png') });

  // Help panel overlay.
  await page.keyboard.press('?');
  await page.waitForTimeout(500);
  console.log('shot 4/4: 04-help (help panel open)');
  await page.screenshot({ path: resolve(MEDIA_DIR, '04-help.png') });

  await browser.close();
  console.log(`done — 4 screenshots saved to ${MEDIA_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
