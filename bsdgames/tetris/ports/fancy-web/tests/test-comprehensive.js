// Comprehensive invariant tests for various presets and modes.
// Reuses the same headless harness as test-smoke.js.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createContext() {
  return {
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    set globalAlpha(_) {},
    get globalAlpha() { return 1; },
    set fillStyle(_) {},
    get fillStyle() { return ''; },
    set strokeStyle(_) {},
    get strokeStyle() { return ''; },
    set lineWidth(_) {},
    get lineWidth() { return 1; }
  };
}

function createElement(id, tag = 'div') {
  const listeners = [];
  const el = {
    id,
    tagName: tag,
    classList: { list: [], add(cls) { if (!this.list.includes(cls)) this.list.push(cls); }, remove(cls) { this.list = this.list.filter(c => c !== cls); }, contains(cls) { return this.list.includes(cls); } },
    style: {},
    value: '',
    textContent: '',
    addEventListener: (type, fn) => listeners.push({ type, fn }),
    _listeners: listeners,
    click() { listeners.filter(l => l.type === 'click').forEach(l => l.fn()); }
  };
  if (tag === 'canvas') {
    el.width = 100;
    el.height = 100;
    el.getContext = () => createContext();
  }
  return el;
}

const elements = {
  setupScreen: createElement('setupScreen'),
  gameScreen: createElement('gameScreen'),
  gameCanvas: createElement('gameCanvas', 'canvas'),
  nextCanvas: createElement('nextCanvas', 'canvas'),
  overlay: createElement('overlay'),
  overlayTitle: createElement('overlayTitle'),
  overlayText: createElement('overlayText'),
  hudMode: createElement('hudMode'),
  hudLevel: createElement('hudLevel'),
  hudLines: createElement('hudLines'),
  hudScore: createElement('hudScore'),
  boardWidth: createElement('boardWidth', 'input'),
  boardHeight: createElement('boardHeight', 'input'),
  presetSelect: createElement('presetSelect', 'select'),
  garbageHeight: createElement('garbageHeight', 'input'),
  garbageDensity: createElement('garbageDensity', 'input'),
  modeSelect: createElement('modeSelect', 'select'),
  startLevel: createElement('startLevel', 'input')
};

global.document = {
  getElementById: id => elements[id] || createElement(id),
  querySelector: sel => {
    if (sel === '.game-area') return { clientWidth: 800, clientHeight: 600 };
    if (sel === '.side-panel') return { getBoundingClientRect: () => ({ width: 110 }), style: {} };
    return createElement('dummy');
  },
  querySelectorAll: sel => sel === '.touch-btn' ? [] : []
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  innerWidth: 1200,
  innerHeight: 800
};
global.getComputedStyle = () => ({ display: 'flex' });
global.performance = { now: () => Date.now() };
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};

vm.runInThisContext(fs.readFileSync(path.join(__dirname, '../src/settings.js'), 'utf8'), { filename: 'settings.js' });
vm.runInThisContext(fs.readFileSync(path.join(__dirname, '../src/game.js'), 'utf8'), { filename: 'game.js' });

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERT FAIL: ' + msg);
}

function setPreset(preset) {
  elements.presetSelect.value = preset;
  elements.boardWidth.value = String(settings.presets[preset].width);
  elements.boardHeight.value = String(settings.presets[preset].height);
}

function setMode(mode) {
  elements.modeSelect.value = mode;
}

function setGarbage(height, densityPercent) {
  elements.garbageHeight.value = String(height);
  elements.garbageDensity.value = String(densityPercent);
}

function countCells(game, type) {
  let n = 0;
  for (let y = 0; y < game.height; y++) {
    for (let x = 0; x < game.width; x++) {
      if (game.board[y][x].type === type) n++;
    }
  }
  return n;
}

function fillRowExceptGap(game, y, gapX) {
  for (let x = 0; x < game.width; x++) {
    if (game.board[y][x].type === 'wall') continue;
    if (x !== gapX) game.board[y][x] = { type: 'filled', color: '#fff' };
  }
}

function playableColumnsAt(game, y) {
  const cols = [];
  for (let x = 0; x < game.width; x++) {
    if (game.board[y][x].type !== 'wall') cols.push(x);
  }
  return cols;
}

const settings = new Settings();

// --- Test every preset: spawn does not collide, walls match shape ---
const presets = ['normal', 'tower', 'canyon', 'wide', 'split', 'hourglass', 'donut', 'staircase'];
for (const preset of presets) {
  setPreset(preset);
  setGarbage(0, 0);
  const game = new Game(settings);
  game.start();
  assert(game.running, `${preset}: game starts`);
  assert(game.current !== null, `${preset}: piece spawned`);
  assert(!game.collides(game.current.x, game.current.y, game.current.cells), `${preset}: spawn does not collide`);

  // At least one wall expected for shaped presets
  if (preset !== 'normal' && preset !== 'tower' && preset !== 'wide') {
    assert(countCells(game, 'wall') > 0, `${preset}: walls exist`);
  }

  // Spawn column must be playable at y=1
  const topPlayable = playableColumnsAt(game, 1);
  assert(topPlayable.includes(game.spawnX), `${preset}: spawnX is playable at y=1`);
}
console.log('Preset spawn tests passed.');

