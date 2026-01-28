const container = document.getElementById('mazeContainer');
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const regenerateBtn = document.getElementById('regenerateBtn');

const CELL_SIZE = 30;
const WALL_THICKNESS = 2;
const COLS = 16;
const ROWS = 16;
const WALL_COLOR = '#2a2a4e';
const PATH_COLOR = '#0a0a0f';
const ENTRANCE_COLOR = '#2ecc71';
const EXIT_COLOR = '#e74c3c';

const MAZE_WIDTH = COLS * CELL_SIZE + WALL_THICKNESS;
const MAZE_HEIGHT = ROWS * CELL_SIZE + WALL_THICKNESS;
const DIAGONAL = Math.ceil(Math.sqrt(MAZE_WIDTH * MAZE_WIDTH + MAZE_HEIGHT * MAZE_HEIGHT));

canvas.width = DIAGONAL;
canvas.height = DIAGONAL;

let cells = [];
let rotation = 0;
let scale = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartAngle = 0;
let initialRotation = 0;

function initCells() {
  cells = [];
  for (let y = 0; y < ROWS; y++) {
    cells[y] = [];
    for (let x = 0; x < COLS; x++) {
      cells[y][x] = {
        top: true,
        right: true,
        bottom: true,
        left: true,
        visited: false
      };
    }
  }
}

function generateMaze() {
  initCells();
  
  const stack = [];
  const startX = 0;
  const startY = 0;
  
  cells[startY][startX].visited = true;
  stack.push({ x: startX, y: startY });
  
  const directions = [
    { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
    { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
    { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
    { dx: -1, dy: 0, wall: 'left', opposite: 'right' }
  ];
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = [];
    
    for (const dir of directions) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;
      
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && !cells[ny][nx].visited) {
        neighbors.push({ x: nx, y: ny, wall: dir.wall, opposite: dir.opposite });
      }
    }
    
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      cells[current.y][current.x][next.wall] = false;
      cells[next.y][next.x][next.opposite] = false;
      cells[next.y][next.x].visited = true;
      stack.push({ x: next.x, y: next.y });
    } else {
      stack.pop();
    }
  }
  
  cells[0][0].top = false;
  cells[0][COLS - 1].top = false;
  
  // Ensure entrance has a path down
  cells[0][0].bottom = false;
  cells[1][0].top = false;
}

const MAZE_OFFSET_X = (DIAGONAL - MAZE_WIDTH) / 2;
const MAZE_OFFSET_Y = (DIAGONAL - MAZE_HEIGHT) / 2;

