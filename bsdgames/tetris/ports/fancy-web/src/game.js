const COLORS = {
  I: '#05d9e8',
  O: '#ffcc00',
  T: '#a855f7',
  S: '#39ff14',
  Z: '#ff2a6d',
  J: '#3b82f6',
  L: '#f97316',
  wall: '#2a2d3d',
  grid: '#181a24',
  ghost: 'rgba(255,255,255,0.12)'
};

const SHAPES = {
  I: {
    color: COLORS.I,
    rotations: [
      [{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:2,y:0}],
      [{x:0,y:0},{x:0,y:-1},{x:0,y:1},{x:0,y:2}],
      [{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:2,y:0}],
      [{x:0,y:0},{x:0,y:-1},{x:0,y:1},{x:0,y:2}]
    ]
  },
  O: {
    color: COLORS.O,
    rotations: [
      [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}]
    ]
  },
  T: {
    color: COLORS.T,
    rotations: [
      [{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:0,y:1}],
      [{x:0,y:0},{x:0,y:-1},{x:0,y:1},{x:1,y:0}],
      [{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:0,y:-1}],
      [{x:0,y:0},{x:0,y:-1},{x:0,y:1},{x:-1,y:0}]
    ]
  },
  S: {
    color: COLORS.S,
    rotations: [
      [{x:0,y:0},{x:-1,y:0},{x:0,y:-1},{x:1,y:-1}],
      [{x:0,y:0},{x:0,y:-1},{x:1,y:0},{x:1,y:1}],
      [{x:0,y:0},{x:-1,y:0},{x:0,y:-1},{x:1,y:-1}],
      [{x:0,y:0},{x:0,y:-1},{x:1,y:0},{x:1,y:1}]
    ]
  },
  Z: {
    color: COLORS.Z,
    rotations: [
      [{x:0,y:0},{x:1,y:0},{x:0,y:-1},{x:-1,y:-1}],
      [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:-1}],
      [{x:0,y:0},{x:1,y:0},{x:0,y:-1},{x:-1,y:-1}],
      [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:-1}]
    ]
  },
  J: {
    color: COLORS.J,
    rotations: [
      [{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:1,y:1}],
      [{x:0,y:0},{x:0,y:-1},{x:0,y:1},{x:-1,y:1}],
      [{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:-1,y:-1}],
      [{x:0,y:0},{x:0,y:-1},{x:0,y:1},{x:1,y:-1}]
    ]
  },
  L: {
    color: COLORS.L,
    rotations: [
      [{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:-1,y:1}],
      [{x:0,y:0},{x:0,y:-1},{x:0,y:1},{x:-1,y:-1}],
      [{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:1,y:-1}],
      [{x:0,y:0},{x:0,y:-1},{x:0,y:1},{x:1,y:1}]
    ]
  }
};

const SHAPE_KEYS = Object.keys(SHAPES);

class Game {
  constructor(settings) {
    this.settings = settings;
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.nextCanvas = document.getElementById('nextCanvas');
    this.nextCtx = this.nextCanvas.getContext('2d');
    this.overlay = document.getElementById('overlay');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlayText = document.getElementById('overlayText');

    this.running = false;
    this.paused = false;
    this.gameOver = false;
    this.lastTime = 0;
    this.dropTimer = 0;
    this.lockDelay = 0;
    this.survivalTimer = 0;

    this.board = [];
    this.particles = [];
    this.bag = [];
    this.current = null;
    this.nextType = null;
    this.ghostY = 0;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.mode = 'marathon';

    this.keys = {};
    this.das = { left: 0, right: 0 };
    this.repeat = { left: 0, right: 0 };

    this.bindControls();
    window.addEventListener('resize', () => this.resize());
  }

