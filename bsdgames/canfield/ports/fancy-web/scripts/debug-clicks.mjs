import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'debug-screenshots');
const URL = 'http://localhost:4173';

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(OUT_DIR, '00-initial.png') });

  await page.click('button:has-text("Inspect")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(OUT_DIR, '01-inspect.png') });

  await page.click('button:has-text("Commit")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(OUT_DIR, '02-commit.png') });

  // Click stock top card
  const stockPile = page.locator('.table-area > div:nth-child(3) .pile-slot').first();
  await stockPile.locator('.card').last().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(OUT_DIR, '03-stock-selected.png') });

  // Click first tableau
  const tableau1 = page.locator('.tableau-row .pile-slot').first();
  await tableau1.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(OUT_DIR, '04-tableau-clicked.png') });

  // Click talon
  const talonPile = page.locator('.table-area > div:nth-child(3) .pile-slot').nth(1);
  await talonPile.locator('.card').last().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(OUT_DIR, '05-talon-selected.png') });

  // Click first foundation
  await page.locator('.foundation-row .pile-slot').first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(OUT_DIR, '06-foundation-clicked.png') });

  await browser.close();
  console.log(`Debug screenshots saved to ${OUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
