// trek/fancy-web — DOM + input + rendering orchestration
//
// Wires the headless engine to the canvas-based combat scene UI.

import { createGame, executeCommand, snapshot, SYSTEM_ORDER } from './engine.js';
import { parseCommand, PARSE, describeCommand } from './parser.js';
import { GALAXY_SIZE, QUADRANT_SIZE, CELL } from './galaxy.js';

const $ = (id) => document.getElementById(id);

// DOM refs (present in index.html shell)
const bgCanvas = $('space-bg');
const sceneCanvas = $('scene');
const stratCanvas = $('strategic-canvas');
const stratOverlay = $('strategic');
const cmdBuffer = $('cmd-buffer');
const cmdHint = $('cmd-hint');
const eventLog = $('event-log-body');
const shipStatusHost = $('ship-status-body');
const systemsHost = $('systems-body');
const sectorInfoHost = $('sector-info-body');
const stardateEl = $('stardate');
const sectorEl = $('sector-label');
const viewButtons = document.querySelectorAll('#view-toggles button');
const gameOverEl = $('game-over');
const gameOverTitle = $('game-over-title');
const gameOverText = $('game-over-text');
const gameOverStats = $('game-over-stats');
const startBtn = $('start-btn');
const titleScreen = $('title-screen');
const difficultyPicker = $('difficulty-picker');

const bgCtx = bgCanvas.getContext('2d');
const sceneCtx = sceneCanvas.getContext('2d');
const stratCtx = stratCanvas.getContext('2d');

// State
let game = null;
let currentView = 'combat';
let cmdText = '';
let selectedDifficulty = 'standard';
let animT = 0;

// Space backdrop image (deep-space nebula + starfield).
// Preloaded so the render loop can draw it every frame without a flash.
const bgImage = new Image();
let bgLoaded = false;
bgImage.onload = () => { bgLoaded = true; };
bgImage.onerror = () => { bgLoaded = false; };
bgImage.src = 'references/background_01.jpg';

// USS Enterprise top-down PNG sprite (transparent background).
const shipImage = new Image();
let shipLoaded = false;
shipImage.onload = () => { shipLoaded = true; };
shipImage.onerror = () => { shipLoaded = false; };
shipImage.src = 'references/uss_enterprise_top_01.png';

/** Draw the space image cover-fit (fill viewport, crop excess) with a
 *  subtle "camera float" so the scene doesn't feel frozen. */
function drawSpaceImage(ctx, w, h, t) {
  if (!bgLoaded) {
    // Fallback while image loads
    ctx.fillStyle = '#020310';
    ctx.fillRect(0, 0, w, h);
    return;
  }
  const imgW = bgImage.naturalWidth;
  const imgH = bgImage.naturalHeight;
  const scale = Math.max(w / imgW, h / imgH) * 1.06; // slight overscan for float room
  const dW = imgW * scale;
  const dH = imgH * scale;
  // Very slow sine drift — barely perceptible, keeps the scene alive.
  const driftX = Math.sin(t * 0.00015) * 22;
  const driftY = Math.cos(t * 0.00010) * 16;
  const dX = (w - dW) / 2 + driftX;
  const dY = (h - dH) / 2 + driftY;
  ctx.drawImage(bgImage, dX, dY, dW, dH);
}
// Effect overlays (transient FX)
let phaserFx = null;   // { from, to, t }
let torpedoFx = null;  // { from, to, t, trail }
let hitFx = [];        // [{ x, y, t }]

// ---------------------------------------------------------------------------
// Canvas sizing
// ---------------------------------------------------------------------------

let W = 0, H = 0;
function fitCanvases() {
  W = window.innerWidth;
  H = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  for (const cnv of [bgCanvas, sceneCanvas]) {
    cnv.style.width = W + 'px';
    cnv.style.height = H + 'px';
    cnv.width = Math.floor(W * dpr);
    cnv.height = Math.floor(H * dpr);
    cnv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  regenStars();
}
window.addEventListener('resize', fitCanvases);

function regenStars() {
  // Kept as a no-op stub for the resize handler contract; the background
  // image replaces the programmatic starfield.
}

// ---------------------------------------------------------------------------
// Background render — deep-space nebula image with subtle drift
// ---------------------------------------------------------------------------

function renderBackground(t) {
  drawSpaceImage(bgCtx, W, H, t);
  // Slight vignette so HUD panels read cleanly against the image
  const grad = bgCtx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.75);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.7, 'rgba(0,0,10,0.35)');
  grad.addColorStop(1, 'rgba(0,0,10,0.75)');
  bgCtx.fillStyle = grad;
  bgCtx.fillRect(0, 0, W, H);
}

