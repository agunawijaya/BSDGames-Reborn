// One-shot screenshot capture for README media.
// Usage:
//   1. Start dev server: npm run dev &
//   2. Run:              node scripts/capture-screenshots.mjs

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = resolve(__dirname, '..', 'media');
const URL = process.env.APP_URL ?? 'http://localhost:5173';

async function main() {
  await mkdir(MEDIA_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on('pageerror', (err) => console.error('pageerror:', err.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.error('console.error:', m.text());
  });

  console.log('navigating…');
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('svg.board', { timeout: 20_000 });
  await page.waitForTimeout(600);

  // 1. Empty board — Vs AI mode, black to move
  console.log('shot 1/4: 01-empty-board');
  await page.screenshot({ path: resolve(MEDIA_DIR, '01-empty-board.png') });

  // Human plays K10 (center). AI will respond automatically after 500ms.
  const board = await page.locator('svg.board').boundingBox();
  if (!board) throw new Error('board bounding box not found');
  // K10 is col 9, row 9. SVG coords: PADDING=40 + col*30 = 310, row*30+40=310.
  // Screen coords: origin + (svgX / 620) * boardWidth
  const svgToScreen = (svgX, svgY) => ({
    x: board.x + (svgX / 620) * board.width,
    y: board.y + (svgY / 620) * board.height,
  });
  const k10 = svgToScreen(40 + 9 * 30, 40 + 9 * 30);
  await page.mouse.click(k10.x, k10.y);
  await page.waitForTimeout(1200); // wait for AI response + drop animation

  // 2. Mid-game: play a few more moves against the AI
  const humanMoves = [
    [7, 9], // J10
    [9, 7], // K8
    [11, 9], // M10
    [9, 11], // K12
  ];
  for (const [col, row] of humanMoves) {
    const p = svgToScreen(40 + col * 30, 40 + row * 30);
    await page.mouse.click(p.x, p.y);
    await page.waitForTimeout(1000); // AI responds
  }

  console.log('shot 2/4: 02-midgame-vs-ai');
  await page.screenshot({ path: resolve(MEDIA_DIR, '02-midgame-vs-ai.png') });

  // 3. Switch to hot-seat mode for a clean shot
  await page.getByRole('button', { name: 'Hot-seat' }).click();
  await page.waitForTimeout(400);
  // Play a quick hot-seat sequence with a clear pattern
  const hotseatMoves = [
    [9, 9], // K10
    [10, 10],
    [8, 9],
    [11, 10],
    [7, 9],
    [12, 10],
    [6, 9],
    [13, 10], // Black at (6..9, 9) — 4 in a row on row 9, White responding on row 10
  ];
  for (const [col, row] of hotseatMoves) {
    const p = svgToScreen(40 + col * 30, 40 + row * 30);
    await page.mouse.click(p.x, p.y);
    await page.waitForTimeout(350);
  }
  console.log('shot 3/4: 03-hotseat-threats');
  await page.screenshot({ path: resolve(MEDIA_DIR, '03-hotseat-threats.png') });

  // 4. Play the winning move — Black extends to (5, 9) making 5 in a row.
  const winMove = svgToScreen(40 + 5 * 30, 40 + 9 * 30);
  await page.mouse.click(winMove.x, winMove.y);
  await page.waitForTimeout(700);
  console.log('shot 4/4: 04-win');
  await page.screenshot({ path: resolve(MEDIA_DIR, '04-win.png') });

  await browser.close();
  console.log('done — 4 screenshots saved to ' + MEDIA_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