function drawMaze() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  ctx.translate(centerX + panX, centerY + panY);
  ctx.scale(scale, scale);
  ctx.rotate(rotation);
  ctx.translate(-centerX, -centerY);
  
  ctx.fillStyle = PATH_COLOR;
  ctx.fillRect(MAZE_OFFSET_X, MAZE_OFFSET_Y, MAZE_WIDTH, MAZE_HEIGHT);
  
  ctx.strokeStyle = WALL_COLOR;
  ctx.lineWidth = WALL_THICKNESS;
  ctx.lineCap = 'square';
  
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = cells[y][x];
      const drawX = x * CELL_SIZE + MAZE_OFFSET_X + WALL_THICKNESS / 2;
      const drawY = y * CELL_SIZE + MAZE_OFFSET_Y + WALL_THICKNESS / 2;
      
      if (cell.top) {
        ctx.beginPath();
        ctx.moveTo(drawX, drawY);
        ctx.lineTo(drawX + CELL_SIZE, drawY);
        ctx.stroke();
      }
      
      if (cell.right) {
        ctx.beginPath();
        ctx.moveTo(drawX + CELL_SIZE, drawY);
        ctx.lineTo(drawX + CELL_SIZE, drawY + CELL_SIZE);
        ctx.stroke();
      }
      
      if (cell.bottom) {
        ctx.beginPath();
        ctx.moveTo(drawX, drawY + CELL_SIZE);
        ctx.lineTo(drawX + CELL_SIZE, drawY + CELL_SIZE);
        ctx.stroke();
      }
      
      if (cell.left) {
        ctx.beginPath();
        ctx.moveTo(drawX, drawY);
        ctx.lineTo(drawX, drawY + CELL_SIZE);
        ctx.stroke();
      }
    }
  }
  
  const entranceX = 0 * CELL_SIZE + MAZE_OFFSET_X + WALL_THICKNESS / 2;
  const entranceY = 0 * CELL_SIZE + MAZE_OFFSET_Y + WALL_THICKNESS / 2;
  ctx.fillStyle = ENTRANCE_COLOR;
  ctx.fillRect(entranceX + 2, entranceY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  
  const exitX = (COLS - 1) * CELL_SIZE + MAZE_OFFSET_X + WALL_THICKNESS / 2;
  const exitY = 0 * CELL_SIZE + MAZE_OFFSET_Y + WALL_THICKNESS / 2;
  ctx.fillStyle = EXIT_COLOR;
  ctx.fillRect(exitX + 2, exitY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  
  ctx.restore();
}

function getAngleFromCenter(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.atan2(clientY - centerY, clientX - centerX);
}

container.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStartAngle = getAngleFromCenter(e.clientX, e.clientY);
  initialRotation = rotation;
  container.classList.add('dragging');
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  const currentAngle = getAngleFromCenter(e.clientX, e.clientY);
  rotation = initialRotation + (currentAngle - dragStartAngle);
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  container.classList.remove('dragging');
});

container.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  isDragging = true;
  dragStartAngle = getAngleFromCenter(touch.clientX, touch.clientY);
  initialRotation = rotation;
});

document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  
  const touch = e.touches[0];
  const currentAngle = getAngleFromCenter(touch.clientX, touch.clientY);
  rotation = initialRotation + (currentAngle - dragStartAngle);
});

document.addEventListener('touchend', () => {
  isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left - canvas.width / 2;
  const mouseY = e.clientY - rect.top - canvas.height / 2;
  
  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
  const newScale = Math.max(0.5, Math.min(5, scale * zoomFactor));
  
  // Zoom towards mouse position
  panX = mouseX - (mouseX - panX) * (newScale / scale);
  panY = mouseY - (mouseY - panY) * (newScale / scale);
  
  scale = newScale;
}, { passive: false });

regenerateBtn.addEventListener('click', () => {
  offsetX = 0;
  offsetY = 0;
  generateMaze();
  drawMaze();
});

function getMazeData() {
  return { cells, offsetX, offsetY, CELL_SIZE, COLS, ROWS };
}

// Fluid particles
const FLUID_RADIUS = 4;
const FLUID_COLOR = '#3498db';
const GRAVITY = 0.15;
const FRICTION = 0.98;
const BOUNCE = 0.3;
const MAX_VELOCITY = 8;
const SPAWN_RATE = 3;
const MAX_PARTICLES = 50000;

let particles = [];
let spawnCounter = 0;

function createParticle() {
  return {
    x: CELL_SIZE / 2 + (Math.random() - 0.5) * 4,
    y: CELL_SIZE / 2,
    vx: (Math.random() - 0.5) * 0.5,
    vy: 0,
    stuckFrames: 0
  };
}

function getCellAt(px, py) {
  const cellX = Math.floor(px / CELL_SIZE);
  const cellY = Math.floor(py / CELL_SIZE);
  return { cellX, cellY };
}

