// Minimal Node smoke test for the Tetris engine logic.
// Mocks just enough DOM/window APIs to instantiate Game and Settings.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Minimal 2D context mock
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
    classList: {
      list: [],
      add(cls) { if (!this.list.includes(cls)) this.list.push(cls); },
      remove(cls) { this.list = this.list.filter(c => c !== cls); },
      contains(cls) { return this.list.includes(cls); }
    },
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

// Set sensible defaults
elements.boardWidth.value = '10';
elements.boardHeight.value = '20';
elements.presetSelect.value = 'normal';
elements.garbageHeight.value = '0';
elements.garbageDensity.value = '0';
elements.modeSelect.value = 'marathon';
elements.startLevel.value = '1';

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

// Load scripts in dependency order (run in global-like context so classes are visible)
vm.runInThisContext(fs.readFileSync(path.join(__dirname, '../src/settings.js'), 'utf8'), { filename: 'settings.js' });
vm.runInThisContext(fs.readFileSync(path.join(__dirname, '../src/game.js'), 'utf8'), { filename: 'game.js' });

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERT FAIL: ' + msg);
}

function boardRowToString(game, y) {
  return game.board[y].map(c => {
    if (c.type === 'wall') return '#';
    if (c.type === 'filled') return 'X';
    return '.';
  }).join('');
}

// Test 1: Settings defaults
const settings = new Settings();
const cfg = settings.getConfig();
assert(cfg.width === 10 && cfg.height === 20, 'default board size');
assert(cfg.garbageHeight === 0, 'default no garbage');

// Test 2: Start game
const game = new Game(settings);
game.start();
assert(game.running, 'game running after start');
assert(game.width === 10 && game.height === 20, 'game board size');
assert(game.current !== null, 'current piece spawned');
assert(game.nextType !== null, 'next piece set');

// Test 3: Move and rotate without crash
const startX = game.current.x;
game.move(-1);
game.move(1);
assert(game.current.x === startX, 'move left then right returns to start');
game.rotate(1);
game.rotate(-1);
assert(game.current !== null, 'piece still active after rotations');

// Test 4: Hard drop places piece
const beforeScore = game.score;
game.hardDrop();
assert(game.score > beforeScore || game.gameOver, 'hard drop scored or game over');

// Test 5: Line clear
// Set up a full row at the bottom with a 4-cell gap, then place an I piece horizontally to fill it.
game.board = [];
for (let y = 0; y < 20; y++) {
  const row = [];
  for (let x = 0; x < 10; x++) row.push({ type: 'empty' });
  game.board.push(row);
}
// Fill every cell in row 19 except x=3,4,5,6
for (let x = 0; x < 10; x++) {
  if (x < 3 || x > 6) game.board[19][x] = { type: 'filled', color: '#fff' };
}

// Place I piece horizontally so it covers the gap
const iShape = SHAPES.I.rotations[0]; // horizontal: -1,0,1,2
const iColor = SHAPES.I.color;
game.current = {
  type: 'I',
  color: iColor,
  rotation: 0,
  x: 5,
  y: 19,
  cells: iShape
};
// offsets cover x=4,5,6,7 -> but gap is 3-6, so x=7 would collide? Use x=4 -> cells 3,4,5,6
game.current.x = 4;
assert(!game.collides(4, 19, iShape), 'I piece fits into bottom gap');
game.hardDrop();

assert(game.lines > 0, `line cleared (lines=${game.lines})`);
assert(boardRowToString(game, 19).includes('.'), 'bottom row empty after clear');

// Test 6: Garbage generation does not crash
const game2 = new Game(settings);
game2.start();
const gCfg = settings.getConfig();
gCfg.garbageHeight = 5;
gCfg.garbageDensity = 0.3;
// Re-init board with garbage
game2.initBoard(gCfg);
let garbageCount = 0;
for (let y = 0; y < game2.height; y++) {
  for (let x = 0; x < game2.width; x++) {
    if (game2.board[y][x].type === 'filled') garbageCount++;
  }
}
assert(garbageCount > 0, 'garbage stack generated');

// Test 7: Canyon preset walls
settings.presetSelect.value = 'canyon';
settings.applyPreset();
const canyonCfg = settings.getConfig();
assert(canyonCfg.preset === 'canyon' && canyonCfg.width === 10, 'canyon preset applied');
const game3 = new Game(settings);
game3.start();
let wallCount = 0;
for (let y = 0; y < game3.height; y++) {
  for (let x = 0; x < game3.width; x++) {
    if (game3.board[y][x].type === 'wall') wallCount++;
  }
}
assert(wallCount > 0, 'canyon walls exist');

console.log('All smoke tests passed.');