// ---------------------------------------------------------------------------
// Ship sprites
// ---------------------------------------------------------------------------

// Native pixel width of the fallback programmatic ship — used to convert
// the caller's `targetWidth` (in pixels) into a `scale` factor when the
// image sprite is not yet loaded.
const ENTERPRISE_FALLBACK_NATIVE_WIDTH = 140;

/**
 * Draw the USS Enterprise centered at (cx, cy).
 * @param cx canvas x centre
 * @param cy canvas y centre
 * @param targetWidth desired on-screen width in pixels
 * @param angle optional rotation (radians), default 0 (bow facing +X)
 */
function drawEnterprise(cx, cy, targetWidth, angle = 0) {
  const c = sceneCtx;
  // Preferred: the PNG sprite (transparent background)
  if (shipLoaded) {
    const iw = shipImage.naturalWidth;
    const ih = shipImage.naturalHeight;
    const s = targetWidth / iw;
    const w = iw * s;
    const h = ih * s;
    c.save();
    c.translate(cx, cy);
    if (angle !== 0) c.rotate(angle);
    // Subtle cyan glow behind the ship for atmosphere
    c.shadowColor = 'rgba(140, 220, 255, 0.45)';
    c.shadowBlur = Math.max(12, targetWidth * 0.08);
    c.drawImage(shipImage, -w / 2, -h / 2, w, h);
    c.restore();
    return;
  }

  // Fallback: programmatic vector ship (used while PNG loads or if it
  // fails to load). Uses the original numeric coordinates; targetWidth
  // is converted to a scale factor.
  const scale = targetWidth / ENTERPRISE_FALLBACK_NATIVE_WIDTH;
  c.save();
  c.translate(cx, cy);
  c.rotate(angle);
  c.scale(scale, scale);

  for (const y of [-25, 25]) {
    const g = c.createRadialGradient(-40, y, 0, -40, y, 22);
    g.addColorStop(0, 'rgba(140, 220, 255, 0.75)');
    g.addColorStop(1, 'rgba(140, 220, 255, 0)');
    c.fillStyle = g;
    c.fillRect(-70, y - 25, 60, 60);
  }
  c.fillStyle = '#5a6d8e';
  c.fillRect(-60, -35, 55, 10);
  c.fillRect(-60, 25, 55, 10);
  c.fillStyle = '#a0e0ff';
  c.fillRect(-60, -33, 5, 6);
  c.fillRect(-60, 27, 5, 6);
  c.strokeStyle = '#4a5c7a';
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(-10, -20); c.lineTo(-10, -30);
  c.moveTo(-10, 20); c.lineTo(-10, 30);
  c.stroke();
  c.fillStyle = '#8395b8';
  c.beginPath(); c.ellipse(-8, 0, 44, 14, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#3d4c68'; c.lineWidth = 1.2; c.stroke();
  c.beginPath();
  c.moveTo(15, -6); c.lineTo(30, -12); c.lineTo(30, 12); c.lineTo(15, 6);
  c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#a0b3d4';
  c.beginPath(); c.ellipse(45, 0, 34, 30, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(45, 0, 24, 21, 0, 0, Math.PI * 2);
  c.strokeStyle = 'rgba(60, 76, 104, 0.5)'; c.lineWidth = 1; c.stroke();
  c.fillStyle = '#c8d8f2';
  c.beginPath(); c.arc(52, 0, 6, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#5a6d8e'; c.stroke();
  c.fillStyle = '#00d4ff'; c.shadowColor = '#00d4ff'; c.shadowBlur = 4;
  c.beginPath();
  c.arc(45, -28, 1.5, 0, Math.PI * 2);
  c.arc(45, 28, 1.5, 0, Math.PI * 2);
  c.arc(60, 0, 1.5, 0, Math.PI * 2);
  c.fill(); c.shadowBlur = 0;
  c.fillStyle = 'rgba(50, 64, 92, 0.7)';
  c.font = 'bold 8px "Orbitron", monospace';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('NCC-1701', 45, 15);
  c.restore();
}

function drawKlingon(cx, cy, scale = 1.0, angle = Math.PI) {
  const c = sceneCtx;
  c.save();
  c.translate(cx, cy);
  c.rotate(angle);
  c.scale(scale, scale);
  const rg = c.createRadialGradient(0, 0, 0, 0, 0, 55);
  rg.addColorStop(0, 'rgba(255, 60, 60, 0.32)');
  rg.addColorStop(1, 'rgba(255, 60, 60, 0)');
  c.fillStyle = rg; c.fillRect(-55, -55, 110, 110);
  c.fillStyle = '#3a2118'; c.strokeStyle = '#1a0e08'; c.lineWidth = 1.5;
  // Head
  c.beginPath();
  c.moveTo(35, 0); c.lineTo(15, -8); c.lineTo(-5, -6); c.lineTo(-5, 6); c.lineTo(15, 8);
  c.closePath(); c.fill(); c.stroke();
  // Wings
  c.beginPath();
  c.moveTo(-5, -6); c.lineTo(-15, -30); c.lineTo(-35, -35); c.lineTo(-30, -20); c.lineTo(-20, -10);
  c.closePath(); c.fill(); c.stroke();
  c.beginPath();
  c.moveTo(-5, 6); c.lineTo(-15, 30); c.lineTo(-35, 35); c.lineTo(-30, 20); c.lineTo(-20, 10);
  c.closePath(); c.fill(); c.stroke();
  // Lights
  c.fillStyle = '#ff3838'; c.shadowColor = '#ff3838'; c.shadowBlur = 6;
  c.beginPath();
  c.arc(28, 0, 1.8, 0, Math.PI * 2);
  c.arc(-30, -28, 1.5, 0, Math.PI * 2);
  c.arc(-30, 28, 1.5, 0, Math.PI * 2);
  c.fill(); c.shadowBlur = 0;
  c.fillStyle = 'rgba(255, 100, 60, 0.4)';
  c.beginPath(); c.arc(36, 0, 3, 0, Math.PI * 2); c.fill();
  c.restore();
}

function drawShield(cx, cy, r, alpha = 0.18) {
  const g = sceneCtx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r);
  g.addColorStop(0, 'rgba(125, 196, 255, 0)');
  g.addColorStop(0.85, `rgba(125, 196, 255, ${alpha * 0.6})`);
  g.addColorStop(1, `rgba(125, 196, 255, ${alpha})`);
  sceneCtx.fillStyle = g;
  sceneCtx.beginPath();
  sceneCtx.arc(cx, cy, r, 0, Math.PI * 2);
  sceneCtx.fill();
}

function drawStar(cx, cy, r) {
  const g = sceneCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, 'rgba(255, 220, 160, 0.9)');
  g.addColorStop(0.3, 'rgba(255, 160, 100, 0.4)');
  g.addColorStop(1, 'rgba(255, 100, 50, 0)');
  sceneCtx.fillStyle = g;
  sceneCtx.beginPath();
  sceneCtx.arc(cx, cy, r, 0, Math.PI * 2);
  sceneCtx.fill();
  sceneCtx.fillStyle = '#ffe8b8';
  sceneCtx.beginPath();
  sceneCtx.arc(cx, cy, r * 0.14, 0, Math.PI * 2);
  sceneCtx.fill();
}

function drawStarbase(cx, cy, r) {
  sceneCtx.strokeStyle = '#ffd76a';
  sceneCtx.shadowColor = '#ffd76a';
  sceneCtx.shadowBlur = 10;
  sceneCtx.lineWidth = 3;
  sceneCtx.beginPath();
  sceneCtx.rect(cx - r, cy - r, r * 2, r * 2);
  sceneCtx.moveTo(cx - r * 0.6, cy - r * 0.6);
  sceneCtx.lineTo(cx + r * 0.6, cy + r * 0.6);
  sceneCtx.moveTo(cx + r * 0.6, cy - r * 0.6);
  sceneCtx.lineTo(cx - r * 0.6, cy + r * 0.6);
  sceneCtx.stroke();
  sceneCtx.shadowBlur = 0;
}

// ---------------------------------------------------------------------------
// Combat scene render — pull ship positions from game state
// ---------------------------------------------------------------------------

function renderCombat(t) {
  sceneCtx.clearRect(0, 0, W, H);
  if (!game) return;
  const snap = snapshot(game);
  const contents = snap.quadrant.contents;

  // Sector cell size for positioning entities on screen.
  const margin = 100;
  const availW = W - margin * 2;
  const availH = H - margin * 2 - 200;   // leave room for HUD bottom
  const cellSize = Math.min(availW, availH) / QUADRANT_SIZE;
  const originX = (W - cellSize * QUADRANT_SIZE) / 2;
  const originY = (H - cellSize * QUADRANT_SIZE) / 2 - 40;

  // Convert sector coords → pixel center
  const cell = (sx, sy) => ({
    x: originX + (sx + 0.5) * cellSize,
    y: originY + (sy + 0.5) * cellSize,
  });

  // Draw stars in-sector (soft glow orbs)
  for (const s of contents.stars) {
    const p = cell(s.sx, s.sy);
    drawStar(p.x, p.y, cellSize * 0.55);
  }

  // Starbase
  if (contents.starbase) {
    const p = cell(contents.starbase.sx, contents.starbase.sy);
    drawStarbase(p.x, p.y, cellSize * 0.35);
    sceneCtx.font = 'bold 9px "Orbitron", monospace';
    sceneCtx.fillStyle = '#ffd76a';
    sceneCtx.textAlign = 'center';
    sceneCtx.fillText('BASE', p.x, p.y + cellSize * 0.55);
  }

  // Klingons
  for (const k of contents.klingons) {
    if (k.destroyed) continue;
    const p = cell(k.sx, k.sy);
    drawShield(p.x, p.y, cellSize * 0.45, 0.14 + 0.05 * Math.sin(t * 0.004));
    drawKlingon(p.x, p.y, cellSize * 0.014);
  }

  // Enterprise
  const ep = cell(snap.ship.sx, snap.ship.sy);
  if (snap.ship.shieldsUp) drawShield(ep.x, ep.y, cellSize * 1.1, 0.22);
  // targetWidth ≈ 2.6 cells across — big enough to see saucer detail,
  // still fits inside a single sector at normal zoom.
  drawEnterprise(ep.x, ep.y, cellSize * 2.6);

  // Phaser fx
  if (phaserFx) {
    phaserFx.t += 1;
    const pulse = Math.max(0, 1 - phaserFx.t / 40);
    for (const target of phaserFx.targets) {
      const from = ep;
      const to = cell(target.sx, target.sy);
      // Outer
      sceneCtx.strokeStyle = `rgba(0, 212, 255, ${0.15 * pulse})`;
      sceneCtx.lineWidth = 10;
      sceneCtx.lineCap = 'round';
      sceneCtx.beginPath();
      sceneCtx.moveTo(from.x + 40, from.y);
      sceneCtx.lineTo(to.x, to.y);
      sceneCtx.stroke();
      sceneCtx.strokeStyle = `rgba(120, 240, 255, ${0.4 * pulse})`;
      sceneCtx.lineWidth = 4; sceneCtx.stroke();
      sceneCtx.strokeStyle = `rgba(220, 250, 255, ${0.95 * pulse})`;
      sceneCtx.lineWidth = 1.5; sceneCtx.stroke();
      // Impact
      const g = sceneCtx.createRadialGradient(to.x, to.y, 0, to.x, to.y, 22);
      g.addColorStop(0, `rgba(255, 255, 255, ${pulse})`);
      g.addColorStop(0.4, `rgba(120, 240, 255, ${0.4 * pulse})`);
      g.addColorStop(1, 'rgba(0, 212, 255, 0)');
      sceneCtx.fillStyle = g;
      sceneCtx.beginPath();
      sceneCtx.arc(to.x, to.y, 22, 0, Math.PI * 2);
      sceneCtx.fill();
    }
    if (phaserFx.t > 40) phaserFx = null;
  }

  // Torpedo fx
  if (torpedoFx) {
    torpedoFx.t += 1;
    const dur = 40;
    const cycle = torpedoFx.t / dur;
    if (cycle >= 1) {
      torpedoFx = null;
    } else {
      // Draw moving torpedo along its trail
      const from = ep;
      const to = torpedoFx.hit ? cell(torpedoFx.hit.sx, torpedoFx.hit.sy)
                              : cell(QUADRANT_SIZE - 1, snap.ship.sy);
      const cx = from.x + (to.x - from.x) * cycle;
      const cy = from.y + (to.y - from.y) * cycle;
      // Trail
      for (let i = 1; i <= 18; i++) {
        const tt = cycle - i * 0.03;
        if (tt < 0) continue;
        const tx = from.x + (to.x - from.x) * tt;
        const ty = from.y + (to.y - from.y) * tt;
        const a = (1 - i / 18) * 0.55;
        const r = 7 - i * 0.3;
        const g = sceneCtx.createRadialGradient(tx, ty, 0, tx, ty, r);
        g.addColorStop(0, `rgba(255, 220, 120, ${a})`);
        g.addColorStop(1, 'rgba(255, 120, 40, 0)');
        sceneCtx.fillStyle = g;
        sceneCtx.beginPath();
        sceneCtx.arc(tx, ty, r, 0, Math.PI * 2);
        sceneCtx.fill();
      }
      const g = sceneCtx.createRadialGradient(cx, cy, 0, cx, cy, 14);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.3, 'rgba(255,200,100,0.85)');
      g.addColorStop(1, 'rgba(255, 80, 30, 0)');
      sceneCtx.fillStyle = g;
      sceneCtx.beginPath();
      sceneCtx.arc(cx, cy, 14, 0, Math.PI * 2);
      sceneCtx.fill();
    }
  }

  // Hit fx (klingon return fire flash)
  hitFx = hitFx.filter(h => h.t < 30);
  for (const h of hitFx) {
    h.t += 1;
    const a = Math.max(0, 1 - h.t / 30);
    const p = cell(h.sx, h.sy);
    sceneCtx.strokeStyle = `rgba(255, 90, 70, ${a * 0.75})`;
    sceneCtx.lineWidth = 3;
    sceneCtx.lineCap = 'round';
    sceneCtx.beginPath();
    sceneCtx.moveTo(p.x, p.y);
    sceneCtx.lineTo(ep.x, ep.y);
    sceneCtx.stroke();
    sceneCtx.strokeStyle = `rgba(255, 220, 200, ${a * 0.9})`;
    sceneCtx.lineWidth = 1;
    sceneCtx.stroke();
    // Impact glow on Enterprise
    const g = sceneCtx.createRadialGradient(ep.x, ep.y, 0, ep.x, ep.y, 30);
    g.addColorStop(0, `rgba(255, 100, 80, ${a * 0.4})`);
    g.addColorStop(1, 'rgba(255, 100, 80, 0)');
    sceneCtx.fillStyle = g;
    sceneCtx.beginPath();
    sceneCtx.arc(ep.x, ep.y, 30, 0, Math.PI * 2);
    sceneCtx.fill();
  }

  // Sector grid lines (very faint)
  sceneCtx.strokeStyle = 'rgba(120, 160, 220, 0.05)';
  sceneCtx.lineWidth = 1;
  for (let i = 0; i <= QUADRANT_SIZE; i++) {
    sceneCtx.beginPath();
    sceneCtx.moveTo(originX + i * cellSize, originY);
    sceneCtx.lineTo(originX + i * cellSize, originY + cellSize * QUADRANT_SIZE);
    sceneCtx.stroke();
    sceneCtx.beginPath();
    sceneCtx.moveTo(originX, originY + i * cellSize);
    sceneCtx.lineTo(originX + cellSize * QUADRANT_SIZE, originY + i * cellSize);
    sceneCtx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Strategic galaxy chart
// ---------------------------------------------------------------------------

function renderStrategic() {
  if (!game) return;
  const snap = snapshot(game);
  const c = stratCtx;
  const w = stratCanvas.width;
  const h = stratCanvas.height;
  c.clearRect(0, 0, w, h);

  // Deep-space image backdrop (same source as the tactical view)
  drawSpaceImage(c, w, h, animT);
  // Darken so the 8×8 grid + quadrant labels stay legible over the nebula.
  c.fillStyle = 'rgba(4, 8, 24, 0.55)';
  c.fillRect(0, 0, w, h);

  const gridSize = Math.min(w, h) - 100;
  const gridX = (w - gridSize) / 2;
  const gridY = (h - gridSize) / 2;
  const cell = gridSize / GALAXY_SIZE;

  // Grid lines
  c.strokeStyle = 'rgba(180, 200, 240, 0.15)';
  c.lineWidth = 1;
  for (let i = 0; i <= GALAXY_SIZE; i++) {
    c.beginPath();
    c.moveTo(gridX + i * cell, gridY);
    c.lineTo(gridX + i * cell, gridY + gridSize);
    c.stroke();
    c.beginPath();
    c.moveTo(gridX, gridY + i * cell);
    c.lineTo(gridX + gridSize, gridY + i * cell);
    c.stroke();
  }

  // Labels
  c.font = '10px "Orbitron", monospace';
  c.fillStyle = 'rgba(180, 200, 240, 0.35)';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let qy = 0; qy < GALAXY_SIZE; qy++) {
    for (let qx = 0; qx < GALAXY_SIZE; qx++) {
      c.fillText(`${qx+1}-${qy+1}`, gridX + qx * cell + cell/2, gridY + qy * cell + 12);
    }
  }

  // Fog of war on unscanned quadrants
  for (let qy = 0; qy < GALAXY_SIZE; qy++) {
    for (let qx = 0; qx < GALAXY_SIZE; qx++) {
      if (!game.galaxy.quadrants[qy][qx].scanned) {
        c.fillStyle = 'rgba(0, 0, 10, 0.55)';
        c.fillRect(gridX + qx * cell, gridY + qy * cell, cell, cell);
      }
    }
  }

  // Your quadrant highlight
  const youQx = snap.ship.qx, youQy = snap.ship.qy;
  const youX = gridX + youQx * cell + cell/2;
  const youY = gridY + youQy * cell + cell/2;
  c.fillStyle = 'rgba(0, 212, 255, 0.16)';
  c.fillRect(gridX + youQx * cell, gridY + youQy * cell, cell, cell);
  c.strokeStyle = 'rgba(0, 212, 255, 0.8)';
  c.lineWidth = 2;
  c.strokeRect(gridX + youQx * cell + 2, gridY + youQy * cell + 2, cell - 4, cell - 4);

  // Ship marker
  c.fillStyle = '#00d4ff';
  c.shadowColor = '#00d4ff';
  c.shadowBlur = 12;
  c.beginPath();
  c.moveTo(youX, youY - 8);
  c.lineTo(youX + 7, youY + 6);
  c.lineTo(youX, youY + 3);
  c.lineTo(youX - 7, youY + 6);
  c.closePath();
  c.fill();
  c.shadowBlur = 0;
  c.font = 'bold 9px "Orbitron", monospace';
  c.fillStyle = '#eaf4ff';
  c.fillText('E', youX, youY - 20);

  // Klingons in scanned quadrants
  for (let qy = 0; qy < GALAXY_SIZE; qy++) {
    for (let qx = 0; qx < GALAXY_SIZE; qx++) {
      const q = game.galaxy.quadrants[qy][qx];
      if (!q.scanned || q.klingons <= 0) continue;
      const kx = gridX + qx * cell + cell/2 - 12;
      const ky = gridY + qy * cell + cell - 12;
      c.fillStyle = '#ff3838';
      c.shadowColor = '#ff3838';
      c.shadowBlur = 8;
      c.beginPath();
      c.arc(kx, ky, 5, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;
      c.font = 'bold 10px "Orbitron", monospace';
      c.fillStyle = '#ff8080';
      c.textAlign = 'left';
      c.fillText(`K${q.klingons}`, kx + 8, ky);
      c.textAlign = 'center';
    }
  }

  // Starbases
  for (let qy = 0; qy < GALAXY_SIZE; qy++) {
    for (let qx = 0; qx < GALAXY_SIZE; qx++) {
      const q = game.galaxy.quadrants[qy][qx];
      if (!q.scanned || q.starbases <= 0) continue;
      const bx = gridX + qx * cell + cell/2 + 12;
      const by = gridY + qy * cell + cell/2;
      c.strokeStyle = '#ffd76a';
      c.shadowColor = '#ffd76a';
      c.shadowBlur = 8;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(bx - 6, by); c.lineTo(bx + 6, by);
      c.moveTo(bx, by - 6); c.lineTo(bx, by + 6);
      c.stroke();
      c.shadowBlur = 0;
    }
  }

  c.strokeStyle = 'rgba(0, 212, 255, 0.6)';
  c.lineWidth = 2;
  c.strokeRect(gridX - 4, gridY - 4, gridSize + 8, gridSize + 8);
}

// ---------------------------------------------------------------------------
// HUD rendering
// ---------------------------------------------------------------------------

function pct(v, m) { return Math.max(0, Math.min(100, Math.round((v / m) * 100))); }
function fillClass(v, m) {
  const p = pct(v, m);
  if (p < 25) return 'crit';
  if (p < 50) return 'warn';
  return '';
}

function renderHUD() {
  if (!game) return;
  const snap = snapshot(game);

  stardateEl.textContent = `Stardate ${snap.stardate.toFixed(1)} / ${snap.stardateEnd.toFixed(1)}`;
  sectorEl.textContent = `Sector ${snap.ship.qx + 1}-${snap.ship.qy + 1}`;

  // Ship status
  const shieldsMax = snap.ship.shieldsMax;
  shipStatusHost.innerHTML = `
    <div class="row"><span class="label">SHIELDS</span>
      <div class="bar"><div class="fill ${fillClass(snap.ship.shields, shieldsMax)}" style="width:${pct(snap.ship.shields, shieldsMax)}%"></div></div>
      <span class="val">${snap.ship.shields}${snap.ship.shieldsUp ? '↑' : '↓'}</span>
    </div>
    <div class="row"><span class="label">HULL</span>
      <div class="bar"><div class="fill ${fillClass(snap.ship.hull, 100)}" style="width:${snap.ship.hull}%"></div></div>
      <span class="val">${snap.ship.hull}%</span>
    </div>
    <div class="row"><span class="label">ENERGY</span>
      <div class="bar"><div class="fill ${fillClass(snap.ship.energy, 10000)}" style="width:${pct(snap.ship.energy, 10000)}%"></div></div>
      <span class="val">${snap.ship.energy}</span>
    </div>
    <div class="row"><span class="label">TORPS</span>
      <div class="bar"><div class="fill ${fillClass(snap.ship.torpedoes, 10)}" style="width:${pct(snap.ship.torpedoes, 10)}%"></div></div>
      <span class="val">${snap.ship.torpedoes} / 10</span>
    </div>
  `;

  // Systems
  const SYS_LABELS = {
    warp: 'Warp Engines', impulse: 'Impulse', phasers: 'Phasers',
    torpedoes: 'Torpedoes', shields: 'Shields', sensors: 'Sensors',
    computer: 'Computer', lifeSupport: 'Life Support',
  };
  systemsHost.innerHTML = SYSTEM_ORDER.map(s => {
    const dmg = snap.ship.systems[s];
    const cls = dmg === 0 ? 'ok' : dmg <= 3 ? 'warn' : 'crit';
    const label = dmg === 0 ? 'OK' : dmg <= 3 ? 'WEAK' : 'DAMAGED';
    return `<div class="sys-row"><span class="name">${SYS_LABELS[s]}</span><span class="state ${cls}">${label}</span></div>`;
  }).join('');

  // Sector info
  sectorInfoHost.innerHTML = `
    <div class="row"><span class="lbl">Klingons here</span><span class="v ${snap.quadrant.klingonCount > 0 ? 'danger' : ''}">${snap.quadrant.klingonCount}</span></div>
    <div class="row"><span class="lbl">Starbases here</span><span class="v">${snap.quadrant.starbaseCount}</span></div>
    <div class="row"><span class="lbl">Stars here</span><span class="v">${snap.quadrant.contents.stars.length}</span></div>
    <div class="row"><span class="lbl">Klingons remaining</span><span class="v danger">${snap.klingonsRemaining}</span></div>
    <div class="row"><span class="lbl">Stardate remaining</span><span class="v">${(snap.stardateEnd - snap.stardate).toFixed(1)}</span></div>
    <div class="row"><span class="lbl">Docked</span><span class="v">${snap.ship.docked ? 'YES' : '—'}</span></div>
  `;

  // Event log
  const evtHtml = snap.events.slice(-12).reverse().map(e => {
    let cls = '';
    if (e.tag === 'kill' || e.tag === 'phaser' || e.tag === 'win') cls = 'ok';
    else if (e.tag === 'hit' || e.tag === 'loss') cls = 'hit';
    else if (e.tag === 'damage' || e.tag === 'miss') cls = 'warn';
    return `<div class="evt ${cls}">${escapeHtml(e.msg)} <small>· sd ${e.stardate.toFixed(1)}</small></div>`;
  }).join('');
  eventLog.innerHTML = evtHtml;
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c]);
}