function canMoveTo(newX, newY, p) {
  const { cellX: oldCellX, cellY: oldCellY } = getCellAt(p.x, p.y);
  const { cellX: newCellX, cellY: newCellY } = getCellAt(newX, newY);
  
  if (newCellX < 0 || newCellX >= COLS || newCellY < 0 || newCellY >= ROWS) {
    if (newCellY < 0 && newCellX === 0 && !cells[0][0].top) return true;
    if (newCellY < 0 && newCellX === COLS - 1 && !cells[0][COLS - 1].top) return true;
    return false;
  }
  
  const cell = cells[oldCellY]?.[oldCellX];
  if (!cell) return false;
  
  const localX = newX - oldCellX * CELL_SIZE;
  const localY = newY - oldCellY * CELL_SIZE;
  
  if (localX - FLUID_RADIUS < 0 && cell.left) return false;
  if (localX + FLUID_RADIUS > CELL_SIZE && cell.right) return false;
  if (localY - FLUID_RADIUS < 0 && cell.top) return false;
  if (localY + FLUID_RADIUS > CELL_SIZE && cell.bottom) return false;
  
  return true;
}

function updateParticle(p) {
  const gravityX = Math.sin(rotation) * GRAVITY;
  const gravityY = Math.cos(rotation) * GRAVITY;
  
  p.vx += gravityX;
  p.vy += gravityY;
  
  p.vx *= FRICTION;
  p.vy *= FRICTION;
  
  p.vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, p.vx));
  p.vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, p.vy));
  
  const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
  if (speed < 0.1) {
    p.stuckFrames++;
    if (p.stuckFrames > 30) {
      p.vx += (Math.random() - 0.5) * 2;
      p.vy += (Math.random() - 0.5) * 2;
      p.stuckFrames = 0;
    }
  } else {
    p.stuckFrames = 0;
  }
  
  const newX = p.x + p.vx;
  const newY = p.y + p.vy;
  
  if (canMoveTo(newX, p.y, p)) {
    p.x = newX;
  } else {
    p.vx = -p.vx * BOUNCE;
  }
  
  if (canMoveTo(p.x, newY, p)) {
    p.y = newY;
  } else {
    p.vy = -p.vy * BOUNCE;
  }
}

function clampToWalls(p) {
  const { cellX, cellY } = getCellAt(p.x, p.y);
  
  if (cellX < 0 || cellX >= COLS || cellY < 0 || cellY >= ROWS) {
    p.x = Math.max(FLUID_RADIUS, Math.min(COLS * CELL_SIZE - FLUID_RADIUS, p.x));
    p.y = Math.max(FLUID_RADIUS, Math.min(ROWS * CELL_SIZE - FLUID_RADIUS, p.y));
    return;
  }
  
  const cell = cells[cellY]?.[cellX];
  if (!cell) return;
  
  const localX = p.x - cellX * CELL_SIZE;
  const localY = p.y - cellY * CELL_SIZE;
  
  if (localX - FLUID_RADIUS < 0 && cell.left) {
    p.x = cellX * CELL_SIZE + FLUID_RADIUS;
    p.vx = Math.abs(p.vx) * BOUNCE;
  }
  if (localX + FLUID_RADIUS > CELL_SIZE && cell.right) {
    p.x = cellX * CELL_SIZE + CELL_SIZE - FLUID_RADIUS;
    p.vx = -Math.abs(p.vx) * BOUNCE;
  }
  if (localY - FLUID_RADIUS < 0 && cell.top) {
    p.y = cellY * CELL_SIZE + FLUID_RADIUS;
    p.vy = Math.abs(p.vy) * BOUNCE;
  }
  if (localY + FLUID_RADIUS > CELL_SIZE && cell.bottom) {
    p.y = cellY * CELL_SIZE + CELL_SIZE - FLUID_RADIUS;
    p.vy = -Math.abs(p.vy) * BOUNCE;
  }
}

const GRID_SIZE = FLUID_RADIUS * 4;
let spatialGrid = {};

function getSpatialKey(x, y) {
  const gx = Math.floor(x / GRID_SIZE);
  const gy = Math.floor(y / GRID_SIZE);
  return `${gx},${gy}`;
}

function buildSpatialGrid() {
  spatialGrid = {};
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const key = getSpatialKey(p.x, p.y);
    if (!spatialGrid[key]) spatialGrid[key] = [];
    spatialGrid[key].push(i);
  }
}

