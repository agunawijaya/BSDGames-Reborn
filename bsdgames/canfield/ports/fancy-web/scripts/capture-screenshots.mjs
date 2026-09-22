// One-shot screenshot capture for README media. Not part of the app;
// invoked manually to refresh `media/` after visual changes.
//
// Usage:
//   1. Start dev/preview server:  `npm run preview` (background)
//   2. Run this script:           `node scripts/capture-screenshots.mjs`
//   3. Screenshots land in `media/`.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = resolve(__dirname, '..', 'media');
const URL = process.env.APP_URL ?? 'http://localhost:4173';

async function main() {
  await mkdir(MEDIA_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on('pageerror', (err) => console.error('pageerror:', err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('console.error:', msg.text());
  });

  console.log(`navigating to ${URL} …`);
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('shot 1/4: 01-initial-deal');
  await page.screenshot({ path: resolve(MEDIA_DIR, '01-initial-deal.png') });

  // Open the betting panel details by clicking Inspect.
  await page.click('button:has-text("Inspect")');
  await page.waitForTimeout(400);
  console.log('shot 2/4: 02-betting-panel');
  await page.screenshot({ path: resolve(MEDIA_DIR, '02-betting-panel.png') });

  // Commit and make a few moves to reach mid-game.
  await page.click('button:has-text("Commit")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Deal Hand")');
  await page.waitForTimeout(300);
  console.log('shot 3/4: 03-midgame');
  await page.screenshot({ path: resolve(MEDIA_DIR, '03-midgame.png') });

  // Open help modal.
  await page.keyboard.press('?');
  await page.waitForTimeout(400);
  console.log('shot 4/4: 04-help');
  await page.screenshot({ path: resolve(MEDIA_DIR, '04-help.png') });

  await browser.close();
  console.log(`done — 4 screenshots saved to ${MEDIA_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