// ---------------------------------------------------------------------------
// Command handling
// ---------------------------------------------------------------------------

function refreshHint() {
  const parsed = parseCommand(cmdText);
  if (parsed.status === PARSE.OK) {
    cmdHint.textContent = '↵ ' + describeCommand(parsed.cmd);
  } else if (cmdText.trim() === '') {
    cmdHint.textContent = 'phaser · torpedo · move · srscan · lrscan · shields up|down|<n> · dock · damages · help · quit';
  } else {
    cmdHint.textContent = parsed.error || 'Unknown command';
  }
}

function submitCommand() {
  const parsed = parseCommand(cmdText);
  if (parsed.status !== PARSE.OK) {
    // Just clear + play error sound (skip for now)
    return;
  }
  const cmd = parsed.cmd;

  if (cmd.action === 'help') {
    // Show help temporarily in cmdHint
    cmdHint.textContent = cmd.text;
    cmdText = '';
    cmdBuffer.textContent = '';
    return;
  }
  if (cmd.action === 'quit') {
    endGame(false, 'Mission aborted');
    cmdText = ''; cmdBuffer.textContent = ''; refreshHint();
    return;
  }

  const res = executeCommand(game, cmd);
  if (!res.ok) {
    cmdHint.textContent = 'ERR: ' + res.error;
    cmdText = '';
    cmdBuffer.textContent = '';
    return;
  }

  // Play back effects visually
  for (const eff of (res.effects || [])) {
    if (eff.type === 'phaser') {
      phaserFx = { t: 0, targets: eff.damages.map(d => ({ sx: d.sx, sy: d.sy })) };
    } else if (eff.type === 'torpedo') {
      torpedoFx = { t: 0, hit: eff.hit };
    } else if (eff.type === 'klingonFire') {
      hitFx.push({ sx: eff.from[0], sy: eff.from[1], t: 0 });
    }
  }

  cmdText = '';
  cmdBuffer.textContent = '';
  refreshHint();
  renderHUD();

  if (game.won || game.lost) {
    endGame(game.won, game.won ? `All Klingons destroyed at stardate ${game.stardate.toFixed(1)}` : game.lostReason);
  }
}

