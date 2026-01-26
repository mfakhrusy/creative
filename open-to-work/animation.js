const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Canvas setup
canvas.width = 900;
canvas.height = 400;

// Lego brick colors (vibrant palette)
const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e91e63'];

// Letter definitions - each letter is a grid of 1s and 0s
// Grid is 5 wide x 7 tall for each letter
const LETTER_MAPS = {
  'O': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'P': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  'E': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  'N': [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'T': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  'W': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1],
  ],
  'R': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  'K': [
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  ' ': [
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
  ],
};

const TEXT = "OPEN TO WORK";
const BRICK_SIZE = 10;
const BRICK_GAP = 2;
const LETTER_GAP = 15;

class Brick {
  constructor(targetX, targetY, color, delay) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = targetX + (Math.random() - 0.5) * 50;
    this.y = -50 - Math.random() * 300;
    this.color = color;
    this.delay = delay;
    this.started = false;
    this.velocity = 0;
    this.gravity = 0.5;
    this.bounce = 0.3;
    this.settled = false;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  update(time) {
    if (time < this.delay) return;
    this.started = true;

    if (this.settled) return;

    // Apply gravity
    this.velocity += this.gravity;
    this.y += this.velocity;
    this.rotation += this.rotationSpeed;

    // Move horizontally toward target
    this.x += (this.targetX - this.x) * 0.1;

    // Check if reached target
    if (this.y >= this.targetY) {
      this.y = this.targetY;
      if (Math.abs(this.velocity) > 1) {
        this.velocity = -this.velocity * this.bounce;
        this.rotationSpeed *= 0.5;
      } else {
        this.velocity = 0;
        this.rotation = 0;
        this.settled = true;
      }
    }
  }

  draw(ctx) {
    if (!this.started) return;

    ctx.save();
    ctx.translate(this.x + BRICK_SIZE / 2, this.y + BRICK_SIZE / 2);
    ctx.rotate(this.rotation);
    
    // Main brick body
    ctx.fillStyle = this.color;
    ctx.fillRect(-BRICK_SIZE / 2, -BRICK_SIZE / 2, BRICK_SIZE, BRICK_SIZE);
    
    // Highlight (top-left)
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-BRICK_SIZE / 2, -BRICK_SIZE / 2, BRICK_SIZE, 2);
    ctx.fillRect(-BRICK_SIZE / 2, -BRICK_SIZE / 2, 2, BRICK_SIZE);
    
    // Shadow (bottom-right)
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-BRICK_SIZE / 2, BRICK_SIZE / 2 - 2, BRICK_SIZE, 2);
    ctx.fillRect(BRICK_SIZE / 2 - 2, -BRICK_SIZE / 2, 2, BRICK_SIZE);
    
    // Lego stud on top
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(-0.5, -0.5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// Create bricks for all letters
const bricks = [];
let offsetX = 50;
let letterDelay = 0;
const LETTER_DURATION = 350; // Overlap: next letter starts while previous is still dropping

for (const char of TEXT) {
  const letterMap = LETTER_MAPS[char];
  if (!letterMap) continue;
  
  const letterColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  // Count bricks in this letter for staggering within the letter
  let brickIndex = 0;
  
  for (let row = 0; row < letterMap.length; row++) {
    for (let col = 0; col < letterMap[row].length; col++) {
      if (letterMap[row][col] === 1) {
        const x = offsetX + col * (BRICK_SIZE + BRICK_GAP);
        const y = 150 + row * (BRICK_SIZE + BRICK_GAP);
        // Stagger bricks within the letter, but all start after previous letter
        const delay = letterDelay + (brickIndex * 20) + Math.random() * 30;
        bricks.push(new Brick(x, y, letterColor, delay));
        brickIndex++;
      }
    }
  }
  
  offsetX += letterMap[0].length * (BRICK_SIZE + BRICK_GAP) + LETTER_GAP;
  
  // Only add delay for non-space characters
  if (char !== ' ') {
    letterDelay += LETTER_DURATION;
  } else {
    letterDelay += 200; // Smaller pause for spaces
  }
}

// Animation loop
let startTime = null;

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  // Clear canvas
  ctx.fillStyle = 'rgba(10, 10, 20, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw all bricks
  for (const brick of bricks) {
    brick.update(elapsed);
    brick.draw(ctx);
  }

  // Check if all settled for replay
  const allSettled = bricks.every(b => b.settled);
  if (allSettled && elapsed > 5000) {
    // Reset after a pause
    setTimeout(() => {
      startTime = null;
      for (const brick of bricks) {
        brick.y = -50 - Math.random() * 300;
        brick.x = brick.targetX + (Math.random() - 0.5) * 50;
        brick.velocity = 0;
        brick.settled = false;
        brick.started = false;
        brick.rotation = Math.random() * Math.PI * 2;
        brick.rotationSpeed = (Math.random() - 0.5) * 0.2;
      }
    }, 2000);
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