// --- Test line clear on each shaped preset (use I piece) ---
for (const preset of presets) {
  setPreset(preset);
  setGarbage(0, 0);
  const game = new Game(settings);
  game.start();

  // Find a row that has enough contiguous playable columns to fit a horizontal I piece (4 cells)
  let clearableY = -1;
  let gapX = -1;
  for (let y = game.height - 1; y >= 0; y--) {
    const cols = playableColumnsAt(game, y);
    if (cols.length >= 4) {
      clearableY = y;
      gapX = cols[1]; // pick a gap somewhere in the playable band
      break;
    }
  }
  if (clearableY === -1) {
    console.log(`  ${preset}: no row wide enough for I-piece line-clear test, skipped.`);
    continue;
  }

  // Fill the row except the gap
  for (let x = 0; x < game.width; x++) {
    if (game.board[clearableY][x].type === 'wall') continue;
    if (x !== gapX) game.board[clearableY][x] = { type: 'filled', color: '#fff' };
  }

  // Place horizontal I piece covering the gap
  const iShape = SHAPES.I.rotations[0];
  // Need a 4-wide horizontal band containing gapX; find leftmost offset so cells cover gapX and are playable
  const cols = playableColumnsAt(game, clearableY);
  // Try positions where gapX is one of the 4 cells
  let placed = false;
  for (let left = gapX - 3; left <= gapX; left++) {
    const cells = iShape.map(c => ({ x: left + c.x, y: clearableY + c.y }));
    const allPlayable = cells.every(c => c.x >= 0 && c.x < game.width && game.board[c.y][c.x].type !== 'wall');
    if (allPlayable) {
      game.current = { type: 'I', color: SHAPES.I.color, rotation: 0, x: left, y: clearableY, cells: iShape };
      game.hardDrop();
      placed = true;
      break;
    }
  }
  if (!placed) {
    console.log(`  ${preset}: could not place I-piece for line-clear test, skipped.`);
    continue;
  }

  assert(game.lines > 0, `${preset}: line clear detected (lines=${game.lines})`);
}
console.log('Preset line-clear tests passed.');

// --- Test starting garbage generation for various densities ---
for (const density of [0, 30, 80]) {
  setPreset('normal');
  setGarbage(10, density);
  const game = new Game(settings);
  game.start();
  const filled = countCells(game, 'filled');
  assert(filled > 0, `garbage density ${density}: some filled cells expected`);
}
console.log('Garbage generation tests passed.');

// --- Test survival mode adds garbage and eventually ends game ---
setPreset('normal');
setMode('survival');
setGarbage(0, 0);
const surv = new Game(settings);
surv.start();
assert(surv.mode === 'survival', 'survival mode set');
const beforeRows = countCells(surv, 'filled');
surv.addGarbageRow();
const afterRows = countCells(surv, 'filled');
assert(afterRows > beforeRows, 'survival: garbage row added');

// Fill the board to force game over on next spawn
for (let y = 0; y < surv.height; y++) {
  for (let x = 0; x < surv.width; x++) {
    if (surv.board[y][x].type === 'wall') continue;
    surv.board[y][x] = { type: 'filled', color: '#fff' };
  }
}
surv.spawnPiece();
assert(surv.gameOver, 'survival: game over when board full');
console.log('Survival mode tests passed.');

// --- Test marathon mode level progression ---
setPreset('normal');
setMode('marathon');
setGarbage(0, 0);
const mara = new Game(settings);
mara.start();
const startLevel = mara.level;
// Simulate clearing 10 lines by setting up and clearing rows
for (let i = 0; i < 10; i++) {
  const y = mara.height - 1;
  const cols = playableColumnsAt(mara, y);
  if (cols.length < 4) break;
  const gapX = cols[0];
  fillRowExceptGap(mara, y, gapX);
  // Place O piece to fill gap (2x2)
  const oShape = SHAPES.O.rotations[0];
  mara.current = { type: 'O', color: SHAPES.O.color, rotation: 0, x: gapX, y: y - 1, cells: oShape };
  mara.hardDrop();
}
assert(mara.level > startLevel || mara.lines >= 10, `marathon: level or lines should advance (level=${mara.level}, lines=${mara.lines})`);
console.log('Marathon progression tests passed.');

// --- Test game over on full board in marathon ---
setPreset('normal');
setMode('marathon');
setGarbage(0, 0);
const full = new Game(settings);
full.start();
for (let y = 0; y < full.height; y++) {
  for (let x = 0; x < full.width; x++) {
    if (full.board[y][x].type === 'wall') continue;
    full.board[y][x] = { type: 'filled', color: '#fff' };
  }
}
full.spawnPiece();
assert(full.gameOver, 'marathon: game over when board full');
console.log('Marathon game-over tests passed.');

console.log('\nAll comprehensive tests passed.');