function endGame(won, reason) {
  gameOverTitle.textContent = won ? 'VICTORY' : 'DEFEAT';
  gameOverTitle.className = won ? 'win' : 'loss';
  gameOverText.textContent = reason;
  const snap = snapshot(game);
  gameOverStats.textContent =
    `${snap.kills} Klingons destroyed · Hull ${snap.ship.hull}% · Energy ${snap.ship.energy} · Stardate ${snap.stardate.toFixed(1)}`;
  gameOverEl.classList.add('shown');
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

function onKeyDown(e) {
  if (e.repeat) return;
  if (titleScreen.classList.contains('shown')) {
    if (e.key === 'Enter' || e.key === ' ') startNewGame();
    return;
  }
  if (gameOverEl.classList.contains('shown')) {
    if (e.key === 'Enter' || e.key === ' ') {
      gameOverEl.classList.remove('shown');
      titleScreen.classList.add('shown');
    }
    return;
  }

  if (e.key === 'Enter') {
    submitCommand();
    e.preventDefault();
    return;
  }
  if (e.key === 'Backspace') {
    cmdText = cmdText.slice(0, -1);
    cmdBuffer.textContent = cmdText;
    refreshHint();
    e.preventDefault();
    return;
  }
  if (e.key === 'Escape') {
    cmdText = '';
    cmdBuffer.textContent = '';
    refreshHint();
    return;
  }
  // Toggle views
  if (e.key === 'v' || e.key === 'V') {
    toggleView(currentView === 'combat' ? 'strategic' : 'combat');
    e.preventDefault();
    return;
  }

  if (e.key.length === 1 && /^[A-Za-z0-9 .\-]$/.test(e.key)) {
    cmdText += e.key;
    cmdBuffer.textContent = cmdText;
    refreshHint();
    e.preventDefault();
  }
}

function toggleView(view) {
  currentView = view;
  viewButtons.forEach(b => b.classList.toggle('active', b.dataset.view === view));
  if (view === 'strategic') {
    stratOverlay.classList.add('shown');
    renderStrategic();
  } else {
    stratOverlay.classList.remove('shown');
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

function buildDifficultyButtons() {
  difficultyPicker.innerHTML = '';
  const opts = [
    { key: 'novice',   label: 'NOVICE',   desc: '8 Klingons · 40 stardates' },
    { key: 'standard', label: 'STANDARD', desc: '15 Klingons · 30 stardates' },
    { key: 'expert',   label: 'EXPERT',   desc: '25 Klingons · 22 stardates' },
  ];
  for (const o of opts) {
    const b = document.createElement('button');
    b.className = 'diff-btn';
    b.dataset.diff = o.key;
    b.innerHTML = `<span class="diff-label">${o.label}</span><span class="diff-desc">${o.desc}</span>`;
    if (o.key === selectedDifficulty) b.classList.add('active');
    b.addEventListener('click', () => {
      selectedDifficulty = o.key;
      difficultyPicker.querySelectorAll('.diff-btn').forEach(x => x.classList.toggle('active', x.dataset.diff === o.key));
    });
    difficultyPicker.appendChild(b);
  }
}

function startNewGame() {
  game = createGame({ difficulty: selectedDifficulty });
  cmdText = '';
  cmdBuffer.textContent = '';
  hitFx = [];
  phaserFx = null;
  torpedoFx = null;
  titleScreen.classList.remove('shown');
  gameOverEl.classList.remove('shown');
  currentView = 'combat';
  stratOverlay.classList.remove('shown');
  viewButtons.forEach(b => b.classList.toggle('active', b.dataset.view === 'combat'));
  refreshHint();
  renderHUD();
}

function boot() {
  fitCanvases();
  buildDifficultyButtons();
  document.addEventListener('keydown', onKeyDown);
  startBtn.addEventListener('click', startNewGame);
  viewButtons.forEach(b => b.addEventListener('click', () => toggleView(b.dataset.view)));

  function frame(t) {
    animT = t;
    renderBackground(t);
    if (game && !titleScreen.classList.contains('shown')) {
      renderCombat(t);
      if (currentView === 'strategic') renderStrategic();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