  start() {
    const cfg = this.settings.getConfig();
    this.width = cfg.width;
    this.height = cfg.height;
    this.mode = cfg.mode;
    this.level = cfg.startLevel;
    this.score = 0;
    this.lines = 0;
    this.dropTimer = 0;
    this.lockDelay = 0;
    this.survivalTimer = 0;
    this.gameOver = false;
    this.paused = false;
    this.particles = [];
    this.bag = [];
    this.nextType = this.nextPieceType();

    this.initBoard(cfg);
    this.spawnPiece();

    document.getElementById('setupScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('hudMode').textContent = this.mode === 'marathon' ? 'Marathon' : 'Survival';
    this.updateHUD();
    this.overlay.classList.add('hidden');

    this.resize();
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(t => this.loop(t));
  }

  showMenu() {
    this.running = false;
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('setupScreen').classList.add('active');
  }

  initBoard(cfg) {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push({ type: 'empty' });
      }
      this.board.push(row);
    }

    // Apply preset walls
    const setWall = (x, y) => {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.board[y][x] = { type: 'wall' };
      }
    };

    if (cfg.preset === 'canyon') {
      const playable = 4;
      const start = Math.floor((this.width - playable) / 2);
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (x < start || x >= start + playable) setWall(x, y);
        }
      }
    } else if (cfg.preset === 'split') {
      const wallX = Math.floor(this.width / 2);
      for (let y = 0; y < this.height; y++) setWall(wallX, y);
    } else if (cfg.preset === 'hourglass') {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const neckTop = Math.floor(this.height * 0.35);
          const neckBottom = Math.floor(this.height * 0.65);
          const neckWidth = Math.max(4, Math.floor(this.width * 0.35));
          const neckStart = Math.floor((this.width - neckWidth) / 2);
          if (y >= neckTop && y <= neckBottom && (x < neckStart || x >= neckStart + neckWidth)) {
            setWall(x, y);
          }
        }
      }
    } else if (cfg.preset === 'donut') {
      const blockW = Math.max(2, Math.floor(this.width * 0.3));
      const blockH = Math.max(4, Math.floor(this.height * 0.25));
      const startX = Math.floor((this.width - blockW) / 2);
      const startY = Math.floor((this.height - blockH) / 2);
      for (let y = startY; y < startY + blockH; y++) {
        for (let x = startX; x < startX + blockW; x++) {
          setWall(x, y);
        }
      }
    } else if (cfg.preset === 'staircase') {
      // Stepped floor: each column has a raised floor, rising from left to right.
      // Top of the board stays fully open so pieces can fall in.
      for (let x = 0; x < this.width; x++) {
        const stepHeight = Math.floor((x / (this.width - 1)) * (this.height * 0.45));
        for (let h = 0; h < stepHeight; h++) {
          setWall(x, this.height - 1 - h);
        }
      }
    }

    // Ensure the piece has a playable spawn column near the top.
    // Pick the middle of the widest contiguous playable segment so pieces
    // like T and I do not spawn across a wall.
    this.spawnX = Math.floor(this.width / 2);
    let bestRun = [];
    let currentRun = [];
    for (let x = 0; x < this.width; x++) {
      if (this.board[1][x].type !== 'wall') {
        currentRun.push(x);
      } else {
        if (currentRun.length > bestRun.length) bestRun = currentRun;
        currentRun = [];
      }
    }
    if (currentRun.length > bestRun.length) bestRun = currentRun;
    if (bestRun.length > 0) {
      // Center the spawn, but keep enough room for the widest piece (I = 4 cells).
      const minX = bestRun[0] + 1;
      const maxX = bestRun[bestRun.length - 1] - 2;
      let x = bestRun[Math.floor(bestRun.length / 2)];
      if (x < minX) x = minX;
      if (x > maxX) x = maxX;
      this.spawnX = x;
    }

    // Generate starting garbage stack
    if (cfg.garbageHeight > 0) {
      this.generateGarbage(cfg.garbageHeight, cfg.garbageDensity);
    }
  }

  generateGarbage(stackHeight, density) {
    const colors = Object.values(COLORS).slice(0, 7);
    stackHeight = Math.min(stackHeight, this.height);
    for (let y = this.height - stackHeight; y < this.height; y++) {
      const playableCols = [];
      for (let x = 0; x < this.width; x++) {
        if (this.board[y][x].type === 'wall') continue;
        playableCols.push(x);
        if (Math.random() > density) {
          this.board[y][x] = { type: 'filled', color: colors[Math.floor(Math.random() * colors.length)] };
        }
      }
      // Guarantee at least one hole per garbage row so it does not auto-clear.
      const filledCols = playableCols.filter(x => this.board[y][x].type === 'filled');
      if (filledCols.length === playableCols.length && playableCols.length > 0) {
        const holeX = playableCols[Math.floor(Math.random() * playableCols.length)];
        this.board[y][holeX] = { type: 'empty' };
      }
    }
  }

  getSpeed() {
    // Gravity in seconds per cell
    const base = Math.max(0.02, 0.8 - (this.level - 1) * 0.06);
    return base;
  }

  nextPieceType() {
    if (this.bag.length === 0) {
      this.bag = [...SHAPE_KEYS].sort(() => Math.random() - 0.5);
    }
    return this.bag.pop();
  }

  spawnPiece() {
    const type = this.nextType || this.nextPieceType();
    this.nextType = this.nextPieceType();
    const shape = SHAPES[type];
    const spawnX = this.spawnX != null ? this.spawnX : Math.floor(this.width / 2);
    const spawnY = 1;

    this.current = {
      type,
      color: shape.color,
      rotation: 0,
      x: spawnX,
      y: spawnY,
      cells: shape.rotations[0]
    };

    // Try to fit; if not, try moving up as far as the visible entry row (y=0).
    // Do not allow spawning entirely above the board, otherwise the game never ends.
    while (this.collides(this.current.x, this.current.y, this.current.cells) && this.current.y > 0) {
      this.current.y--;
    }

    if (this.collides(this.current.x, this.current.y, this.current.cells)) {
      this.endGame(false);
      return;
    }

    this.updateGhost();
    this.drawNext();
  }

  drawNext() {
    const ctx = this.nextCtx;
    const w = this.nextCanvas.width;
    const h = this.nextCanvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!this.nextType) return;
    const shape = SHAPES[this.nextType];
    const cells = shape.rotations[0];

    // Compute bounding box
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    for (const c of cells) {
      minX = Math.min(minX, c.x);
      maxX = Math.max(maxX, c.x);
      minY = Math.min(minY, c.y);
      maxY = Math.max(maxY, c.y);
    }
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    const cellSize = Math.min(w / (bw + 1), h / (bh + 1));
    const offsetX = (w - cellSize * bw) / 2 - minX * cellSize;
    const offsetY = (h - cellSize * bh) / 2 - minY * cellSize;

    ctx.fillStyle = shape.color;
    for (const c of cells) {
      const px = offsetX + c.x * cellSize;
      const py = offsetY + c.y * cellSize;
      ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
      // highlight
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize * 0.25);
      ctx.fillStyle = shape.color;
    }
  }

  collides(px, py, cells) {
    for (const c of cells) {
      const x = px + c.x;
      const y = py + c.y;
      if (x < 0 || x >= this.width || y >= this.height) return true;
      if (y >= 0 && this.board[y][x].type !== 'empty') return true;
    }
    return false;
  }

  rotate(dir) {
    if (!this.current || this.gameOver || this.paused) return;
    const len = SHAPES[this.current.type].rotations.length;
    const newRot = (this.current.rotation + dir + len) % len;
    const newCells = SHAPES[this.current.type].rotations[newRot];

    // Wall kicks: horizontal first, then upward (floor kick). No downward kick
    // to prevent pieces from teleporting through gaps below them.
    const kicks = [0, -1, 1, -2, 2];
    for (const kx of kicks) {
      for (const ky of [0, -1]) {
        if (!this.collides(this.current.x + kx, this.current.y + ky, newCells)) {
          this.current.rotation = newRot;
          this.current.cells = newCells;
          this.current.x += kx;
          this.current.y += ky;
          this.lockDelay = 0;
          this.updateGhost();
          return;
        }
      }
    }
  }

  move(dx) {
    if (!this.current || this.gameOver || this.paused) return;
    if (!this.collides(this.current.x + dx, this.current.y, this.current.cells)) {
      this.current.x += dx;
      this.lockDelay = 0;
      this.updateGhost();
      return true;
    }
    return false;
  }

  softDrop() {
    if (!this.current || this.gameOver || this.paused) return;
    if (!this.collides(this.current.x, this.current.y + 1, this.current.cells)) {
      this.current.y += 1;
      this.score += 1;
      this.updateGhost();
      return true;
    }
    return false;
  }

  hardDrop() {
    if (!this.current || this.gameOver || this.paused) return;
    let cellsDropped = 0;
    while (!this.collides(this.current.x, this.current.y + 1, this.current.cells)) {
      this.current.y += 1;
      cellsDropped++;
    }
    this.score += cellsDropped * 2;
    this.lockPiece();
  }

  updateGhost() {
    if (!this.current) return;
    this.ghostY = this.current.y;
    while (!this.collides(this.current.x, this.ghostY + 1, this.current.cells)) {
      this.ghostY++;
    }
  }

  lockPiece() {
    if (!this.current) return;
    for (const c of this.current.cells) {
      const x = this.current.x + c.x;
      const y = this.current.y + c.y;
      if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
        this.board[y][x] = { type: 'filled', color: this.current.color };
      }
    }
    this.current = null;
    const cleared = this.clearFullLines(true);
    if (cleared > 0) {
      this.lines += cleared;
      this.score += [0, 100, 300, 600, 1000][cleared] * this.level;
      this.level = this.settings.getConfig().startLevel + Math.floor(this.lines / 10);
    }
    this.updateHUD();
    this.spawnPiece();
  }

  clearFullLines(animate) {
    const clearedRows = [];

    for (let y = 0; y < this.height; y++) {
      let hasPlayable = false;
      let full = true;
      for (let x = 0; x < this.width; x++) {
        const cell = this.board[y][x];
        if (cell.type === 'wall') continue;
        hasPlayable = true;
        if (cell.type !== 'filled') {
          full = false;
          break;
        }
      }
      if (hasPlayable && full) {
        clearedRows.push(y);
      }
    }

    if (clearedRows.length === 0) return 0;

    if (animate) this.spawnParticles(clearedRows);

    // Build new board: keep non-cleared rows in order, insert empty rows at top
    const newRows = [];
    for (let y = 0; y < this.height; y++) {
      if (clearedRows.includes(y)) continue;
      newRows.push(this.board[y]);
    }

    while (newRows.length < this.height) {
      const emptyRow = [];
      for (let x = 0; x < this.width; x++) {
        emptyRow.push(this.board[0][x].type === 'wall' ? { type: 'wall' } : { type: 'empty' });
      }
      newRows.unshift(emptyRow);
    }

    this.board = newRows;
    return clearedRows.length;
  }

  addGarbageRow() {
    // Shift everything up by one row (non-wall cells)
    for (let y = 0; y < this.height - 1; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.board[y][x].type === 'wall') continue;
        this.board[y][x] = this.board[y + 1][x];
      }
    }

    // Fill bottom row with garbage, one random hole in playable columns
    const colors = Object.values(COLORS).slice(0, 7);
    const playableX = [];
    for (let x = 0; x < this.width; x++) {
      if (this.board[this.height - 1][x].type !== 'wall') playableX.push(x);
    }
    const hole = playableX.length > 0 ? playableX[Math.floor(Math.random() * playableX.length)] : -1;

    for (let x = 0; x < this.width; x++) {
      if (this.board[this.height - 1][x].type === 'wall') continue;
      if (x === hole) {
        this.board[this.height - 1][x] = { type: 'empty' };
      } else {
        this.board[this.height - 1][x] = { type: 'filled', color: colors[Math.floor(Math.random() * colors.length)] };
      }
    }

    // If the active piece now overlaps garbage, push it up or end game
    if (this.current && this.collides(this.current.x, this.current.y, this.current.cells)) {
      let pushed = false;
      for (let i = 1; i <= 4; i++) {
        if (!this.collides(this.current.x, this.current.y - i, this.current.cells)) {
          this.current.y -= i;
          pushed = true;
          break;
        }
      }
      if (!pushed) {
        this.endGame(false);
        return;
      }
    }
  }

  spawnParticles(rows) {
    const cellSize = this.cellSize;
    for (const y of rows) {
      for (let x = 0; x < this.width; x++) {
        if (this.board[y][x].type === 'wall') continue;
        const color = this.board[y][x].color || '#fff';
        for (let i = 0; i < 4; i++) {
          this.particles.push({
            x: (x + 0.5) * cellSize,
            y: (y + 0.5) * cellSize,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 - 2,
            life: 1,
            decay: 0.02 + Math.random() * 0.03,
            color,
            size: cellSize * (0.15 + Math.random() * 0.2)
          });
        }
      }
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.life -= p.decay;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  loop(time) {
    if (!this.running) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    if (!this.paused && !this.gameOver) {
      this.update(dt);
    }
    this.updateParticles();
    this.draw();

    requestAnimationFrame(t => this.loop(t));
  }

  update(dt) {
    if (!this.current) return;

    // DAS / repeat movement
    const dasDelay = 0.17;
    const repeatRate = 0.05;
    for (const dir of ['left', 'right']) {
      const dx = dir === 'left' ? -1 : 1;
      if (this.keys[dir]) {
        this.das[dir] += dt;
        if (this.das[dir] >= dasDelay) {
          this.repeat[dir] += dt;
          if (this.repeat[dir] >= repeatRate) {
            this.move(dx);
            this.repeat[dir] = 0;
          }
        }
      } else {
        this.das[dir] = 0;
        this.repeat[dir] = 0;
      }
    }

    // Soft drop key
    if (this.keys['down']) {
      this.softDrop();
    }

    // Gravity: advance one cell per interval, catch up if dt is large
    this.dropTimer += dt;
    const speed = this.getSpeed();
    let gravitySteps = 0;
    while (this.dropTimer >= speed) {
      this.dropTimer -= speed;
      gravitySteps++;
      if (!this.softDrop()) break;
    }

    if (this.collides(this.current.x, this.current.y + 1, this.current.cells)) {
      this.lockDelay += dt;
      if (this.lockDelay >= 0.5) {
        this.lockPiece();
        this.lockDelay = 0;
      }
    } else {
      this.lockDelay = 0;
    }

    // Survival mode: add garbage periodically
    if (this.mode === 'survival') {
      const interval = Math.max(3, 12 - (this.level - 1) * 0.6);
      this.survivalTimer += dt;
      if (this.survivalTimer >= interval) {
        this.addGarbageRow();
        this.survivalTimer = 0;
        this.updateGhost();
      }
    }
  }

  resize() {
    if (!this.width || !this.height) return;
    const area = document.querySelector('.game-area');
    const side = document.querySelector('.side-panel');
    let sideW = 0;
    if (side && getComputedStyle(side).display !== 'none') {
      sideW = side.getBoundingClientRect().width + 20;
    }
    const maxW = Math.max(100, area.clientWidth - sideW - 20);
    const maxH = area.clientHeight - 20;
    const aspect = this.width / this.height;
    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    this.cellSize = Math.max(10, Math.min(32, w / this.width));
    this.canvas.width = this.cellSize * this.width;
    this.canvas.height = this.cellSize * this.height;
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const cs = this.cellSize;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid / board
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.board[y][x];
        const px = x * cs;
        const py = y * cs;

        if (cell.type === 'wall') {
          this.drawBlock(x, y, COLORS.wall, 0.8, true);
        } else if (cell.type === 'filled') {
          this.drawBlock(x, y, cell.color, 1, false);
        } else {
          ctx.strokeStyle = COLORS.grid;
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, cs - 1, cs - 1);
        }
      }
    }

    // Ghost piece
    if (this.current) {
      for (const c of this.current.cells) {
        const x = this.current.x + c.x;
        const y = this.ghostY + c.y;
        if (y >= 0) this.drawBlock(x, y, COLORS.ghost, 0.35, true);
      }
    }

    // Current piece
    if (this.current) {
      for (const c of this.current.cells) {
        const x = this.current.x + c.x;
        const y = this.current.y + c.y;
        if (y >= 0) this.drawBlock(x, y, this.current.color, 1, false);
      }
    }

    // Particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  drawBlock(x, y, color, alpha, flat) {
    const ctx = this.ctx;
    const cs = this.cellSize;
    const px = x * cs;
    const py = y * cs;
    const pad = 1;

    ctx.globalAlpha = alpha;
    if (flat) {
      ctx.fillStyle = color;
      ctx.fillRect(px + pad, py + pad, cs - pad * 2, cs - pad * 2);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(px + pad, py + pad, cs - pad * 2, cs - pad * 2);

      // Inner highlight
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(px + pad, py + pad, cs - pad * 2, cs * 0.25);

      // Border glow
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + pad + 0.5, py + pad + 0.5, cs - pad * 2 - 1, cs - pad * 2 - 1);
    }
    ctx.globalAlpha = 1;
  }

  updateHUD() {
    document.getElementById('hudLevel').textContent = this.level;
    document.getElementById('hudLines').textContent = this.lines;
    document.getElementById('hudScore').textContent = this.score;
  }

  endGame(win) {
    this.gameOver = true;
    this.overlayTitle.textContent = win ? 'Selesai!' : 'Game Over';
    this.overlayText.textContent = `Score: ${this.score}  ·  Lines: ${this.lines}`;
    this.overlay.classList.remove('hidden');
  }

  bindControls() {
    window.addEventListener('keydown', e => {
      if (!this.running) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          this.keys['left'] = true;
          if (!this.gameOver && !this.paused) this.move(-1);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
          this.keys['right'] = true;
          if (!this.gameOver && !this.paused) this.move(1);
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
          this.keys['down'] = true;
          e.preventDefault();
          break;
        case 'ArrowUp':
        case 'w':
        case 'x':
          if (!this.gameOver && !this.paused) this.rotate(1);
          e.preventDefault();
          break;
        case 'z':
          if (!this.gameOver && !this.paused) this.rotate(-1);
          e.preventDefault();
          break;
        case ' ':
          if (!this.gameOver && !this.paused) this.hardDrop();
          e.preventDefault();
          break;
        case 'p':
        case 'P':
          if (!this.gameOver) this.togglePause();
          break;
      }
    });

    window.addEventListener('keyup', e => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a': this.keys['left'] = false; break;
        case 'ArrowRight':
        case 'd': this.keys['right'] = false; break;
        case 'ArrowDown':
        case 's': this.keys['down'] = false; break;
      }
    });

    // On-screen touch controls
    document.querySelectorAll('.touch-btn').forEach(btn => {
      btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (!this.running) return;
        const action = btn.dataset.action;
        if (action === 'pause') {
          if (!this.gameOver) this.togglePause();
          return;
        }
        if (this.gameOver || this.paused) return;
        switch (action) {
          case 'left': this.move(-1); break;
          case 'right': this.move(1); break;
          case 'down': this.softDrop(); break;
          case 'rotate': this.rotate(1); break;
          case 'drop': this.hardDrop(); break;
        }
      });
    });
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.overlayTitle.textContent = 'Paused';
      this.overlayText.textContent = 'Tekan P untuk melanjutkan';
      this.overlay.classList.remove('hidden');
    } else {
      this.overlay.classList.add('hidden');
    }
  }
}