function getNeighborIndices(p) {
  const neighbors = [];
  const gx = Math.floor(p.x / GRID_SIZE);
  const gy = Math.floor(p.y / GRID_SIZE);
  
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const key = `${gx + dx},${gy + dy}`;
      if (spatialGrid[key]) {
        neighbors.push(...spatialGrid[key]);
      }
    }
  }
  return neighbors;
}

function resolveParticleCollisions() {
  buildSpatialGrid();
  
  const minDist = FLUID_RADIUS * 2;
  const minDistSq = minDist * minDist;
  const checked = new Set();
  
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    const neighbors = getNeighborIndices(a);
    
    for (const j of neighbors) {
      if (j <= i) continue;
      
      const pairKey = i < j ? `${i},${j}` : `${j},${i}`;
      if (checked.has(pairKey)) continue;
      checked.add(pairKey);
      
      const b = particles[j];
      
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distSq = dx * dx + dy * dy;
      
      if (distSq < minDistSq && distSq > 0.01) {
        const dist = Math.sqrt(distSq);
        const overlap = (minDist - dist) * 0.5;
        
        const nx = dx / dist;
        const ny = dy / dist;
        
        const pushX = nx * overlap;
        const pushY = ny * overlap;
        
        if (canMoveTo(a.x - pushX, a.y, a)) a.x -= pushX;
        if (canMoveTo(a.x, a.y - pushY, a)) a.y -= pushY;
        if (canMoveTo(b.x + pushX, b.y, b)) b.x += pushX;
        if (canMoveTo(b.x, b.y + pushY, b)) b.y += pushY;
        
        const relVx = a.vx - b.vx;
        const relVy = a.vy - b.vy;
        const relDot = relVx * nx + relVy * ny;
        
        if (relDot > 0) {
          a.vx -= relDot * nx * 0.25;
          a.vy -= relDot * ny * 0.25;
          b.vx += relDot * nx * 0.25;
          b.vy += relDot * ny * 0.25;
        }
      }
    }
  }
}

function updateParticles() {
  spawnCounter++;
  if (spawnCounter >= SPAWN_RATE && particles.length < MAX_PARTICLES) {
    particles.push(createParticle());
    spawnCounter = 0;
  }
  
  for (const p of particles) {
    updateParticle(p);
    clampToWalls(p);
  }
  
  // Multiple iterations for stable collision resolution
  for (let iter = 0; iter < 5; iter++) {
    resolveParticleCollisions();
    for (const p of particles) {
      clampToWalls(p);
    }
  }
  
  // Keep particles inside maze bounds
  for (const p of particles) {
    p.x = Math.max(FLUID_RADIUS, Math.min(COLS * CELL_SIZE - FLUID_RADIUS, p.x));
    p.y = Math.max(FLUID_RADIUS, Math.min(ROWS * CELL_SIZE - FLUID_RADIUS, p.y));
  }
}

function drawParticles() {
  ctx.save();
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  ctx.translate(centerX + panX, centerY + panY);
  ctx.scale(scale, scale);
  ctx.rotate(rotation);
  ctx.translate(-centerX, -centerY);
  
  ctx.fillStyle = FLUID_COLOR;
  for (const p of particles) {
    const drawX = p.x + MAZE_OFFSET_X + WALL_THICKNESS / 2;
    const drawY = p.y + MAZE_OFFSET_Y + WALL_THICKNESS / 2;
    
    ctx.beginPath();
    ctx.arc(drawX, drawY, FLUID_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

function resetParticles() {
  particles = [];
  spawnCounter = 0;
  rotation = 0;
  scale = 1;
  panX = 0;
  panY = 0;
}

regenerateBtn.addEventListener('click', resetParticles);

function gameLoop() {
  updateParticles();
  drawMaze();
  drawParticles();
  requestAnimationFrame(gameLoop);
}

generateMaze();
gameLoop();
